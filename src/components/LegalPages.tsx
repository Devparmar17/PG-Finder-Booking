import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { ApnaPgLogo } from './ApnaPgLogo';

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#7C3AED] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>
        <ApnaPgLogo size="sm" />
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Terms of Service</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Last updated: September 2026 • Apna PG Platform</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-normal">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. Nature of the Service</h2>
              <p>
                Apna PG is a digital platform connecting prospective residents with verified paying guest (PG) accommodations.
                All bookings facilitated through the platform operate under a leave-and-licence arrangement for residential accommodation,
                not a permanent tenancy or lease.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. Zero Brokerage Guarantee & Token Reservation</h2>
              <p>
                Apna PG charges ₹0 brokerage fee from residents. When reserving a bed, a token payment of ₹2,000 may be paid
                to lock the bed for up to 48 hours prior to your selected move-in date. The token is 100% refundable if cancelled
                at least 48 hours before the scheduled check-in, or fully adjusted against your first month rent upon move-in.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Security Deposit & Refund Policy</h2>
              <p>
                Security deposits are held in a designated resident escrow account. Upon vacating and providing the standard 30-day
                digital notice via the app, the deposit is 100% refundable within 2 business days following room handover and sub-meter
                electricity settlement.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Resident Conduct & House Rules</h2>
              <p>
                Residents agree to observe quiet hours (10:30 PM to 6:30 AM), register visiting guests at the property front desk,
                and respect fellow residents regardless of gender, religion, or background. Illegal substances and hazardous items are
                strictly prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">5. Notice Period</h2>
              <p>
                A 30-day advance notice must be submitted through the resident portal before vacating. Notice periods ensure sufficient
                time for final billing calculations and key handover.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-[#7C3AED] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>
        <ApnaPgLogo size="sm" />
      </header>

      {/* Persistent Demo Warning Banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-3 text-center">
        <p className="text-xs font-bold text-amber-900 max-w-2xl mx-auto flex items-center justify-center gap-2">
          <Shield className="w-4 h-4 text-amber-600 shrink-0" />
          Notice: This is a demonstration portfolio project. Do not enter real government identity numbers or personal financial secrets.
        </p>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">In compliance with the Digital Personal Data Protection (DPDP) Act</p>
            </div>
          </div>

          <div className="space-y-6 text-sm text-slate-600 leading-relaxed font-normal">
            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">1. What We Collect & Why</h2>
              <ul className="list-disc pl-5 space-y-1.5 mt-2">
                <li>
                  <strong className="text-slate-800">Basic Profile (Name, Phone, Email):</strong> Required to issue your digital booking receipt, confirm authentication, and notify you of rent schedules.
                </li>
                <li>
                  <strong className="text-slate-800">Emergency Contact:</strong> Strictly stored to contact your designated family or guardian in case of medical emergencies or urgent resident welfare situations.
                </li>
                <li>
                  <strong className="text-slate-800">Government ID (Aadhaar/PAN/Passport):</strong> Collected solely for mandatory local police tenant intimation and identity verification required under municipal PG regulations.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">2. How Long Data is Retained</h2>
              <p>
                Active resident records are stored for the duration of your stay. Identity documents are purged from live active servers within 90 days after your move-out inspection and deposit settlement, preserving only statutory tax invoice logs as required by Indian accounting laws.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">3. Who We Share Data With</h2>
              <p>
                We do not sell, rent, or trade your personal data to marketing brokers or third-party advertisers. Your contact and ID details are shared only with the verified on-site property manager of your booked PG and statutory local law enforcement agencies upon lawful request.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-900 mb-2">4. Your Data Rights & Deletion Requests</h2>
              <p>
                Under the DPDP Act, you have the right to inspect, correct, or request deletion of your personal records. To request an account erasure or download your data file, contact our privacy desk at{' '}
                <a href="mailto:privacy@apnapg.in" className="text-[#7C3AED] font-semibold underline">
                  privacy@apnapg.in
                </a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 shadow-md">
        <div className="flex justify-center mb-6">
          <ApnaPgLogo size="lg" />
        </div>
        <div className="w-16 h-16 rounded-2xl bg-purple-100 text-[#7C3AED] flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">We couldn't find that page</h1>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          The link you followed might be broken, or the listing may have been moved or unlisted.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer"
        >
          Return to Explore PGs
        </Link>
      </div>
    </div>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8 px-4 sm:px-8 text-center text-xs text-slate-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ApnaPgLogo size="sm" />
          <span className="text-slate-400">|</span>
          <span>© {new Date().getFullYear()} Apna PG Co-Living</span>
        </div>
        <div className="flex items-center gap-6 font-medium">
          <Link to="/terms" className="hover:text-[#7C3AED] transition-colors">
            Terms of Service
          </Link>
          <Link to="/privacy" className="hover:text-[#7C3AED] transition-colors">
            Privacy Policy
          </Link>
          <a href="mailto:support@apnapg.in" className="hover:text-[#7C3AED] transition-colors">
            Contact Support
          </a>
        </div>
      </div>
    </footer>
  );
};
