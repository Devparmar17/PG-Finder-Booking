import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Wrench,
  Wifi,
  QrCode,
  CreditCard,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Phone,
  MessageCircle,
  Copy,
  Check,
  Star,
  Sunrise,
  Sun,
  Moon,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { BookingRecord, MaintenanceTicket, PGListing } from '../types';

interface ResidentManagementViewProps {
  activeBooking: BookingRecord;
  pgListing?: PGListing;
  maintenanceTickets: MaintenanceTicket[];
  onAddTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'createdAt' | 'status'>) => void;
  onPayRent: (bookingId: string) => void;
  onBackToExplore: () => void;
}

export const ResidentManagementView: React.FC<ResidentManagementViewProps> = ({
  activeBooking,
  pgListing,
  maintenanceTickets,
  onAddTicket,
  onPayRent,
  onBackToExplore,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'food' | 'maintenance' | 'rent'>('overview');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<MaintenanceTicket['category']>('electrical');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [foodRating, setFoodRating] = useState(4);
  const [skippedMeals, setSkippedMeals] = useState<string[]>([]);
  const [rentPaidSuccess, setRentPaidSuccess] = useState(false);

  const handleCopyWifi = () => {
    navigator.clipboard?.writeText(activeBooking.wifiCredentials?.pass || 'PGFast@2026');
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    onAddTicket({
      pgId: activeBooking.pgId,
      roomNumber: activeBooking.roomNumber,
      category: ticketCategory,
      title: ticketTitle,
      description: ticketDescription,
      priority: ticketPriority,
    });

    setTicketTitle('');
    setTicketDescription('');
    setShowNewTicketModal(false);
  };

  const handlePayRentClick = () => {
    onPayRent(activeBooking.id);
    setRentPaidSuccess(true);
    setTimeout(() => setRentPaidSuccess(false), 3000);
  };

  const toggleSkipMeal = (mealKey: string) => {
    if (skippedMeals.includes(mealKey)) {
      setSkippedMeals(skippedMeals.filter((m) => m !== mealKey));
    } else {
      setSkippedMeals([...skippedMeals, mealKey]);
    }
  };

  return (
    <div id="resident-management-view" className="space-y-4 pb-24 animate-in fade-in duration-200">
      {/* Top Banner Card */}
      <div className="mx-4 bg-slate-900 text-white rounded-xl p-5 shadow-md relative overflow-hidden border border-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Active Resident Stay</span>
            </div>
            <h1 className="text-xl font-bold">{activeBooking.pgName}</h1>
            <p className="text-xs text-slate-400">{activeBooking.pgLocation}</p>
          </div>

          <div className="p-2.5 bg-slate-800/90 border border-slate-700/60 rounded-lg text-center">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Room & Bed</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {activeBooking.roomNumber} - {activeBooking.bedNumber}
            </div>
          </div>
        </div>

        {/* Quick Credentials Bar */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/70 border border-slate-700/50 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400">Wi-Fi: Fast_5G</div>
              <div className="font-mono font-bold text-xs text-slate-100">{activeBooking.wifiCredentials?.pass}</div>
            </div>
            <button
              onClick={handleCopyWifi}
              className="p-1 rounded hover:bg-slate-700 text-slate-300 transition-colors"
              title="Copy password"
            >
              {copiedWifi ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="bg-slate-800/70 border border-slate-700/50 rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-slate-400">Smart Gate Entry</div>
              <div className="font-mono font-bold text-xs text-blue-400">
                {activeBooking.biometricId}
              </div>
            </div>
            <QrCode className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="px-4 flex gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'food', label: "Today's Food" },
          { id: 'maintenance', label: `Maintenance (${maintenanceTickets.length})` },
          { id: 'rent', label: 'Rent Ledger' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="px-4 space-y-3.5 animate-in fade-in duration-150">
          {/* Quick Rent Due Card */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Next Rent Due</div>
              <div className="text-base font-bold text-slate-900">
                ₹{activeBooking.monthlyRent.toLocaleString()}
                <span className="text-xs font-normal text-slate-500"> on 1st of month</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('rent')}
              className="px-3.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1 border border-blue-100 transition-colors"
            >
              <span>View Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setActiveTab('maintenance');
                setShowNewTicketModal(true);
              }}
              className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Raise Issue</div>
              <div className="text-[11px] text-slate-500">Plumbing, AC, Wi-Fi</div>
            </button>

            <button
              onClick={() => setActiveTab('food')}
              className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 text-left transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Sun className="w-4 h-4" />
              </div>
              <div className="text-xs font-bold text-slate-900">Today's Meals</div>
              <div className="text-[11px] text-slate-500">Live menu & skip rebate</div>
            </button>
          </div>

          {/* Manager Contact & SOS */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="font-bold text-xs text-slate-900 mb-2.5">
              Property Manager & Emergency
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs">
                  PM
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {pgListing?.managerContact.name || 'Suresh Patel'}
                  </div>
                  <div className="text-[11px] text-slate-500">On-site Property Manager</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href={`tel:${pgListing?.managerContact.phone || '+919876543210'}`}
                  className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 transition-colors"
                  aria-label="Call manager"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <a
                  href={`https://wa.me/${pgListing?.managerContact.whatsapp || '+919876543210'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200/60 transition-colors"
                  aria-label="WhatsApp manager"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Food & Mess Quality */}
      {activeTab === 'food' && (
        <div className="px-4 space-y-3.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Today's Live Mess Menu</h2>
              <p className="text-[11px] text-slate-500">Cooked fresh with RO water</p>
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">Rate Quality:</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setFoodRating(star)}>
                    <Star
                      className={`w-3.5 h-3.5 ${
                        star <= foodRating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Meals List */}
          <div className="space-y-2.5">
            {/* Breakfast */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Sunrise className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Breakfast (7:30 - 9:30 AM)</div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Aloo Poha, Sprouts Salad, Sev & Tea/Coffee
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleSkipMeal('breakfast')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0 transition-colors ${
                  skippedMeals.includes('breakfast')
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {skippedMeals.includes('breakfast') ? 'Skipped (-₹40)' : 'Skip Meal'}
              </button>
            </div>

            {/* Lunch */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Lunch (12:30 - 2:30 PM)</div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Dal Tadka, Jeera Rice, Phulka Roti, Bhindi Masala, Curd
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleSkipMeal('lunch')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0 transition-colors ${
                  skippedMeals.includes('lunch')
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {skippedMeals.includes('lunch') ? 'Skipped (-₹60)' : 'Skip Meal'}
              </button>
            </div>

            {/* Dinner */}
            <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-900">Dinner (8:00 - 10:00 PM)</div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Paneer Tikka Masala, Butter Roti, Vegetable Pulao, Gulab Jamun
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleSkipMeal('dinner')}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold shrink-0 transition-colors ${
                  skippedMeals.includes('dinner')
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {skippedMeals.includes('dinner') ? 'Skipped (-₹60)' : 'Skip Meal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Maintenance & Safety Tickets */}
      {activeTab === 'maintenance' && (
        <div className="px-4 space-y-3.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Maintenance Tickets</h2>
              <p className="text-[11px] text-slate-500">Track resolution time in real-time</p>
            </div>

            <button
              id="btn-raise-ticket-top"
              onClick={() => setShowNewTicketModal(true)}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Raise Issue</span>
            </button>
          </div>

          {/* Tickets List */}
          <div className="space-y-2.5">
            {maintenanceTickets.length === 0 ? (
              <div className="bg-white rounded-xl p-6 text-center text-slate-400 text-xs border border-slate-200">
                No active maintenance requests. Everything is working smoothly!
              </div>
            ) : (
              maintenanceTickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                      {t.category} • Room {t.roomNumber}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold capitalize ${
                        t.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : t.status === 'in_progress'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>

                  <h3 className="font-bold text-xs text-slate-900">{t.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{t.description}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-100">
                    <span>Priority: {t.priority.toUpperCase()}</span>
                    <span>Logged on: {t.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Rent Ledger & Direct Payment */}
      {activeTab === 'rent' && (
        <div className="px-4 space-y-3.5 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">Upcoming Month Rent</div>
                <div className="text-xl font-bold text-slate-900">
                  ₹{activeBooking.monthlyRent.toLocaleString()}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-bold text-blue-600 uppercase">Status</div>
                <div className="text-xs font-bold text-amber-600">Due in 5 Days</div>
              </div>
            </div>

            {/* Zero Hidden Charges Guarantee Badge */}
            <div className="flex items-center gap-2 p-2.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-medium border border-emerald-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero hidden charges guaranteed. Receipt issued instantly.</span>
            </div>

            <button
              onClick={handlePayRentClick}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay ₹{activeBooking.monthlyRent.toLocaleString()} via Instant UPI</span>
            </button>

            {rentPaidSuccess && (
              <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-lg text-center text-xs font-semibold animate-in fade-in border border-emerald-200">
                ✓ Rent Paid Successfully! Digital Receipt Generated.
              </div>
            )}
          </div>

          {/* Past Transactions Ledger */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800">Payment History</h3>
            <div className="bg-white rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs shadow-sm">
              <div>
                <div className="font-bold text-slate-900">Token Booking Deposit</div>
                <div className="text-[10px] text-slate-400">
                  {activeBooking.transactionId} • {activeBooking.createdAt}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900">
                  ₹{activeBooking.tokenPaid.toLocaleString()}
                </div>
                <span className="text-[10px] font-semibold text-emerald-600">Paid ✓</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Maintenance Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm shadow-xl space-y-3.5 border border-slate-200">
            <h3 className="font-bold text-base text-slate-900">Raise Maintenance Issue</h3>

            <form onSubmit={handleCreateTicket} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                >
                  <option value="electrical">⚡ Electrical & AC</option>
                  <option value="plumbing">🚰 Plumbing & Water</option>
                  <option value="wifi">📶 Wi-Fi & Internet</option>
                  <option value="cleaning">🧹 Housekeeping & Cleaning</option>
                  <option value="security">🛡️ Security & Biometric Key</option>
                  <option value="other">📦 Other Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC cooling low in room"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Provide more details for the technician..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
