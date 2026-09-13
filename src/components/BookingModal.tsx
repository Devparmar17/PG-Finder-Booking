import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Calendar,
  CreditCard,
  QrCode,
  Lock,
  ArrowRight,
  User,
  Phone,
  Mail,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  Check,
  Download,
  Share2,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import { PGListing, BedSlot, BookingRecord, UserProfile } from '../types';
import { formatINR, SHARING_LABEL } from '../data/properties';
import { generateBookingCode, generateBiometricId } from '../lib/bookingUtils';

interface BookingModalProps {
  pg: PGListing;
  initialBed?: BedSlot;
  currentUser: UserProfile | null;
  allBookings?: BookingRecord[];
  onClose: () => void;
  onBookingComplete: (booking: BookingRecord) => void;
  initialStep?: 1 | 2 | 3;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  pg,
  initialBed,
  currentUser,
  allBookings = [],
  onClose,
  onBookingComplete,
  initialStep = 1,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(initialStep);
  const [selectedBed, setSelectedBed] = useState<BedSlot | undefined>(
    initialBed || pg.availableBeds.find((b) => b.status === 'available')
  );
  const [moveInDate, setMoveInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [paymentType, setPaymentType] = useState<'token' | 'full'>('token');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [revealedCredentials, setRevealedCredentials] = useState(false);

  // Field states wired to actual currentUser
  const [tenantName, setTenantName] = useState(currentUser?.name || '');
  const [tenantPhone, setTenantPhone] = useState(currentUser?.phone ? currentUser.phone.replace('+91', '').trim() : '');
  const [emergencyContact, setEmergencyContact] = useState(currentUser?.emergencyContact ? currentUser.emergencyContact.replace('+91', '').trim() : '');
  const [tenantEmail, setTenantEmail] = useState(currentUser?.email || '');
  const [idType, setIdType] = useState<'Aadhaar Card' | 'PAN Card' | 'Passport' | 'Voter ID'>('Aadhaar Card');
  const [idNumber, setIdNumber] = useState('');
  const [idConsent, setIdConsent] = useState(false);
  const [showIdMask, setShowIdMask] = useState(true);

  // Validation Touched & Errors
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Refs for focusing invalid inputs
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emergencyRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const idNumberRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  const rentAmount = selectedBed ? selectedBed.price : pg.pricePerMonth;
  // Security deposit is canonically 2 * rentAmount
  const depositAmount = rentAmount * 2;
  const tokenAmount = 2000;
  const totalDueAtMoveIn = rentAmount + depositAmount;
  const payableNow = paymentType === 'token' ? tokenAmount : totalDueAtMoveIn;
  const balanceDueAtMoveIn = totalDueAtMoveIn - payableNow;

  // Validation function
  const validateField = (name: string, value: string, currentIdType = idType): string => {
    switch (name) {
      case 'tenantName': {
        const trimmed = value.trim();
        if (!trimmed) return 'Full Name is required.';
        if (trimmed.length < 2 || trimmed.length > 60) return 'Name must be between 2 and 60 characters.';
        if (!/^[a-zA-Z\s.'-]+$/.test(trimmed)) return 'Only letters, spaces, dots, and hyphens allowed.';
        return '';
      }
      case 'tenantPhone': {
        const clean = value.replace(/\D/g, '');
        // handle optional 91 prefix
        const mobile = clean.length === 12 && clean.startsWith('91') ? clean.slice(2) : clean;
        if (!mobile) return 'Mobile number is required.';
        if (!/^[6-9]\d{9}$/.test(mobile)) return 'Enter a valid 10-digit Indian mobile number (starts with 6-9).';
        if (/^(\d)\1{9}$/.test(mobile)) return 'Invalid mobile number with identical repeating digits.';
        return '';
      }
      case 'emergencyContact': {
        const clean = value.replace(/\D/g, '');
        const em = clean.length === 12 && clean.startsWith('91') ? clean.slice(2) : clean;
        if (!em) return 'Emergency contact is required.';
        if (!/^[6-9]\d{9}$/.test(em)) return 'Enter a valid 10-digit mobile number.';
        if (/^(\d)\1{9}$/.test(em)) return 'Invalid emergency contact number.';
        const cleanTenantPhone = tenantPhone.replace(/\D/g, '').slice(-10);
        if (em === cleanTenantPhone) return 'Emergency contact must differ from your primary mobile number.';
        return '';
      }
      case 'tenantEmail': {
        const trimmed = value.trim();
        if (!trimmed) return 'Email address is required.';
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) return 'Enter a valid email address.';
        return '';
      }
      case 'idNumber': {
        const trimmed = value.trim().toUpperCase();
        if (!trimmed) return 'Government ID number is required.';
        if (currentIdType === 'Aadhaar Card') {
          const digits = trimmed.replace(/\s/g, '');
          if (!/^\d{12}$/.test(digits)) return 'Aadhaar must be exactly 12 digits.';
          if (/^(\d)\1{11}$/.test(digits)) return 'Invalid Aadhaar number.';
        } else if (currentIdType === 'PAN Card') {
          if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(trimmed)) return 'PAN must follow format ABCDE1234F (5 letters, 4 digits, 1 letter).';
        } else if (currentIdType === 'Passport') {
          if (!/^[A-Z][0-9]{7}$/.test(trimmed)) return 'Passport must be 1 letter followed by 7 digits.';
        } else if (currentIdType === 'Voter ID') {
          if (!/^[A-Z]{3}[0-9]{7}$/.test(trimmed)) return 'Voter ID must be 3 letters followed by 7 digits.';
        }
        return '';
      }
      default:
        return '';
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    let val = '';
    if (field === 'tenantName') val = tenantName;
    if (field === 'tenantPhone') val = tenantPhone;
    if (field === 'emergencyContact') val = emergencyContact;
    if (field === 'tenantEmail') val = tenantEmail;
    if (field === 'idNumber') val = idNumber;
    const err = validateField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const isStep2FormValid = (): boolean => {
    const errName = validateField('tenantName', tenantName);
    const errPhone = validateField('tenantPhone', tenantPhone);
    const errEmergency = validateField('emergencyContact', emergencyContact);
    const errEmail = validateField('tenantEmail', tenantEmail);
    const errId = validateField('idNumber', idNumber);
    return !errName && !errPhone && !errEmergency && !errEmail && !errId && idConsent;
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    const errName = validateField('tenantName', tenantName);
    const errPhone = validateField('tenantPhone', tenantPhone);
    const errEmergency = validateField('emergencyContact', emergencyContact);
    const errEmail = validateField('tenantEmail', tenantEmail);
    const errId = validateField('idNumber', idNumber);

    const newErrors: Record<string, string> = {
      tenantName: errName,
      tenantPhone: errPhone,
      emergencyContact: errEmergency,
      tenantEmail: errEmail,
      idNumber: errId,
    };
    if (!idConsent) {
      newErrors.idConsent = 'You must consent to ID verification for booking.';
    }

    setErrors(newErrors);
    setTouched({
      tenantName: true,
      tenantPhone: true,
      emergencyContact: true,
      tenantEmail: true,
      idNumber: true,
      idConsent: true,
    });

    if (errName) {
      nameRef.current?.focus();
      return;
    }
    if (errPhone) {
      phoneRef.current?.focus();
      return;
    }
    if (errEmergency) {
      emergencyRef.current?.focus();
      return;
    }
    if (errEmail) {
      emailRef.current?.focus();
      return;
    }
    if (errId) {
      idNumberRef.current?.focus();
      return;
    }
    if (!idConsent) {
      consentRef.current?.focus();
      return;
    }

    setStep(3);
  };

  const handlePayAndConfirm = () => {
    if (!agreeTerms) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const bookingCode = generateBookingCode(allBookings);
      const biometricId = generateBiometricId(tenantName);

      const newBooking: BookingRecord = {
        id: `BK-${Date.now()}`,
        bookingCode,
        pgId: pg.id,
        pgName: pg.name,
        pgImage: pg.images[0],
        pgLocation: pg.location,
        roomNumber: selectedBed ? selectedBed.roomNumber : '201',
        bedNumber: selectedBed ? selectedBed.bedNumber : 'Bed A',
        sharingType: selectedBed ? `${selectedBed.type} Sharing` : 'Double Sharing',
        moveInDate,
        tenantName: tenantName.trim(),
        tenantPhone: tenantPhone.trim(),
        tenantEmail: tenantEmail.trim(),
        emergencyContact: emergencyContact.trim(),
        idProofType: `${idType} Verified`,
        monthlyRent: rentAmount,
        securityDeposit: depositAmount,
        tokenPaid: payableNow,
        dueAmount: balanceDueAtMoveIn,
        paymentMethod,
        transactionId: `TXN-${paymentMethod}-${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: 'confirmed',
        createdAt: new Date().toISOString().split('T')[0],
        rentCycleDay: 1,
        wifiCredentials: {
          ssid: `${pg.name.replace(/\s+/g, '')}_Fast_5G`,
          pass: 'PGFast@2026',
        },
        biometricId,
      };

      setConfirmedBooking(newBooking);
      setStep(4);

      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti fallback
      }
    }, 1200);
  };

  const handleCopyCode = () => {
    if (!confirmedBooking) return;
    navigator.clipboard.writeText(confirmedBooking.bookingCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleRequestClose = () => {
    if (step === 4) {
      if (confirmedBooking) onBookingComplete(confirmedBooking);
      else onClose();
      return;
    }
    // If in-progress booking, warn user
    setShowDiscardConfirm(true);
  };

  return createPortal(
    <div
      id="booking-modal-backdrop"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleRequestClose();
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="relative z-60 bg-white w-full max-w-md sm:max-w-xl md:max-w-2xl rounded-t-3xl sm:rounded-2xl flex flex-col shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom-4 duration-200"
        style={{ maxHeight: 'min(88dvh, 680px)' }}
      >
        {/* Top Header */}
        <div className="shrink-0 px-5 sm:px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#7C3AED]">
              {step === 4 ? 'Booking Confirmed' : `Step ${step} of 3 • ${step === 1 ? 'Bed Selection' : step === 2 ? 'Resident KYC' : 'Transparent Payment'}`}
            </div>
            <h2 id="booking-modal-title" className="text-base sm:text-lg font-black text-slate-900">
              {step === 1 && 'Select Bed & Move-In Date'}
              {step === 2 && 'Resident Information & KYC'}
              {step === 3 && 'Review Details & Payment'}
              {step === 4 && 'Bed Reserved Successfully 🎉'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleRequestClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            aria-label="Close booking modal"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 min-h-0 space-y-4">
          {/* Discard Warning Alert if triggered */}
          {showDiscardConfirm && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-in fade-in">
              <h4 className="text-xs font-bold text-amber-900 mb-1">Discard this in-progress booking?</h4>
              <p className="text-xs text-amber-700 mb-3">
                Your selected room reservation and entered resident details will not be saved.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDiscardConfirm(false)}
                  className="px-4 py-2 bg-white border border-amber-300 text-amber-900 text-xs font-bold rounded-lg cursor-pointer hover:bg-amber-100"
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg cursor-pointer hover:bg-red-700"
                >
                  Discard & Exit
                </button>
              </div>
            </div>
          )}

          {/* STEP 1: Bed & Move-In Date */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Selected PG Summary */}
              <div className="flex items-center gap-3.5 p-3.5 bg-purple-50/60 rounded-2xl border border-purple-100">
                <img
                  src={pg.images[0]}
                  alt={pg.name}
                  className="w-14 h-14 rounded-xl object-cover"
                />
                <div>
                  <div className="font-black text-sm text-slate-900">{pg.name}</div>
                  <div className="text-xs text-slate-500">{pg.area}, {pg.city}</div>
                  <div className="text-xs font-bold text-[#7C3AED] mt-0.5">
                    from {formatINR(rentAmount)} / month • Zero Brokerage
                  </div>
                </div>
              </div>

              {/* Bed Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800">
                    Select Bed Slot ({pg.availableBeds.filter((b) => b.status === 'available').length} of {pg.availableBeds.length} available)
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {pg.availableBeds.map((bed) => {
                    const isAvailable = bed.status === 'available';
                    const isSelected = selectedBed?.id === bed.id;

                    return (
                      <button
                        type="button"
                        key={bed.id}
                        disabled={!isAvailable}
                        onClick={() => setSelectedBed(bed)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          !isAvailable
                            ? 'bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed'
                            : isSelected
                              ? 'bg-[#7C3AED] text-white border-[#7C3AED] shadow-sm'
                              : 'bg-white border-slate-200 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{bed.bedNumber}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                              isSelected
                                ? 'bg-purple-800 text-white'
                                : isAvailable
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {isAvailable ? 'Available' : 'Occupied'}
                          </span>
                        </div>
                        <div
                          className={`text-[11px] mt-0.5 ${
                            isSelected ? 'text-purple-100' : 'text-slate-500'
                          }`}
                        >
                          Room {bed.roomNumber} (Floor {bed.floor}) • {bed.type}
                        </div>
                        <div
                          className={`text-xs font-bold mt-1 ${
                            isSelected ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {formatINR(bed.price)} / mo
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Move-In Date */}
              <div>
                <label htmlFor="input-booking-movein-date" className="block text-xs font-bold text-slate-800 mb-1.5">
                  Expected Move-In Date
                </label>
                <div className="relative">
                  <input
                    id="input-booking-movein-date"
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#7C3AED]"
                  />
                  <Calendar className="w-4 h-4 text-[#7C3AED] absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Notice period and monthly rent cycles start from this move-in date.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Resident Information & KYC Form */}
          {step === 2 && (
            <form id="step2-form" noValidate onSubmit={handleStep2Submit} className="space-y-4 animate-in fade-in duration-150">
              {/* Full Name */}
              <div>
                <label htmlFor="kyc-name" className="block text-xs font-bold text-slate-800 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={nameRef}
                    id="kyc-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={tenantName}
                    onChange={(e) => {
                      setTenantName(e.target.value);
                      if (touched.tenantName) setErrors((prev) => ({ ...prev, tenantName: validateField('tenantName', e.target.value) }));
                    }}
                    onBlur={() => handleBlur('tenantName')}
                    aria-invalid={Boolean(errors.tenantName)}
                    aria-describedby={errors.tenantName ? 'err-kyc-name' : undefined}
                    placeholder="As shown on official ID"
                    className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium transition-colors ${
                      errors.tenantName && touched.tenantName
                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                        : 'border-slate-200 focus:ring-2 focus:ring-[#7C3AED]'
                    }`}
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.tenantName && touched.tenantName && (
                  <p id="err-kyc-name" className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.tenantName}
                  </p>
                )}
              </div>

              {/* Mobile & Emergency Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Mobile */}
                <div>
                  <label htmlFor="kyc-phone" className="block text-xs font-bold text-slate-800 mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">+91</span>
                    <input
                      ref={phoneRef}
                      id="kyc-phone"
                      name="tel"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      required
                      value={tenantPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setTenantPhone(val);
                        if (touched.tenantPhone) setErrors((prev) => ({ ...prev, tenantPhone: validateField('tenantPhone', val) }));
                      }}
                      onBlur={() => handleBlur('tenantPhone')}
                      aria-invalid={Boolean(errors.tenantPhone)}
                      aria-describedby={errors.tenantPhone ? 'err-kyc-phone' : undefined}
                      placeholder="10-digit mobile number"
                      className={`w-full pl-11 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium transition-colors ${
                        errors.tenantPhone && touched.tenantPhone
                          ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                          : 'border-slate-200 focus:ring-2 focus:ring-[#7C3AED]'
                      }`}
                    />
                  </div>
                  {errors.tenantPhone && touched.tenantPhone && (
                    <p id="err-kyc-phone" className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.tenantPhone}
                    </p>
                  )}
                </div>

                {/* Emergency Contact */}
                <div>
                  <label htmlFor="kyc-emergency" className="block text-xs font-bold text-slate-800 mb-1">
                    Emergency Contact <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">+91</span>
                    <input
                      ref={emergencyRef}
                      id="kyc-emergency"
                      name="emergency-tel"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      required
                      value={emergencyContact}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                        setEmergencyContact(val);
                        if (touched.emergencyContact) setErrors((prev) => ({ ...prev, emergencyContact: validateField('emergencyContact', val) }));
                      }}
                      onBlur={() => handleBlur('emergencyContact')}
                      aria-invalid={Boolean(errors.emergencyContact)}
                      aria-describedby={errors.emergencyContact ? 'err-kyc-emergency' : undefined}
                      placeholder="10-digit mobile number"
                      className={`w-full pl-11 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium transition-colors ${
                        errors.emergencyContact && touched.emergencyContact
                          ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                          : 'border-slate-200 focus:ring-2 focus:ring-[#7C3AED]'
                      }`}
                    />
                  </div>
                  {errors.emergencyContact && touched.emergencyContact && (
                    <p id="err-kyc-emergency" className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {errors.emergencyContact}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="kyc-email" className="block text-xs font-bold text-slate-800 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={emailRef}
                    id="kyc-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={tenantEmail}
                    onChange={(e) => {
                      setTenantEmail(e.target.value);
                      if (touched.tenantEmail) setErrors((prev) => ({ ...prev, tenantEmail: validateField('tenantEmail', e.target.value) }));
                    }}
                    onBlur={() => handleBlur('tenantEmail')}
                    aria-invalid={Boolean(errors.tenantEmail)}
                    aria-describedby={errors.tenantEmail ? 'err-kyc-email' : undefined}
                    placeholder="For booking receipts and invoices"
                    className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-xs font-medium transition-colors ${
                      errors.tenantEmail && touched.tenantEmail
                        ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                        : 'border-slate-200 focus:ring-2 focus:ring-[#7C3AED]'
                    }`}
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                {errors.tenantEmail && touched.tenantEmail && (
                  <p id="err-kyc-email" className="text-[11px] text-red-600 font-semibold mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.tenantEmail}
                  </p>
                )}
              </div>

              {/* Government ID Type & Number */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="kyc-idtype" className="text-xs font-bold text-slate-800">
                    Government ID Document <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-purple-700 bg-purple-50 font-bold px-2 py-0.5 rounded-full border border-purple-200">
                    Police Verification
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <select
                      id="kyc-idtype"
                      value={idType}
                      onChange={(e) => {
                        const newType = e.target.value as any;
                        setIdType(newType);
                        setIdNumber('');
                        setErrors((prev) => ({ ...prev, idNumber: '' }));
                      }}
                      className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#7C3AED]"
                    >
                      <option value="Aadhaar Card">Aadhaar Card (12 digits)</option>
                      <option value="PAN Card">PAN Card (ABCDE1234F)</option>
                      <option value="Passport">Passport (1 letter + 7 digits)</option>
                      <option value="Voter ID">Voter ID (3 letters + 7 digits)</option>
                    </select>
                  </div>

                  <div className="relative">
                    <input
                      ref={idNumberRef}
                      id="kyc-idnumber"
                      type={showIdMask ? 'password' : 'text'}
                      value={idNumber}
                      onChange={(e) => {
                        const val = e.target.value;
                        setIdNumber(val);
                        if (touched.idNumber) setErrors((prev) => ({ ...prev, idNumber: validateField('idNumber', val, idType) }));
                      }}
                      onBlur={() => handleBlur('idNumber')}
                      aria-invalid={Boolean(errors.idNumber)}
                      aria-describedby={errors.idNumber ? 'err-kyc-idnumber' : undefined}
                      placeholder={
                        idType === 'Aadhaar Card'
                          ? '12-digit Aadhaar'
                          : idType === 'PAN Card'
                            ? 'ABCDE1234F'
                            : idType === 'Passport'
                              ? 'A1234567'
                              : 'ABC1234567'
                      }
                      className={`w-full pl-3 pr-9 py-2.5 bg-white border rounded-xl text-xs font-mono font-medium transition-colors ${
                        errors.idNumber && touched.idNumber
                          ? 'border-red-500 ring-1 ring-red-500 bg-red-50/20'
                          : 'border-slate-200 focus:ring-2 focus:ring-[#7C3AED]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowIdMask((prev) => !prev)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label={showIdMask ? 'Show ID number' : 'Mask ID number'}
                    >
                      {showIdMask ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {errors.idNumber && touched.idNumber && (
                  <p id="err-kyc-idnumber" className="text-[11px] text-red-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {errors.idNumber}
                  </p>
                )}

                {/* Consent Checkbox */}
                <div className="pt-2 border-t border-slate-200/80">
                  <label className="flex items-start gap-2.5 text-[11px] text-slate-600 cursor-pointer">
                    <input
                      ref={consentRef}
                      type="checkbox"
                      checked={idConsent}
                      onChange={(e) => {
                        setIdConsent(e.target.checked);
                        if (e.target.checked) setErrors((prev) => ({ ...prev, idConsent: '' }));
                      }}
                      className="w-4 h-4 mt-0.5 rounded text-[#7C3AED] focus:ring-[#7C3AED] shrink-0"
                    />
                    <span>
                      I consent to Apna PG collecting my identity details strictly for resident verification and mandatory municipal police tenant intimation under the DPDP Act.
                    </span>
                  </label>
                  {errors.idConsent && touched.idConsent && (
                    <p className="text-[11px] text-red-600 font-semibold mt-1">
                      {errors.idConsent}
                    </p>
                  )}
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: Transparent Pricing & Summary */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Prominent Booking Summary Card */}
              <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4">
                <div className="text-[10px] font-bold text-purple-700 uppercase tracking-wider mb-1">
                  Booking Summary
                </div>
                <div className="text-base font-black text-slate-900">{pg.name}</div>
                <div className="text-xs text-slate-600 mb-3">{pg.area}, {pg.city}</div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-purple-200/80 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Room</span>
                    <span className="font-bold text-slate-800">Room {selectedBed?.roomNumber || '201'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Bed Slot</span>
                    <span className="font-bold text-slate-800">{selectedBed?.bedNumber || 'Bed A'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Sharing</span>
                    <span className="font-bold text-slate-800">{selectedBed ? `${selectedBed.type} Sharing` : 'Double'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Move-in Date</span>
                    <span className="font-bold text-[#7C3AED]">{moveInDate}</span>
                  </div>
                </div>
              </div>

              {/* Transparent Cost Breakdown Table */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
                <div className="font-bold text-slate-800 mb-1">Transparent Cost Breakdown</div>
                <div className="flex justify-between text-slate-600">
                  <span>First Month Rent</span>
                  <span className="font-semibold text-slate-900">{formatINR(rentAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Security Deposit (100% Refundable)</span>
                  <span className="font-semibold text-slate-900">{formatINR(depositAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST on Residential Rent</span>
                  <span className="font-semibold text-emerald-700">₹0 (Statutory Exemption)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Brokerage / Platform Commission</span>
                  <span className="font-bold text-emerald-600">₹0 (Direct Booking)</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Due For Move-In</span>
                  <span className="text-[#7C3AED]">{formatINR(totalDueAtMoveIn)}</span>
                </div>
              </div>

              {/* Payment Type Selection (Token vs Full) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Choose Payment Amount
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentType('token')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentType === 'token'
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">Lock Bed with Token</div>
                    <div className="text-sm font-black text-[#7C3AED] mt-1">{formatINR(tokenAmount)}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Balance {formatINR(balanceDueAtMoveIn)} due on move-in
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentType('full')}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentType === 'full'
                        ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-500/20'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900">Pay Full Amount</div>
                    <div className="text-sm font-black text-[#7C3AED] mt-1">{formatINR(totalDueAtMoveIn)}</div>
                    <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                      Includes 100% refundable deposit
                    </div>
                  </button>
                </div>

                {/* Token refund policy line */}
                <div className="mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-600 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#7C3AED] shrink-0 mt-0.5" />
                  <span>
                    <strong>Cancellation & Refund Policy:</strong> Token ({formatINR(tokenAmount)}) is 100% refundable up to 48 hours before your move-in date ({moveInDate}). Upon check-in, it is fully adjusted against your first month rent.
                  </span>
                </div>
              </div>

              {/* Payment Gateways */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {/* UPI */}
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'UPI'
                        ? 'bg-purple-50/50 border-purple-500 ring-1 ring-purple-500/30'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-[#7C3AED]" />
                        <span className="text-xs font-bold text-slate-900">Instant UPI Payment</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Zero Fee
                      </span>
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="flex gap-2 pt-1">
                        {(['gpay', 'phonepe', 'paytm', 'qr'] as const).map((app) => (
                          <button
                            type="button"
                            key={app}
                            onClick={(e) => {
                              e.stopPropagation();
                              setUpiApp(app);
                            }}
                            className={`flex-1 py-1.5 text-[11px] font-bold uppercase rounded-lg border transition-all cursor-pointer ${
                              upiApp === app
                                ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card */}
                  <div
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      paymentMethod === 'Card'
                        ? 'bg-purple-50/50 border-purple-500 ring-1 ring-purple-500/30'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#7C3AED]" />
                      <span className="text-xs font-bold text-slate-900">Debit / Credit Card</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">Visa • MasterCard • RuPay</span>
                  </div>
                </div>
              </div>

              {/* Required Terms Checkbox */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <label htmlFor="checkbox-agree-terms" className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer font-medium">
                  <input
                    id="checkbox-agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-[#7C3AED] focus:ring-[#7C3AED] shrink-0 cursor-pointer"
                  />
                  <span>
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-[#7C3AED] font-bold underline">
                      Stay Terms & House Rules
                    </a>{' '}
                    and 48-hour refundable token cancellation policy.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Confirmation */}
          {step === 4 && confirmedBooking && (
            <div className="text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">Bed Reserved Successfully!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Confirmation & receipt dispatched to{' '}
                  <span className="font-semibold text-slate-800">{confirmedBooking.tenantEmail}</span>
                </p>
              </div>

              {/* Monospace Booking Reference Bar */}
              <div className="flex items-center justify-between p-3 bg-slate-100 rounded-xl border border-slate-200">
                <div className="text-left">
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Booking Reference</span>
                  <span className="text-sm font-mono font-black text-slate-900 tracking-wider">
                    {confirmedBooking.bookingCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 shadow-xs cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Payment Summary */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between text-slate-600">
                  <span>Amount Paid Now ({confirmedBooking.paymentMethod})</span>
                  <span className="font-bold text-emerald-700">{formatINR(confirmedBooking.tokenPaid)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Balance Due at Move-In</span>
                  <span className="font-bold text-slate-900">{formatINR(confirmedBooking.dueAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Transaction ID</span>
                  <span className="font-mono text-[11px] text-slate-700">{confirmedBooking.transactionId}</span>
                </div>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-slate-900 text-white rounded-2xl p-5 text-left shadow-lg space-y-3 relative overflow-hidden border border-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">
                      Resident Digital Pass
                    </div>
                    <div className="text-base font-bold">{confirmedBooking.pgName}</div>
                    <div className="text-xs text-slate-400">{confirmedBooking.pgLocation}</div>
                  </div>
                  <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-center">
                    <div className="text-[9px] text-slate-400 uppercase">ROOM</div>
                    <div className="text-xs font-bold">Room {confirmedBooking.roomNumber}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <div className="text-[10px] text-slate-400">Bed Assigned</div>
                    <div className="font-semibold">{confirmedBooking.bedNumber}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Move-in Date</div>
                    <div className="font-semibold">{confirmedBooking.moveInDate}</div>
                  </div>
                </div>

                {/* Gate & Wi-Fi Protection for Token Payments */}
                <div className="pt-2 border-t border-slate-800">
                  {!revealedCredentials ? (
                    <div className="p-2.5 bg-slate-800/80 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] text-purple-300 font-bold">Access Credentials Security</div>
                        <div className="text-[11px] text-slate-400">Wi-Fi & Biometric Gate Pass activate on move-in</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRevealedCredentials(true)}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] rounded-lg cursor-pointer"
                      >
                        Preview Pass
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-xs animate-in fade-in">
                      <div>
                        <div className="text-[10px] text-slate-400">Network name</div>
                        <div className="font-mono text-[11px]">{confirmedBooking.wifiCredentials?.ssid}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400">Smart Biometric ID</div>
                        <div className="font-mono text-[11px] text-[#B48CF8] font-bold">
                          {confirmedBooking.biometricId}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Pinned Sticky Footer */}
        <div
          className="shrink-0 sticky bottom-0 bg-white border-t border-slate-100 p-4 sm:p-5 z-10"
          style={{ paddingBottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}
        >
          {step === 1 && (
            <button
              id="btn-step1-next"
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 bg-[#7C3AED] hover:bg-purple-700 active:bg-purple-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Continue to Resident Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {step === 2 && (
            <div className="flex gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Back
              </button>
              <button
                id="btn-step2-next"
                type="button"
                disabled={!isStep2FormValid()}
                onClick={handleStep2Submit}
                className="flex-1 py-3.5 bg-[#7C3AED] hover:bg-purple-700 active:bg-purple-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:shadow-none disabled:pointer-events-none text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Review & Pay</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="flex gap-2.5 w-full">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={isProcessing}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Back
              </button>
              <button
                id="btn-pay-now-action"
                type="button"
                disabled={isProcessing || !agreeTerms}
                onClick={handlePayAndConfirm}
                className="flex-1 py-3.5 bg-[#7C3AED] hover:bg-purple-700 active:bg-purple-800 disabled:bg-purple-300 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay {formatINR(payableNow)} & Reserve Bed</span>
                  </>
                )}
              </button>
            </div>
          )}

          {step === 4 && confirmedBooking && (
            <div className="space-y-2 w-full">
              <button
                id="btn-complete-and-manage"
                type="button"
                onClick={() => onBookingComplete(confirmedBooking)}
                className="w-full py-3.5 bg-[#7C3AED] hover:bg-purple-700 active:bg-purple-800 text-white text-xs sm:text-sm font-bold rounded-xl shadow-sm transition-all cursor-pointer"
              >
                Manage My Stay in Resident Portal
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Close & Explore More PGs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
