/**
 * Web Audio API & HTML5 Audio Hybrid Engine
 * - Supports custom MP3 files in public/audio/ (bgm-main.mp3 & bgm-postcard.mp3)
 * - Graceful zero-dependency Web Audio API synthesizer fallback if MP3s are not present
 * - Multiple SFX presets (pop, rustle, chime, flip, whoosh)
 */

let audioCtx = null;
let isMuted = false;
let isBgmPlaying = false;
let currentTrack = 'main'; // 'main' | 'postcard'

// HTML5 Audio instances for custom MP3s
let mainAudioEl = null;
let postcardAudioEl = null;
let usingHtmlAudio = false;

// Synthesizer variables
let bgmIntervalId = null;
let bgmStep = 0;

// ─── Musical Notes Frequency Map ─────────────────────────────────────────────
const NOTES = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50
};

// Track 1: Playful & Cute Gift Reveal Theme
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

// Track 2: Warm, Nostalgic & Emotional Postcard Theme
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
  stateListeners.forEach((fn) => fn({ isBgmPlaying, currentTrack, isMuted }));
}

export function subscribeAudioState(fn) {
  stateListeners.add(fn);
  fn({ isBgmPlaying, currentTrack, isMuted });
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

// ─── MP3 Track Setup (with fallback test) ─────────────────────────────────────
const MP3_PATHS = {
  main: ['./audio/bgm-main.mp3', '/OzonZ/audio/bgm-main.mp3', './bgm-main.mp3'],
  postcard: ['./audio/bgm-postcard.mp3', '/OzonZ/audio/bgm-postcard.mp3', './bgm-postcard.mp3']
};

function tryCreateAudioElement(paths) {
  const audio = new Audio();
  audio.loop = true;
  audio.volume = 0.5;
  let pathIndex = 0;

  audio.src = paths[pathIndex];
  audio.onerror = () => {
    pathIndex++;
    if (pathIndex < paths.length) {
      audio.src = paths[pathIndex];
    }
  };
  return audio;
}

// Try initializing HTML5 Audio
try {
  mainAudioEl = tryCreateAudioElement(MP3_PATHS.main);
  postcardAudioEl = tryCreateAudioElement(MP3_PATHS.postcard);
} catch (_) {}

// ─── BGM Controls ─────────────────────────────────────────────────────────────
export function startBgm(track = currentTrack) {
  initAudio();
  currentTrack = track;
  isBgmPlaying = true;
  stopSynthBgm();

  // Try playing MP3 first
  const targetAudio = track === 'postcard' ? postcardAudioEl : mainAudioEl;
  const otherAudio = track === 'postcard' ? mainAudioEl : postcardAudioEl;

  if (otherAudio) {
    try { otherAudio.pause(); } catch (_) {}
  }

  if (targetAudio && targetAudio.src && !isMuted) {
    const playPromise = targetAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          usingHtmlAudio = true;
          notifyListeners();
        })
        .catch(() => {
          // MP3 not found or blocked -> Fallback to synthesizer
          usingHtmlAudio = false;
          startSynthBgm(track);
        });
    }
  } else {
    startSynthBgm(track);
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
    playTone(note, speed / 1000 * 0.9, oscType, track === 'postcard' ? 0.07 : 0.06);
    // Warm bass harmonic
    if (bgmStep % 2 === 0) {
      playTone(note / 2, speed / 1000 * 1.5, 'sine', 0.03);
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
    startBgm(currentTrack);
    return true;
  }
}

export function switchBgmTrack(trackName) {
  if (currentTrack === trackName) return;
  currentTrack = trackName;
  if (isBgmPlaying) {
    startBgm(trackName);
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
