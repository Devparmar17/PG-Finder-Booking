import React from 'react';

interface ApnaPgLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ApnaPgLogo: React.FC<ApnaPgLogoProps> = ({
  className = '',
  showText = true,
  size = 'md',
}) => {
  const pinSize = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {/* Pin with drop shadow */}
      <div className={`relative ${pinSize} flex items-center justify-center`}>
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full drop-shadow-[0_12px_20px_rgba(124,58,237,0.28)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Soft Ellipse Shadow at the base */}
          <ellipse cx="100" cy="232" rx="42" ry="7" fill="#7C3AED" fillOpacity="0.22" />

          {/* Purple Map Pin Body */}
          <path
            d="M100 220C100 220 176 142 176 88C176 46.0264 141.974 12 100 12C58.0264 12 24 46.0264 24 88C24 142 100 220 100 220Z"
            fill="url(#pinGradient)"
          />

          {/* Inner White Circle */}
          <circle cx="100" cy="88" r="48" fill="#FFFFFF" />

          {/* Blue House Roof with Chimney */}
          {/* Chimney */}
          <path d="M125 72V61H133V80L125 72Z" fill="#1D6FE9" />
          {/* Triangular Roof Gable */}
          <path
            d="M100 48L61 80H71L100 56.5L129 80H139L100 48Z"
            fill="#1D6FE9"
          />

          {/* 4-Pane Blue Window */}
          {/* Top-Left */}
          <rect x="84" y="74" width="13" height="13" rx="1.5" fill="#1D6FE9" />
          {/* Top-Right */}
          <rect x="103" y="74" width="13" height="13" rx="1.5" fill="#1D6FE9" />
          {/* Bottom-Left */}
          <rect x="84" y="91" width="13" height="13" rx="1.5" fill="#1D6FE9" />
          {/* Bottom-Right */}
          <rect x="103" y="91" width="13" height="13" rx="1.5" fill="#1D6FE9" />

          {/* Gradients */}
          <defs>
            <linearGradient
              id="pinGradient"
              x1="24"
              y1="12"
              x2="176"
              y2="220"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#8B5CF6" />
              <stop offset="0.6" stopColor="#7C3AED" />
              <stop offset="1" stopColor="#6D28D9" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col items-center mt-2">
          {/* Purple Accent Line */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent rounded-full mb-1" />
          {/* APNA PG Text */}
          <span className="text-sm font-black tracking-wider text-[#1D6FE9] uppercase">
            APNA PG
          </span>
        </div>
      )}
    </div>
  );
};
