import confetti from 'canvas-confetti';

/**
 * canvas-confetti preset bursts for the gift reveal
 */

const PINK_GOLD = ['#FF8DA1', '#FFD1DC', '#F4A261', '#FFD166', '#FF69B4', '#B388FF'];
const WHITE_PINK = ['#FFFFFF', '#FFD1DC', '#FF8DA1', '#FFA0B4'];

export function ribbonBurst() {
  // Left cannon
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.65 },
    colors: PINK_GOLD,
    shapes: ['square'],
    scalar: 1.1,
    drift: 1,
  });
  // Right cannon
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: PINK_GOLD,
      shapes: ['square'],
      scalar: 1.1,
      drift: -1,
    });
  }, 120);
}

export function starBurst() {
  confetti({
    particleCount: 80,
    angle: 90,
    spread: 100,
    origin: { x: 0.5, y: 0.55 },
    colors: PINK_GOLD,
    shapes: ['star'],
    scalar: 1.3,
    gravity: 0.8,
    ticks: 300,
  });
}

export function sparkBurst() {
  // Center up
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { x: 0.5, y: 0.6 },
    colors: WHITE_PINK,
    shapes: ['circle'],
    scalar: 0.8,
    gravity: 0.6,
    ticks: 250,
  });
}

export function fullRevealBurst() {
  // Fire multiple waves
  ribbonBurst();
  setTimeout(starBurst, 200);
  setTimeout(sparkBurst, 400);
  setTimeout(ribbonBurst, 600);
  setTimeout(() => {
    confetti({
      particleCount: 120,
      angle: 90,
      spread: 160,
      origin: { x: 0.5, y: 0.5 },
      colors: PINK_GOLD,
      shapes: ['star', 'square', 'circle'],
      scalar: 1.2,
      gravity: 0.7,
      ticks: 400,
    });
  }, 800);
}

export function finaleConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;
  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
      colors: PINK_GOLD,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
      colors: PINK_GOLD,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  };
  frame();
}
