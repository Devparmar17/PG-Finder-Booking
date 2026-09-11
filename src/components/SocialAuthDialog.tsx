import React, { useState } from 'react';
import {
  X,
  Check,
  ShieldCheck,
  Fingerprint,
  Mail,
  User,
  ArrowRight,
  Plus,
} from 'lucide-react';

export interface SocialAuthResult {
  provider: 'google' | 'apple';
  name: string;
  email: string;
  avatar: string;
}

interface SocialAuthDialogProps {
  isOpen: boolean;
  provider: 'google' | 'apple';
  onClose: () => void;
  onSuccess: (result: SocialAuthResult) => void;
}

export const SocialAuthDialog: React.FC<SocialAuthDialogProps> = ({
  isOpen,
  provider,
  onClose,
  onSuccess,
}) => {
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<string>('primary');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showAddGoogleAccount, setShowAddGoogleAccount] = useState(false);

  // Apple states
  const [appleEmailOption, setAppleEmailOption] = useState<'share' | 'hide'>('share');
  const [isProcessing, setIsProcessing] = useState(false);
  const [authStep, setAuthStep] = useState<'prompt' | 'authenticating' | 'complete'>('prompt');

  if (!isOpen) return null;

  const googleAccounts = [
    {
      id: 'primary',
      name: 'Dev Parmar',
      email: 'devparmar3030@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      tag: 'Default • Signed in',
    },
    {
      id: 'student',
      name: 'Dev Parmar (Gujarat Uni)',
      email: 'dev.parmar@gujaratuni.ac.in',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
      tag: 'Student Workspace',
    },
  ];

  const handleSelectGoogle = (accId: string) => {
    setIsProcessing(true);
    setAuthStep('authenticating');

    setTimeout(() => {
      let result: SocialAuthResult;
      if (accId === 'custom') {
        result = {
          provider: 'google',
          name: customName.trim() || 'Google Resident',
          email: customEmail.trim() || 'user@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        };
      } else {
        const acc = googleAccounts.find((a) => a.id === accId) || googleAccounts[0];
        result = {
          provider: 'google',
          name: acc.name,
          email: acc.email,
          avatar: acc.avatar,
        };
      }
      setAuthStep('complete');
      setTimeout(() => {
        onSuccess(result);
      }, 400);
    }, 600);
  };

  const handleAppleSubmit = () => {
    setIsProcessing(true);
    setAuthStep('authenticating');

    setTimeout(() => {
      const email =
        appleEmailOption === 'share'
          ? 'devparmar3030@gmail.com'
          : 'devparmar.apple@privaterelay.appleid.com';

      const result: SocialAuthResult = {
        provider: 'apple',
        name: 'Dev Parmar',
        email: email,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
      };
      setAuthStep('complete');
      setTimeout(() => {
        onSuccess(result);
      }, 400);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      {/* ========================================================================= */}
      {/* GOOGLE AUTHENTICATION MODAL */}
      {/* ========================================================================= */}
      {provider === 'google' && (
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header with Google Colors & Close */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Sign in with Google</h3>
                <p className="text-[11px] text-slate-500">Choose an account to continue to Apna PG</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Account Chooser Body */}
          <div className="p-6 space-y-3">
            {authStep === 'authenticating' ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-sm font-bold text-slate-800">Authenticating with Google...</div>
                <div className="text-xs text-slate-500">Syncing your profile and verified credentials</div>
              </div>
            ) : authStep === 'complete' ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="text-sm font-black text-slate-900">Google Authentication Successful!</div>
                <div className="text-xs text-slate-500">Updating resident profile...</div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  {googleAccounts.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleSelectGoogle(acc.id)}
                      className="w-full p-3.5 rounded-2xl border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex items-center justify-between text-left cursor-pointer group shadow-2xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={acc.avatar}
                          alt={acc.name}
                          className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-400"
                        />
                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-700 truncate">
                            {acc.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{acc.email}</div>
                          <span className="inline-block text-[9px] font-semibold text-blue-600 mt-0.5">
                            {acc.tag}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </button>
                  ))}

                  {/* Add another Google account option */}
                  {!showAddGoogleAccount ? (
                    <button
                      type="button"
                      onClick={() => setShowAddGoogleAccount(true)}
                      className="w-full p-3 rounded-2xl border border-dashed border-slate-300 hover:border-blue-400 hover:bg-slate-50 transition-all flex items-center gap-3 text-left cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                        <Plus className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-700">Use another Google account</div>
                        <div className="text-[10px] text-slate-400">Enter custom name & gmail address</div>
                      </div>
                    </button>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 animate-in fade-in">
                      <div className="text-xs font-bold text-slate-800">Enter Google Account Details</div>
                      <input
                        type="text"
                        placeholder="Full Name (e.g. Dev Parmar)"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={customEmail}
                        onChange={(e) => setCustomEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setShowAddGoogleAccount(false)}
                          className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectGoogle('custom')}
                          disabled={!customEmail}
                          className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg cursor-pointer disabled:opacity-50"
                        >
                          Continue with this account
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Google OAuth Disclaimer */}
                <div className="pt-3 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed">
                  To continue, Google will securely share your verified name, email address, and profile
                  photo with Apna PG according to the Google Identity Services agreement.
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* APPLE AUTHENTICATION MODAL */}
      {/* ========================================================================= */}
      {provider === 'apple' && (
        <div className="relative w-full max-w-sm bg-black text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in zoom-in-95 duration-200">
          
          {/* Header */}
          <div className="px-6 pt-6 pb-3 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.79-11.97-14.24-5.33-8.08-9.47-17.15-12.43-27.22-2.96-10.07-4.44-19.68-4.44-28.84 0-13.06 3.34-24.16 10.03-33.3 6.69-9.14 15.26-13.79 25.7-13.96 4.35 0 9.29 1.13 14.81 3.38 5.53 2.25 9.4 3.42 11.62 3.5 1.94-.13 5.92-1.37 11.94-3.73 6.01-2.36 10.9-3.41 14.65-3.15 11.39.87 20.35 5.09 26.89 12.67-10.15 6.17-15.11 14.76-14.88 25.77.23 8.7 3.51 16.03 9.85 21.99 6.34 5.96 13.9 9.38 22.68 10.25-2.08 6.09-4.57 12.42-7.46 19-.94 2.17-1.84 4.36-2.7 6.55zM119.22 33.64c0-7.39 2.65-14.28 7.94-20.67 5.29-6.39 11.83-10.45 19.62-12.18.33 1.25.49 2.37.49 3.36 0 7.39-2.73 14.4-8.19 21.03-5.46 6.63-12.04 10.7-19.74 12.21-.08-1.25-.12-2.5-.12-3.75z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold tracking-tight">Sign in with Apple</h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Apple ID Body */}
          <div className="p-6 space-y-4">
            {authStep === 'authenticating' ? (
              <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
                <Fingerprint className="w-12 h-12 text-white animate-pulse" />
                <div className="text-sm font-bold text-white">Apple ID Authentication...</div>
                <div className="text-xs text-white/60">Verifying biometric credentials</div>
              </div>
            ) : authStep === 'complete' ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="text-sm font-bold text-white">Apple ID Verified</div>
                <div className="text-xs text-white/60">Setting up resident profile...</div>
              </div>
            ) : (
              <>
                <div className="text-center space-y-1">
                  <div className="text-xs text-white/70">Do you want to sign in to Apna PG with your Apple ID?</div>
                  <div className="text-sm font-bold text-white">Dev Parmar</div>
                  <div className="text-xs text-white/50">devparmar3030@gmail.com</div>
                </div>

                {/* Email Relay Radio */}
                <div className="bg-white/5 rounded-2xl p-3 border border-white/10 space-y-2.5 text-xs">
                  <label
                    onClick={() => setAppleEmailOption('share')}
                    className="flex items-start gap-2.5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="apple_email"
                      checked={appleEmailOption === 'share'}
                      onChange={() => setAppleEmailOption('share')}
                      className="mt-0.5 text-white accent-white"
                    />
                    <div>
                      <div className="font-semibold text-white">Share My Email</div>
                      <div className="text-[10px] text-white/60">devparmar3030@gmail.com</div>
                    </div>
                  </label>

                  <div className="border-t border-white/10 pt-2" />

                  <label
                    onClick={() => setAppleEmailOption('hide')}
                    className="flex items-start gap-2.5 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="apple_email"
                      checked={appleEmailOption === 'hide'}
                      onChange={() => setAppleEmailOption('hide')}
                      className="mt-0.5 text-white accent-white"
                    />
                    <div>
                      <div className="font-semibold text-white">Hide My Email</div>
                      <div className="text-[10px] text-white/60">
                        devparmar.apple@privaterelay.appleid.com (Relayed to your Apple ID)
                      </div>
                    </div>
                  </label>
                </div>

                {/* Continue with Touch / Face ID */}
                <button
                  type="button"
                  onClick={handleAppleSubmit}
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-white text-black hover:bg-white/90 active:scale-[0.98] font-bold text-xs sm:text-sm rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Continue with Passcode / Touch ID</span>
                </button>

                <div className="text-center text-[10px] text-white/50 leading-relaxed">
                  Apna PG will receive your name and the email address you choose to share.
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
