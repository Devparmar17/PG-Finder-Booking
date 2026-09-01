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
} from 'lucide-react';
import { INITIAL_USER } from '../data/mockData';
import { BookingRecord, UserProfile } from '../types';
import { EditProfileModal } from './EditProfileModal';

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
          <div className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-[#7C3AED] border border-purple-200/60 rounded-full text-xs font-bold">
            <span>Auth: {authProvider === 'google' ? 'Google' : authProvider === 'apple' ? 'Apple ID' : 'Mobile OTP'}</span>
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
    </div>
  );
};
