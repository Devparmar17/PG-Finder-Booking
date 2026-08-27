import React from 'react';
import { User, Phone, Mail, ShieldCheck, CheckCircle2, FileText, Download, LogOut, Settings, HelpCircle } from 'lucide-react';
import { INITIAL_USER } from '../data/mockData';
import { BookingRecord } from '../types';

interface ProfileViewProps {
  bookings: BookingRecord[];
  onBackToHome: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ bookings }) => {
  return (
    <div id="profile-view" className="px-4 py-3 space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-full ring-4 ring-purple-100 p-0.5 mx-auto mb-3 shadow-md">
          <img
            src={INITIAL_USER.avatar}
            alt={INITIAL_USER.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        <h2 className="text-lg font-black text-slate-900">{INITIAL_USER.name}</h2>
        <p className="text-xs text-slate-500">{INITIAL_USER.city}, Gujarat</p>

        {/* KYC Badge */}
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold mt-2.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Aadhaar e-KYC Verified</span>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-3 text-xs">
        <h3 className="font-extrabold text-sm text-slate-900">Personal Details</h3>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-500">
            <Phone className="w-4 h-4 text-purple-600" />
            <span>Phone</span>
          </div>
          <span className="font-bold text-slate-800">{INITIAL_USER.phone}</span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-500">
            <Mail className="w-4 h-4 text-purple-600" />
            <span>Email</span>
          </div>
          <span className="font-bold text-slate-800">{INITIAL_USER.email}</span>
        </div>

        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Emergency Contact</span>
          </div>
          <span className="font-bold text-slate-800">{INITIAL_USER.emergencyContact}</span>
        </div>
      </div>

      {/* Digital Receipts & Agreements */}
      <div className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-3 text-xs">
        <h3 className="font-extrabold text-sm text-slate-900">Digital Agreements & Invoices</h3>

        {bookings.map((b) => (
          <div
            key={b.id}
            className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200/70"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-800">
                  {b.pgName} ({b.roomNumber})
                </div>
                <div className="text-[10px] text-slate-400">
                  Token Invoice • {b.bookingCode}
                </div>
              </div>
            </div>

            <button
              onClick={() => alert(`Receipt downloaded for ${b.bookingCode}`)}
              className="p-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors"
              title="Download PDF"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Support & Settings Links */}
      <div className="bg-white rounded-3xl p-2 border border-slate-200/80 shadow-sm text-xs font-semibold text-slate-700">
        <button className="w-full p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors">
          <div className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-purple-600" />
            <span>Help & PG Resident Support</span>
          </div>
          <span className="text-slate-400">›</span>
        </button>

        <button className="w-full p-3 flex items-center justify-between hover:bg-slate-50 rounded-2xl transition-colors text-red-600">
          <div className="flex items-center gap-2.5">
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Sign Out</span>
          </div>
          <span className="text-slate-400">›</span>
        </button>
      </div>
    </div>
  );
};
