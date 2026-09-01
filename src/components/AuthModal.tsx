import React, { useState } from 'react';
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
} from 'lucide-react';
import { UserProfile } from '../types';
import { ApnaPgLogo } from './ApnaPgLogo';

interface AuthModalProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLoginSuccess }) => {
  // Screen views: 'login' | 'pre_details' | 'forgot_password'
  const [view, setView] = useState<'login' | 'pre_details' | 'forgot_password'>('login');
  
  // Login form states
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeProvider, setActiveProvider] = useState<'google' | 'apple' | 'email' | 'phone'>('email');

  // Pre-details Onboarding Profile States
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

  // Handle direct Login submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone) {
      setErrorMessage('Please enter your email or phone number');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const isEmail = emailOrPhone.includes('@');
      setProfileData((prev) => ({
        ...prev,
        email: isEmail ? emailOrPhone : prev.email,
        phone: !isEmail ? emailOrPhone : prev.phone,
        name: isEmail ? emailOrPhone.split('@')[0].replace(/[._]/g, ' ') : prev.name,
      }));
      setView('pre_details');
    }, 500);
  };

  // Handle small round Google & Apple login buttons
  const handleSocialAuth = (provider: 'google' | 'apple') => {
    setActiveProvider(provider);
    setIsSubmitting(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsSubmitting(false);
      if (provider === 'google') {
        setProfileData((prev) => ({
          ...prev,
          name: 'Dev Parmar',
          email: 'devparmar3030@gmail.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        }));
      } else {
        setProfileData((prev) => ({
          ...prev,
          name: 'Dev Parmar (Apple)',
          email: 'devparmar.apple@privaterelay.appleid.com',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        }));
      }
      setView('pre_details');
    }, 500);
  };

  // Complete pre-details and launch the app
  const handleCompletePreDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const userProfile: UserProfile = {
        id: `user-${Date.now()}`,
        name: profileData.name || 'Resident Guest',
        email: profileData.email || 'resident@apnapg.in',
        phone: profileData.phone || '+91 98765 43210',
        avatar: profileData.avatar,
        city: profileData.city,
        gender: profileData.gender,
        userType: profileData.userType,
        institutionOrCompany: profileData.institutionOrCompany,
        kycStatus: 'Verified',
        emergencyContact: profileData.emergencyContact,
        authProvider: activeProvider,
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
              
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-2xl animate-shake">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                {/* Email / Phone Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-600">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="input-email-phone"
                    type="text"
                    required
                    placeholder="Email/phone No."
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-[#FAF8FF] border border-purple-200/90 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:bg-white transition-all shadow-2xs"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-600">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    id="input-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-3.5 bg-[#FAF8FF] border border-purple-200/90 rounded-2xl text-xs sm:text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:bg-white transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-purple-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => setView('forgot_password')}
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

              {/* Small Circular Social Buttons (Google & Apple) */}
              <div className="flex items-center justify-center gap-4 pt-2">
                
                {/* Round Google Button */}
                <button
                  id="btn-google-round"
                  type="button"
                  onClick={() => handleSocialAuth('google')}
                  disabled={isSubmitting}
                  className="w-12 h-12 rounded-full bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group"
                  title="Sign in with Google"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                </button>

                {/* Round Apple Button */}
                <button
                  id="btn-apple-round"
                  type="button"
                  onClick={() => handleSocialAuth('apple')}
                  disabled={isSubmitting}
                  className="w-12 h-12 rounded-full bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-purple-300 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group text-black"
                  title="Sign in with Apple"
                >
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.79-11.97-14.24-5.33-8.08-9.47-17.15-12.43-27.22-2.96-10.07-4.44-19.68-4.44-28.84 0-13.06 3.34-24.16 10.03-33.3 6.69-9.14 15.26-13.79 25.7-13.96 4.35 0 9.29 1.13 14.81 3.38 5.53 2.25 9.4 3.42 11.62 3.5 1.94-.13 5.92-1.37 11.94-3.73 6.01-2.36 10.9-3.41 14.65-3.15 11.39.87 20.35 5.09 26.89 12.67-10.15 6.17-15.11 14.76-14.88 25.77.23 8.7 3.51 16.03 9.85 21.99 6.34 5.96 13.9 9.38 22.68 10.25-2.08 6.09-4.57 12.42-7.46 19-.94 2.17-1.84 4.36-2.7 6.55zM119.22 33.64c0-7.39 2.65-14.28 7.94-20.67 5.29-6.39 11.83-10.45 19.62-12.18.33 1.25.49 2.37.49 3.36 0 7.39-2.73 14.4-8.19 21.03-5.46 6.63-12.04 10.7-19.74 12.21-.08-1.25-.12-2.5-.12-3.75z" />
                  </svg>
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
        {/* SCREEN 2: FORGOT PASSWORD FLOW */}
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
                  onClick={() => setView('login')}
                  className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-500 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-base font-extrabold text-slate-900">Reset Password</h2>
              </div>
              <p className="text-xs text-slate-500">
                Enter your registered email or phone to receive a quick verification link.
              </p>

              <div className="relative">
                <Mail className="w-4 h-4 text-purple-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter registered email / phone"
                  defaultValue={emailOrPhone}
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF8FF] border border-purple-200 rounded-2xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  alert('Password reset instructions sent!');
                  setView('login');
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#6D28D9] to-[#7C3AED] hover:from-[#5B21B6] hover:to-[#6D28D9] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all cursor-pointer"
              >
                Send Reset Link
              </button>
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
                  Step 2 of 2 • Pre-Details
                </span>
                <h2 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Resident Profile Details
                </h2>
                <p className="text-xs text-purple-100">
                  Tailor your room, mess preferences & resident verification card
                </p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-5 h-5 text-yellow-300" />
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
                    onChange={(e) => setProfileData({ ...profileData, emergencyContact: e.target.value })}
                    placeholder="+91 98250 99881 (Parent)"
                    className="w-full px-3 py-2.5 bg-[#FAF8FF] border border-purple-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                  />
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

      </div>
    </div>
  );
};
