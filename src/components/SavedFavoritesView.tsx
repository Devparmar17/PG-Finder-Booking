import React, { useState } from 'react';
import { Heart, Trash2, ArrowRight, Star, MapPin, Scale, Check, X } from 'lucide-react';
import { PGListing } from '../types';

interface SavedFavoritesViewProps {
  favoritePGs: PGListing[];
  onSelectPG: (pg: PGListing) => void;
  onRemoveFavorite: (pgId: string) => void;
  onExploreMore: () => void;
}

export const SavedFavoritesView: React.FC<SavedFavoritesViewProps> = ({
  favoritePGs,
  onSelectPG,
  onRemoveFavorite,
  onExploreMore,
}) => {
  const [compareList, setCompareList] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const toggleCompare = (pgId: string) => {
    if (compareList.includes(pgId)) {
      setCompareList(compareList.filter((id) => id !== pgId));
    } else {
      if (compareList.length < 3) {
        setCompareList([...compareList, pgId]);
      }
    }
  };

  const comparedPGObjects = favoritePGs.filter((pg) => compareList.includes(pg.id));

  return (
    <div id="saved-favorites-view" className="px-5 sm:px-6 py-4 space-y-4 pb-28 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">Saved PGs</h1>
          <p className="text-xs text-slate-500 font-medium">{favoritePGs.length} accommodations in your wishlist</p>
        </div>

        {favoritePGs.length >= 2 && (
          <button
            onClick={() => setShowCompareModal(true)}
            disabled={compareList.length < 2}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              compareList.length >= 2
                ? 'bg-[#7C3AED] text-white shadow-sm hover:bg-purple-700'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare ({compareList.length})</span>
          </button>
        )}
      </div>

      {/* Empty State */}
      {favoritePGs.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center space-y-3 border border-slate-200/90 shadow-sm mt-4">
          <div className="w-14 h-14 bg-purple-50 text-[#7C3AED] rounded-full flex items-center justify-center mx-auto border border-purple-100">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Your Wishlist is Empty</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
            Tap the heart icon on any PG listing in the explore page to save and compare them here.
          </p>
          <button
            onClick={onExploreMore}
            className="px-5 py-2.5 bg-[#7C3AED] text-white rounded-xl text-xs font-bold hover:bg-purple-700 shadow-sm transition-all cursor-pointer"
          >
            Explore PGs
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {favoritePGs.map((pg) => {
            const isCompared = compareList.includes(pg.id);

            return (
              <div
                key={pg.id}
                className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm flex gap-3.5 items-center group relative hover:border-purple-300 transition-all"
              >
                <div
                  onClick={() => onSelectPG(pg)}
                  className="w-24 h-24 rounded-xl overflow-hidden bg-slate-100 shrink-0 cursor-pointer"
                >
                  <img src={pg.images[0]} alt={pg.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3
                      onClick={() => onSelectPG(pg)}
                      className="font-bold text-sm text-slate-900 truncate cursor-pointer hover:text-[#7C3AED] transition-colors"
                    >
                      {pg.name}
                    </h3>
                    <button
                      onClick={() => onRemoveFavorite(pg.id)}
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7C3AED] shrink-0" />
                    <span className="truncate">{pg.location}</span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <div className="text-sm font-bold text-slate-900">
                      ₹{pg.pricePerMonth.toLocaleString()}
                      <span className="text-[10px] text-slate-400 font-normal">/mo</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCompare(pg.id)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                          isCompared
                            ? 'bg-[#7C3AED] text-white border-[#7C3AED]'
                            : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        {isCompared ? '✓ Compare' : '+ Compare'}
                      </button>

                      <button
                        onClick={() => onSelectPG(pg)}
                        className="px-3 py-1 bg-purple-50 text-[#7C3AED] hover:bg-purple-100 border border-purple-200 rounded-lg text-xs font-bold cursor-pointer transition-colors"
                      >
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Comparison Modal */}
      {showCompareModal && comparedPGObjects.length >= 2 && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg md:max-w-2xl rounded-2xl p-5 sm:p-6 shadow-xl space-y-4 max-h-[85vh] overflow-y-auto border border-slate-200">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h2 className="font-bold text-base text-slate-900">Side-by-Side PG Comparison</h2>
              <button onClick={() => setShowCompareModal(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              {comparedPGObjects.map((pg) => (
                <div key={pg.id} className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2">
                  <img src={pg.images[0]} alt={pg.name} className="w-full h-24 object-cover rounded-lg" />
                  <div className="font-bold text-sm text-slate-900">{pg.name}</div>
                  <div className="text-[#7C3AED] font-bold text-sm">₹{pg.pricePerMonth.toLocaleString()}/mo</div>
                  <div className="text-slate-600">Deposit: ₹{pg.costBreakdown.securityDeposit}</div>
                  <div className="text-slate-600">Food: {pg.foodIncluded ? '✓ 3 Meals' : 'Optional'}</div>
                  <div className="text-slate-600">Category: {pg.category.toUpperCase()}</div>
                  <div className="text-slate-600">Rating: ⭐ {pg.rating}</div>
                  <button
                    onClick={() => {
                      setShowCompareModal(false);
                      onSelectPG(pg);
                    }}
                    className="w-full py-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    View & Book
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
