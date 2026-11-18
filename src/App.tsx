/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MotionConfig, motion } from 'motion/react';
import { AudioPlayer } from './components/AudioPlayer';
import {
  IslamicGeometricBackdrop,
  IslamicOrnamentDivider,
} from './components/IslamicPattern';
import { QuranDisplay } from './components/QuranDisplay';
import { SurahHeader } from './components/SurahHeader';

export default function App() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div
        dir="rtl"
        lang="ar"
        className="relative min-h-screen flex flex-col justify-between bg-[#061c16] text-[#f6f2e8]"
      >
        {/* Subtle Islamic geometric pattern backdrop */}
        <IslamicGeometricBackdrop />

        {/* Main Sanctuary Content */}
        <main className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 sm:space-y-8"
          >
            {/* 1. Header */}
            <SurahHeader />

            {/* 2. Real HTML5 Audio Player & Reciter Information */}
            <AudioPlayer onPlaybackStateChange={setIsPlaying} />

            {/* 3. Quran Section (Uthmani Script + Copy & Share) */}
            <QuranDisplay isPlaying={isPlaying} />
          </motion.div>
        </main>

        {/* Quiet Minimal Footer */}
        <footer className="relative z-10 pb-8 pt-2 px-4 text-center">
          <IslamicOrnamentDivider className="mb-4 opacity-70" />
          <p className="text-xs sm:text-sm text-[#8aa095]">
            القرآن الكريم · سورة الفاتحة بالرسم العثماني
          </p>
        </footer>
      </div>
    </MotionConfig>
  );
}
