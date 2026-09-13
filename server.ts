import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Helper to determine the effective base URL
  const getBaseUrl = (req: express.Request) => {
    if (process.env.APP_URL) {
      return process.env.APP_URL.replace(/\/$/, '');
    }
    const host = req.get('host') || `localhost:${PORT}`;
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    return `${protocol}://${host}`;
  };

  // ===========================================================================
  // 1. API: Health Check
  // ===========================================================================
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'apna-pg-auth-server',
      timestamp: new Date().toISOString(),
    });
  });

  // ===========================================================================
  // 2. API: OAuth Configuration Status
  // ===========================================================================
  app.get('/api/auth/config', (req, res) => {
    const baseUrl = getBaseUrl(req);
    const callbackUrl = `${baseUrl}/auth/callback`;

    res.json({
      callbackUrl,
      providers: {
        google: {
          configured: Boolean(process.env.GOOGLE_CLIENT_ID),
          clientId: process.env.GOOGLE_CLIENT_ID ? `${process.env.GOOGLE_CLIENT_ID.substring(0, 8)}...` : null,
        },
        apple: {
          configured: Boolean(process.env.APPLE_CLIENT_ID),
          clientId: process.env.APPLE_CLIENT_ID ? `${process.env.APPLE_CLIENT_ID.substring(0, 8)}...` : null,
        },
      },
    });
  });

  // ===========================================================================
  // 3. API: Generate OAuth Authorization URL
  // ===========================================================================
  app.get('/api/auth/url', (req, res) => {
    const provider = (req.query.provider as string || 'google').toLowerCase();
    const baseUrl = getBaseUrl(req);
    const redirectUri = (req.query.redirect_uri as string) || `${baseUrl}/auth/callback`;

    if (provider === 'google') {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) {
        return res.json({
          configured: false,
          provider: 'google',
          redirectUri,
          message: 'GOOGLE_CLIENT_ID is not set in environment variables.',
        });
      }

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account',
        state: `google_${Date.now()}`,
      });

      const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      return res.json({
        configured: true,
        provider: 'google',
        url,
        redirectUri,
      });
    }

    if (provider === 'apple') {
      const clientId = process.env.APPLE_CLIENT_ID;
      if (!clientId) {
        return res.json({
          configured: false,
          provider: 'apple',
          redirectUri,
          message: 'APPLE_CLIENT_ID is not set in environment variables.',
        });
      }

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code id_token',
        scope: 'name email',
        response_mode: 'form_post',
        state: `apple_${Date.now()}`,
      });

      const url = `https://appleid.apple.com/auth/authorize?${params.toString()}`;
      return res.json({
        configured: true,
        provider: 'apple',
        url,
        redirectUri,
      });
    }

    res.status(400).json({ error: 'Unsupported provider. Use "google" or "apple".' });
  });

  // ===========================================================================
  // 4. API / Route: OAuth Callback Handler (Popup receiver)
  // Supports both GET (Google) and POST (Apple form_post)
  // ===========================================================================
  const handleOAuthCallback = async (req: express.Request, res: express.Response) => {
    const code = req.query.code || req.body?.code;
    const state = (req.query.state || req.body?.state || '') as string;
    const provider = state.startsWith('apple') || req.body?.id_token ? 'apple' : 'google';

    let userEmail = '';
    let userName = '';

    // If Google code exchange is possible via Google client secret
    if (provider === 'google' && code && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      try {
        const baseUrl = getBaseUrl(req);
        const redirectUri = `${baseUrl}/auth/callback`;

        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code: String(code),
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code',
          }),
        });

        if (tokenRes.ok) {
          const tokenData = await tokenRes.json();
          if (tokenData.access_token) {
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
              headers: { Authorization: `Bearer ${tokenData.access_token}` },
            });
            if (userInfoRes.ok) {
              const userInfo = await userInfoRes.json();
              userEmail = userInfo.email || '';
              userName = userInfo.name || '';
            }
          }
        }
      } catch (err) {
        console.error('Error exchanging Google OAuth code:', err);
      }
    }

    // Return popup closing script sending message back to opener window
    const payload = JSON.stringify({
      type: 'OAUTH_AUTH_SUCCESS',
      provider,
      code: code ? String(code) : undefined,
      user: {
        email: userEmail || undefined,
        name: userName || undefined,
        provider,
      },
    });

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Complete - Apna PG</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background-color: #f8fafc;
              color: #0f172a;
              text-align: center;
              padding: 20px;
            }
            .card {
              background: white;
              padding: 32px 24px;
              border-radius: 16px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.08);
              max-width: 360px;
            }
            .spinner {
              width: 36px;
              height: 36px;
              border: 3px solid #e2e8f0;
              border-top-color: #7c3aed;
              border-radius: 50%;
              animation: spin 0.8s linear infinite;
              margin: 0 auto 16px;
            }
            @keyframes spin { to { transform: rotate(360deg); } }
            h2 { margin: 0 0 8px; font-size: 18px; color: #1e1b4b; }
            p { margin: 0; font-size: 13px; color: #64748b; line-height: 1.5; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="spinner"></div>
            <h2>Sign-In Successful!</h2>
            <p>Connecting your account to Apna PG... This window will close automatically.</p>
          </div>
          <script>
            try {
              const data = ${payload};
              if (window.opener && !window.opener.closed) {
                window.opener.postMessage(data, '*');
                setTimeout(() => { window.close(); }, 600);
              } else {
                window.location.href = '/';
              }
            } catch (e) {
              console.error(e);
              window.location.href = '/';
            }
          </script>
        </body>
      </html>
    `);
  };

  // Register callback with and without trailing slash
  app.get('/auth/callback', handleOAuthCallback);
  app.get('/auth/callback/', handleOAuthCallback);
  app.post('/auth/callback', handleOAuthCallback);
  app.post('/auth/callback/', handleOAuthCallback);

  // ===========================================================================
  // 5. Mount Vite Middleware (Dev) or Static Assets (Prod)
  // ===========================================================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Apna PG Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
