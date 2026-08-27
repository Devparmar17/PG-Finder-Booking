import React, { useState } from 'react';
import { X, Star, CheckCircle2 } from 'lucide-react';
import { Review } from '../types';
import { INITIAL_USER } from '../data/mockData';

interface WriteReviewModalProps {
  pgName: string;
  pgId: string;
  onClose: () => void;
  onSubmitReview: (review: Review) => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  pgName,
  pgId,
  onClose,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(5);
  const [foodRating, setFoodRating] = useState(5);
  const [cleanlinessRating, setCleanlinessRating] = useState(5);
  const [wifiRating, setWifiRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      authorName: INITIAL_USER.name,
      rating,
      date: 'Just now',
      content: comment,
      isCurrentResident: true,
      categoryRatings: {
        food: foodRating,
        cleanliness: cleanlinessRating,
        wifi: wifiRating,
        security: 5,
      },
    };

    onSubmitReview(newRev);
    onClose();
  };

  return (
    <div
      id="write-review-modal"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Write Verified Review</h2>
            <p className="text-xs text-slate-500 mt-0.5">{pgName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Overall Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 text-slate-300 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-center">
              <span className="text-[11px] font-bold text-slate-700">Food</span>
              <div className="flex justify-center mt-1.5 gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setFoodRating(s)} className="cursor-pointer">
                    <Star
                      className={`w-3.5 h-3.5 ${s <= foodRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <span className="text-[11px] font-bold text-slate-700">Cleanliness</span>
              <div className="flex justify-center mt-1.5 gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setCleanlinessRating(s)} className="cursor-pointer">
                    <Star
                      className={`w-3.5 h-3.5 ${s <= cleanlinessRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center">
              <span className="text-[11px] font-bold text-slate-700">Wi-Fi</span>
              <div className="flex justify-center mt-1.5 gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} type="button" onClick={() => setWifiRating(s)} className="cursor-pointer">
                    <Star
                      className={`w-3.5 h-3.5 ${s <= wifiRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-800 mb-1.5">Your Experience & Feedback</label>
            <textarea
              rows={3}
              required
              placeholder="Tell future residents about room maintenance, food taste, safety, and amenities..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#7C3AED] focus:outline-none text-xs font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Review will appear with Verified Resident badge</span>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-xl shadow-sm cursor-pointer transition-colors"
            >
              Post Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
