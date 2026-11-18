import React, { useCallback, useState } from 'react';
import { Check, Copy, Minus, Plus, Share2 } from 'lucide-react';
import {
  SURAH_FATIHA_AYAHS,
  formatSurahForCopy,
} from '../data/surahFatiha';
import { AyahMarker } from './IslamicPattern';

interface QuranDisplayProps {
  isPlaying: boolean;
}

const FONT_SIZE_STEPS = [
  { label: 'مريح', className: 'text-[1.45rem] sm:text-[1.75rem] leading-[2.45]' },
  { label: 'متوسط', className: 'text-[1.7rem] sm:text-[2.1rem] leading-[2.5]' },
  { label: 'كبير', className: 'text-[1.95rem] sm:text-[2.45rem] leading-[2.55]' },
] as const;

export const QuranDisplay: React.FC<QuranDisplayProps> = ({ isPlaying }) => {
  const [fontSizeIndex, setFontSizeIndex] = useState(1);
  const [copiedText, setCopiedText] = useState(false);
  const [sharedLink, setSharedLink] = useState(false);

  const handleCopySurah = useCallback(async () => {
    const text = formatSurahForCopy();
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2400);
    } catch {
      // Fallback for older browsers without async clipboard permissions
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2400);
    }
  }, []);

  const handleShareLink = useCallback(async () => {
    const shareUrl = window.location.href;
    const shareData: ShareData = {
      title: 'سورة الفاتحة — تلاوة واستماع',
      text: 'استمع إلى سورة الفاتحة كاملة واقرأ آياتها بالرسم العثماني',
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Ignore user cancellation; fall back to clipboard copy on error
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setSharedLink(true);
      setTimeout(() => setSharedLink(false), 2400);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setSharedLink(true);
      setTimeout(() => setSharedLink(false), 2400);
    }
  }, []);

  const currentFontClass = FONT_SIZE_STEPS[fontSizeIndex].className;

  return (
    <section
      aria-label="نص سورة الفاتحة بالرسم العثماني"
      className="relative rounded-2xl bg-[#09231c]/92 border border-[#d4af37]/30 p-5 sm:p-9 lg:p-11 shadow-[0_24px_60px_rgba(0,0,0,0.42)]"
    >
      {/* Delicate inner Mushaf border */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-2.5 sm:inset-3.5 rounded-xl border transition-colors duration-500 ${
          isPlaying ? 'border-[#d4af37]/35' : 'border-[#d4af37]/15'
        }`}
      />

      {/* Corner ornaments */}
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="pointer-events-none absolute top-4 right-4 h-6 w-6 text-[#d4af37]/45"
        fill="none"
      >
        <path d="M30 2H8C4.686 2 2 4.686 2 8V30" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="pointer-events-none absolute top-4 left-4 h-6 w-6 text-[#d4af37]/45 -scale-x-100"
        fill="none"
      >
        <path d="M30 2H8C4.686 2 2 4.686 2 8V30" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="pointer-events-none absolute bottom-4 right-4 h-6 w-6 text-[#d4af37]/45 -scale-y-100"
        fill="none"
      >
        <path d="M30 2H8C4.686 2 2 4.686 2 8V30" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="pointer-events-none absolute bottom-4 left-4 h-6 w-6 text-[#d4af37]/45 scale-[-1]"
        fill="none"
      >
        <path d="M30 2H8C4.686 2 2 4.686 2 8V30" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="8" r="2" fill="currentColor" />
      </svg>

      {/* Mushaf Verses Body */}
      <div className="relative z-10 py-3 sm:py-4 px-1 sm:px-4">
        <div
          dir="rtl"
          className={`font-quran text-center text-[#f6f2e8] ${currentFontClass} transition-all duration-200`}
        >
          {SURAH_FATIHA_AYAHS.map((ayah) => (
            <span key={ayah.number} className="inline">
              <span>{ayah.textUthmani}</span>
              <AyahMarker arabicNumber={ayah.arabicNumber} />
              {ayah.number < SURAH_FATIHA_AYAHS.length ? ' ' : ''}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom Action Bar: Font Comfort + Copy Surah + Share Link */}
      <div className="relative z-10 mt-6 pt-5 border-t border-[#d4af37]/15 flex flex-wrap items-center justify-between gap-3">
        {/* Font size adjuster */}
        <div
          className="flex items-center gap-1.5"
          role="group"
          aria-label="حجم الخط القرآني"
        >
          <span className="text-xs text-[#9cb3a7] ml-1.5">حجم الخط</span>
          <button
            type="button"
            onClick={() => setFontSizeIndex((prev) => Math.max(0, prev - 1))}
            disabled={fontSizeIndex === 0}
            aria-label="تصغير حجم الخط"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d4af37]/20 bg-[#061c16]/70 text-[#e5c76b] hover:bg-[#d4af37]/15 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Minus className="h-4 w-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() =>
              setFontSizeIndex((prev) =>
                Math.min(FONT_SIZE_STEPS.length - 1, prev + 1)
              )
            }
            disabled={fontSizeIndex === FONT_SIZE_STEPS.length - 1}
            aria-label="تكبير حجم الخط"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#d4af37]/20 bg-[#061c16]/70 text-[#e5c76b] hover:bg-[#d4af37]/15 disabled:opacity-35 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Copy & Share Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopySurah}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d4af37]/25 bg-[#061c16]/70 px-4 py-2 min-h-[42px] text-xs sm:text-sm font-medium text-[#f6f2e8] hover:border-[#d4af37]/50 hover:bg-[#d4af37]/15 transition-colors focus-visible:outline-2 focus-visible:outline-[#d4af37] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {copiedText ? (
              <>
                <Check className="h-4 w-4 text-[#e5c76b]" aria-hidden="true" />
                <span className="text-[#e5c76b]">تم نسخ السورة</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-[#e5c76b]" aria-hidden="true" />
                <span>نسخ السورة</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleShareLink}
            className="inline-flex items-center gap-2 rounded-lg border border-[#d4af37]/25 bg-[#061c16]/70 px-4 py-2 min-h-[42px] text-xs sm:text-sm font-medium text-[#f6f2e8] hover:border-[#d4af37]/50 hover:bg-[#d4af37]/15 transition-colors focus-visible:outline-2 focus-visible:outline-[#d4af37] whitespace-nowrap shrink-0 cursor-pointer"
          >
            {sharedLink ? (
              <>
                <Check className="h-4 w-4 text-[#e5c76b]" aria-hidden="true" />
                <span className="text-[#e5c76b]">تم نسخ الرابط</span>
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 text-[#e5c76b]" aria-hidden="true" />
                <span>مشاركة الموقع</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
