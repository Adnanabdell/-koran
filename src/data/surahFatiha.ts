export interface Ayah {
  number: number;
  arabicNumber: string;
  textUthmani: string;
}

export const SURAH_METADATA = {
  title: 'سورة الفاتحة',
  subtitle: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  revelationPlace: 'مكية',
  verseCountLabel: '٧ آيات',
  otherName: 'السبع المثاني',
  surahOrder: 'السورة الأولى',
} as const;

export const SURAH_FATIHA_AYAHS: readonly Ayah[] = [
  {
    number: 1,
    arabicNumber: '١',
    textUthmani: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  },
  {
    number: 2,
    arabicNumber: '٢',
    textUthmani: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
  },
  {
    number: 3,
    arabicNumber: '٣',
    textUthmani: 'ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
  },
  {
    number: 4,
    arabicNumber: '٤',
    textUthmani: 'مَٰلِكِ يَوْمِ ٱلدِّينِ',
  },
  {
    number: 5,
    arabicNumber: '٥',
    textUthmani: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
  },
  {
    number: 6,
    arabicNumber: '٦',
    textUthmani: 'ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ',
  },
  {
    number: 7,
    arabicNumber: '٧',
    textUthmani:
      'صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ',
  },
];

export function formatSurahForCopy(): string {
  const verses = SURAH_FATIHA_AYAHS.map(
    (ayah) => `${ayah.textUthmani} ﴿${ayah.arabicNumber}﴾`
  ).join(' ');

  return `${SURAH_METADATA.title}\n${verses}`;
}
