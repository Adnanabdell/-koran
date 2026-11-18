/**
 * Surah Al-Fatiha Audio Configuration
 *
 * Easily change `primaryUrl` (or `fallbackUrl`) below if you ever want to
 * swap to another MP3 file or a local bundled asset (e.g. '/audio/fatiha.mp3').
 *
 * Verified live endpoints:
 * - Primary: MP3Quran official CDN (Mishary Rashid Alafasy, Rewayat Hafs 'An 'Assem, ~51.9s complete Surah)
 * - Fallback: Islamic Network CDN (Mishary Rashid Alafasy, 128kbps MP3, ~51.9s complete Surah)
 */
export const PRIMARY_AUDIO_URL =
  'https://cdn.mp3quran.net/audio/mishary-alafasy/r1/001.mp3';

export const FALLBACK_AUDIO_URL =
  'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3';

export interface ReciterProfile {
  nameAr: string;
  monogram: string;
  riwayahAr: string;
  styleAr: string;
  sourceNameAr: string;
}

export interface SurahAudioConfig {
  audioSources: readonly string[];
  reciter: ReciterProfile;
}

export const SURAH_FATIHA_AUDIO_CONFIG: SurahAudioConfig = {
  audioSources: [PRIMARY_AUDIO_URL, FALLBACK_AUDIO_URL],
  reciter: {
    nameAr: 'الشيخ مشاري راشد العفاسي',
    monogram: 'م',
    riwayahAr: 'رواية حفص عن عاصم',
    styleAr: 'تلاوة مرتلة كاملة',
    sourceNameAr: 'مصحف MP3Quran المعتمد',
  },
};
