import React, { useState } from 'react';
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
} from 'lucide-react';
import { PGListing, BedSlot, BookingRecord } from '../types';
import { INITIAL_USER } from '../data/mockData';

interface BookingModalProps {
  pg: PGListing;
  initialBed?: BedSlot;
  onClose: () => void;
  onBookingComplete: (booking: BookingRecord) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  pg,
  initialBed,
  onClose,
  onBookingComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedBed, setSelectedBed] = useState<BedSlot | undefined>(
    initialBed || pg.availableBeds.find((b) => b.status === 'available')
  );
  const [moveInDate, setMoveInDate] = useState('2026-09-01');
  const [paymentType, setPaymentType] = useState<'token' | 'full'>('token');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking'>('UPI');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRecord | null>(null);

  // Form Fields
  const [tenantName, setTenantName] = useState(INITIAL_USER.name);
  const [tenantPhone, setTenantPhone] = useState(INITIAL_USER.phone);
  const [tenantEmail, setTenantEmail] = useState(INITIAL_USER.email);
  const [emergencyContact, setEmergencyContact] = useState('+91 98250 99881');
  const [idType, setIdType] = useState('Aadhaar Card (UIDAI)');

  const rentAmount = selectedBed ? selectedBed.price : pg.pricePerMonth;
  const depositAmount = pg.costBreakdown.securityDeposit;
  const tokenAmount = 2000; // Flat token deposit to lock bed
  const totalDueAtMoveIn = rentAmount + depositAmount;
  const payableNow = paymentType === 'token' ? tokenAmount : totalDueAtMoveIn;

  const handlePayAndConfirm = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const bookingCode = `PG-AHM-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: BookingRecord = {
        id: `BK-${Date.now()}`,
        bookingCode,
        pgId: pg.id,
        pgName: pg.name,
        pgImage: pg.images[0],
        pgLocation: pg.location,
        roomNumber: selectedBed ? selectedBed.roomNumber : 'Room 201',
        bedNumber: selectedBed ? selectedBed.bedNumber : 'Bed A',
        sharingType: selectedBed ? `${selectedBed.type} Sharing` : 'Double Sharing',
        moveInDate,
        tenantName,
        tenantPhone,
        tenantEmail,
        emergencyContact,
        idProofType: idType,
        monthlyRent: rentAmount,
        securityDeposit: depositAmount,
        tokenPaid: payableNow,
        dueAmount: paymentType === 'token' ? totalDueAtMoveIn - tokenAmount : 0,
        paymentMethod,
        transactionId: `TXN-UPI-${Math.floor(100000000 + Math.random() * 900000000)}`,
        status: 'confirmed',
        createdAt: new Date().toISOString().split('T')[0],
        rentCycleDay: 1,
        wifiCredentials: { ssid: `${pg.name.replace(/\s+/g, '')}_Fast_5G`, pass: 'PGFast@2026' },
        biometricId: `BIO-${tenantName.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      };

      setConfirmedBooking(newBooking);
      setStep(4);

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Safe fallback
      }
    }, 1200);
  };

  return (
    <div
      id="booking-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-end sm:items-center overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-md max-h-[92vh] rounded-t-2xl sm:rounded-xl flex flex-col relative shadow-xl overflow-hidden border border-slate-200">
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
              {step === 4 ? 'Booking Confirmed' : `Step ${step} of 3`}
            </div>
            <h2 className="text-base font-bold text-slate-900">
              {step === 1 && 'Select Bed & Move-In Date'}
              {step === 2 && 'Resident Information & KYC'}
              {step === 3 && 'Transparent Payment & Confirm'}
              {step === 4 && 'Congratulations! 🎉'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: Bed & Date */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Selected PG Summary */}
              <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <img
                  src={pg.images[0]}
                  alt={pg.name}
                  className="w-14 h-14 rounded-lg object-cover"
                />
                <div>
                  <div className="font-bold text-sm text-slate-900">{pg.name}</div>
                  <div className="text-xs text-slate-500">{pg.location}</div>
                  <div className="text-xs font-bold text-blue-600 mt-0.5">
                    ₹{rentAmount.toLocaleString()} / month (Zero Brokerage)
                  </div>
                </div>
              </div>

              {/* Bed Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Select Room & Bed Slot
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {pg.availableBeds.map((bed) => {
                    const isAvailable = bed.status === 'available';
                    const isSelected = selectedBed?.id === bed.id;

                    return (
                      <button
                        key={bed.id}
                        disabled={!isAvailable}
                        onClick={() => setSelectedBed(bed)}
                        className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                          !isAvailable
                            ? 'bg-slate-100 border-slate-200 opacity-40 cursor-not-allowed'
                            : isSelected
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span>{bed.bedNumber}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                              isSelected
                                ? 'bg-blue-700 text-white'
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
                            isSelected ? 'text-blue-100' : 'text-slate-500'
                          }`}
                        >
                          {bed.roomNumber} (Floor {bed.floor}) • {bed.type}
                        </div>
                        <div
                          className={`text-xs font-bold mt-1 ${
                            isSelected ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          ₹{bed.price.toLocaleString()} / mo
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Move-In Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Expected Move-In Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={moveInDate}
                    onChange={(e) => setMoveInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:ring-2 focus:ring-blue-500"
                  />
                  <Calendar className="w-4 h-4 text-blue-600 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Rent will be calculated pro-rata from this date onwards.
                </p>
              </div>

              <button
                id="btn-step1-next"
                onClick={() => setStep(2)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Continue to Resident Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: Tenant KYC & Contact */}
          {step === 2 && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={tenantName}
                    onChange={(e) => setTenantName(e.target.value)}
                    placeholder="Enter full name"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">Mobile</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={tenantPhone}
                      onChange={(e) => setTenantPhone(e.target.value)}
                      className="w-full pl-8 pr-2 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                    />
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-800 mb-1">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Parent / Guardian"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={tenantEmail}
                    onChange={(e) => setTenantEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1">
                  Government ID Type
                </label>
                <select
                  value={idType}
                  onChange={(e) => setIdType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
                >
                  <option>Aadhaar Card (UIDAI)</option>
                  <option>PAN Card</option>
                  <option>Driving License</option>
                  <option>Passport / Student ID</option>
                </select>
                <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Instant e-KYC verification enabled</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Back
                </button>
                <button
                  id="btn-step2-next"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Review & Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Transparent Pricing & Online Payment */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Cost Summary */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>First Month Rent</span>
                  <span className="font-semibold text-slate-900">₹{rentAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Security Deposit (100% Refundable)</span>
                  <span className="font-semibold text-slate-900">
                    ₹{depositAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Maintenance & Platform Fee</span>
                  <span className="font-semibold text-emerald-600">FREE (₹0)</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Brokerage Commission</span>
                  <span className="font-semibold text-emerald-600">₹0 (Direct Booking)</span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Move-In Amount</span>
                  <span className="text-blue-600">₹{totalDueAtMoveIn.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Type Selection (Token vs Full) */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Choose Payment Option
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPaymentType('token')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      paymentType === 'token'
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-900">Lock Bed with Token</div>
                    <div className="text-sm font-bold text-blue-600 mt-1">₹{tokenAmount}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Pay remaining at move-in
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentType('full')}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                      paymentType === 'full'
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="text-xs font-semibold text-slate-900">Pay Full Amount</div>
                    <div className="text-sm font-bold text-blue-600 mt-1">
                      ₹{totalDueAtMoveIn.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
                      Includes 100% deposit
                    </div>
                  </button>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  Secure Payment Gateway
                </label>
                <div className="space-y-2">
                  {/* UPI Option */}
                  <div
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      paymentMethod === 'UPI'
                        ? 'bg-blue-50/50 border-blue-500'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-semibold text-slate-900">Instant UPI</span>
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Fastest & Zero Fee
                      </span>
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div className="flex gap-2 pt-1">
                        {(['gpay', 'phonepe', 'paytm', 'qr'] as const).map((app) => (
                          <button
                            key={app}
                            onClick={(e) => {
                              e.stopPropagation();
                              setUpiApp(app);
                            }}
                            className={`flex-1 py-1.5 text-[11px] font-semibold uppercase rounded-md border transition-all cursor-pointer ${
                              upiApp === app
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-slate-600 border-slate-200'
                            }`}
                          >
                            {app}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Option */}
                  <div
                    onClick={() => setPaymentMethod('Card')}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                      paymentMethod === 'Card'
                        ? 'bg-blue-50/50 border-blue-500'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-slate-900">Debit / Credit Card</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Visa / MC / RuPay</span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                id="btn-pay-now-action"
                disabled={isProcessing}
                onClick={handlePayAndConfirm}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Secure Payment...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ₹{payableNow.toLocaleString()} & Book Bed</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* STEP 4: Success & Digital Pass */}
          {step === 4 && confirmedBooking && (
            <div className="text-center space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Bed Booked Successfully!</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Booking Code:{' '}
                  <span className="font-bold text-blue-600">
                    {confirmedBooking.bookingCode}
                  </span>
                </p>
              </div>

              {/* Digital Pass Card */}
              <div className="bg-slate-900 text-white rounded-xl p-4 text-left shadow-lg space-y-3 relative overflow-hidden border border-slate-800">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">
                      Resident Digital Pass
                    </div>
                    <div className="text-base font-bold">{confirmedBooking.pgName}</div>
                    <div className="text-xs text-slate-400">{confirmedBooking.pgLocation}</div>
                  </div>
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-center">
                    <div className="text-[9px] text-slate-400">ROOM</div>
                    <div className="text-xs font-bold">{confirmedBooking.roomNumber}</div>
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
                  <div>
                    <div className="text-[10px] text-slate-400">Wi-Fi Network</div>
                    <div className="font-semibold text-[11px]">
                      {confirmedBooking.wifiCredentials?.ssid}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400">Smart Biometric ID</div>
                    <div className="font-semibold text-emerald-400">
                      {confirmedBooking.biometricId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  id="btn-complete-and-manage"
                  onClick={() => onBookingComplete(confirmedBooking)}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  Manage My Stay in Resident Portal
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                >
                  Close & Explore More PGs
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
