import { useEffect, useRef } from 'react';

/**
 * PinkWindParticles — A lightweight HTML5 canvas particle & wind breeze system.
 * Features:
 * - Subtle, low-opacity soft pink & white floating circular particles.
 * - Vertical pixel/dashed white wind streaks rising like gentle breeze trails (as in Until Then style).
 * - Smoothly responds to scroll opacity prop.
 */
export default function PinkWindParticles({ opacity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // ─── 1. CIRCLE PARTICLES (Subtle pink & white only, low opacity) ─────────
    const CIRCLE_COLORS = [
      'rgba(255, 255, 255, ',   // Soft White
      'rgba(255, 255, 255, ',   // Soft White (weighted)
      'rgba(255, 192, 203, ',   // Soft Pastel Pink
      'rgba(255, 182, 193, ',   // Light Pink
      'rgba(255, 218, 225, ',   // Blush White-Pink
    ];

    const CIRCLE_COUNT = Math.min(Math.floor(width / 70), 18); // Reduced count

    const createCircleParticle = (initialY = null) => ({
      x: Math.random() * width,
      y: initialY !== null ? initialY : height + Math.random() * 60,
      radius: 2 + Math.random() * 3.5, // Small delicate size
      speedY: 0.6 + Math.random() * 1.0, // Gentle upward speed
      swaySpeed: 0.0012 + Math.random() * 0.002,
      swayAmp: 10 + Math.random() * 20,
      phase: Math.random() * Math.PI * 2,
      baseAlpha: 0.12 + Math.random() * 0.22, // Low subtle opacity
      colorPrefix: CIRCLE_COLORS[Math.floor(Math.random() * CIRCLE_COLORS.length)],
      pulseSpeed: 0.002 + Math.random() * 0.003,
    });

    const circleParticles = Array.from({ length: CIRCLE_COUNT }, () =>
      createCircleParticle(Math.random() * height)
    );

    // ─── 2. WHITE WIND STREAKS (Dashed vertical columns like in Image 2) ─────
    const WIND_STREAM_COUNT = Math.min(Math.floor(width / 220), 6); // 4-6 streams

    const createWindStream = (initialY = null) => {
      const segmentCount = 7 + Math.floor(Math.random() * 8); // 7 to 14 segments
      const blockSize = 3.5 + Math.random() * 1.5; // ~4px
      const gap = 3 + Math.random() * 2; // ~4px gap
      const streamHeight = segmentCount * (blockSize + gap);

      return {
        x: Math.random() * width,
        y: initialY !== null ? initialY : height + 20 + Math.random() * (height * 0.5),
        speedY: 1.2 + Math.random() * 1.4, // Rising speed
        segmentCount,
        blockSize,
        gap,
        streamHeight,
        baseAlpha: 0.25 + Math.random() * 0.35, // Translucent white
        swaySpeed: 0.0008 + Math.random() * 0.0015,
        swayAmp: 4 + Math.random() * 8,
        phase: Math.random() * Math.PI * 2,
      };
    };

    const windStreams = Array.from({ length: WIND_STREAM_COUNT }, () =>
      createWindStream(Math.random() * height)
    );

    let startTime = performance.now();

    const render = (now) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      if (opacity > 0.005) {
        // ─── Draw White Wind Streams (Image 2 style dashed breeze) ─────────
        for (let i = 0; i < windStreams.length; i++) {
          const stream = windStreams[i];
          stream.y -= stream.speedY;

          const sway = Math.sin(elapsed * stream.swaySpeed + stream.phase) * stream.swayAmp;
          const currentX = stream.x + sway;

          // Reset when whole stream moves off top
          if (stream.y < -stream.streamHeight - 20) {
            windStreams[i] = createWindStream(height + 10 + Math.random() * 120);
            continue;
          }

          for (let s = 0; s < stream.segmentCount; s++) {
            const segY = stream.y + s * (stream.blockSize + stream.gap);

            // Taper head and tail of stream for soft organic entrance/exit
            const normalizedPos = s / (stream.segmentCount - 1);
            const taper = Math.sin(normalizedPos * Math.PI); // 0 at ends, 1 in middle
            const segAlpha = stream.baseAlpha * (0.35 + taper * 0.65) * opacity;

            if (segAlpha <= 0.002) continue;

            ctx.fillStyle = `rgba(255, 255, 255, ${segAlpha})`;
            // Draw clean square/pixel wind dash
            ctx.fillRect(currentX, segY, stream.blockSize, stream.blockSize);
          }
        }

        // ─── Draw Subtle Soft Pink & White Circles ─────────────────────────
        for (let i = 0; i < circleParticles.length; i++) {
          const p = circleParticles[i];
          p.y -= p.speedY;

          const sway = Math.sin(elapsed * p.swaySpeed + p.phase) * (p.swayAmp * 0.04);
          p.x += sway;

          if (p.y < -20) {
            circleParticles[i] = createCircleParticle(height + 10 + Math.random() * 30);
            continue;
          }
          if (p.x < -30) p.x = width + 15;
          if (p.x > width + 30) p.x = -15;

          const currentAlpha =
            (p.baseAlpha + Math.sin(elapsed * p.pulseSpeed + p.phase) * 0.05) * opacity;

          if (currentAlpha <= 0.002) continue;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${p.colorPrefix}${currentAlpha})`;
          ctx.fill();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 5,
        opacity: opacity > 0.005 ? 1 : 0,
        transition: 'opacity 0.15s ease-out',
      }}
    />
  );
}
