import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  RotateCcw,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { SURAH_FATIHA_AUDIO_CONFIG } from '../config/audio';

interface AudioPlayerProps {
  onPlaybackStateChange?: (isPlaying: boolean) => void;
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '00:00';
  }
  const totalSeconds = Math.floor(seconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  onPlaybackStateChange,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isSeekingRef = useRef(false);

  const { audioSources, reciter } = SURAH_FATIHA_AUDIO_CONFIG;

  const [sourceIndex, setSourceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMetadataReady, setIsMetadataReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeSourceUrl = audioSources[sourceIndex] ?? '';

  // Notify parent when playback state changes
  useEffect(() => {
    onPlaybackStateChange?.(isPlaying);
  }, [isPlaying, onPlaybackStateChange]);

  // Sync volume and mute to the underlying HTMLAudioElement
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Integrate Media Session API for mobile lock-screen and notification controls
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title: 'سورة الفاتحة',
      artist: reciter.nameAr,
      album: 'القرآن الكريم',
    });

    const handleMediaPlay = () => {
      const audio = audioRef.current;
      if (audio) {
        audio.play().catch(() => {});
      }
    };

    const handleMediaPause = () => {
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
      }
    };

    const handleMediaSeek = (details: MediaSessionActionDetails) => {
      const audio = audioRef.current;
      if (audio && typeof details.seekTime === 'number') {
        audio.currentTime = details.seekTime;
        setCurrentTime(details.seekTime);
      }
    };

    try {
      navigator.mediaSession.setActionHandler('play', handleMediaPlay);
      navigator.mediaSession.setActionHandler('pause', handleMediaPause);
      navigator.mediaSession.setActionHandler('seekto', handleMediaSeek);
    } catch {
      // Some browsers restrict specific mediaSession action handlers
    }

    return () => {
      try {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('seekto', null);
      } catch {
        // Ignore cleanup errors
      }
    };
  }, [reciter.nameAr]);

  const startPlayback = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    setErrorMessage(null);
    setHasCompleted(false);

    // Show loading state if audio data isn't ready yet
    if (audio.readyState < 2) {
      setIsLoading(true);
    }

    try {
      await audio.play();
    } catch (err) {
      setIsLoading(false);
      setIsPlaying(false);
      // Distinguish user-aborted or autoplay rejection vs genuine source failure
      const errorName = err instanceof Error ? err.name : '';
      if (errorName === 'NotAllowedError') {
        setErrorMessage(
          'يرجى الضغط على زر التشغيل لبدء التلاوة على هذا المتصفح.'
        );
      } else if (errorName !== 'AbortError') {
        setErrorMessage(
          'تعذر تشغيل ملف التلاوة. يرجى التحقق من الاتصال والمحاولة مرة أخرى.'
        );
      }
    }
  }, []);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    // If playback reached the end, restart cleanly from 0
    if (hasCompleted || (duration > 0 && audio.currentTime >= duration - 0.25)) {
      audio.currentTime = 0;
      setCurrentTime(0);
    }

    void startPlayback();
  }, [isPlaying, hasCompleted, duration, startPlayback]);

  const handleReplay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setHasCompleted(false);
    setErrorMessage(null);
    audio.currentTime = 0;
    setCurrentTime(0);
    void startPlayback();
  }, [startPlayback]);

  const handleRetryLoad = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setErrorMessage(null);
    setHasCompleted(false);
    setIsLoading(true);
    setSourceIndex(0);

    // Synchronously update src & call load/play inside user gesture for iOS Safari
    audio.src = audioSources[0];
    audio.load();
    void startPlayback();
  }, [audioSources, startPlayback]);

  const handleSeekInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextTime = parseFloat(e.target.value);
      setCurrentTime(nextTime);
      setHasCompleted(false);

      const audio = audioRef.current;
      if (audio && Number.isFinite(nextTime)) {
        audio.currentTime = nextTime;
      }
    },
    []
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const nextVol = parseFloat(e.target.value);
      setVolume(nextVol);
      if (nextVol > 0 && isMuted) {
        setIsMuted(false);
      } else if (nextVol === 0) {
        setIsMuted(true);
      }
    },
    [isMuted]
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  // HTML5 Audio event handlers
  const handleLoadStart = () => {
    if (isPlaying) {
      setIsLoading(true);
    }
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration);
    }
    setIsMetadataReady(true);
    setIsLoading(false);
    setErrorMessage(null);
  };

  const handleCanPlay = () => {
    setIsLoading(false);
    setErrorMessage(null);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handlePlayEvent = () => {
    setIsPlaying(true);
    setHasCompleted(false);
    setErrorMessage(null);
  };

  const handlePlayingEvent = () => {
    setIsPlaying(true);
    setIsLoading(false);
    setErrorMessage(null);
  };

  const handlePauseEvent = () => {
    setIsPlaying(false);
    setIsLoading(false);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || isSeekingRef.current) return;
    setCurrentTime(audio.currentTime);
    if (
      Number.isFinite(audio.duration) &&
      audio.duration > 0 &&
      audio.duration !== duration
    ) {
      setDuration(audio.duration);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setIsLoading(false);
    setHasCompleted(true);
    if (duration > 0) {
      setCurrentTime(duration);
    }
  };

  const handleAudioError = () => {
    setIsPlaying(false);

    // Automatically fall back to verified backup source before showing an error
    if (sourceIndex + 1 < audioSources.length) {
      const nextIndex = sourceIndex + 1;
      setSourceIndex(nextIndex);
      setIsLoading(true);
      const audio = audioRef.current;
      if (audio) {
        audio.src = audioSources[nextIndex];
        audio.load();
      }
      return;
    }

    setIsLoading(false);
    setErrorMessage(
      'تعذر تحميل التلاوة الصوتية حالياً. يرجى التأكد من اتصالك بالإنترنت ثم الضغط على إعادة المحاولة.'
    );
  };

  const progressPercent =
    duration > 0 ? Math.min(100, Math.max(0, (currentTime / duration) * 100)) : 0;

  const effectiveVolume = isMuted ? 0 : volume;
  const volumePercent = Math.round(effectiveVolume * 100);

  return (
    <section
      aria-label="مشغل تلاوة سورة الفاتحة"
      className="relative rounded-2xl bg-[#0a271f]/90 border border-[#d4af37]/25 shadow-[0_20px_50px_rgba(0,0,0,0.45)] backdrop-blur-sm p-5 sm:p-7"
    >
      {/* Real HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={activeSourceUrl}
        preload="metadata"
        playsInline
        onLoadStart={handleLoadStart}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onPlay={handlePlayEvent}
        onPlaying={handlePlayingEvent}
        onPause={handlePauseEvent}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onError={handleAudioError}
      />

      {/* Reciter Profile Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#d4af37]/15">
        <div className="flex items-center gap-3.5 min-w-0">
          {/* Geometric calligraphic monogram emblem */}
          <div
            aria-hidden="true"
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#061c16] border border-[#d4af37]/45 text-[#e5c76b]"
          >
            <svg
              viewBox="0 0 48 48"
              className="absolute inset-0 h-full w-full opacity-35"
              fill="none"
            >
              <rect
                x="9"
                y="9"
                width="30"
                height="30"
                transform="rotate(45 24 24)"
                stroke="#d4af37"
                strokeWidth="0.9"
              />
            </svg>
            <span className="font-display-ar text-xl font-bold relative z-10 leading-none">
              {reciter.monogram}
            </span>
          </div>

          <div className="min-w-0">
            <h2 className="font-display-ar text-lg sm:text-xl font-bold text-[#f6f2e8] truncate">
              {reciter.nameAr}
            </h2>
            <p className="text-xs sm:text-sm text-[#9cb3a7] mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              <span>{reciter.riwayahAr}</span>
              <span aria-hidden="true" className="text-[#d4af37]/60">
                ·
              </span>
              <span>{reciter.styleAr}</span>
            </p>
          </div>
        </div>

        {/* Replay button (always accessible) */}
        <button
          type="button"
          onClick={handleReplay}
          className="inline-flex items-center gap-2 rounded-lg border border-[#d4af37]/25 bg-[#061c16]/70 px-3.5 py-2 min-h-[40px] text-xs sm:text-sm font-medium text-[#e5c76b] hover:bg-[#d4af37]/15 hover:border-[#d4af37]/50 transition-colors focus-visible:outline-2 focus-visible:outline-[#d4af37] focus-visible:outline-offset-2 whitespace-nowrap shrink-0 cursor-pointer"
          aria-label="إعادة تشغيل السورة من البداية"
        >
          <RotateCcw className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>إعادة التشغيل</span>
        </button>
      </div>

      {/* Main Audio Controls Area */}
      <div className="pt-5">
        {/* Progress Scrubber & Time Readout (LTR timeline for universal scrub consistency) */}
        <div className="space-y-2">
          <div dir="ltr" className="relative flex items-center h-7">
            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : 100}
              step={0.1}
              value={duration > 0 ? currentTime : 0}
              disabled={!isMetadataReady && !duration}
              onPointerDown={() => {
                isSeekingRef.current = true;
              }}
              onPointerUp={() => {
                isSeekingRef.current = false;
              }}
              onPointerCancel={() => {
                isSeekingRef.current = false;
              }}
              onTouchEnd={() => {
                isSeekingRef.current = false;
              }}
              onBlur={() => {
                isSeekingRef.current = false;
              }}
              onChange={handleSeekInput}
              aria-label="شريط التقدم الصوتي"
              className="emerald-slider w-full relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #d4af37 0%, #e5c76b ${progressPercent}%, rgba(212, 175, 55, 0.18) ${progressPercent}%, rgba(212, 175, 55, 0.18) 100%)`,
                height: '6px',
                borderRadius: '9999px',
              }}
            />
          </div>

          <div
            dir="ltr"
            className="flex items-center justify-between text-xs sm:text-sm text-[#a6bbb0] tabular-nums"
          >
            <span aria-label="الوقت الحالي">{formatTime(currentTime)}</span>
            <span aria-label="المدة الإجمالية">
              {duration > 0 ? formatTime(duration) : '--:--'}
            </span>
          </div>
        </div>

        {/* Primary Play/Pause Button + Loading State + Volume Controls */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          {/* Play / Pause + Live Status Label */}
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل التلاوة'}
              className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#e5c76b] to-[#c79d2b] text-[#061c16] shadow-[0_6px_24px_rgba(212,175,55,0.32)] hover:brightness-105 active:scale-95 transition-all duration-150 focus-visible:outline-2 focus-visible:outline-[#f6f2e8] focus-visible:outline-offset-3 cursor-pointer"
            >
              {isLoading ? (
                <Loader2
                  className="h-6 w-6 animate-spin"
                  aria-hidden="true"
                />
              ) : isPlaying ? (
                <Pause className="h-6 w-6 fill-current" aria-hidden="true" />
              ) : (
                <Play
                  className="h-6 w-6 fill-current -translate-x-[1px]"
                  aria-hidden="true"
                />
              )}
            </button>

            <div className="text-sm">
              {isLoading ? (
                <p className="text-[#e5c76b] font-medium flex items-center gap-2">
                  <span>جارٍ تحميل التلاوة...</span>
                </p>
              ) : isPlaying ? (
                <p className="text-[#f6f2e8] font-medium">
                  جاري تشغيل التلاوة
                </p>
              ) : hasCompleted ? (
                <p className="text-[#e5c76b] font-medium">
                  اكتملت التلاوة المباركة
                </p>
              ) : (
                <p className="text-[#d4dfd9] font-medium">
                  اضغط للاستماع إلى السورة كاملة
                </p>
              )}
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2.5 bg-[#061c16]/65 border border-[#d4af37]/15 rounded-xl px-3 py-1.5">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'إلغاء كتم الصوت' : 'كتم الصوت'}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[#e5c76b] hover:bg-[#d4af37]/15 transition-colors focus-visible:outline-2 focus-visible:outline-[#d4af37] cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" aria-hidden="true" />
              ) : volume < 0.5 ? (
                <Volume1 className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Volume2 className="h-5 w-5" aria-hidden="true" />
              )}
            </button>

            <div dir="ltr" className="flex items-center w-24 sm:w-28">
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={effectiveVolume}
                onChange={handleVolumeChange}
                aria-label="مستوى الصوت"
                className="emerald-slider w-full"
                style={{
                  background: `linear-gradient(to right, #d4af37 0%, #e5c76b ${volumePercent}%, rgba(212, 175, 55, 0.18) ${volumePercent}%, rgba(212, 175, 55, 0.18) 100%)`,
                  height: '5px',
                  borderRadius: '9999px',
                }}
              />
            </div>
          </div>
        </div>

        {/* Clear Error Message Banner */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              role="alert"
              className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-400/35 bg-amber-950/45 px-4 py-3 text-sm text-amber-100"
            >
              <div className="flex items-start sm:items-center gap-2.5">
                <AlertCircle
                  className="h-5 w-5 text-amber-300 shrink-0 mt-0.5 sm:mt-0"
                  aria-hidden="true"
                />
                <span>{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={handleRetryLoad}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-amber-400/20 border border-amber-300/40 px-3.5 py-2 text-xs font-medium text-amber-100 hover:bg-amber-400/30 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>إعادة المحاولة</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion Animation Banner */}
        <AnimatePresence>
          {hasCompleted && !errorMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 relative overflow-hidden rounded-xl border border-[#d4af37]/40 bg-gradient-to-b from-[#113a2e] to-[#08221b] p-5 text-center"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.18), transparent 70%)',
                }}
              />

              <motion.div
                initial={{ rotate: -25, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="mx-auto mb-2.5 flex h-11 w-11 items-center justify-center"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 48 48"
                  className="h-11 w-11 text-[#e5c76b]"
                  fill="none"
                >
                  <path
                    d="M24 4L29.5 18.5L44 24L29.5 29.5L24 44L18.5 29.5L4 24L18.5 18.5L24 4Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="rgba(212,175,55,0.14)"
                  />
                  <rect
                    x="14"
                    y="14"
                    width="20"
                    height="20"
                    transform="rotate(45 24 24)"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                  <circle cx="24" cy="24" r="3.5" fill="currentColor" />
                </svg>
              </motion.div>

              <p className="font-quran text-2xl text-[#e5c76b] relative z-10">
                صَدَقَ اللَّهُ الْعَظِيمُ
              </p>
              <p className="text-sm text-[#c7d6ce] mt-1 relative z-10">
                تمت تلاوة سورة الفاتحة كاملة بفضل الله
              </p>

              <div className="mt-4 relative z-10">
                <button
                  type="button"
                  onClick={handleReplay}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#d4af37] px-4 py-2 min-h-[40px] text-sm font-semibold text-[#061c16] hover:bg-[#e5c76b] transition-colors focus-visible:outline-2 focus-visible:outline-[#f6f2e8] cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span>إعادة الاستماع</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
