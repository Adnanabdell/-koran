import React from 'react';
import { SURAH_METADATA } from '../data/surahFatiha';
import { IslamicOrnamentDivider } from './IslamicPattern';

export const SurahHeader: React.FC = () => {
  return (
    <header className="text-center pt-6 pb-4 sm:pt-10 sm:pb-6 px-4">
      {/* Top ornamental crown */}
      <IslamicOrnamentDivider className="mb-5 sm:mb-6" />

      {/* Main Surah Title */}
      <h1 className="font-display-ar text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-normal text-[#f6f2e8] leading-tight">
        {SURAH_METADATA.title}
      </h1>

      {/* Basmalah Subtitle */}
      <p className="font-quran text-xl sm:text-2xl text-[#e5c76b] mt-3 sm:mt-4 leading-relaxed">
        {SURAH_METADATA.subtitle}
      </p>

      {/* Clean unboxed typographic metadata (zero-pill discipline) */}
      <div
        className="mt-3 flex items-center justify-center gap-2.5 text-xs sm:text-sm text-[#9cb3a7]"
        aria-label="معلومات السورة"
      >
        <span>{SURAH_METADATA.revelationPlace}</span>
        <span aria-hidden="true" className="text-[#d4af37]/60">
          ·
        </span>
        <span>{SURAH_METADATA.verseCountLabel}</span>
        <span aria-hidden="true" className="text-[#d4af37]/60">
          ·
        </span>
        <span>{SURAH_METADATA.otherName}</span>
      </div>
    </header>
  );
};
