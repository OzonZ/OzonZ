/**
 * Web Audio API & HTML5 Audio Hybrid Engine
 * - Main Track: "A Slow Turn of the Page" (public/audio/bgm-main.mp3 or A_Slow_Turn_of_the_Page.mp3)
 * - Postcard Track: "Dept - Strawberry Champagne" (public/audio/bgm-postcard.mp3 or Dept- Strawberry Champagne Official lyrics video.mp3)
 * - Always-on Autoplay on initial website load (with graceful unlock on first touch/scroll/click)
 * - Automatic permanent switch to Postcard Track once Postcard is viewed
 * - Smooth 1.75-second crossfade (plays second track first and fades in over 1.75s, fades out first track)
 * - Graceful fallback to Web Audio API synthesizer if MP3s fail to load
 * - Multiple SFX presets (pop, rustle, chime, flip, whoosh, sparkle)
 */

let audioCtx = null;
let isMuted = false;
let isBgmPlaying = true; // Always ON by default when opening website
let currentTrack = 'main'; // 'main' | 'postcard'
let hasSwitchedToPostcard = false;
let userManuallyPaused = false;
let autoplayAttempted = false;

const BGM_TARGET_VOLUME = 0.50; // 50% volume
export const FADE_DURATION_MS = 1750; // 1.75 seconds

// HTML5 Audio instances for custom MP3s
let mainAudioEl = null;
let postcardAudioEl = null;
let usingHtmlAudio = false;
let activeFadeRaf = null;

// Synthesizer variables
let bgmIntervalId = null;
let bgmStep = 0;

// Track Information for UI
export const TRACK_INFO = {
  main: {
    title: 'A Slow Turn of the Page',
    artist: 'Until Then OST',
  },
  postcard: {
    title: 'Dept - Strawberry Champagne',
    artist: 'Dept',
  },
};

// ─── Musical Notes Frequency Map (Synth Fallback) ───────────────────────────
const NOTES = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50,
};

const MELODY_MAIN = [
  NOTES.E5, NOTES.D5, NOTES.C5, NOTES.D5,
  NOTES.E5, NOTES.E5, NOTES.E5, NOTES.G5,
  NOTES.D5, NOTES.D5, NOTES.D5, NOTES.D5,
  NOTES.E5, NOTES.G5, NOTES.G5, NOTES.G5,
  NOTES.E5, NOTES.D5, NOTES.C5, NOTES.D5,
  NOTES.E5, NOTES.E5, NOTES.E5, NOTES.E5,
  NOTES.D5, NOTES.D5, NOTES.E5, NOTES.D5,
  NOTES.C5, NOTES.C5, NOTES.C5, NOTES.C5,
];

const MELODY_POSTCARD = [
  NOTES.C4, NOTES.E4, NOTES.G4, NOTES.C5,
  NOTES.B4, NOTES.G4, NOTES.E4, NOTES.G4,
  NOTES.A4, NOTES.C5, NOTES.E5, NOTES.D5,
  NOTES.G4, NOTES.B4, NOTES.D5, NOTES.C5,
  NOTES.F4, NOTES.A4, NOTES.C5, NOTES.E5,
  NOTES.E4, NOTES.G4, NOTES.B4, NOTES.D5,
  NOTES.D4, NOTES.F4, NOTES.A4, NOTES.C5,
  NOTES.G3, NOTES.B3, NOTES.D4, NOTES.G4,
];

// Listeners for UI state updates
const stateListeners = new Set();

function notifyListeners() {
  stateListeners.forEach((fn) =>
    fn({
      isBgmPlaying,
      currentTrack,
      isMuted,
      trackInfo: TRACK_INFO[currentTrack],
      usingHtmlAudio,
      hasSwitchedToPostcard,
    })
  );
}

export function subscribeAudioState(fn) {
  stateListeners.add(fn);
  fn({
    isBgmPlaying,
    currentTrack,
    isMuted,
    trackInfo: TRACK_INFO[currentTrack],
    usingHtmlAudio,
    hasSwitchedToPostcard,
  });
  return () => stateListeners.delete(fn);
}

// ─── Initialize Audio Context ────────────────────────────────────────────────
function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

// ─── Synthesizer Play Tone ───────────────────────────────────────────────────
function playTone(freq, duration, type = 'triangle', gainVal = 0.08) {
  if (!audioCtx || isMuted) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (_) {}
}

// ─── MP3 Track Setup (Resolves relative to base URL) ─────────────────────────
const BASE_URL = import.meta.env.BASE_URL || '/';
const cleanBase = BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`;

const MP3_PATHS = {
  main: [
    `${cleanBase}audio/bgm-main.mp3`,
    `${cleanBase}audio/A_Slow_Turn_of_the_Page.mp3`,
    './audio/bgm-main.mp3',
    './audio/A_Slow_Turn_of_the_Page.mp3',
    '/audio/bgm-main.mp3',
  ],
  postcard: [
    `${cleanBase}audio/bgm-postcard.mp3`,
    `${cleanBase}audio/Dept-%20Strawberry%20Champagne%20Official%20lyrics%20video.mp3`,
    './audio/bgm-postcard.mp3',
    './audio/Dept-%20Strawberry%20Champagne%20Official%20lyrics%20video.mp3',
    '/audio/bgm-postcard.mp3',
  ],
};

function tryCreateAudioElement(paths) {
  const audio = new Audio();
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = BGM_TARGET_VOLUME;
  let pathIndex = 0;

  audio.src = paths[pathIndex];
  audio.load();

  audio.onerror = () => {
    pathIndex++;
    if (pathIndex < paths.length) {
      audio.src = paths[pathIndex];
      audio.load();
    }
  };
  return audio;
}

try {
  mainAudioEl = tryCreateAudioElement(MP3_PATHS.main);
  postcardAudioEl = tryCreateAudioElement(MP3_PATHS.postcard);
} catch (_) {}

// ─── Fading Helpers ──────────────────────────────────────────────────────────
function cancelActiveFade() {
  if (activeFadeRaf) {
    cancelAnimationFrame(activeFadeRaf);
    activeFadeRaf = null;
  }
}

/**
 * Crossfades smoothly from fromAudio to toAudio over durationMs (1.75s).
 * Starts toAudio immediately at volume 0 and ramps up to 0.65,
 * while fromAudio simultaneously fades out from its current volume to 0.
 */
function crossFadeHtmlAudio(fromAudio, toAudio, durationMs = FADE_DURATION_MS) {
  cancelActiveFade();
  initAudio();

  const fromEl = fromAudio;
  const toEl = toAudio;

  if (!toEl) return;

  // Start target track at 0 volume and play immediately
  toEl.volume = 0;
  if (!isMuted) {
    const playPromise = toEl.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          usingHtmlAudio = true;
          notifyListeners();
        })
        .catch((err) => {
          console.warn('Audio play error, using fallback:', err);
          usingHtmlAudio = false;
          startSynthBgm(currentTrack);
        });
    }
  }

  const fromWasPlaying = fromEl && !fromEl.paused;
  const startFromVol = fromWasPlaying ? fromEl.volume : BGM_TARGET_VOLUME;
  const startTime = performance.now();

  function fadeStep(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / durationMs);

    // Target track fades in (0 -> 0.65)
    if (toEl && !isMuted) {
      toEl.volume = Math.min(BGM_TARGET_VOLUME, progress * BGM_TARGET_VOLUME);
    }

    // Previous track fades out (startFromVol -> 0)
    if (fromEl && fromWasPlaying) {
      fromEl.volume = Math.max(0, (1 - progress) * startFromVol);
    }

    if (progress < 1) {
      activeFadeRaf = requestAnimationFrame(fadeStep);
    } else {
      activeFadeRaf = null;
      if (toEl && !isMuted) {
        toEl.volume = BGM_TARGET_VOLUME;
      }
      if (fromEl) {
        try {
          fromEl.pause();
          fromEl.currentTime = 0;
          fromEl.volume = BGM_TARGET_VOLUME;
        } catch (_) {}
      }
      notifyListeners();
    }
  }

  activeFadeRaf = requestAnimationFrame(fadeStep);
}

// ─── BGM Controls ─────────────────────────────────────────────────────────────
export function startBgm(track = currentTrack, { fadeDuration = 0 } = {}) {
  initAudio();
  currentTrack = track;
  isBgmPlaying = true;
  userManuallyPaused = false;
  stopSynthBgm();

  const targetAudio = track === 'postcard' ? postcardAudioEl : mainAudioEl;
  const otherAudio = track === 'postcard' ? mainAudioEl : postcardAudioEl;

  if (fadeDuration > 0 && targetAudio) {
    crossFadeHtmlAudio(otherAudio, targetAudio, fadeDuration);
  } else {
    cancelActiveFade();
    if (otherAudio) {
      try {
        otherAudio.pause();
        otherAudio.currentTime = 0;
        otherAudio.volume = BGM_TARGET_VOLUME;
      } catch (_) {}
    }

    if (targetAudio && targetAudio.src && !isMuted) {
      targetAudio.volume = BGM_TARGET_VOLUME;
      const playPromise = targetAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            usingHtmlAudio = true;
            notifyListeners();
          })
          .catch(() => {
            usingHtmlAudio = false;
            startSynthBgm(track);
          });
      }
    } else {
      startSynthBgm(track);
    }
  }
  notifyListeners();
}

function startSynthBgm(track = 'main') {
  stopSynthBgm();
  const melody = track === 'postcard' ? MELODY_POSTCARD : MELODY_MAIN;
  const speed = track === 'postcard' ? 440 : 360;
  const oscType = track === 'postcard' ? 'sine' : 'triangle';

  bgmStep = 0;
  bgmIntervalId = setInterval(() => {
    if (isMuted) return;
    const note = melody[bgmStep % melody.length];
    playTone(note, (speed / 1000) * 0.9, oscType, track === 'postcard' ? 0.07 : 0.06);
    if (bgmStep % 2 === 0) {
      playTone(note / 2, (speed / 1000) * 1.5, 'sine', 0.03);
    }
    bgmStep++;
  }, speed);
}

function stopSynthBgm() {
  if (bgmIntervalId) {
    clearInterval(bgmIntervalId);
    bgmIntervalId = null;
  }
}

export function stopBgm() {
  userManuallyPaused = true;
  cancelActiveFade();
  isBgmPlaying = false;
  stopSynthBgm();
  if (mainAudioEl) {
    try { mainAudioEl.pause(); } catch (_) {}
  }
  if (postcardAudioEl) {
    try { postcardAudioEl.pause(); } catch (_) {}
  }
  notifyListeners();
}

export function toggleBgm() {
  if (isBgmPlaying) {
    stopBgm();
    return false;
  } else {
    userManuallyPaused = false;
    startBgm(currentTrack, { fadeDuration: FADE_DURATION_MS });
    return true;
  }
}

/**
 * Switch permanently to Postcard track ("Dept - Strawberry Champagne")
 * Plays the second music immediately and fades it in over 1.75 seconds while fading out the first track.
 */
export function triggerPostcardMusicPermanent(fadeDuration = FADE_DURATION_MS) {
  hasSwitchedToPostcard = true;
  currentTrack = 'postcard';
  isBgmPlaying = true;
  userManuallyPaused = false;
  startBgm('postcard', { fadeDuration });
  notifyListeners();
}

export function switchBgmTrack(trackName, fadeDuration = FADE_DURATION_MS) {
  if (hasSwitchedToPostcard && trackName === 'main') {
    return;
  }
  currentTrack = trackName;
  if (isBgmPlaying) {
    startBgm(trackName, { fadeDuration });
  } else {
    notifyListeners();
  }
}

export function isBgmOn() {
  return isBgmPlaying;
}

export function getCurrentTrack() {
  return currentTrack;
}

// ─── Autoplay Initialization on Website Open ─────────────────────────────────
export function initAutoplay() {
  if (userManuallyPaused) return;
  autoplayAttempted = true;
  isBgmPlaying = true;
  notifyListeners();

  // 1. Try immediate playback (works if browser allows or user visited before)
  startBgm(currentTrack, { fadeDuration: FADE_DURATION_MS });

  // 2. Global gesture unlocker (triggers on first click, tap, or touch anywhere)
  const unlockAudio = () => {
    if (userManuallyPaused) return;
    initAudio();
    const activeEl = currentTrack === 'postcard' ? postcardAudioEl : mainAudioEl;
    if (activeEl) {
      activeEl.volume = BGM_TARGET_VOLUME;
      const promise = activeEl.play();
      if (promise !== undefined) {
        promise
          .then(() => {
            usingHtmlAudio = true;
            isBgmPlaying = true;
            notifyListeners();
          })
          .catch(() => {});
      }
    }
  };

  if (typeof window !== 'undefined') {
    const events = ['click', 'pointerdown', 'touchstart', 'touchend', 'keydown', 'scroll'];
    events.forEach((evt) => {
      window.addEventListener(evt, unlockAudio, { capture: true, passive: true, once: true });
      document.addEventListener(evt, unlockAudio, { capture: true, passive: true, once: true });
    });
  }
}

// Auto-trigger on script load if window is available
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initAutoplay, 100);
  } else {
    window.addEventListener('DOMContentLoaded', () => setTimeout(initAutoplay, 100));
  }
}

// ─── SFX Presets ─────────────────────────────────────────────────────────────
export function sfxPop() {
  initAudio();
  playTone(880, 0.12, 'sine', 0.14);
  setTimeout(() => playTone(1100, 0.08, 'sine', 0.1), 50);
}

export function sfxWhoosh() {
  initAudio();
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(650, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, audioCtx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.09, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.25);
  } catch (_) {}
}

export function sfxChime() {
  initAudio();
  [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 0.5, 'triangle', 0.08), idx * 85);
  });
}

export function sfxRustle() {
  initAudio();
  if (!audioCtx) return;
  try {
    const bufferSize = Math.floor(audioCtx.sampleRate * 0.18);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  } catch (_) {}
}

export function sfxFlip() {
  initAudio();
  playTone(440, 0.06, 'square', 0.06);
  setTimeout(() => playTone(660, 0.06, 'square', 0.06), 75);
  setTimeout(() => playTone(880, 0.12, 'triangle', 0.08), 150);
}

export function sfxSparkle() {
  initAudio();
  [783.99, 880.00, 1046.50, 1318.51].forEach((freq, idx) => {
    setTimeout(() => playTone(freq, 0.25, 'sine', 0.06), idx * 60);
  });
}
