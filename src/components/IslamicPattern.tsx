import React from 'react';

/**
 * Full-viewport subtle Islamic 8-fold star geometric tessellation backdrop.
 * Low opacity so Arabic Uthmani text maintains high contrast and legibility.
 */
export const IslamicGeometricBackdrop: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Subtle radial sanctuary light */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 75% 55% at 50% 18%, rgba(20, 83, 61, 0.42) 0%, rgba(6, 28, 22, 0.85) 60%, #041410 100%)',
        }}
      />

      {/* Repeating 8-fold Islamic geometric lattice */}
      <svg
        className="h-full w-full opacity-[0.055]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="islamic-khatam-grid"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Outer diamond frame */}
            <path
              d="M60 0 L120 60 L60 120 L0 60 Z"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.7"
            />
            {/* Rub el Hizb / 8-point star */}
            <rect
              x="35"
              y="35"
              width="50"
              height="50"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.8"
            />
            <rect
              x="35"
              y="35"
              width="50"
              height="50"
              transform="rotate(45 60 60)"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.8"
            />
            {/* Inner octagonal star lines */}
            <circle
              cx="60"
              cy="60"
              r="14"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.6"
            />
            {/* Corner interlocking half-stars */}
            <circle
              cx="0"
              cy="0"
              r="18"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.55"
            />
            <circle
              cx="120"
              cy="0"
              r="18"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.55"
            />
            <circle
              cx="0"
              cy="120"
              r="18"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.55"
            />
            <circle
              cx="120"
              cy="120"
              r="18"
              fill="none"
              stroke="#d4af37"
              strokeWidth="0.55"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-khatam-grid)" />
      </svg>
    </div>
  );
};

/**
 * Ornate Islamic filigree headpiece / section divider.
 */
export const IslamicOrnamentDivider: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  return (
    <div
      aria-hidden="true"
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <div className="h-px flex-1 max-w-[110px] bg-gradient-to-l from-[#d4af37]/60 to-transparent" />
      <svg
        width="52"
        height="22"
        viewBox="0 0 52 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-[#d4af37] shrink-0"
      >
        <path
          d="M26 2L29.2 7.8L35 11L29.2 14.2L26 20L22.8 14.2L17 11L22.8 7.8L26 2Z"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="rgba(212,175,55,0.12)"
        />
        <circle cx="26" cy="11" r="2.2" fill="currentColor" />
        <path
          d="M12 11C12 9 9.5 7.5 7 9.5C5 11 2 11 2 11C2 11 5 11 7 12.5C9.5 14.5 12 13 12 11Z"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.75"
        />
        <path
          d="M40 11C40 9 42.5 7.5 45 9.5C47 11 50 11 50 11C50 11 47 11 45 12.5C42.5 14.5 40 13 40 11Z"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.75"
        />
      </svg>
      <div className="h-px flex-1 max-w-[110px] bg-gradient-to-r from-[#d4af37]/60 to-transparent" />
    </div>
  );
};

/**
 * Traditional Mushaf Ayah end rosette ornament containing the Eastern Arabic numeral.
 * Custom SVG guarantees crisp alignment across all mobile and desktop browsers.
 */
export const AyahMarker: React.FC<{ arabicNumber: string }> = ({
  arabicNumber,
}) => {
  return (
    <span
      className="inline-flex items-center justify-center relative align-middle mx-1.5 select-none"
      style={{ width: '1.85em', height: '1.85em' }}
      aria-label={`الآية ${arabicNumber}`}
    >
      <svg
        viewBox="0 0 40 40"
        className="w-full h-full text-[#d4af37]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M20 2.5L23.9 6.7L29.6 5.9L30.8 11.5L36.2 13.7L34.7 19.3L38.3 23.8L34.2 27.9L35.1 33.6L29.5 34.8L27.2 39.2L21.7 37.5L17.2 39.8L13.1 35.7L7.5 36.4L6.3 30.8L1.8 28.4L3.5 22.9L1.2 17.5L5.4 13.5L4.7 7.8L10.3 6.7L12.7 2.2L18.2 3.9L20 2.5Z"
          stroke="currentColor"
          strokeWidth="1.25"
          fill="rgba(212, 175, 55, 0.08)"
        />
        <circle
          cx="20"
          cy="20.5"
          r="11.5"
          stroke="currentColor"
          strokeWidth="0.9"
          opacity="0.7"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[0.58em] font-display-ar font-bold text-[#f0d888] leading-none pt-[2px]">
        {arabicNumber}
      </span>
    </span>
  );
};
