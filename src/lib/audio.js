/**
 * Web Audio API — BGM + SFX Engine
 * Inspired by the OzonZ Love Letter Blueprint chiptune approach
 */

let audioCtx = null;
let isBgmPlaying = false;
let bgmIntervalId = null;
let bgmStep = 0;

// ─── Notes ───────────────────────────────────────────────────────────────────
const NOTES = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00,
  A4: 440.00, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25,
  G5: 783.99, A5: 880.00,
};

// Cute romantic melody
const MELODY = [
  NOTES.E5, NOTES.D5, NOTES.C5, NOTES.D5,
  NOTES.E5, NOTES.E5, NOTES.E5, NOTES.G5,
  NOTES.D5, NOTES.D5, NOTES.D5, NOTES.D5,
  NOTES.E5, NOTES.G5, NOTES.G5, NOTES.G5,
  NOTES.E5, NOTES.D5, NOTES.C5, NOTES.D5,
  NOTES.E5, NOTES.E5, NOTES.E5, NOTES.E5,
  NOTES.D5, NOTES.D5, NOTES.E5, NOTES.D5,
  NOTES.C5, NOTES.C5, NOTES.C5, NOTES.C5,
];

// ─── Core ─────────────────────────────────────────────────────────────────────
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

function playTone(freq, duration, type = 'triangle', gainVal = 0.08) {
  if (!audioCtx) return;
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

// ─── BGM ──────────────────────────────────────────────────────────────────────
export function startBgm() {
  if (isBgmPlaying) return;
  initAudio();
  isBgmPlaying = true;
  bgmIntervalId = setInterval(() => {
    const note = MELODY[bgmStep % MELODY.length];
    playTone(note, 0.38, 'triangle', 0.06);
    if (bgmStep % 2 === 0) playTone(note / 2, 0.55, 'sine', 0.025);
    bgmStep++;
  }, 380);
}

export function stopBgm() {
  clearInterval(bgmIntervalId);
  isBgmPlaying = false;
}

export function toggleBgm() {
  if (isBgmPlaying) { stopBgm(); return false; }
  else { startBgm(); return true; }
}

export function isBgmOn() { return isBgmPlaying; }

// ─── SFX ──────────────────────────────────────────────────────────────────────
export function sfxPop() {
  initAudio();
  playTone(880, 0.12, 'sine', 0.12);
  setTimeout(() => playTone(1100, 0.08, 'sine', 0.08), 60);
}

export function sfxWhoosh() {
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(600, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.25);
  gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.25);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.25);
}

export function sfxChime() {
  initAudio();
  [523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.5, 'triangle', 0.07), i * 80);
  });
}

export function sfxRustle() {
  initAudio();
  if (!audioCtx) return;
  const bufferSize = Math.floor(audioCtx.sampleRate * 0.18);
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.07, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
  noise.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start();
}

export function sfxFlip() {
  initAudio();
  playTone(440, 0.06, 'square', 0.05);
  setTimeout(() => playTone(660, 0.06, 'square', 0.05), 80);
  setTimeout(() => playTone(880, 0.1, 'triangle', 0.07), 160);
}
