import React, { useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidthClass?: string; // default sm:max-w-lg lg:max-w-xl
  triggerRef?: React.RefObject<HTMLElement | null>;
  confirmDiscardOnClose?: boolean;
  onConfirmDiscard?: () => void;
  ariaDescribedBy?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidthClass = 'sm:max-w-lg lg:max-w-xl',
  triggerRef,
  confirmDiscardOnClose,
  onConfirmDiscard,
  ariaDescribedBy,
}) => {
  const headingId = useId();
  const sheetRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const scrollPosRef = useRef<number>(0);

  // Focus trapping and keyboard management
  useEffect(() => {
    if (!isOpen) return;

    // Save scroll position and lock body scroll
    scrollPosRef.current = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    document.body.style.overflow = 'hidden';
    document.body.style.top = `-${scrollPosRef.current}px`;
    document.body.style.width = '100%';

    // Focus heading on open
    const timer = setTimeout(() => {
      if (headingRef.current) {
        headingRef.current.focus();
      }
    }, 50);

    // Escape listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleRequestClose();
        return;
      }

      if (e.key === 'Tab' && sheetRef.current) {
        const focusableElements = sheetRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = (Array.from(focusableElements) as HTMLElement[]).filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
        );

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === headingRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollPosRef.current);

      // Return focus to trigger
      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
    };
  }, [isOpen]);

  const handleRequestClose = () => {
    if (confirmDiscardOnClose && onConfirmDiscard) {
      onConfirmDiscard();
    } else {
      onClose();
    }
  };

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-200 motion-reduce:transition-none"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleRequestClose();
        }
      }}
      role="presentation"
    >
      <div
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        aria-describedby={ariaDescribedBy}
        className={`w-full ${maxWidthClass} max-h-[88dvh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden z-60 animate-in slide-in-from-bottom duration-250 ease-out sm:zoom-in-95 motion-reduce:animate-none`}
      >
        {/* Mobile drag handle indicator */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mt-3 mb-1 sm:hidden shrink-0" />

        {/* Sheet Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 shrink-0">
          <div className="flex-1 pr-4">
            <h2
              ref={headingRef}
              id={headingId}
              tabIndex={-1}
              className="text-lg sm:text-xl font-black text-slate-900 tracking-tight outline-none"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={handleRequestClose}
            aria-label="Close dialog"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sheet Body with Scroll */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 sm:px-6 py-4 focus:outline-none">
          {children}
        </div>

        {/* Sticky Action Footer with Safe-Area Padding */}
        {footer && (
          <div className="border-t border-slate-100 px-5 sm:px-6 py-3.5 bg-slate-50/90 backdrop-blur-xs shrink-0 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))]">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
