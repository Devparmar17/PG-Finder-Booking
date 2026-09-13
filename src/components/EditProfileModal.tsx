import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  Building2,
  Camera,
  Check,
  Sparkles,
  Utensils,
  HeartPulse,
} from 'lucide-react';
import { UserProfile } from '../types';

interface EditProfileModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: UserProfile) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<UserProfile>({
    ...currentUser,
    dietPreference: currentUser.dietPreference || 'veg',
    bloodGroup: currentUser.bloodGroup || 'B+',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showCustomUrlInput, setShowCustomUrlInput] = useState(false);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setSuccessMessage('Profile details updated successfully!');
      onSave(formData);
      setTimeout(() => {
        setSuccessMessage('');
        onClose();
      }, 700);
    }, 400);
  };

  const handleAvatarSelect = (url: string) => {
    setFormData((prev) => ({ ...prev, avatar: url }));
  };

  const handleApplyCustomUrl = () => {
    if (customAvatarUrl.trim()) {
      setFormData((prev) => ({ ...prev, avatar: customAvatarUrl.trim() }));
      setShowCustomUrlInput(false);
      setCustomAvatarUrl('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl sm:rounded-[32px] shadow-2xl border border-purple-100 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] px-5 sm:px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
              <User className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-tight">
                Edit Resident Profile
              </h2>
              <p className="text-[11px] text-purple-100">
                Update personal, occupation & accommodation details
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Avatar Section */}
          <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-4 space-y-3">
            <label className="block text-xs font-extrabold text-slate-800">
              Profile Photo & Avatar
            </label>
            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-500/30 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setShowCustomUrlInput(!showCustomUrlInput)}
                  className="absolute bottom-0 right-0 p-1 bg-[#7C3AED] text-white rounded-full shadow-md hover:bg-purple-800 transition-transform cursor-pointer"
                  title="Change URL"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div className="flex-1 space-y-1.5">
                <span className="text-[11px] text-slate-500 font-medium block">
                  Select a profile avatar or enter custom image URL:
                </span>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {AVATAR_PRESETS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAvatarSelect(url)}
                      className={`relative w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        formData.avatar === url
                          ? 'border-[#7C3AED] ring-2 ring-purple-400 scale-105'
                          : 'border-white opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt="Preset avatar" className="w-full h-full object-cover" />
                      {formData.avatar === url && (
                        <div className="absolute inset-0 bg-purple-600/30 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {showCustomUrlInput && (
              <div className="flex items-center gap-2 pt-2 animate-in fade-in">
                <input
                  type="url"
                  placeholder="Paste direct image URL (https://...)"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
                <button
                  type="button"
                  onClick={handleApplyCustomUrl}
                  className="px-3 py-2 bg-[#7C3AED] text-white text-xs font-bold rounded-xl hover:bg-purple-800 cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Legal Name (as per Govt ID)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8FF] border border-purple-200/90 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] focus:bg-white focus:outline-none"
                placeholder="Enter full name"
              />
            </div>
          </div>

          {/* Phone & Email Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8FF] border border-purple-200/90 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] focus:bg-white focus:outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8FF] border border-purple-200/90 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] focus:bg-white focus:outline-none"
                  placeholder="name@email.com"
                />
              </div>
            </div>
          </div>

          {/* Gender Preference */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Gender Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'male', label: 'Boys / Male' },
                { id: 'female', label: 'Girls / Female' },
                { id: 'other', label: 'Unisex / Other' },
              ].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender: g.id as any })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    formData.gender === g.id
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
                onClick={() => setFormData({ ...formData, userType: 'student' })}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                  formData.userType === 'student'
                    ? 'bg-purple-50 border-[#7C3AED] text-[#7C3AED] ring-2 ring-purple-500/20'
                    : 'bg-[#FAF8FF] border-purple-200 text-slate-700 hover:bg-purple-50'
                }`}
              >
                <GraduationCap className="w-4 h-4 shrink-0 text-[#7C3AED]" />
                <div>
                  <div className="text-xs font-bold">College Student</div>
                  <div className="text-[10px] text-slate-500">University / Coaching</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, userType: 'working_professional' })}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer flex items-center gap-2.5 ${
                  formData.userType === 'working_professional'
                    ? 'bg-purple-50 border-[#7C3AED] text-[#7C3AED] ring-2 ring-purple-500/20'
                    : 'bg-[#FAF8FF] border-purple-200 text-slate-700 hover:bg-purple-50'
                }`}
              >
                <Briefcase className="w-4 h-4 shrink-0 text-[#7C3AED]" />
                <div>
                  <div className="text-xs font-bold">Working Pro</div>
                  <div className="text-[10px] text-slate-500">IT / Corporate</div>
                </div>
              </button>
            </div>
          </div>

          {/* College / University / Company */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              College / University / Company Name
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={formData.institutionOrCompany || ''}
                onChange={(e) =>
                  setFormData({ ...formData, institutionOrCompany: e.target.value })
                }
                placeholder="e.g. Ahmedabad University, Nirma, TCS, Infocity"
                className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8FF] border border-purple-200/90 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* City, Emergency Contact & Food Preference */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Stay City
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8FF] border border-purple-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                >
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Gandhinagar">Gandhinagar</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Surat">Surat</option>
                  <option value="Rajkot">Rajkot</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Emergency Contact
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  placeholder="+91 98250 99881 (Parent)"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8FF] border border-purple-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Diet & Blood Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dietary Preference
              </label>
              <div className="relative">
                <Utensils className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.dietPreference || 'veg'}
                  onChange={(e) =>
                    setFormData({ ...formData, dietPreference: e.target.value as any })
                  }
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8FF] border border-purple-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                >
                  <option value="veg">Pure Vegetarian (No Onion/Garlic option)</option>
                  <option value="jain">Strict Jain Food</option>
                  <option value="eggetarian">Eggetarian</option>
                  <option value="non_veg">Non-Vegetarian</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Blood Group (for Resident ID)
              </label>
              <div className="relative">
                <HeartPulse className="w-4 h-4 text-purple-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <select
                  value={formData.bloodGroup || 'B+'}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-[#FAF8FF] border border-purple-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-2 py-3 px-4 rounded-2xl bg-gradient-to-r from-[#6D28D9] via-[#7C3AED] to-[#8B5CF6] hover:from-[#5B21B6] hover:to-[#7C3AED] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving Changes...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Save Profile Details
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
