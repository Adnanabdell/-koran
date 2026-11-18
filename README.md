# سورة الفاتحة — تلاوة واستماع (Surah Al-Fatiha Audio & Mushaf Web App)

A minimalist, responsive Arabic RTL web application dedicated to reading **Surah Al-Fatiha** in authentic Uthmani script and listening to the complete recitation via the HTML5 Audio API.

## Features

- **Authentic Uthmani Text**: All 7 verses of Surah Al-Fatiha with custom SVG Ayah rosette markers (`١`–`٧`) and adjustable reading size.
- **Real HTML5 Audio Player**:
  - Play / Pause, interactive seekable progress bar, current & total duration (`MM:SS`), volume slider & mute toggle, and Replay button.
  - Loading indicator while buffering and clear Arabic error banner with Retry action if playback fails.
  - Verified complete Surah Al-Fatiha recitation by **Sheikh Mishary Rashid Alafasy** (`Hafs 'an 'Asim`, ~52 seconds) from MP3Quran CDN with automatic fallback to Islamic Network CDN.
  - Mobile lock-screen integration via the browser Media Session API.
- **Additional Tools**: Copy full Surah text, share website link (native Share Sheet on mobile / clipboard fallback on desktop), and peaceful completion animation when the recitation finishes.
- **Zero Backend Required**: Pure static Vite + React + TypeScript application ready for instant deployment on Vercel.

---

## Configurable Audio URL

All audio sources and reciter metadata are centralized in **`src/config/audio.ts`**:

```ts
export const PRIMARY_AUDIO_URL =
  'https://cdn.mp3quran.net/audio/mishary-alafasy/r1/001.mp3';

export const FALLBACK_AUDIO_URL =
  'https://cdn.islamic.network/quran/audio-surah/128/ar.alafasy/1.mp3';
```

To use your own MP3 file later, either replace `PRIMARY_AUDIO_URL` with your HTTPS URL or place an MP3 file in `public/audio/fatiha.mp3` and set `PRIMARY_AUDIO_URL = '/audio/fatiha.mp3'`.

---

## Run Locally

### Prerequisites
- Node.js 18+ and npm

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Start the development server (runs on http://localhost:3000)
npm run dev
```

To test a production build locally:
```bash
npm run build
npm run preview
```

---

## Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)
1. Push this project to a GitHub, GitLab, or Bitbucket repository.
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository.
3. Vercel automatically detects **Vite** (configured in `vercel.json`):
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Click **Deploy**. Your public HTTPS URL will be live in seconds and works on both desktop and mobile browsers.

### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy to production
vercel --prod
```
