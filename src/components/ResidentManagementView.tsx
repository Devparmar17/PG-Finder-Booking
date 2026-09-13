import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  FileText,
  Calendar,
  Building,
  KeyRound,
  Download,
  Utensils,
  BedDouble,
  UserCheck,
  Bot,
  Send,
  HelpCircle,
  LogOut,
  Printer,
  Share2,
  ExternalLink,
  Info,
  BadgeCheck,
  CheckCheck,
  Sliders,
  DollarSign,
  AlertCircle,
  CornerDownRight,
  Lock,
  Smartphone,
  Receipt,
  X,
  RefreshCw,
  Edit3,
  User,
  MapPin,
  GraduationCap,
  Briefcase,
  HeartPulse,
  Mail,
} from 'lucide-react';
import { BookingRecord, MaintenanceTicket, PGListing, UserProfile } from '../types';
import { EditProfileModal } from './EditProfileModal';
import { INITIAL_USER } from '../data/mockData';
import { jsPDF } from 'jspdf';

interface ResidentManagementViewProps {
  activeBooking: BookingRecord;
  pgListing?: PGListing;
  maintenanceTickets: MaintenanceTicket[];
  currentUser?: UserProfile | null;
  onAddTicket: (ticket: any) => void;
  onPayRent: (bookingId: string) => void;
  onBackToExplore: () => void;
  onUpdateProfile?: (user: UserProfile) => void;
}

interface AIMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  diagnosis?: {
    category: string;
    probableCause: string;
    suggestedAction: string;
  };
  navigationTarget?: {
    label: string;
    tab: 'overview' | 'ai_pg' | 'food' | 'maintenance' | 'rent' | 'agreement' | 'move_out';
    actionPayload?: any;
  };
}

export const ResidentManagementView: React.FC<ResidentManagementViewProps> = ({
  activeBooking,
  pgListing,
  maintenanceTickets,
  currentUser,
  onAddTicket,
  onPayRent,
  onBackToExplore,
  onUpdateProfile,
}) => {
  const residentUser: UserProfile = currentUser || INITIAL_USER;
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ai_pg' | 'agreement' | 'move_out' | 'food' | 'maintenance' | 'rent'
  >('overview');

  // Maintenance modal states
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [ticketCategory, setTicketCategory] = useState<string>('Electricity & AC');
  const [ticketTitle, setTicketTitle] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketPriority, setTicketPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');

  // Copy helpers
  const [copiedWifi, setCopiedWifi] = useState(false);
  const [copiedGatePass, setCopiedGatePass] = useState(false);
  const [copiedAgreementId, setCopiedAgreementId] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Food & mess states
  const [foodRating, setFoodRating] = useState(4);
  const [skippedMeals, setSkippedMeals] = useState<string[]>([]);
  const [rentPaidSuccess, setRentPaidSuccess] = useState(false);

  // Move-out states
  const [moveOutNoticeDate, setMoveOutNoticeDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [moveOutReason, setMoveOutReason] = useState('job_relocation');
  const [moveOutNotes, setMoveOutNotes] = useState('');
  const [moveOutSubmitted, setMoveOutSubmitted] = useState(false);
  const [moveOutUpi, setMoveOutUpi] = useState('resident@upi');

  // Interactive UPI Payment Modal States
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiPaymentType, setUpiPaymentType] = useState<'apps' | 'id' | 'qr'>('apps');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'cred' | 'amazonpay'>('gpay');
  const [customUpiId, setCustomUpiId] = useState('resident.stay@oksbi');
  const [isUpiVerifying, setIsUpiVerifying] = useState(false);
  const [isUpiVerified, setIsUpiVerified] = useState(true);
  const [autoPayEnabled, setAutoPayEnabled] = useState(false);
  const [isProcessingUpi, setIsProcessingUpi] = useState(false);
  const [upiTxnReceipt, setUpiTxnReceipt] = useState<{
    txnId: string;
    utrNumber: string;
    amount: number;
    timestamp: string;
    method: string;
  } | null>(null);
  const [qrCountdown, setQrCountdown] = useState(300);

  useEffect(() => {
    let timer: any;
    if (showUpiModal && upiPaymentType === 'qr' && qrCountdown > 0) {
      timer = setInterval(() => {
        setQrCountdown((prev) => (prev > 0 ? prev - 1 : 300));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showUpiModal, upiPaymentType, qrCountdown]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleVerifyCustomUpi = () => {
    if (!customUpiId.includes('@')) return;
    setIsUpiVerifying(true);
    setTimeout(() => {
      setIsUpiVerifying(false);
      setIsUpiVerified(true);
    }, 600);
  };

  const handleExecuteUpiPayment = () => {
    setIsProcessingUpi(true);
    setTimeout(() => {
      setIsProcessingUpi(false);
      const generatedUtr = `UPI/UTR/2026/${Math.floor(100000000 + Math.random() * 900000000)}`;
      const generatedTxn = `TXN-RENT-${Math.floor(100000 + Math.random() * 900000)}`;
      const appNames: Record<string, string> = {
        gpay: 'Google Pay (UPI)',
        phonepe: 'PhonePe (UPI)',
        paytm: 'Paytm UPI',
        bhim: 'BHIM UPI',
        cred: 'CRED UPI',
        amazonpay: 'Amazon Pay UPI',
      };
      
      setUpiTxnReceipt({
        txnId: generatedTxn,
        utrNumber: generatedUtr,
        amount: activeBooking.monthlyRent,
        timestamp: new Date().toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        method:
          upiPaymentType === 'apps'
            ? appNames[selectedUpiApp] || 'Instant UPI'
            : upiPaymentType === 'id'
            ? `UPI ID (${customUpiId})`
            : 'Dynamic Bharat QR',
      });
      onPayRent(activeBooking.id);
      setRentPaidSuccess(true);
    }, 1200);
  };

  // Quick formatters to prevent duplicate words like 'Room Room' or 'Double Sharing Sharing'
  const cleanRoom = (activeBooking.roomNumber || '201').replace(/^Room\s*/i, '').trim();
  const cleanSharing = (activeBooking.sharingType || 'Double').replace(/\s*Sharing$/i, '').trim() + ' Sharing';
  const tenantFirstName = activeBooking.tenantName ? activeBooking.tenantName.split(' ')[0] : 'Resident';

  // AI Resident Bot States
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: `Hello ${tenantFirstName}! 👋 I am your 24/7 AI Stay Assistant for ${activeBooking.pgName} (Room ${cleanRoom}). Describe any issue (AC, Wi-Fi, plumbing, food, tenancy agreement, move out) or pick a quick symptom below and I will diagnose it and navigate you directly to the solution!`,
      timestamp: 'Just now',
    },
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  const handleCopyWifi = () => {
    navigator.clipboard?.writeText(activeBooking.wifiCredentials?.pass || 'PGFast@2026');
    setCopiedWifi(true);
    setTimeout(() => setCopiedWifi(false), 2000);
  };

  const handleCopyGatePass = () => {
    navigator.clipboard?.writeText(activeBooking.biometricId || 'BIO-THAL-302');
    setCopiedGatePass(true);
    setTimeout(() => setCopiedGatePass(false), 2000);
  };

  const handleCopyAgreementId = () => {
    navigator.clipboard?.writeText('AGR-AMD-2026-8831');
    setCopiedAgreementId(true);
    setTimeout(() => setCopiedAgreementId(false), 2000);
  };

  const handleDownloadAgreement = () => {
    setDownloadSuccess(true);
    try {
      const doc = new jsPDF();
      
      // Header Banner
      doc.setFontSize(18);
      doc.setTextColor(109, 40, 217);
      doc.text('Apna PG - Stay Terms Summary', 14, 20);

      doc.setFontSize(9);
      doc.setTextColor(180, 83, 9);
      doc.text('Sample document - not a legal agreement or a stamped instrument.', 14, 28);

      doc.setTextColor(100, 116, 139);
      doc.text(`Ref: AGR-AMD-2026-8831  |  Property: ${activeBooking.pgName}, Ahmedabad`, 14, 34);

      doc.setDrawColor(226, 232, 240);
      doc.line(14, 38, 196, 38);

      // Section 1: Accommodation Allotment
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('1. Accommodation & Room Allotment', 14, 46);

      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Property Name: ${activeBooking.pgName}`, 14, 54);
      doc.text(`Location: ${activeBooking.pgLocation}`, 14, 60);
      doc.text(`Resident Name: ${activeBooking.tenantName}`, 14, 66);
      doc.text(`Resident Phone: ${activeBooking.tenantPhone}`, 14, 72);
      doc.text(`Allotment: Bed ${activeBooking.bedNumber} in Room ${cleanRoom} (${cleanSharing})`, 14, 78);
      doc.text('Occupancy Basis: Shared accommodation licence (Permissive lodging, not an exclusive tenancy)', 14, 84);

      // Section 2: Financial Terms
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('2. Financial Terms & Schedule', 14, 96);

      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Monthly Rent: Rs. ${(activeBooking.monthlyRent ?? 0).toLocaleString('en-IN')} / month (Due 1st - 5th)`, 14, 104);
      doc.text(`Security Deposit: Rs. ${(activeBooking.securityDeposit ?? 0).toLocaleString('en-IN')} (100% refundable upon move-out clearance)`, 14, 110);
      doc.text('Electricity Charges: Rs. 10 / unit billed monthly via individual room sub-meter', 14, 116);
      doc.text('Notice Period: 30 days mandatory advance digital notice prior to vacating', 14, 122);

      // Section 3: Inclusions & House Rules
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('3. Inclusions & House Rules', 14, 134);

      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text('• Food & Mess: 3 Fresh Meals + High Tea daily (Meal skip rebates available in app)', 14, 142);
      doc.text('• Wi-Fi: 300 Mbps unlimited high-speed fiber internet', 14, 148);
      doc.text(`• Smart Access: 24/7 Biometric entry (Pass ID: ${activeBooking.biometricId || 'BIO-THAL-302'})`, 14, 154);
      doc.text('• Quiet Hours: 10:30 PM to 6:30 AM strictly maintained for study & rest', 14, 160);
      doc.text('• Visitor Policy: Allowed in common ground lounge until 8:00 PM', 14, 166);
      doc.text('• Living Standards: Non-smoking and alcohol-free co-living community', 14, 172);

      // Section 4: Property Contacts
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('4. Property Contacts', 14, 184);

      doc.setFontSize(9.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`Property Manager: Suresh Patel (${pgListing?.managerContact.phone || '+91 98765 43210'})`, 14, 192);
      doc.text('Resident Support: Apna PG Resident Portal / 24/7 StayAI Support', 14, 198);

      doc.save(`Stay_Terms_${activeBooking.tenantName.replace(/\s+/g, '_')}_Room${activeBooking.roomNumber}.pdf`);
    } catch (err) {
      console.error('Failed to generate PDF', err);
    }
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketTitle.trim()) return;

    onAddTicket({
      pgId: activeBooking.pgId,
      pgName: activeBooking.pgName,
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
    setTimeout(() => setRentPaidSuccess(false), 4000);
  };

  const toggleSkipMeal = (mealKey: string) => {
    if (skippedMeals.includes(mealKey)) {
      setSkippedMeals(skippedMeals.filter((m) => m !== mealKey));
    } else {
      setSkippedMeals([...skippedMeals, mealKey]);
    }
  };

  const totalRebate =
    (skippedMeals.includes('breakfast') ? 40 : 0) +
    (skippedMeals.includes('lunch') ? 60 : 0) +
    (skippedMeals.includes('dinner') ? 60 : 0);

  // =========================================================================
  // AI BOT INTELLIGENCE & NAVIGATION LOGIC
  // =========================================================================
  const handleSendAiMessage = (customText?: string, autoOpenTab: boolean = false) => {
    const textToSend = (customText || aiInput).trim();
    if (!textToSend) return;

    if (autoOpenTab) {
      setActiveTab('ai_pg');
    }

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setAiMessages((prev) => [...prev, userMsg]);
    if (!customText) setAiInput('');
    setIsAiThinking(true);

    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let botResponse: AIMessage;

      if (lower.includes('ac') || lower.includes('cooling') || lower.includes('air condition')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I've diagnosed your AC issue for Room ${activeBooking.roomNumber}. Make sure the remote is on "Cool Mode" (24°C) and the room MCB is active. If cooling remains low, our HVAC technician will visit within 4 hours.`,
          timestamp: 'Just now',
          diagnosis: {
            category: 'Electricity & AC',
            probableCause: 'Filter dust accumulation or compressor voltage check',
            suggestedAction: 'Raise an expedited AC repair ticket with one tap below',
          },
          navigationTarget: {
            label: 'Open AC Ticket Form & Pre-fill',
            tab: 'maintenance',
            actionPayload: {
              category: 'Electricity & AC',
              title: `AC cooling low in Room ${activeBooking.roomNumber}`,
              description: 'AC airflow is weak and cooling temperature is not dropping.',
              priority: 'high',
            },
          },
        };
      } else if (lower.includes('wifi') || lower.includes('internet') || lower.includes('speed') || lower.includes('disconnect')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Your floor router is ONLINE with 300 Mbps Fiber. Wi-Fi SSID is "${activeBooking.wifiCredentials?.ssid || 'PG_Fiber_HighSpeed'}" and Password is "${activeBooking.wifiCredentials?.pass || 'PGFast@2026'}". Try copying the password or reconnecting.`,
          timestamp: 'Just now',
          diagnosis: {
            category: 'Wi-Fi & Internet',
            probableCause: 'Band switching (5GHz vs 2.4GHz) or cached DNS',
            suggestedAction: 'Copy Wi-Fi credentials or log router inspection',
          },
          navigationTarget: {
            label: 'View Credentials in Stay Overview',
            tab: 'overview',
          },
        };
      } else if (lower.includes('move out') || lower.includes('vacate') || lower.includes('leave') || lower.includes('deposit refund') || lower.includes('notice')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Per your Tenancy Agreement, a 30-day notice is required. Your Security Deposit of ₹${(activeBooking.securityDeposit ?? 0).toLocaleString('en-IN')} is 100% refundable directly to your UPI ID after key handover and electricity sub-meter clearance.`,
          timestamp: 'Just now',
          diagnosis: {
            category: 'Tenancy & Move-Out',
            probableCause: 'Vacate notice submission & security deposit clearance calculation',
            suggestedAction: 'Select your preferred departure date and submit digital move-out notice',
          },
          navigationTarget: {
            label: 'Go to Move-Out & Deposit Clearance Tab',
            tab: 'move_out',
          },
        };
      } else if (lower.includes('agreement') || lower.includes('contract') || lower.includes('terms') || lower.includes('rent slip') || lower.includes('rules') || lower.includes('pdf')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Your Stay Terms Summary (Ref: AGR-AMD-2026-8831) is available for Room ${activeBooking.roomNumber}. It summarizes your monthly rent (₹${activeBooking.monthlyRent}/mo), deposit (₹${activeBooking.securityDeposit}), sub-meter electricity, mess timings, and house rules. You can view or download the PDF summary directly.`,
          timestamp: 'Just now',
          diagnosis: {
            category: 'Stay Terms & House Rules',
            probableCause: 'House policies and accommodation terms review',
            suggestedAction: 'Review stay terms definition list or download PDF summary',
          },
          navigationTarget: {
            label: 'Go to Stay Terms Tab',
            tab: 'agreement',
          },
        };
      } else if (lower.includes('food') || lower.includes('mess') || lower.includes('dinner') || lower.includes('lunch') || lower.includes('breakfast') || lower.includes('meal')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Today's mess serves fresh hot meals: Breakfast (Aloo Poha + Tea), Lunch (Dal Tadka, Paneer & Roti), Dinner (Paneer Tikka Masala & Gulab Jamun). You can skip individual meals to earn up to ₹160 daily rent rebate!`,
          timestamp: 'Just now',
          diagnosis: {
            category: 'Mess & Food Schedule',
            probableCause: 'Daily menu check & skip rebate management',
            suggestedAction: 'Check full timetable and toggle skipped meals',
          },
          navigationTarget: {
            label: "Go to Today's Food Tab",
            tab: 'food',
          },
        };
      } else if (lower.includes('rent') || lower.includes('pay') || lower.includes('upi') || lower.includes('bill') || lower.includes('invoice')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Your monthly rent is ₹${(activeBooking.monthlyRent ?? 0).toLocaleString('en-IN')} (Cycle: 1st of each month). Instant zero-convenience fee payments are accepted via UPI, GPay, PhonePe, or Cards with instant receipt generation.`,
          timestamp: 'Just now',
          diagnosis: {
            category: 'Billing & Rent Ledger',
            probableCause: 'Monthly rent payment & invoices',
            suggestedAction: 'Open rent ledger and pay via Instant UPI',
          },
          navigationTarget: {
            label: 'Go to Rent & Invoices Tab',
            tab: 'rent',
          },
        };
      } else if (lower.includes('plumbing') || lower.includes('water') || lower.includes('tap') || lower.includes('geyser') || lower.includes('bathroom') || lower.includes('flush')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `For plumbing & hot water in Room ${activeBooking.roomNumber}, our on-site team carries spare taps, cartridges, and geyser elements. Emergency water issues are attended within 60 minutes.`,
          timestamp: 'Just now',
          diagnosis: {
            category: 'Plumbing & Water',
            probableCause: 'Water pressure fluctuation or valve check',
            suggestedAction: 'Log a priority plumbing ticket with our facility team',
          },
          navigationTarget: {
            label: 'Raise Plumbing Maintenance Ticket',
            tab: 'maintenance',
            actionPayload: {
              category: 'Plumbing',
              title: `Plumbing issue in Room ${activeBooking.roomNumber}`,
              description: 'Water tap / geyser inspection required.',
              priority: 'high',
            },
          },
        };
      } else if (lower.includes('gate') || lower.includes('biometric') || lower.includes('entry') || lower.includes('lock') || lower.includes('key')) {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `Your Smart Gate Pass ID is "${activeBooking.biometricId || 'BIO-THAL-302'}". The main entrance operates 24/7 with biometric keypad reader. For late-night entry, tap your pass code on the keypad.`,
          timestamp: 'Just now',
          diagnosis: {
            category: 'Security & Access Control',
            probableCause: 'Smart lock gate key verification',
            suggestedAction: 'Copy Gate Pass ID from Stay Overview',
          },
          navigationTarget: {
            label: 'View Gate Pass in Overview',
            tab: 'overview',
          },
        };
      } else {
        botResponse = {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: `I've noted your query regarding "${textToSend}". I can help route you to our on-site manager, raise an expedited service ticket, or navigate to any screen.`,
          timestamp: 'Just now',
          diagnosis: {
            category: 'Resident Support',
            probableCause: 'General query resolution',
            suggestedAction: 'Choose an action below or contact your on-site manager directly.',
          },
          navigationTarget: {
            label: 'View Maintenance & Support',
            tab: 'maintenance',
          },
        };
      }

      setAiMessages((prev) => [...prev, botResponse]);
      setIsAiThinking(false);
    }, 500);
  };

  const handleExecuteAiNavigation = (target: AIMessage['navigationTarget']) => {
    if (!target) return;
    setActiveTab(target.tab);

    if (target.actionPayload && target.tab === 'maintenance') {
      setTicketCategory(target.actionPayload.category || 'Electricity & AC');
      setTicketTitle(target.actionPayload.title || '');
      setTicketDescription(target.actionPayload.description || '');
      setTicketPriority(target.actionPayload.priority || 'medium');
      setShowNewTicketModal(true);
    }
  };

  const handleMoveOutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMoveOutSubmitted(true);
  };

  return (
    <div id="resident-management-view" className="space-y-4 pb-28 animate-in fade-in duration-200">
      {/* ========================================================================= */}
      {/* TAB 1: STAY OVERVIEW */}
      {/* ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* 1. TOP RESIDENT STATUS BANNER */}
          <div className="mx-4 sm:mx-6 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg relative overflow-hidden border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-purple-300 text-[11px] font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                  <span>Active Resident Stay</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-300 capitalize">{activeBooking.category} PG</span>
                </div>
                <h1 className="text-lg sm:text-xl font-black tracking-tight text-white">
                  {activeBooking.pgName}
                </h1>
                <p className="text-xs text-slate-400">
                  {activeBooking.pgLocation}
                </p>
              </div>

              {/* Room & Bed Pill Badge */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between px-3 py-2 sm:px-4 sm:py-2 bg-slate-800/90 border border-slate-700/80 rounded-xl shrink-0">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Allocated Room
                </div>
                <div className="text-sm sm:text-base font-black text-purple-300">
                  Room {cleanRoom}{' '}
                  <span className="text-xs text-white font-medium">({activeBooking.bedNumber})</span>
                </div>
              </div>
            </div>

            {/* Quick Credentials Bar - 2 Equal Balanced Columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3.5 border-t border-slate-800 text-xs">
              {/* Wi-Fi Details */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center shrink-0">
                    <Wifi className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Wi-Fi: {activeBooking.wifiCredentials?.ssid || 'PG_Fiber_HighSpeed'}
                    </div>
                    <div className="font-mono font-bold text-xs text-slate-100 flex items-center gap-1.5">
                      <span>Key: {activeBooking.wifiCredentials?.pass || 'PGFast@2026'}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCopyWifi}
                  className="px-2.5 py-1 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  title="Copy Wi-Fi password"
                >
                  {copiedWifi ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              {/* Smart Biometric Gate Entry */}
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <KeyRound className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-medium">24/7 Smart Gate Pass</div>
                    <div className="font-mono font-bold text-xs text-emerald-300">
                      {activeBooking.biometricId || 'BIO-THAL-302'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleCopyGatePass}
                  className="px-2.5 py-1 rounded-lg bg-slate-700/80 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                  title="Copy Gate ID"
                >
                  {copiedGatePass ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400 text-[10px]">Copied</span>
                    </>
                  ) : (
                    <>
                      <QrCode className="w-3 h-3" />
                      <span>Pass</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="px-4 sm:px-6 space-y-4">
            {/* ======================================================================= */}
            {/* RESIDENT PROFILE CARD (WITH "CHANGE PROFILE" BUTTON) */}
            {/* ======================================================================= */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    onClick={() => setShowEditProfileModal(true)}
                    className="relative cursor-pointer group shrink-0"
                    title="Click to change profile"
                  >
                    <img
                      src={residentUser.avatar}
                      alt={residentUser.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-purple-400/40 shadow-xs"
                    />
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-sm font-black text-slate-900">{residentUser.name}</h3>
                      <span className="text-[10px] bg-purple-50 text-[#7C3AED] px-2 py-0.5 rounded-full font-bold border border-purple-200">
                        {residentUser.userType === 'student' ? 'Student' : 'Working Pro'}
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                        Verified
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {residentUser.institutionOrCompany || 'Resident'} • {residentUser.phone}
                    </p>
                  </div>
                </div>

                {/* Change Profile Action Button */}
                <button
                  id="btn-resident-change-profile"
                  onClick={() => setShowEditProfileModal(true)}
                  className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-[#7C3AED] border border-purple-200/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Change Profile</span>
                </button>
              </div>

              {/* Quick Details Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px]">
                <div className="p-2 bg-purple-50/50 rounded-xl border border-purple-100/60">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Stay City</span>
                  <span className="font-bold text-slate-800">{residentUser.city}</span>
                </div>
                <div className="p-2 bg-purple-50/50 rounded-xl border border-purple-100/60">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Diet</span>
                  <span className="font-bold text-slate-800 capitalize">
                    {residentUser.dietPreference || 'Pure Veg'}
                  </span>
                </div>
                <div className="p-2 bg-purple-50/50 rounded-xl border border-purple-100/60">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Blood Group</span>
                  <span className="font-bold text-slate-800">{residentUser.bloodGroup || 'B+'}</span>
                </div>
                <div className="p-2 bg-purple-50/50 rounded-xl border border-purple-100/60">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Emergency</span>
                  <span className="font-bold text-slate-800 truncate block">{residentUser.emergencyContact}</span>
                </div>
              </div>
            </div>

            {/* ======================================================================= */}
            {/* COMPACT BRIEF AI TEASER CARD (WITH 1-CLICK 'GO TO AI PG') */}
            {/* ======================================================================= */}
            <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white rounded-2xl p-4 sm:p-4.5 border border-purple-800/60 shadow-md relative overflow-hidden">
              {/* Ambient Background Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-200 flex items-center justify-center font-bold ring-1 ring-purple-400/40 shadow-inner shrink-0">
                    <Bot className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm sm:text-base font-black text-white">StayAI Problem Solver</h2>
                      <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        24/7 Live
                      </span>
                    </div>
                    <p className="text-xs text-purple-200 mt-0.5 line-clamp-1">
                      Instant diagnosis for AC, Wi-Fi, plumbing, food, agreements, or move-out questions.
                    </p>
                  </div>
                </div>

                {/* Primary Go to AI PG Button */}
                <button
                  onClick={() => setActiveTab('ai_pg')}
                  className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shrink-0 hover:scale-[1.02] active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                  <span>Go to AI PG Assistant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick Symptom Chips Row */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-purple-800/50 relative z-10 text-xs">
                <span className="text-[11px] font-bold text-purple-300 shrink-0 mr-1">Quick Symptoms:</span>
                {[
                  { label: '❄️ AC cooling low', query: 'AC cooling is low in my room' },
                  { label: '📶 Wi-Fi issue', query: 'My Wi-Fi is not connecting' },
                  { label: '🚰 Hot water / geyser', query: 'No hot water from geyser in bathroom' },
                  { label: '📜 Room Agreement', query: 'Show me my rental tenancy agreement' },
                  { label: '🚪 Move out notice', query: 'I want to move out and calculate deposit refund' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAiMessage(chip.query, true)}
                    className="px-2.5 py-1 rounded-lg bg-purple-900/70 hover:bg-purple-800 border border-purple-700/70 text-purple-100 text-[11px] font-semibold transition-all shrink-0 cursor-pointer hover:scale-[1.02] active:scale-95"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ======================================================================= */}
            {/* QUICK ACCESS ACTION TILES (STAY TERMS, MOVE OUT, FOOD, TICKETS) */}
            {/* ======================================================================= */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <button
                id="btn-nav-stay-terms"
                onClick={() => setActiveTab('agreement')}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-300 text-left transition-all group cursor-pointer space-y-1.5"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                  <FileText className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Stay Terms</div>
                  <div className="text-[11px] text-slate-500">Rules & PDF</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('move_out')}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-300 text-left transition-all group cursor-pointer space-y-1.5"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <LogOut className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Move Out of PG</div>
                  <div className="text-[11px] text-slate-500">Notice & Deposit</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setActiveTab('maintenance');
                  setShowNewTicketModal(true);
                }}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-300 text-left transition-all group cursor-pointer space-y-1.5"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                  <Wrench className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Raise Issue</div>
                  <div className="text-[11px] text-slate-500">AC, plumbing, repair</div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('food')}
                className="p-3.5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-300 text-left transition-all group cursor-pointer space-y-1.5"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#7C3AED] flex items-center justify-center group-hover:bg-[#7C3AED] group-hover:text-white transition-colors">
                  <Utensils className="w-4.5 h-4.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Today's Meals</div>
                  <div className="text-[11px] text-slate-500">Menu & skip rebate</div>
                </div>
              </button>
            </div>

            {/* ======================================================================= */}
            {/* ROOM & STAY SPECIFICATIONS */}
            {/* ======================================================================= */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold">
                    <Building className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">Room & Stay Terms</h3>
                    <p className="text-[10px] text-slate-500">Accommodation summary & house terms</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('agreement')}
                  className="text-xs font-bold text-[#7C3AED] hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Terms</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Spec Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100/80 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Sharing Mode</span>
                  <p className="text-xs font-bold text-slate-900 capitalize">{cleanSharing}</p>
                </div>

                <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100/80 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Rent</span>
                  <p className="text-xs font-bold text-[#2563EB]">₹{(activeBooking.monthlyRent ?? 0).toLocaleString('en-IN')} / mo</p>
                </div>

                <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100/80 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Security Deposit</span>
                  <p className="text-xs font-bold text-emerald-700">₹{(activeBooking.securityDeposit ?? 0).toLocaleString('en-IN')} (100% Refundable)</p>
                </div>

                <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100/80 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Electricity Billing</span>
                  <p className="text-xs font-bold text-slate-900">₹10 / unit (Sub-meter)</p>
                </div>

                <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100/80 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Food Inclusion</span>
                  <p className="text-xs font-bold text-slate-900">3 Meals + Evening Tea</p>
                </div>

                <div className="p-2.5 bg-purple-50/50 rounded-xl border border-purple-100/80 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Notice Period</span>
                  <p className="text-xs font-bold text-slate-900">30 Days (Flexible)</p>
                </div>
              </div>
            </div>

            {/* ======================================================================= */}
            {/* UPCOMING RENT DUE & INSTANT UPI */}
            {/* ======================================================================= */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-medium text-slate-500">Next Rent Cycle</span>
                  <div className="text-lg sm:text-xl font-black text-slate-900">
                    ₹{(activeBooking.monthlyRent ?? 0).toLocaleString('en-IN')}
                    <span className="text-xs font-normal text-slate-400"> / month</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    Due on 1st of Month
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Zero convenience fees</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-0.5">
                <button
                  onClick={handlePayRentClick}
                  className="flex-1 py-2.5 sm:py-3 bg-[#7C3AED] hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay Rent via Instant UPI</span>
                </button>
                <button
                  onClick={() => setActiveTab('rent')}
                  className="px-3.5 py-2.5 sm:py-3 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] font-bold text-xs rounded-xl border border-purple-200/80 transition-colors cursor-pointer"
                >
                  View Ledger
                </button>
              </div>

              {rentPaidSuccess && (
                <div className="p-2.5 bg-emerald-50 text-emerald-800 rounded-xl text-center text-xs font-bold animate-in fade-in border border-emerald-200">
                  ✓ Rent Paid Successfully! Digital Receipt issued instantly.
                </div>
              )}
            </div>

            {/* ======================================================================= */}
            {/* PROPERTY MANAGER & SOS CONTACT */}
            {/* ======================================================================= */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="text-xs font-bold text-slate-900">
                On-Site Property Manager & SOS Support
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#7C3AED] font-black text-sm">
                    PM
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">
                      {pgListing?.managerContact.name || 'Suresh Patel'}
                    </div>
                    <div className="text-[11px] text-slate-500">Available 24/7 on property</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${pgListing?.managerContact.phone || '+919876543210'}`}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 transition-colors flex items-center gap-1.5 text-xs font-bold"
                    aria-label="Call manager"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Call</span>
                  </a>
                  <a
                    href={`https://wa.me/${pgListing?.managerContact.whatsapp || '+919876543210'}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 sm:px-3 sm:py-2 rounded-xl bg-purple-50 text-[#7C3AED] hover:bg-purple-100 border border-purple-200/60 transition-colors flex items-center gap-1.5 text-xs font-bold"
                    aria-label="WhatsApp manager"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB: DEDICATED FULL AI PG ASSISTANT SCREEN */}
      {/* ========================================================================= */}
      {activeTab === 'ai_pg' && (
        <div className="px-3 sm:px-6 space-y-4 animate-in fade-in duration-200">
          {/* Clean Dedicated Header Bar - Ultra Responsive & Unclustered */}
          <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200 shadow-sm space-y-3">
            {/* Top Navigation Action Row */}
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-slate-700" />
                <span>Back to My Stay</span>
              </button>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs font-bold bg-purple-50 text-[#7C3AED] px-2.5 py-1 rounded-lg border border-purple-200/80 shrink-0">
                  Room {cleanRoom} ({activeBooking.bedNumber})
                </span>
                <button
                  onClick={() => {
                    setAiMessages([
                      {
                        id: 'welcome-reset',
                        sender: 'bot',
                        text: `Hello ${activeBooking.tenantName || 'Resident'}! I am your StayAI Assistant for ${activeBooking.pgName}, Room ${cleanRoom}. What problem or query can I assist you with today?`,
                        timestamp: 'Just now',
                      },
                    ]);
                  }}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Reset conversation"
                >
                  Clear Chat
                </button>
              </div>
            </div>

            {/* Assistant Identity & Live Status Banner */}
            <div className="flex items-center gap-3 pt-2.5 border-t border-slate-100">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                    StayAI Problem Solver
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    24/7 AI Assistance
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate">
                  {activeBooking.pgName} • Instant diagnostics for AC, Wi-Fi, Food, Rent & Gate
                </p>
              </div>
            </div>
          </div>

          {/* Full Screen Dedicated Chat Workspace */}
          <div className="bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 text-white rounded-3xl p-4 sm:p-6 border border-purple-800/60 shadow-xl space-y-4 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Quick Symptom Problem Diagnosis Shortcuts */}
            <div className="space-y-1.5 relative z-10">
              <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center justify-between">
                <span>Select a Common Resident Issue</span>
                <span className="text-[10px] text-purple-400/80 font-normal">Tap to auto-diagnose</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '❄️ AC cooling low / repair', query: 'AC cooling is low in my room' },
                  { label: '📶 Wi-Fi connection issue', query: 'My Wi-Fi is not connecting' },
                  { label: '🚰 Geyser / Hot water issue', query: 'No hot water from geyser in bathroom' },
                  { label: '📜 View Room Tenancy Agreement', query: 'Show me my rental tenancy agreement' },
                  { label: '🚪 Move out notice & deposit refund', query: 'I want to move out and calculate deposit refund' },
                  { label: '🍱 Today\'s meals & menu', query: "What is on today's mess menu?" },
                  { label: '💳 Pay monthly rent via UPI', query: 'I want to pay my monthly rent' },
                ].map((pill, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendAiMessage(pill.query)}
                    className="px-3 py-1.5 rounded-xl bg-purple-900/70 hover:bg-purple-800 border border-purple-700/80 text-purple-100 text-xs font-semibold transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-xs"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Interactive Chat Stream */}
            <div className="bg-slate-900/90 rounded-2xl border border-purple-800/40 p-4 space-y-4 min-h-[340px] max-h-[500px] overflow-y-auto no-scrollbar relative z-10">
              {aiMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  } space-y-1.5 animate-in fade-in duration-150`}
                >
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 px-1">
                    {msg.sender === 'bot' ? (
                      <span className="font-bold text-purple-300 flex items-center gap-1">
                        <Bot className="w-3 h-3" /> StayAI Assistant
                      </span>
                    ) : (
                      <span className="text-slate-300">You</span>
                    )}
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed max-w-[92%] sm:max-w-[85%] ${
                      msg.sender === 'user'
                        ? 'bg-[#7C3AED] text-white rounded-br-xs shadow-md'
                        : 'bg-slate-800/90 border border-slate-700/90 text-slate-100 rounded-bl-xs shadow-md'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* AI Structured Diagnosis Card */}
                    {msg.diagnosis && (
                      <div className="mt-3 p-3.5 bg-slate-900/90 rounded-xl border border-purple-500/40 shadow-xs space-y-1.5 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-purple-300 border-b border-slate-800 pb-1.5">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" /> AI Diagnosis: {msg.diagnosis.category}
                          </span>
                          <span className="text-[10px] bg-purple-950 text-purple-200 px-2 py-0.5 rounded-md border border-purple-800">
                            Verified
                          </span>
                        </div>
                        <div className="text-slate-300 pt-0.5">
                          <strong className="text-white font-bold">Probable Cause: </strong>
                          {msg.diagnosis.probableCause}
                        </div>
                        <div className="text-slate-300">
                          <strong className="text-white font-bold">Recommended Action: </strong>
                          {msg.diagnosis.suggestedAction}
                        </div>
                      </div>
                    )}

                    {/* 1-Tap Direct Screen Navigation Button */}
                    {msg.navigationTarget && (
                      <div className="mt-3 pt-2 border-t border-slate-700/80">
                        <button
                          onClick={() => handleExecuteAiNavigation(msg.navigationTarget)}
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01] active:scale-95"
                        >
                          <span>{msg.navigationTarget.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 text-xs text-purple-300 p-2">
                  <div className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                  <span>StayAI is diagnosing your issue & preparing solution...</span>
                </div>
              )}
            </div>

            {/* AI Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendAiMessage();
              }}
              className="flex items-center gap-2 relative z-10"
            >
              <input
                type="text"
                placeholder="Ask StayAI anything... (e.g. 'AC not cooling', 'Move out rules', 'Show agreement', 'Mess food')"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="flex-1 p-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-400 focus:outline-none shadow-xs"
              />
              <button
                type="submit"
                disabled={!aiInput.trim() || isAiThinking}
                className="p-3.5 bg-[#7C3AED] hover:bg-purple-600 disabled:opacity-50 text-white rounded-2xl shadow-sm transition-all cursor-pointer shrink-0"
                aria-label="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: YOUR STAY TERMS (HONEST SUMMARY & DEFINITION LIST) */}
      {/* ========================================================================= */}
      {activeTab === 'agreement' && (
        <div className="px-4 sm:px-6 space-y-4 animate-in fade-in duration-150">
          
          {/* Header Controls */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                ← Back
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    Stay Summary
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Ref: AGR-AMD-2026-8831
                  </span>
                </div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5">
                  Your stay terms
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyAgreementId}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy Reference ID"
              >
                {copiedAgreementId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedAgreementId ? 'Copied' : 'Ref ID'}</span>
              </button>

              <button
                id="btn-download-terms-pdf"
                onClick={handleDownloadAgreement}
                className="px-3.5 py-2 bg-[#7C3AED] hover:bg-purple-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloadSuccess ? 'Downloaded!' : 'Download PDF'}</span>
              </button>
            </div>
          </div>

          {/* Visible Banner: Sample document notice */}
          <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 text-amber-900 flex items-start gap-3 shadow-2xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-xs sm:text-sm font-bold text-amber-950">
                Sample document - not a legal agreement or a stamped instrument.
              </div>
              <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed">
                This document is a summary of standard house rules, fees, and accommodation terms for resident stay at {activeBooking.pgName}, Ahmedabad. It does not constitute a statutory stamped instrument.
              </p>
            </div>
          </div>

          {/* Clean Stay Terms Summary Container */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 sm:p-7 space-y-6 text-slate-800 font-sans">
            
            {/* Document Title Header */}
            <div className="border-b border-slate-200/80 pb-4 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Your stay terms
                </h1>
                <span className="text-xs font-mono font-medium text-slate-500">
                  Ref: AGR-AMD-2026-8831 • Ahmedabad
                </span>
              </div>
              <p className="text-xs text-slate-500">
                PG Accommodation & Shared Living Terms • {activeBooking.pgName}
              </p>
            </div>

            {/* Resident & Property Parties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Property Provider
                </div>
                <div className="font-bold text-slate-900 text-sm">{activeBooking.pgName}</div>
                <div className="text-slate-600">{activeBooking.pgLocation}</div>
                <div className="text-slate-500 text-[11px]">
                  Property Manager: Suresh Patel ({pgListing?.managerContact.phone || '+91 98765 43210'})
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                <div className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                  Resident
                </div>
                <div className="font-bold text-slate-900 text-sm">{activeBooking.tenantName}</div>
                <div className="text-slate-600">Phone: {activeBooking.tenantPhone}</div>
                <div className="text-slate-500 text-[11px]">
                  Emergency: {residentUser.emergencyContact || '+91 98250 99881 (Parent)'}
                </div>
              </div>
            </div>

            {/* Definition List of Useful Content */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Summary of Terms & Charges
              </h3>

              <dl className="border border-slate-200/90 rounded-xl divide-y divide-slate-100 text-xs sm:text-sm bg-white overflow-hidden">
                <div className="p-3.5 sm:px-4 sm:py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 bg-slate-50/50">
                  <dt className="font-bold text-slate-600">Accommodation & Occupancy</dt>
                  <dd className="sm:col-span-2 text-slate-800 font-medium leading-relaxed">
                    Bed {activeBooking.bedNumber} in Room {cleanRoom} ({cleanSharing}). Occupancy is granted as a permissive lodging licence for shared co-living, not an exclusive tenancy of the room.
                  </dd>
                </div>

                <div className="p-3.5 sm:px-4 sm:py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                  <dt className="font-bold text-slate-600">Monthly Rent</dt>
                  <dd className="sm:col-span-2 text-slate-900 font-bold">
                    ₹{(activeBooking.monthlyRent ?? 0).toLocaleString('en-IN')} / month (Payable between 1st and 5th of every month)
                  </dd>
                </div>

                <div className="p-3.5 sm:px-4 sm:py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 bg-slate-50/50">
                  <dt className="font-bold text-slate-600">Security Deposit</dt>
                  <dd className="sm:col-span-2 text-slate-800 font-medium leading-relaxed">
                    <span className="font-bold text-slate-900">₹{(activeBooking.securityDeposit ?? 0).toLocaleString('en-IN')}</span> (100% refundable to your registered UPI or bank account upon move-out clearance and key handover).
                  </dd>
                </div>

                <div className="p-3.5 sm:px-4 sm:py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                  <dt className="font-bold text-slate-600">Electricity Charges</dt>
                  <dd className="sm:col-span-2 text-slate-800 font-medium">
                    ₹10 per unit consumed, billed monthly as recorded on the dedicated room sub-meter.
                  </dd>
                </div>

                <div className="p-3.5 sm:px-4 sm:py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 bg-slate-50/50">
                  <dt className="font-bold text-slate-600">Notice Period</dt>
                  <dd className="sm:col-span-2 text-slate-800 font-medium leading-relaxed">
                    A minimum of <span className="font-bold text-slate-900">30 days advance digital notice</span> via the app is required prior to vacating.
                  </dd>
                </div>

                <div className="p-3.5 sm:px-4 sm:py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                  <dt className="font-bold text-slate-600">Meals & Food Schedule</dt>
                  <dd className="sm:col-span-2 text-slate-800 font-medium leading-relaxed">
                    3 freshly prepared daily meals (Breakfast, Lunch, Dinner) plus evening High-Tea are included. Individual meals can be toggled as skipped in the food tab for automated monthly rent rebates.
                  </dd>
                </div>

                <div className="p-3.5 sm:px-4 sm:py-3.5 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 bg-slate-50/50">
                  <dt className="font-bold text-slate-600">House Rules & Inclusions</dt>
                  <dd className="sm:col-span-2 text-slate-800 font-medium space-y-1.5">
                    <ul className="list-disc pl-4 space-y-1 text-xs text-slate-700">
                      <li><strong>Wi-Fi:</strong> Unlimited high-speed fiber internet (300 Mbps) with floor routers.</li>
                      <li><strong>Smart Gate Access:</strong> 24/7 biometric and digital pass access for registered residents.</li>
                      <li><strong>Quiet Hours:</strong> Respectful study and rest hours are maintained between 10:30 PM and 6:30 AM.</li>
                      <li><strong>Visitor Policy:</strong> Day visitors are welcome in the common ground lounge until 8:00 PM.</li>
                      <li><strong>Living Standards:</strong> Premises are strictly smoke-free and alcohol-free.</li>
                    </ul>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Note at bottom */}
            <div className="pt-2 text-center text-[11px] text-slate-400 font-medium">
              Questions regarding these terms? Message property manager Suresh Patel or contact 24/7 StayAI Support.
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MOVE OUT OF PG (NOTICE & DEPOSIT REFUND CLEARANCE) */}
      {/* ========================================================================= */}
      {activeTab === 'move_out' && (
        <div className="px-4 sm:px-6 space-y-4 animate-in fade-in duration-150">
          
          {/* Header Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                  <LogOut className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900 truncate">
                    Move Out & Deposit Clearance
                  </h2>
                  <p className="text-[11px] text-slate-500 truncate">
                    Guaranteed 100% refund clearance within 24 hours
                  </p>
                </div>
              </div>

              <span className="self-start sm:self-auto text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                100% Refundable
              </span>
            </div>
          </div>

          {/* Move-Out Notice Form & Calculator */}
          {!moveOutSubmitted ? (
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
                  Submit 30-Day Move-Out Notice
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Submitting formal notice ensures no forfeiture of security deposit.
                </p>
              </div>

              <form onSubmit={handleMoveOutSubmit} className="space-y-4">
                {/* Proposed Vacating Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Intended Move-Out Date (30 Days Notice)
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={moveOutNoticeDate}
                      onChange={(e) => setMoveOutNoticeDate(e.target.value)}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Standard notice period is 30 days. Emergency relocations can be coordinated with manager.
                  </p>
                </div>

                {/* Reason for Vacating */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reason for Vacating
                  </label>
                  <select
                    value={moveOutReason}
                    onChange={(e) => setMoveOutReason(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                  >
                    <option value="job_relocation">💼 Job / College Relocation</option>
                    <option value="internship_end">🎓 Internship / Course Completion</option>
                    <option value="moving_with_friends">👥 Moving to flat with friends</option>
                    <option value="hometown_return">🏡 Returning to Hometown</option>
                    <option value="other">📦 Other Reason</option>
                  </select>
                </div>

                {/* Refund Destination UPI */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deposit Refund Destination (UPI ID or Bank Details)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@oksbi or phonepe"
                    value={moveOutUpi}
                    onChange={(e) => setMoveOutUpi(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7C3AED] focus:outline-none font-mono"
                  />
                  <p className="text-[10px] text-emerald-600 font-medium mt-1">
                    ✓ Full ₹{(activeBooking.securityDeposit ?? 0).toLocaleString('en-IN')} will be dispatched to this account.
                  </p>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Feedback / Handover Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Any specific instructions for room handover or luggage pickup..."
                    value={moveOutNotes}
                    onChange={(e) => setMoveOutNotes(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                  />
                </div>

                {/* Refund Estimate Breakdown Box */}
                <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 space-y-2 text-xs">
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Estimated Deposit Settlement</span>
                    <span className="text-[#2563EB] font-black text-sm">
                      ₹{(activeBooking.securityDeposit ?? 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Security Deposit Held</span>
                    <span>₹{(activeBooking.securityDeposit ?? 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Notice Compliance Deduction</span>
                    <span className="text-emerald-700 font-bold">₹0 (Zero Deduction)</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span>Final Payout Date</span>
                    <span className="font-bold text-slate-800">{moveOutNoticeDate} (Within 24 hrs)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Submit Formal Move-Out Notice & Register Refund</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-md text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-slate-900">
                  Move-Out Notice Successfully Registered!
                </h3>
                <p className="text-xs text-slate-500">
                  Notice ID: <strong>MOV-REQ-{activeBooking.roomNumber}-2026</strong> • Effective Vacating Date: <strong>{moveOutNoticeDate}</strong>
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-left text-xs space-y-2 border border-slate-200">
                <div className="font-bold text-slate-800">Clearance & Settlement Steps:</div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center">1</span>
                  <span>Notice Registered in Property ERP</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">2</span>
                  <span>Room inventory audit on {moveOutNoticeDate}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center">3</span>
                  <span>Direct UPI Transfer of ₹{(activeBooking.securityDeposit ?? 0).toLocaleString('en-IN')} to <strong>{moveOutUpi}</strong></span>
                </div>
              </div>

              <button
                onClick={() => setMoveOutSubmitted(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Modify Notice Details
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: TODAY'S MESS & FOOD */}
      {/* ========================================================================= */}
      {activeTab === 'food' && (
        <div className="px-3 sm:px-6 space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Today's Mess Schedule</h2>
                <p className="text-[11px] text-slate-500">Pure RO water & fresh ingredients</p>
              </div>
            </div>

            {totalRebate > 0 && (
              <span className="self-start sm:self-auto text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                +₹{totalRebate} Bill Rebate
              </span>
            )}
          </div>

          <div className="space-y-3">
            {/* Breakfast */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sunrise className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Breakfast</span>
                    <span className="text-[10px] text-slate-400 font-medium">7:30 - 9:30 AM</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Aloo Poha with Sev, Sprouts Salad, Bread Butter & Masala Tea/Coffee
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleSkipMeal('breakfast')}
                className={`px-3 py-2 rounded-xl text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                  skippedMeals.includes('breakfast')
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {skippedMeals.includes('breakfast') ? 'Skipped (-₹40)' : 'Skip (-₹40)'}
              </button>
            </div>

            {/* Lunch */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sun className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Lunch</span>
                    <span className="text-[10px] text-slate-400 font-medium">12:30 - 2:30 PM</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dal Tadka, Jeera Rice, Phulka Roti, Bhindi Masala, Fresh Curd & Papad
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleSkipMeal('lunch')}
                className={`px-3 py-2 rounded-xl text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                  skippedMeals.includes('lunch')
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {skippedMeals.includes('lunch') ? 'Skipped (-₹60)' : 'Skip (-₹60)'}
              </button>
            </div>

            {/* Dinner */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-start justify-between gap-3">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#7C3AED] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Moon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">Dinner</span>
                    <span className="text-[10px] text-slate-400 font-medium">8:00 - 10:00 PM</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Paneer Tikka Masala, Butter Roti, Vegetable Pulao, Salad & Gulab Jamun
                  </p>
                </div>
              </div>

              <button
                onClick={() => toggleSkipMeal('dinner')}
                className={`px-3 py-2 rounded-xl text-[11px] font-bold shrink-0 transition-colors cursor-pointer ${
                  skippedMeals.includes('dinner')
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {skippedMeals.includes('dinner') ? 'Skipped (-₹60)' : 'Skip (-₹60)'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Rate Mess Hygiene & Food</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setFoodRating(star)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-4 h-4 ${
                      star <= foodRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: MAINTENANCE TICKETS */}
      {/* ========================================================================= */}
      {activeTab === 'maintenance' && (
        <div className="px-3 sm:px-6 space-y-3.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('overview')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">Maintenance & Support</h2>
                <p className="text-[11px] text-slate-500">Guaranteed 4-hour on-site resolution</p>
              </div>
            </div>

            <button
              id="btn-raise-ticket-top"
              onClick={() => setShowNewTicketModal(true)}
              className="px-3.5 py-2 bg-[#7C3AED] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-purple-700 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Issue</span>
            </button>
          </div>

          {/* Tickets List */}
          <div className="space-y-3">
            {maintenanceTickets.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center text-slate-500 text-xs border border-slate-200/90 space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-sm">No Active Maintenance Requests</p>
                <p className="text-slate-400">All electrical, plumbing, and Wi-Fi systems are functioning normally.</p>
              </div>
            ) : (
              maintenanceTickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7C3AED] bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                      {t.category} • Room {t.roomNumber}
                    </span>
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-bold capitalize ${
                        t.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : t.status === 'in_progress'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{t.title}</h3>
                    <p className="text-xs text-slate-600 mt-1">{t.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                    <span className="font-medium">Priority: <strong className="text-slate-700 uppercase">{t.priority}</strong></span>
                    <span>Logged: {t.createdAt}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 6: RENT LEDGER & INVOICES */}
      {/* ========================================================================= */}
      {activeTab === 'rent' && (
        <div className="px-3 sm:px-6 space-y-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('overview')}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Upcoming Rent Due</span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    ₹{(activeBooking.monthlyRent ?? 0).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase">
                  Due in 5 Days
                </span>
                <p className="text-[11px] text-slate-400 mt-1">Cycle: 1st of each month</p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium border border-emerald-200/60">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero hidden maintenance fees. Rent includes water & high-speed Wi-Fi.</span>
            </div>

            <button
              onClick={() => setShowUpiModal(true)}
              className="w-full py-3.5 bg-[#7C3AED] hover:bg-purple-700 active:bg-purple-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay ₹{(activeBooking.monthlyRent ?? 0).toLocaleString('en-IN')} via Instant UPI</span>
            </button>

            {rentPaidSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-center text-xs font-bold animate-in fade-in border border-emerald-200">
                ✓ Rent Paid Successfully! Digital Receipt issued instantly.
              </div>
            )}
          </div>

          {/* Payment History */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
              Payment History & Receipts
            </h3>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/90 flex items-center justify-between text-xs shadow-sm">
              <div className="space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#7C3AED]" />
                  <span>Token Booking & Security Deposit</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  Ref: {activeBooking.transactionId || 'TXN-984210'} • {activeBooking.createdAt}
                </div>
              </div>
              <div className="text-right">
                <div className="font-black text-slate-900 text-sm">
                  ₹{(activeBooking.tokenPaid ?? 0).toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Paid ✓
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: INTERACTIVE UPI RENT PAYMENT */}
      {/* ========================================================================= */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-700 via-[#7C3AED] to-indigo-700 text-white p-5 relative">
              <button
                onClick={() => {
                  setShowUpiModal(false);
                  setUpiTxnReceipt(null);
                }}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close UPI Payment modal"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 text-purple-200 text-[11px] font-bold uppercase tracking-wider mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>NPCI Unified Payments Interface (UPI 2.0)</span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-white">
                Pay Monthly Rent
              </h3>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-purple-500/40 text-xs">
                <span className="text-purple-100">{activeBooking.pgName} (Room {activeBooking.roomNumber})</span>
                <span className="font-black text-lg text-white">₹{(activeBooking.monthlyRent ?? 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Modal Content */}
            {!upiTxnReceipt ? (
              <div className="p-5 space-y-4">
                {/* Method Navigation Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-2xl">
                  <button
                    onClick={() => setUpiPaymentType('apps')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      upiPaymentType === 'apps'
                        ? 'bg-white text-[#7C3AED] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>UPI Apps</span>
                  </button>
                  <button
                    onClick={() => setUpiPaymentType('id')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      upiPaymentType === 'id'
                        ? 'bg-white text-[#7C3AED] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <BadgeCheck className="w-3.5 h-3.5" />
                    <span>UPI ID / VPA</span>
                  </button>
                  <button
                    onClick={() => setUpiPaymentType('qr')}
                    className={`py-2 px-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      upiPaymentType === 'qr'
                        ? 'bg-white text-[#7C3AED] shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Scan QR</span>
                  </button>
                </div>

                {/* TAB 1: UPI APPS */}
                {upiPaymentType === 'apps' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <label className="block text-xs font-bold text-slate-700">
                      Select Installed UPI App
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { id: 'gpay', name: 'Google Pay', tag: 'Fastest', color: 'text-blue-600 bg-blue-50 border-blue-200' },
                        { id: 'phonepe', name: 'PhonePe', tag: 'Popular', color: 'text-purple-600 bg-purple-50 border-purple-200' },
                        { id: 'paytm', name: 'Paytm UPI', tag: 'Instant', color: 'text-sky-600 bg-sky-50 border-sky-200' },
                        { id: 'bhim', name: 'BHIM UPI', tag: 'Govt NPCI', color: 'text-orange-600 bg-orange-50 border-orange-200' },
                        { id: 'cred', name: 'CRED Pay', tag: 'Cashback', color: 'text-slate-800 bg-slate-100 border-slate-300' },
                        { id: 'amazonpay', name: 'Amazon Pay', tag: 'Rewards', color: 'text-amber-700 bg-amber-50 border-amber-200' },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id as any)}
                          className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                            selectedUpiApp === app.id
                              ? 'bg-purple-50/80 border-[#7C3AED] ring-2 ring-purple-500/20 shadow-xs'
                              : 'bg-white border-slate-200/90 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-xs text-slate-900">{app.name}</div>
                            <div className="text-[10px] text-slate-400 font-medium">1-Tap Intent</div>
                          </div>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md border ${app.color}`}>
                            {app.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 2: ENTER CUSTOM UPI ID */}
                {upiPaymentType === 'id' && (
                  <div className="space-y-3 animate-in fade-in duration-150">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Enter Virtual Payment Address (VPA)
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            placeholder="e.g. mobile@upi or name@oksbi"
                            value={customUpiId}
                            onChange={(e) => {
                              setCustomUpiId(e.target.value);
                              setIsUpiVerified(false);
                            }}
                            className="w-full pl-3 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                          />
                          {isUpiVerified && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleVerifyCustomUpi}
                          disabled={!customUpiId.includes('@') || isUpiVerifying}
                          className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                          {isUpiVerifying ? 'Verifying...' : isUpiVerified ? 'Verified ✓' : 'Verify'}
                        </button>
                      </div>
                    </div>

                    {/* Quick Bank Suffix Shortcuts */}
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400 mb-1.5">
                        Quick Bank Suffixes:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {['@okhdfcbank', '@oksbi', '@okicici', '@okaxis', '@paytm', '@ybl', '@upi'].map((suffix) => (
                          <button
                            key={suffix}
                            type="button"
                            onClick={() => {
                              const username = customUpiId.split('@')[0] || 'resident';
                              setCustomUpiId(`${username}${suffix}`);
                              setIsUpiVerified(true);
                            }}
                            className="px-2 py-1 bg-purple-50 hover:bg-purple-100 text-[#7C3AED] rounded-lg text-[10px] font-mono font-bold border border-purple-200/60 transition-colors cursor-pointer"
                          >
                            {suffix}
                          </button>
                        ))}
                      </div>
                    </div>

                    {isUpiVerified && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200/80 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Verified Account: <strong>{activeBooking.tenantName}</strong></span>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: DYNAMIC QR CODE */}
                {upiPaymentType === 'qr' && (
                  <div className="space-y-3 text-center animate-in fade-in duration-150">
                    <div className="inline-block p-4 bg-white rounded-2xl border-2 border-slate-900/80 shadow-md relative">
                      <div className="w-44 h-44 bg-slate-900 rounded-xl flex flex-col items-center justify-center p-3 text-white relative overflow-hidden">
                        {/* High fidelity styled QR simulation */}
                        <div className="grid grid-cols-5 gap-1.5 w-full h-full p-2 bg-white rounded-lg">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div
                              key={i}
                              className={`rounded-xs ${
                                [0, 4, 12, 20, 24, 2, 6, 8, 16, 18, 22].includes(i)
                                  ? 'bg-slate-900'
                                  : [1, 5, 7, 11, 13, 17, 21].includes(i)
                                  ? 'bg-purple-700'
                                  : 'bg-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                        {/* Center UPI Badge */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="px-2 py-1 bg-[#7C3AED] text-white text-[9px] font-black uppercase rounded-md shadow-md border border-white">
                            UPI ₹{activeBooking.monthlyRent}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>QR Expires in: <strong className="text-amber-700 font-mono">{formatTimer(qrCountdown)}</strong></span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Scan using Google Pay, PhonePe, Paytm, BHIM, or any UPI banking app.
                      </p>
                    </div>
                  </div>
                )}

                {/* AutoPay e-Mandate Toggle */}
                <div
                  onClick={() => setAutoPayEnabled(!autoPayEnabled)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    autoPayEnabled
                      ? 'bg-purple-50/70 border-purple-300'
                      : 'bg-slate-50 border-slate-200/90'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${autoPayEnabled ? 'bg-[#7C3AED] text-white' : 'bg-slate-200 text-slate-600'}`}>
                      <Zap className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">Enable 1-Click Monthly Auto-Pay</div>
                      <div className="text-[10px] text-slate-500">Auto-debit on 1st of every month • Zero late fee</div>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${autoPayEnabled ? 'bg-[#7C3AED] border-[#7C3AED] text-white' : 'border-slate-300'}`}>
                    {autoPayEnabled && <Check className="w-3 h-3" />}
                  </div>
                </div>

                {/* Pay Action Button */}
                <button
                  type="button"
                  disabled={isProcessingUpi}
                  onClick={handleExecuteUpiPayment}
                  className="w-full py-3.5 bg-gradient-to-r from-purple-700 to-[#7C3AED] hover:from-purple-800 hover:to-purple-700 active:scale-[0.99] text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessingUpi ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Authorizing UPI Payment...</span>
                    </div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authorize & Pay ₹{(activeBooking.monthlyRent ?? 0).toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 font-medium pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-bit SSL Encrypted • Direct Bank to Property Account</span>
                </div>
              </div>
            ) : (
              /* SUCCESS RECEIPT VIEW */
              <div className="p-6 space-y-4 text-center animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h4 className="text-xl font-black text-slate-900">Rent Paid Successfully!</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Official digital tax invoice & receipt generated
                  </p>
                </div>

                {/* Receipt Card */}
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-left space-y-2 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Transaction ID</span>
                    <span className="font-mono font-bold text-slate-900">{upiTxnReceipt.txnId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Bank UTR Ref</span>
                    <span className="font-mono font-bold text-[#7C3AED]">{upiTxnReceipt.utrNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Amount Paid</span>
                    <span className="font-black text-slate-900 text-sm">₹{(upiTxnReceipt.amount ?? 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Payment Mode</span>
                    <span className="font-bold text-slate-800">{upiTxnReceipt.method}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Date & Time</span>
                    <span className="text-slate-700">{upiTxnReceipt.timestamp}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-200">
                    <span className="text-slate-500 font-medium">Status</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200">
                      Settled (Cleared) ✓
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      const receiptContent = `
============================================================
           RENT PAYMENT TAX RECEIPT (DIGITAL ACKNOWLEDGEMENT)
============================================================
Receipt Ref  : ${upiTxnReceipt.txnId}
Bank UTR     : ${upiTxnReceipt.utrNumber}
Date & Time  : ${upiTxnReceipt.timestamp}
Resident     : ${activeBooking.tenantName}
Property     : ${activeBooking.pgName}
Room Details : Room ${activeBooking.roomNumber} (${activeBooking.bedNumber})
Amount Paid  : INR ${upiTxnReceipt.amount}/-
Payment Mode : ${upiTxnReceipt.method}
Status       : SETTLED & VERIFIED (Zero Dues for Current Cycle)

Authorized Signatory: Suresh Patel (Property Manager)
============================================================
                      `.trim();
                      const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `Rent_Receipt_${upiTxnReceipt.txnId}.txt`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    }}
                    className="w-full py-3 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Digital Rent Receipt</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUpiModal(false);
                      setUpiTxnReceipt(null);
                    }}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Done & Return to My Stay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: RAISE MAINTENANCE TICKET */}
      {/* ========================================================================= */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 sm:p-6 w-full max-w-sm sm:max-w-md shadow-2xl space-y-4 border border-slate-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-extrabold text-base text-slate-900">Raise Maintenance Issue</h3>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Category</label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                >
                  <option value="Electricity & AC">⚡ Electrical & AC</option>
                  <option value="Plumbing">🚰 Plumbing & RO Water</option>
                  <option value="Wi-Fi & Internet">📶 Wi-Fi & Internet</option>
                  <option value="Housekeeping & Cleaning">🧹 Housekeeping & Cleaning</option>
                  <option value="Smart Gate & Key">🛡️ Smart Gate & Key</option>
                  <option value="Other Request">📦 Other Request</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Issue Summary</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AC cooling low or water tap leakage"
                  value={ticketTitle}
                  onChange={(e) => setTicketTitle(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Provide any specific details to help the technician resolve faster..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-[#7C3AED] focus:outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Resident Profile Modal */}
      {showEditProfileModal && (
        <EditProfileModal
          currentUser={residentUser}
          isOpen={showEditProfileModal}
          onClose={() => setShowEditProfileModal(false)}
          onSave={(updated) => {
            if (onUpdateProfile) {
              onUpdateProfile(updated);
            }
          }}
        />
      )}
    </div>
  );
};
