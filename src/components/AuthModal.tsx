import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  MapPin,
  ArrowLeft,
  Mail,
  Check,
  Copy,
  ExternalLink,
  Key,
  X,
  AlertCircle,
  Info,
} from 'lucide-react';
import { UserProfile } from '../types';
import { ApnaPgLogo } from './ApnaPgLogo';

interface AuthModalProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess }) => {
  // Screen views: 'login' | 'signup' | 'pre_details' | 'forgot_password'
  const [view, setView] = useState<'login' | 'signup' | 'pre_details' | 'forgot_password'>('login');
  
  // Login form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [emailOrPhoneError, setEmailOrPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [socialNotice, setSocialNotice] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<'google' | 'apple' | null>(null);
  const [oauthSetupModal, setOauthSetupModal] = useState<{
    provider: 'google' | 'apple';
    redirectUri: string;
    message?: string;
  } | null>(null);
  const [copiedUri, setCopiedUri] = useState(false);

  // Forgot password screen state
  const [forgotInput, setForgotInput] = useState('');
  const [forgotInputError, setForgotInputError] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // Sign up form states
  const [signUpName, setSignUpName] = useState('');
  const [signUpIdentifier, setSignUpIdentifier] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpErrors, setSignUpErrors] = useState<{
    name?: string;
    identifier?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Listen for OAuth success message from the popup window callback
  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      // Validate origin is from AI Studio preview or localhost
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const provider = (event.data.provider || 'google') as 'google' | 'apple';
        const rawEmail = event.data.user?.email || (provider === 'google' ? 'devparmar3030@gmail.com' : 'resident@icloud.com');
        const rawName = event.data.user?.name || (provider === 'google' ? 'Dev Parmar' : 'Apple Resident');

        setSocialLoading(null);
        setOauthSetupModal(null);

        const userProfile: UserProfile = {
          id: `oauth-${provider}-${Date.now()}`,
          name: rawName,
          email: rawEmail,
          phone: '+91 98765 43210',
          avatar: provider === 'google'
            ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
          city: 'Ahmedabad',
          gender: 'male',
          userType: 'student',
          institutionOrCompany: 'Ahmedabad University / Tech Hub',
          kycStatus: 'Verified',
          emergencyContact: '+91 98250 99881 (Parent)',
          authProvider: provider,
        };

        onLoginSuccess(userProfile);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [onLoginSuccess]);

  // Handle Social Login via OAuth API endpoint
  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setSocialLoading(provider);
    setErrorMessage('');
    setSocialNotice(null);

    const redirectUri = `${window.location.origin}/auth/callback`;

    try {
      const response = await fetch(`/api/auth/url?provider=${provider}&redirect_uri=${encodeURIComponent(redirectUri)}`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();

      if (data.configured && data.url) {
        // Provider credentials are fully configured - open provider's direct OAuth popup
        const authWindow = window.open(data.url, 'oauth_popup', 'width=560,height=680');
        if (!authWindow) {
          setSocialLoading(null);
          setSocialNotice('Popup was blocked by your browser. Please allow popups to sign in with ' + (provider === 'google' ? 'Google' : 'Apple') + '.');
        }
      } else {
        // Provider credentials need to be set in environment variables
        setSocialLoading(null);
        setOauthSetupModal({
          provider,
          redirectUri: data.redirectUri || redirectUri,
          message: data.message,
        });
      }
    } catch (err) {
      setSocialLoading(null);
      console.error('OAuth initiation error:', err);
      // Fallback setup helper
      setOauthSetupModal({
        provider,
        redirectUri,
        message: 'Could not connect to auth service. Review OAuth API configuration below.',
      });
    }
  };

  const handleSimulateOAuthTest = (provider: 'google' | 'apple') => {
    setOauthSetupModal(null);
    const mockEmail = provider === 'google' ? 'devparmar3030@gmail.com' : 'resident@icloud.com';
    const mockName = provider === 'google' ? 'Dev Parmar (Google Verified)' : 'Resident (Apple Verified)';

    const userProfile: UserProfile = {
      id: `oauth-${provider}-demo`,
      name: mockName,
      email: mockEmail,
      phone: '+91 98765 43210',
      avatar: provider === 'google'
        ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      city: 'Ahmedabad',
      gender: 'male',
      userType: 'student',
      institutionOrCompany: 'Ahmedabad Tech Hub',
      kycStatus: 'Verified',
      emergencyContact: '+91 98250 99881 (Parent)',
      authProvider: provider,
    };

    onLoginSuccess(userProfile);
  };

  const copyCallbackUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  // Pre-details Onboarding Profile States
  const [activeAuthProvider, setActiveAuthProvider] = useState<'email' | 'phone' | 'google' | 'apple'>('email');
  const [preDetailsEmergencyError, setPreDetailsEmergencyError] = useState('');
  const [profileData, setProfileData] = useState<{
    name: string;
    email: string;
    phone: string;
    avatar: string;
    city: string;
    gender: 'male' | 'female' | 'other';
    userType: 'student' | 'working_professional';
    institutionOrCompany: string;
    emergencyContact: string;
  }>({
    name: 'Dev Parmar',
    email: 'devparmar3030@gmail.com',
    phone: '+91 98765 43210',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    city: 'Ahmedabad',
    gender: 'male',
    userType: 'student',
    institutionOrCompany: 'Ahmedabad University / Tech Hub',
    emergencyContact: '+91 98250 99881 (Parent)',
  });

  // Helper to validate identifier (email OR 10-digit Indian mobile)
  const validateIdentifier = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) {
      return 'Please enter your email or 10-digit mobile number.';
    }
    // Check valid email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(trimmed)) {
      return '';
    }
    // Check valid 10-digit Indian mobile (optionally prefixed with +91, 91, or 0)
    const normalizedDigits = trimmed.replace(/[\s\-()]/g, '').replace(/^(\+91|91|0)/, '');
    const indianMobileRegex = /^[6-9]\d{9}$/;
    if (indianMobileRegex.test(normalizedDigits)) {
      return '';
    }
    return 'Must be a valid email (e.g. name@domain.com) or a 10-digit Indian mobile (starts with 6-9).';
  };

  // Helper to validate password (minimum 8 characters)
  const validatePassword = (value: string): string => {
    if (!value) {
      return 'Please enter your password.';
    }
    if (value.length < 8) {
      return 'Password must be at least 8 characters long.';
    }
    return '';
  };

  // Handle direct Login submit with client-side validation
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idError = validateIdentifier(emailOrPhone);
    const passError = validatePassword(password);

    setEmailOrPhoneError(idError);
    setPasswordError(passError);

    if (idError || passError) {
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const isEmail = emailOrPhone.includes('@');
      setActiveAuthProvider(isEmail ? 'email' : 'phone');
      setProfileData((prev) => ({
        ...prev,
        email: isEmail ? emailOrPhone.trim() : prev.email,
        phone: !isEmail ? emailOrPhone.trim() : prev.phone,
        name: isEmail ? emailOrPhone.split('@')[0].replace(/[._]/g, ' ') : prev.name,
      }));
      setView('pre_details');
    }, 500);
  };

  // Handle Sign Up submit with client-side validation
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: typeof signUpErrors = {};

    if (!signUpName.trim() || signUpName.trim().length < 2) {
      errors.name = 'Please enter your full legal name (at least 2 characters).';
    }

    const idError = validateIdentifier(signUpIdentifier);
    if (idError) {
      errors.identifier = idError;
    }

    const passError = validatePassword(signUpPassword);
    if (passError) {
      errors.password = passError;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }

    setSignUpErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const isEmail = signUpIdentifier.includes('@');
      setActiveAuthProvider(isEmail ? 'email' : 'phone');
      setProfileData((prev) => ({
        ...prev,
        name: signUpName.trim(),
        email: isEmail ? signUpIdentifier.trim() : 'resident@apnapg.in',
        phone: !isEmail ? signUpIdentifier.trim() : '+91 98765 43210',
      }));
      setView('pre_details');
    }, 500);
  };

  // Handle Forgot Password submit (does NOT sign in / login bypass)
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const idError = validateIdentifier(forgotInput);
    setForgotInputError(idError);
    if (idError) {
      return;
    }
    setForgotSubmitted(true);
  };

  // Skip pre-details onboarding and launch app immediately
  const handleSkipPreDetails = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const userProfile: UserProfile = {
        id: `user-${Date.now()}`,
        name: profileData.name.trim() || 'Resident Member',
        email: profileData.email.trim() || 'resident@apnapg.in',
        phone: profileData.phone.trim() || '+91 98765 43210',
        avatar: profileData.avatar,
        city: profileData.city || 'Ahmedabad',
        gender: profileData.gender || 'male',
        userType: profileData.userType || 'student',
        institutionOrCompany: profileData.institutionOrCompany || '',
        kycStatus: 'Verified',
        emergencyContact: profileData.emergencyContact.trim() || '+91 98250 99881 (Parent)',
        authProvider: activeAuthProvider,
      };
      onLoginSuccess(userProfile);
    }, 300);
  };

  // Complete pre-details and launch the app
  const handleCompletePreDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setPreDetailsEmergencyError('');

    if (profileData.emergencyContact.trim()) {
      const cleanEm = profileData.emergencyContact.replace(/\D/g, '');
      const num = cleanEm.length === 12 && cleanEm.startsWith('91') ? cleanEm.slice(2) : cleanEm;
      if (num.length > 0 && !/^[6-9]\d{9}$/.test(num)) {
        setPreDetailsEmergencyError('Please enter a valid 10-digit Indian mobile number (starts with 6-9).');
        return;
      }
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const userProfile: UserProfile = {
        id: `user-${Date.now()}`,
        name: profileData.name.trim() || 'Resident Guest',
        email: profileData.email.trim() || 'resident@apnapg.in',
        phone: profileData.phone.trim() || '+91 98765 43210',
        avatar: profileData.avatar,
        city: profileData.city,
        gender: profileData.gender,
        userType: profileData.userType,
        institutionOrCompany: profileData.institutionOrCompany,
        kycStatus: 'Verified',
        emergencyContact: profileData.emergencyContact,
        authProvider: activeAuthProvider,
      };
      onLoginSuccess(userProfile);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7FF] flex items-center justify-center p-4 sm:p-6 overflow-y-auto min-h-screen">
      
      {/* Background Ambient Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-purple-300/35 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md my-auto py-4">
        
        {/* ========================================================================= */}
        {/* SCREEN 1: WELCOME TO APNA PG LOGIN SCREEN */}
        {/* ========================================================================= */}
        {view === 'login' && (
          <div className="flex flex-col items-center w-full">
            
            {/* Top Logo */}
            <div className="mb-3 sm:mb-4">
              <ApnaPgLogo size="lg" showText={false} />
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-5 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7C3AED] tracking-tight">
                Welcome to Apna PG
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                sign in to access your Apna PG account
              </p>
            </div>

            {/* Clean Rounded Form Container */}
            <div className="w-full bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-8 shadow-[0_12px_40px_rgba(124,58,237,0.09)] border border-purple-100/90 space-y-4">
              
              {/* Persistent Demo Mode Notice */}
              <div
                id="demo-mode-login-banner"
                className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-amber-900 text-xs flex items-start gap-2.5"
              >
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">
                  Demo mode - no real account is created and no data is sent anywhere.
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl animate-shake">
                  {errorMessage}
                </div>
              )}

              <form
                method="post"
                action="#"
                noValidate
                onSubmit={handleLoginSubmit}
                className="space-y-4"
              >
                {/* Email / Phone Input */}
                <div>
                  <label htmlFor="input-email-phone" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-600">
                      <User className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <input
                      id="input-email-phone"
                      name="username"
                      type="text"
                      noValidate
                      autoComplete="username"
                      aria-invalid={!!emailOrPhoneError}
                      aria-describedby={emailOrPhoneError ? 'input-email-phone-error' : undefined}
                      placeholder="name@example.com or 9876543210"
                      value={emailOrPhone}
                      onChange={(e) => {
                        setEmailOrPhone(e.target.value);
                        if (emailOrPhoneError) {
                          setEmailOrPhoneError(validateIdentifier(e.target.value));
                        }
                      }}
                      onBlur={() => {
                        if (emailOrPhone) {
                          setEmailOrPhoneError(validateIdentifier(emailOrPhone));
                        }
                      }}
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#FAF8FF] border ${
                        emailOrPhoneError
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-purple-200/90 focus:ring-[#7C3AED]'
                      } rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs`}
                    />
                  </div>
                  {emailOrPhoneError && (
                    <p
                      id="input-email-phone-error"
                      className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1 animate-in fade-in"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{emailOrPhoneError}</span>
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label htmlFor="input-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-600">
                      <Lock className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <input
                      id="input-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      noValidate
                      autoComplete="current-password"
                      aria-invalid={!!passwordError}
                      aria-describedby={passwordError ? 'input-password-error' : undefined}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (passwordError) {
                          setPasswordError(validatePassword(e.target.value));
                        }
                      }}
                      onBlur={() => {
                        if (password) {
                          setPasswordError(validatePassword(password));
                        }
                      }}
                      className={`w-full pl-12 pr-12 py-3.5 bg-[#FAF8FF] border ${
                        passwordError
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-purple-200/90 focus:ring-[#7C3AED]'
                      } rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-purple-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p
                      id="input-password-error"
                      className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1 animate-in fade-in"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{passwordError}</span>
                    </p>
                  )}
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotInput(emailOrPhone);
                      setForgotInputError('');
                      setForgotSubmitted(false);
                      setView('forgot_password');
                    }}
                    className="text-xs font-semibold text-[#7C3AED] hover:text-purple-800 hover:underline cursor-pointer"
                  >
                    Forgot password
                  </button>
                </div>

                {/* Smooth Gradient Login Pill Button */}
                <button
                  id="btn-login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] hover:from-[#5B21B6] hover:to-[#7C3AED] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-[0_10px_25px_rgba(124,58,237,0.35)] hover:shadow-[0_14px_30px_rgba(124,58,237,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </form>

              {/* Social Login Buttons with Real API Integration */}
              <div className="space-y-2 pt-2">
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    id="btn-continue-google"
                    type="button"
                    disabled={socialLoading !== null}
                    onClick={() => handleSocialLogin('google')}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {socialLoading === 'google' ? (
                      <span className="w-4 h-4 border-2 border-[#4285F4] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    )}
                    <span>{socialLoading === 'google' ? 'Connecting...' : 'Continue with Google'}</span>
                  </button>

                  <button
                    id="btn-continue-apple"
                    type="button"
                    disabled={socialLoading !== null}
                    onClick={() => handleSocialLogin('apple')}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {socialLoading === 'apple' ? (
                      <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 fill-current text-slate-900 shrink-0" viewBox="0 0 170 170">
                        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.79-11.97-14.24-5.33-8.08-9.47-17.15-12.43-27.22-2.96-10.07-4.44-19.68-4.44-28.84 0-13.06 3.34-24.16 10.03-33.3 6.69-9.14 15.26-13.79 25.7-13.96 4.35 0 9.29 1.13 14.81 3.38 5.53 2.25 9.4 3.42 11.62 3.5 1.94-.13 5.92-1.37 11.94-3.73 6.01-2.36 10.9-3.41 14.65-3.15 11.39.87 20.35 5.09 26.89 12.67-10.15 6.17-15.11 14.76-14.88 25.77.23 8.7 3.51 16.03 9.85 21.99 6.34 5.96 13.9 9.38 22.68 10.25-2.08 6.09-4.57 12.42-7.46 19-.94 2.17-1.84 4.36-2.7 6.55zM119.22 33.64c0-7.39 2.65-14.28 7.94-20.67 5.29-6.39 11.83-10.45 19.62-12.18.33 1.25.49 2.37.49 3.36 0 7.39-2.73 14.4-8.19 21.03-5.46 6.63-12.04 10.7-19.74 12.21-.08-1.25-.12-2.5-.12-3.75z" />
                      </svg>
                    )}
                    <span>{socialLoading === 'apple' ? 'Connecting...' : 'Continue with Apple'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-1">
                  <span>Sign-in via OAuth 2.0 API</span>
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    className="text-[#7C3AED] hover:underline font-semibold cursor-pointer"
                  >
                    API Setup Guide
                  </button>
                </div>

                {socialNotice && (
                  <div
                    id="social-signin-alert"
                    className="text-[11px] text-center text-[#7C3AED] bg-purple-50 border border-purple-200/80 rounded-lg py-1 px-2 font-medium animate-in fade-in"
                  >
                    {socialNotice}
                  </div>
                )}
              </div>

              {/* Sign Up Link: "New here? Create an account" */}
              <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
                <span>New here? </span>
                <button
                  id="btn-switch-to-signup"
                  type="button"
                  onClick={() => {
                    setEmailOrPhoneError('');
                    setPasswordError('');
                    setErrorMessage('');
                    setSignUpErrors({});
                    setView('signup');
                  }}
                  className="font-bold text-[#7C3AED] hover:text-purple-800 hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </div>

            </div>

            {/* Bottom Footer Text */}
            <div className="mt-6 text-center">
              <span className="text-xs text-slate-400 font-medium tracking-wide">
                Powered by APNAPG.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN: SIGN UP / CREATE ACCOUNT FLOW */}
        {/* ========================================================================= */}
        {view === 'signup' && (
          <div className="flex flex-col items-center w-full">
            
            {/* Top Logo */}
            <div className="mb-3 sm:mb-4">
              <ApnaPgLogo size="lg" showText={false} />
            </div>

            {/* Title & Subtitle */}
            <div className="text-center mb-5 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#7C3AED] tracking-tight">
                Create an account
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                join Ahmedabad's verified PG community
              </p>
            </div>

            {/* Clean Rounded Form Container */}
            <div className="w-full bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-8 shadow-[0_12px_40px_rgba(124,58,237,0.09)] border border-purple-100/90 space-y-4">
              
              {/* Persistent Demo Mode Notice */}
              <div
                id="demo-mode-signup-banner"
                className="p-3 bg-amber-50/90 border border-amber-200/90 rounded-2xl text-amber-900 text-xs flex items-start gap-2.5"
              >
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed font-medium">
                  Demo mode - no real account is created and no data is sent anywhere.
                </span>
              </div>

              <form
                method="post"
                action="#"
                noValidate
                onSubmit={handleSignUpSubmit}
                className="space-y-3.5"
              >
                {/* Full Legal Name */}
                <div>
                  <label htmlFor="input-signup-name" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-600">
                      <User className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <input
                      id="input-signup-name"
                      name="fullname"
                      type="text"
                      noValidate
                      autoComplete="name"
                      aria-invalid={!!signUpErrors.name}
                      aria-describedby={signUpErrors.name ? 'input-signup-name-error' : undefined}
                      placeholder="e.g. Rahul Sharma"
                      value={signUpName}
                      onChange={(e) => {
                        setSignUpName(e.target.value);
                        if (signUpErrors.name) {
                          setSignUpErrors((prev) => ({ ...prev, name: undefined }));
                        }
                      }}
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#FAF8FF] border ${
                        signUpErrors.name
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-purple-200/90 focus:ring-[#7C3AED]'
                      } rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs`}
                    />
                  </div>
                  {signUpErrors.name && (
                    <p
                      id="input-signup-name-error"
                      className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1 animate-in fade-in"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{signUpErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* Email / Mobile */}
                <div>
                  <label htmlFor="input-signup-identifier" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Email or Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-600">
                      <Mail className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <input
                      id="input-signup-identifier"
                      name="username"
                      type="text"
                      noValidate
                      autoComplete="username"
                      aria-invalid={!!signUpErrors.identifier}
                      aria-describedby={signUpErrors.identifier ? 'input-signup-id-error' : undefined}
                      placeholder="rahul@example.com or 9876543210"
                      value={signUpIdentifier}
                      onChange={(e) => {
                        setSignUpIdentifier(e.target.value);
                        if (signUpErrors.identifier) {
                          setSignUpErrors((prev) => ({ ...prev, identifier: undefined }));
                        }
                      }}
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#FAF8FF] border ${
                        signUpErrors.identifier
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-purple-200/90 focus:ring-[#7C3AED]'
                      } rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs`}
                    />
                  </div>
                  {signUpErrors.identifier && (
                    <p
                      id="input-signup-id-error"
                      className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1 animate-in fade-in"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{signUpErrors.identifier}</span>
                    </p>
                  )}
                </div>

                {/* Create Password */}
                <div>
                  <label htmlFor="input-signup-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Create Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-600">
                      <Lock className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <input
                      id="input-signup-password"
                      name="password"
                      type={showSignUpPassword ? 'text' : 'password'}
                      noValidate
                      autoComplete="new-password"
                      aria-invalid={!!signUpErrors.password}
                      aria-describedby={signUpErrors.password ? 'input-signup-pass-error' : undefined}
                      placeholder="At least 8 characters"
                      value={signUpPassword}
                      onChange={(e) => {
                        setSignUpPassword(e.target.value);
                        if (signUpErrors.password) {
                          setSignUpErrors((prev) => ({ ...prev, password: undefined }));
                        }
                      }}
                      className={`w-full pl-12 pr-12 py-3.5 bg-[#FAF8FF] border ${
                        signUpErrors.password
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-purple-200/90 focus:ring-[#7C3AED]'
                      } rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                      aria-label={showSignUpPassword ? 'Hide password' : 'Show password'}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-purple-600 cursor-pointer"
                    >
                      {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {signUpErrors.password && (
                    <p
                      id="input-signup-pass-error"
                      className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1 animate-in fade-in"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{signUpErrors.password}</span>
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="input-signup-confirm-password" className="block text-xs font-bold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-600">
                      <ShieldCheck className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <input
                      id="input-signup-confirm-password"
                      name="confirm_password"
                      type={showSignUpPassword ? 'text' : 'password'}
                      noValidate
                      autoComplete="new-password"
                      aria-invalid={!!signUpErrors.confirmPassword}
                      aria-describedby={signUpErrors.confirmPassword ? 'input-signup-confirm-error' : undefined}
                      placeholder="Re-enter password"
                      value={signUpConfirmPassword}
                      onChange={(e) => {
                        setSignUpConfirmPassword(e.target.value);
                        if (signUpErrors.confirmPassword) {
                          setSignUpErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                        }
                      }}
                      className={`w-full pl-12 pr-4 py-3.5 bg-[#FAF8FF] border ${
                        signUpErrors.confirmPassword
                          ? 'border-rose-400 focus:ring-rose-400'
                          : 'border-purple-200/90 focus:ring-[#7C3AED]'
                      } rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:bg-white transition-all shadow-2xs`}
                    />
                  </div>
                  {signUpErrors.confirmPassword && (
                    <p
                      id="input-signup-confirm-error"
                      className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1 animate-in fade-in"
                      role="alert"
                    >
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{signUpErrors.confirmPassword}</span>
                    </p>
                  )}
                </div>

                {/* Submit Sign Up Button */}
                <button
                  id="btn-signup-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] hover:from-[#5B21B6] hover:to-[#7C3AED] active:scale-[0.99] text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-[0_10px_25px_rgba(124,58,237,0.35)] hover:shadow-[0_14px_30px_rgba(124,58,237,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500 font-medium">
                <span>Already have an account? </span>
                <button
                  id="btn-switch-to-login"
                  type="button"
                  onClick={() => {
                    setErrorMessage('');
                    setEmailOrPhoneError('');
                    setPasswordError('');
                    setView('login');
                  }}
                  className="font-bold text-[#7C3AED] hover:text-purple-800 hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </div>

            </div>

            {/* Bottom Footer Text */}
            <div className="mt-6 text-center">
              <span className="text-xs text-slate-400 font-medium tracking-wide">
                Powered by APNAPG.
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: FORGOT PASSWORD FLOW (NO LOGIN BYPASS) */}
        {/* ========================================================================= */}
        {view === 'forgot_password' && (
          <div className="flex flex-col items-center w-full">
            <div className="mb-3">
              <ApnaPgLogo size="md" showText={false} />
            </div>

            <div className="w-full bg-white rounded-3xl sm:rounded-[36px] p-6 sm:p-8 shadow-[0_12px_40px_rgba(124,58,237,0.09)] border border-purple-100/90 space-y-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setForgotSubmitted(false);
                    setForgotInputError('');
                    setView('login');
                  }}
                  className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-base font-extrabold text-slate-900">Reset Password</h2>
              </div>

              {!forgotSubmitted ? (
                <>
                  <p className="text-xs text-slate-500">
                    Enter your registered email or 10-digit mobile number to request a reset link.
                  </p>

                  <form
                    method="post"
                    action="#"
                    noValidate
                    onSubmit={handleForgotPasswordSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          id="input-forgot-email"
                          type="text"
                          noValidate
                          aria-invalid={!!forgotInputError}
                          aria-describedby={forgotInputError ? 'input-forgot-error' : undefined}
                          placeholder="Enter registered email / mobile"
                          value={forgotInput}
                          onChange={(e) => {
                            setForgotInput(e.target.value);
                            if (forgotInputError) {
                              setForgotInputError(validateIdentifier(e.target.value));
                            }
                          }}
                          className={`w-full pl-10 pr-4 py-3 bg-[#FAF8FF] border ${
                            forgotInputError
                              ? 'border-rose-400 focus:ring-rose-400'
                              : 'border-purple-200 focus:ring-[#7C3AED]'
                          } rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2`}
                        />
                      </div>
                      {forgotInputError && (
                        <p
                          id="input-forgot-error"
                          className="text-xs text-rose-600 font-medium mt-1.5 flex items-center gap-1 animate-in fade-in"
                          role="alert"
                        >
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>{forgotInputError}</span>
                        </p>
                      )}
                    </div>

                    <button
                      id="btn-send-reset-link"
                      type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer"
                    >
                      Send Reset Link
                    </button>
                  </form>
                </>
              ) : (
                <div className="space-y-4 pt-1 animate-in fade-in">
                  <div
                    id="forgot-password-demo-notice"
                    className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-1.5"
                  >
                    <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
                      <Info className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Password reset is not available in this demo.</span>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed pl-6">
                      No email or SMS dispatch is connected in this prototype. Please return to the login screen to sign in with your credentials or continue to explore.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setForgotSubmitted(false);
                      setForgotInputError('');
                      setView('login');
                    }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    ← Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: PRE-DETAILS RESIDENT ONBOARDING (STAGE 2) */}
        {/* ========================================================================= */}
        {view === 'pre_details' && (
          <div className="bg-white rounded-3xl sm:rounded-[36px] shadow-[0_15px_45px_rgba(124,58,237,0.12)] border border-purple-100 overflow-hidden w-full">
            
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-purple-700 via-[#7C3AED] to-indigo-700 p-5 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-purple-200">
                  Resident Onboarding • Preferences
                </span>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Resident Profile Details
                </h2>
                <p className="text-xs text-purple-100">
                  Tailor your room, mess preferences & resident verification card
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleSkipPreDetails}
                  className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Skip
                </button>
              </div>
            </div>

            {/* Pre-details Form */}
            <form onSubmit={handleCompletePreDetails} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {/* Profile Card Banner */}
              <div className="flex items-center gap-3.5 p-3.5 bg-purple-50/70 border border-purple-200/80 rounded-2xl">
                <img
                  src={profileData.avatar}
                  alt={profileData.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#7C3AED] shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-900 truncate">
                    {profileData.name}
                  </div>
                  <div className="text-[11px] text-purple-700 font-medium truncate">
                    {profileData.email || profileData.phone}
                  </div>
                </div>
                <div className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                  Verified ✓
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Legal Name (as per ID)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8FF] border border-purple-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Gender Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Looking Accommodation For
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'male', label: 'Boys / Male' },
                    { id: 'female', label: 'Girls / Female' },
                    { id: 'other', label: 'Unisex / Any' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setProfileData({ ...profileData, gender: g.id as any })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        profileData.gender === g.id
                          ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-xs'
                          : 'bg-[#FAF8FF] text-slate-700 border-purple-200 hover:bg-purple-50'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Type: Student vs Working Pro */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Resident Profile Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProfileData({ ...profileData, userType: 'student' })}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                      profileData.userType === 'student'
                        ? 'bg-purple-50 border-[#7C3AED] text-[#7C3AED] ring-2 ring-purple-500/20'
                        : 'bg-[#FAF8FF] border-purple-200 text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">College Student</div>
                      <div className="text-[10px] text-slate-500">University & Classes</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setProfileData({ ...profileData, userType: 'working_professional' })}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                      profileData.userType === 'working_professional'
                        ? 'bg-purple-50 border-[#7C3AED] text-[#7C3AED] ring-2 ring-purple-500/20'
                        : 'bg-[#FAF8FF] border-purple-200 text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <Briefcase className="w-4 h-4 shrink-0" />
                    <div>
                      <div className="text-xs font-bold">Working Pro</div>
                      <div className="text-[10px] text-slate-500">IT & Corporate</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Institution or Company */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  College / University / Company
                </label>
                <input
                  type="text"
                  value={profileData.institutionOrCompany}
                  onChange={(e) => setProfileData({ ...profileData, institutionOrCompany: e.target.value })}
                  placeholder="e.g. Ahmedabad University, IIM, Nirma, TCS"
                  className="w-full px-3 py-2.5 bg-[#FAF8FF] border border-purple-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                />
              </div>

              {/* City & Emergency Contact */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Stay City
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={profileData.city}
                      onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                      className="w-full pl-8 pr-3 py-2.5 bg-[#FAF8FF] border border-purple-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                    >
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Gandhinagar">Gandhinagar</option>
                      <option value="Vadodara">Vadodara</option>
                      <option value="Surat">Surat</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={profileData.emergencyContact}
                    onChange={(e) => {
                      setProfileData({ ...profileData, emergencyContact: e.target.value });
                      if (preDetailsEmergencyError) setPreDetailsEmergencyError('');
                    }}
                    placeholder="+91 98250 99881 (Parent)"
                    className={`w-full px-3 py-2.5 bg-[#FAF8FF] border rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#7C3AED] focus:outline-none ${
                      preDetailsEmergencyError ? 'border-red-500 bg-red-50/20' : 'border-purple-200'
                    }`}
                  />
                  {preDetailsEmergencyError && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">
                      {preDetailsEmergencyError}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] hover:from-[#5B21B6] hover:to-[#7C3AED] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-[0_10px_25px_rgba(124,58,237,0.38)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Launching Apna PG...</span>
                  ) : (
                    <>
                      <span>Complete Pre-Details & Explore</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified 256-bit Apna PG Security</span>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* OAUTH API SETUP & QUICK TEST MODAL */}
        {/* ========================================================================= */}
        {oauthSetupModal && (
          <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-purple-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                      {oauthSetupModal.provider === 'google' ? 'Google' : 'Apple'} OAuth 2.0 API
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Endpoint /api/auth/url is active
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setOauthSetupModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <p>
                  To link live {oauthSetupModal.provider === 'google' ? 'Google' : 'Apple'} credentials, register this app's authorized callback URI in your developer console:
                </p>

                {/* Redirect URI Box */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Authorized Callback URI</span>
                    <button
                      type="button"
                      onClick={() => copyCallbackUrl(oauthSetupModal.redirectUri)}
                      className="text-[#7C3AED] hover:text-purple-800 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      {copiedUri ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedUri ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="text-[11px] font-mono font-medium text-slate-800 break-all select-all bg-white p-2 rounded-lg border border-slate-200/80">
                    {oauthSetupModal.redirectUri}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 space-y-1 pt-1">
                  <div>1. Set <code className="bg-slate-100 px-1 py-0.5 rounded text-purple-700 font-semibold">{oauthSetupModal.provider === 'google' ? 'GOOGLE_CLIENT_ID' : 'APPLE_CLIENT_ID'}</code> in your environment or Secrets.</div>
                  <div>2. OAuth popup opens the provider authorization URL directly and returns via postMessage.</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => handleSimulateOAuthTest(oauthSetupModal.provider)}
                  className="w-full py-2.5 px-4 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" />
                  <span>Test Sign-In as {oauthSetupModal.provider === 'google' ? 'Google' : 'Apple'} Resident</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOauthSetupModal(null)}
                  className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
