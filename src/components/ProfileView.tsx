import React, { useState } from 'react';
import { Phone, Mail, ShieldCheck, CheckCircle2, FileText, Download, LogOut, HelpCircle, Check } from 'lucide-react';
import { INITIAL_USER } from '../data/mockData';
import { BookingRecord } from '../types';

interface ProfileViewProps {
  bookings: BookingRecord[];
  onBackToHome: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ bookings }) => {
  const [downloadedId, setDownloadedId] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadedId(id);
    setTimeout(() => setDownloadedId(null), 2000);
  };

  return (
    <div id="profile-view" className="px-5 sm:px-6 py-4 space-y-4 pb-28 animate-in fade-in duration-200">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-full ring-4 ring-purple-500/20 p-0.5 mx-auto mb-3 shadow-sm">
          <img
            src={INITIAL_USER.avatar}
            alt={INITIAL_USER.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <h2 className="text-xl font-extrabold text-slate-900">{INITIAL_USER.name}</h2>
        <p className="text-xs text-slate-500 mt-0.5">{INITIAL_USER.city}, Gujarat</p>

        {/* KYC Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-bold mt-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Aadhaar e-KYC Verified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account Info */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3.5 text-xs">
          <h3 className="font-bold text-sm text-slate-900">Personal Details</h3>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Phone className="w-4 h-4 text-[#7C3AED]" />
              <span>Phone</span>
            </div>
            <span className="font-bold text-slate-800">{INITIAL_USER.phone}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-slate-100">
            <div className="flex items-center gap-2.5 text-slate-500">
              <Mail className="w-4 h-4 text-[#7C3AED]" />
              <span>Email</span>
            </div>
            <span className="font-bold text-slate-800">{INITIAL_USER.email}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2.5 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-[#7C3AED]" />
              <span>Emergency Contact</span>
            </div>
            <span className="font-bold text-slate-800">{INITIAL_USER.emergencyContact}</span>
          </div>
        </div>

        {/* Digital Receipts & Agreements */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3.5 text-xs">
          <h3 className="font-bold text-sm text-slate-900">Digital Agreements & Invoices</h3>

          {bookings.map((b) => (
            <div
              key={b.id}
              className="p-3.5 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-200/80"
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
        </div>
      </div>

      {/* Support & Settings Links */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/90 shadow-sm text-xs font-semibold text-slate-700">
        <button className="w-full p-3 flex items-center justify-between hover:bg-slate-50 rounded-xl transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-[#7C3AED]" />
            <span>Help & PG Resident Support</span>
          </div>
          <span className="text-slate-400 font-bold">›</span>
        </button>

        <button className="w-full p-3 flex items-center justify-between hover:bg-red-50 rounded-xl transition-colors text-red-600 cursor-pointer">
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </div>
          <span className="text-slate-400 font-bold">›</span>
        </button>
      </div>
    </div>
  );
};
