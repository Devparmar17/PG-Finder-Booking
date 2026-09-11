import React, { useState } from 'react';
import {
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Download,
  LogOut,
  HelpCircle,
  Check,
  User,
  Briefcase,
  GraduationCap,
  Building2,
  Edit3,
  MapPin,
  Utensils,
  HeartPulse,
  Sparkles,
} from 'lucide-react';
import { INITIAL_USER } from '../data/mockData';
import { BookingRecord, UserProfile } from '../types';
import { EditProfileModal } from './EditProfileModal';
import { SocialAuthDialog, SocialAuthResult } from './SocialAuthDialog';

interface ProfileViewProps {
  currentUser?: UserProfile | null;
  bookings: BookingRecord[];
  onBackToHome: () => void;
  onOpenSupport?: () => void;
  onSignOut?: () => void;
  onUpdateProfile?: (user: UserProfile) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  bookings,
  onOpenSupport,
  onSignOut,
  onUpdateProfile,
}) => {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [socialAuthModal, setSocialAuthModal] = useState<'google' | 'apple' | null>(null);

  const activeUser: UserProfile = currentUser || INITIAL_USER;
  const name = activeUser.name;
  const email = activeUser.email;
  const phone = activeUser.phone;
  const avatar = activeUser.avatar;
  const city = activeUser.city;
  const emergencyContact = activeUser.emergencyContact;
  const institutionOrCompany = activeUser.institutionOrCompany || 'Ahmedabad University / Tech Hub';
  const userType = activeUser.userType || 'student';
  const authProvider = activeUser.authProvider || 'google';
  const dietPreference = activeUser.dietPreference || 'veg';
  const bloodGroup = activeUser.bloodGroup || 'B+';

  const handleDownload = (id: string) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2000);
  };

  const handleSaveProfile = (updated: UserProfile) => {
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  const handleSocialAuthSuccess = (res: SocialAuthResult) => {
    setSocialAuthModal(null);
    const updated: UserProfile = {
      ...activeUser,
      name: res.name,
      email: res.email,
      avatar: res.avatar,
      authProvider: res.provider,
    };
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  return (
    <div id="profile-view" className="px-4 sm:px-6 py-4 space-y-4 pb-28 animate-in fade-in duration-200 max-w-4xl mx-auto">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm text-center relative overflow-hidden">
        {/* Quick Edit Profile Button at top right */}
        <button
          id="btn-edit-profile-header"
          onClick={() => setShowEditModal(true)}
          className="absolute top-4 right-4 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] border border-purple-200/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-105 active:scale-95"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Change Profile</span>
        </button>

        {/* Avatar with edit click */}
        <div
          onClick={() => setShowEditModal(true)}
          className="w-22 h-22 rounded-full ring-4 ring-purple-500/20 p-0.5 mx-auto mb-3 shadow-md relative group cursor-pointer"
          title="Click to change photo"
        >
          <img
            src={avatar}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
          <div className="absolute inset-0 bg-purple-900/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
            <Edit3 className="w-5 h-5" />
          </div>
        </div>

        <h2 className="text-xl font-black text-slate-900">{name}</h2>
        <p className="text-xs text-slate-500 mt-0.5 font-medium flex items-center justify-center gap-1">
          <MapPin className="w-3 h-3 text-[#7C3AED]" />
          <span>{city}, Gujarat</span>
        </p>

        {/* KYC Badge & Auth Provider */}
        <div className="flex items-center justify-center gap-2 mt-3.5 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Aadhaar e-KYC Verified</span>
          </div>

          {authProvider === 'google' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/80 rounded-full text-xs font-bold">
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
              <span>Signed in with Google</span>
            </div>
          )}

          {authProvider === 'apple' && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white border border-slate-700 rounded-full text-xs font-bold">
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.79-11.97-14.24-5.33-8.08-9.47-17.15-12.43-27.22-2.96-10.07-4.44-19.68-4.44-28.84 0-13.06 3.34-24.16 10.03-33.3 6.69-9.14 15.26-13.79 25.7-13.96 4.35 0 9.29 1.13 14.81 3.38 5.53 2.25 9.4 3.42 11.62 3.5 1.94-.13 5.92-1.37 11.94-3.73 6.01-2.36 10.9-3.41 14.65-3.15 11.39.87 20.35 5.09 26.89 12.67-10.15 6.17-15.11 14.76-14.88 25.77.23 8.7 3.51 16.03 9.85 21.99 6.34 5.96 13.9 9.38 22.68 10.25-2.08 6.09-4.57 12.42-7.46 19-.94 2.17-1.84 4.36-2.7 6.55zM119.22 33.64c0-7.39 2.65-14.28 7.94-20.67 5.29-6.39 11.83-10.45 19.62-12.18.33 1.25.49 2.37.49 3.36 0 7.39-2.73 14.4-8.19 21.03-5.46 6.63-12.04 10.7-19.74 12.21-.08-1.25-.12-2.5-.12-3.75z" />
              </svg>
              <span>Signed in with Apple ID</span>
            </div>
          )}

          {authProvider !== 'google' && authProvider !== 'apple' && (
            <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-[#7C3AED] border border-purple-200/60 rounded-full text-xs font-bold">
              <span>Auth: Mobile Phone OTP</span>
            </div>
          )}
        </div>

        {/* Quick Social Authentication Switcher in Profile */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-purple-50/40 p-3 rounded-2xl border border-purple-100/60">
          <div className="text-left">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
              <span>Social Authentication & Switch</span>
            </div>
            <div className="text-[10px] text-slate-500">
              Change account or re-authenticate with Google or Apple ID
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="btn-profile-switch-google"
              type="button"
              onClick={() => setSocialAuthModal('google')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs border ${
                authProvider === 'google'
                  ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-400/30'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
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
              <span>{authProvider === 'google' ? 'Google Active' : 'Sign in Google'}</span>
            </button>

            <button
              id="btn-profile-switch-apple"
              type="button"
              onClick={() => setSocialAuthModal('apple')}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs border ${
                authProvider === 'apple'
                  ? 'bg-black text-white border-black ring-2 ring-slate-400/30'
                  : 'bg-white text-slate-800 hover:bg-slate-50 border-slate-200'
              }`}
            >
              <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.69-7.79-11.97-14.24-5.33-8.08-9.47-17.15-12.43-27.22-2.96-10.07-4.44-19.68-4.44-28.84 0-13.06 3.34-24.16 10.03-33.3 6.69-9.14 15.26-13.79 25.7-13.96 4.35 0 9.29 1.13 14.81 3.38 5.53 2.25 9.4 3.42 11.62 3.5 1.94-.13 5.92-1.37 11.94-3.73 6.01-2.36 10.9-3.41 14.65-3.15 11.39.87 20.35 5.09 26.89 12.67-10.15 6.17-15.11 14.76-14.88 25.77.23 8.7 3.51 16.03 9.85 21.99 6.34 5.96 13.9 9.38 22.68 10.25-2.08 6.09-4.57 12.42-7.46 19-.94 2.17-1.84 4.36-2.7 6.55zM119.22 33.64c0-7.39 2.65-14.28 7.94-20.67 5.29-6.39 11.83-10.45 19.62-12.18.33 1.25.49 2.37.49 3.36 0 7.39-2.73 14.4-8.19 21.03-5.46 6.63-12.04 10.7-19.74 12.21-.08-1.25-.12-2.5-.12-3.75z" />
              </svg>
              <span>{authProvider === 'apple' ? 'Apple ID Active' : 'Sign in Apple'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account Info */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3.5 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-900">Resident Details & Preferences</h3>
            <button
              onClick={() => setShowEditModal(true)}
              className="text-xs font-bold text-[#7C3AED] hover:text-purple-800 flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3 h-3" />
              <span>Edit</span>
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Phone className="w-4 h-4 text-[#7C3AED]" />
              <span>Phone</span>
            </div>
            <span className="font-bold text-slate-800">{phone}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Mail className="w-4 h-4 text-[#7C3AED]" />
              <span>Email</span>
            </div>
            <span className="font-bold text-slate-800 truncate max-w-[180px]">{email}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-500">
              {userType === 'student' ? (
                <GraduationCap className="w-4 h-4 text-[#7C3AED]" />
              ) : (
                <Briefcase className="w-4 h-4 text-[#7C3AED]" />
              )}
              <span>Occupation</span>
            </div>
            <span className="font-bold text-slate-800 capitalize">
              {userType === 'student' ? 'College Student' : 'Working Professional'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Building2 className="w-4 h-4 text-[#7C3AED]" />
              <span>College / Company</span>
            </div>
            <span className="font-bold text-slate-800 truncate max-w-[180px]">{institutionOrCompany}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Utensils className="w-4 h-4 text-[#7C3AED]" />
              <span>Food Preference</span>
            </div>
            <span className="font-bold text-slate-800 capitalize">
              {dietPreference === 'veg'
                ? 'Pure Veg'
                : dietPreference === 'jain'
                ? 'Jain Food'
                : dietPreference === 'eggetarian'
                ? 'Eggetarian'
                : 'Non-Veg'}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-500">
              <HeartPulse className="w-4 h-4 text-[#7C3AED]" />
              <span>Blood Group</span>
            </div>
            <span className="font-bold text-slate-800">{bloodGroup}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
              <span>Emergency Contact</span>
            </div>
            <span className="font-bold text-slate-800">{emergencyContact}</span>
          </div>
        </div>

        {/* Digital Receipts & Agreements */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-sm space-y-3.5 text-xs">
          <h3 className="font-extrabold text-sm text-slate-900">Digital Agreements & Invoices</h3>

          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-3.5 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200/80"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-[#7C3AED] shrink-0" />
                <div>
                  <div className="font-bold text-slate-800">
                    {b.pgName} ({b.roomNumber})
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Token Invoice • {b.bookingCode}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(b.id)}
                className="p-2 rounded-xl bg-purple-50 text-[#7C3AED] hover:bg-purple-100 border border-purple-200/60 transition-colors cursor-pointer"
                title="Download PDF"
              >
                {downloadedId === b.id ? (
                  <Check className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}

          <div className="pt-2 p-3 bg-purple-50/60 rounded-2xl border border-purple-100/90 text-[11px] text-purple-900 flex items-center justify-between">
            <div>
              <span className="font-bold block">Need to update stay details?</span>
              <span className="text-slate-500 text-[10px]">Changes reflect on your rent invoice</span>
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="px-2.5 py-1 bg-[#7C3AED] text-white font-bold rounded-lg text-[10px] cursor-pointer"
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Support & Settings Links */}
      <div className="bg-white rounded-3xl p-2.5 border border-slate-200/90 shadow-sm text-xs font-semibold text-slate-700">
        <button
          onClick={() => setShowEditModal(true)}
          className="w-full p-3 flex items-center justify-between hover:bg-purple-50 rounded-2xl transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <Edit3 className="w-4 h-4 text-[#7C3AED]" />
            <span>Change Profile Information</span>
          </div>
          <span className="text-[#7C3AED] font-bold">›</span>
        </button>

        <button
          onClick={onOpenSupport}
          className="w-full p-3 flex items-center justify-between hover:bg-purple-50 rounded-2xl transition-colors cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#7C3AED]" />
            <div className="flex items-center gap-2">
              <span>Help & AI Resident Support</span>
              <span className="text-[10px] bg-purple-100 text-[#7C3AED] px-2 py-0.5 rounded-full font-bold">24/7 AI Bot</span>
            </div>
          </div>
          <span className="text-[#7C3AED] font-bold">›</span>
        </button>

        <button
          onClick={onSignOut}
          className="w-full p-3 flex items-center justify-between hover:bg-red-50 rounded-2xl transition-colors text-red-600 cursor-pointer text-left"
        >
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out & Switch Account</span>
          </div>
          <span className="text-slate-400 font-bold">›</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal
          currentUser={activeUser}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}

      {/* Social Auth Modal for Google & Apple */}
      {socialAuthModal && (
        <SocialAuthDialog
          isOpen={!!socialAuthModal}
          provider={socialAuthModal}
          onClose={() => setSocialAuthModal(null)}
          onSuccess={handleSocialAuthSuccess}
        />
      )}
    </div>
  );
};
