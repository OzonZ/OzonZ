import { useEffect, useRef } from 'react';

/**
 * PinkWindParticles — A lightweight HTML5 canvas particle & wind breeze system.
 * Features:
 * - Subtle, low-opacity soft pink & white floating circular particles.
 * - Snake/Follow-the-leader white wind streaks: Head moves upward in a zigzag,
 *   and trailing child segments follow the exact path carved out by the head.
 * - Randomized big, medium, and small wind streams.
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

    const CIRCLE_COUNT = Math.min(Math.floor(width / 75), 16);

    const createCircleParticle = (initialY = null) => ({
      x: Math.random() * width,
      y: initialY !== null ? initialY : height + Math.random() * 60,
      radius: 2 + Math.random() * 3.5,
      speedY: 0.6 + Math.random() * 0.9,
      swaySpeed: 0.0012 + Math.random() * 0.002,
      swayAmp: 10 + Math.random() * 20,
      phase: Math.random() * Math.PI * 2,
      baseAlpha: 0.10 + Math.random() * 0.20,
      colorPrefix: CIRCLE_COLORS[Math.floor(Math.random() * CIRCLE_COLORS.length)],
      pulseSpeed: 0.002 + Math.random() * 0.003,
    });

    const circleParticles = Array.from({ length: CIRCLE_COUNT }, () =>
      createCircleParticle(Math.random() * height)
    );

    // ─── 2. FOLLOW-THE-LEADER ZIGZAG WIND STREAMS (Path History Trail) ───────
    const WIND_STREAM_COUNT = Math.min(Math.floor(width / 180), 8); // 5-8 streams

    const createWindStream = (initialY = null) => {
      const sizeType = Math.random(); // 0-0.35: small, 0.35-0.75: medium, 0.75-1.0: big

      let segmentCount, blockSize, sampleSpacing, zigzagAmp, zigzagSpeed, speedY, baseAlpha;

      if (sizeType < 0.35) {
        // Small quick delicate breeze
        segmentCount = 7 + Math.floor(Math.random() * 5); // 7 to 11 child blocks
        blockSize = 2.8 + Math.random() * 0.8;
        sampleSpacing = 4;
        zigzagAmp = 9 + Math.random() * 6; // ~9-15px zigzag width
        zigzagSpeed = 0.0032 + Math.random() * 0.0012;
        speedY = 1.6 + Math.random() * 0.7;
        baseAlpha = 0.25 + Math.random() * 0.18;
      } else if (sizeType < 0.75) {
        // Medium standard wavy breeze
        segmentCount = 12 + Math.floor(Math.random() * 6); // 12 to 17 child blocks
        blockSize = 3.8 + Math.random() * 1.0;
        sampleSpacing = 5;
        zigzagAmp = 15 + Math.random() * 8; // ~15-23px zigzag width
        zigzagSpeed = 0.0026 + Math.random() * 0.0010;
        speedY = 1.3 + Math.random() * 0.5;
        baseAlpha = 0.30 + Math.random() * 0.20;
      } else {
        // Big prominent winding wind gust
        segmentCount = 18 + Math.floor(Math.random() * 8); // 18 to 25 child blocks
        blockSize = 4.8 + Math.random() * 1.4;
        sampleSpacing = 6;
        zigzagAmp = 22 + Math.random() * 10; // ~22-32px zigzag width
        zigzagSpeed = 0.0020 + Math.random() * 0.0008;
        speedY = 1.0 + Math.random() * 0.4;
        baseAlpha = 0.35 + Math.random() * 0.22;
      }

      const maxHistory = segmentCount * sampleSpacing + 15;
      const baseX = Math.random() * width;
      const startY = initialY !== null ? initialY : height + 30 + Math.random() * (height * 0.6);
      const phase = Math.random() * Math.PI * 2;

      // Pre-populate trail history
      const trail = [];
      for (let i = 0; i < maxHistory; i++) {
        const histY = startY + i * speedY;
        const histX = baseX + Math.sin(phase - i * (zigzagSpeed * 16)) * zigzagAmp;
        trail.push({ x: histX, y: histY });
      }

      return {
        baseX,
        headY: startY,
        headX: baseX,
        speedY,
        segmentCount,
        blockSize,
        sampleSpacing,
        zigzagAmp,
        zigzagSpeed,
        baseAlpha,
        phase,
        maxHistory,
        trail,
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
        // ─── Draw Follow-the-Leader Wavy Wind Streams ─────────────────────
        for (let i = 0; i < windStreams.length; i++) {
          const stream = windStreams[i];

          // 1. Move the head upward with a zigzag oscillation
          stream.headY -= stream.speedY;
          stream.headX =
            stream.baseX + Math.sin(elapsed * stream.zigzagSpeed + stream.phase) * stream.zigzagAmp;

          // 2. Push head position into historical trail
          stream.trail.unshift({ x: stream.headX, y: stream.headY });
          if (stream.trail.length > stream.maxHistory) {
            stream.trail.pop();
          }

          // 3. Check if the entire tail has exited past the top
          const lastPoint = stream.trail[stream.trail.length - 1];
          if (lastPoint && lastPoint.y < -40) {
            windStreams[i] = createWindStream(height + 20 + Math.random() * 120);
            continue;
          }

          // 4. Draw children following the head's exact path
          for (let s = 0; s < stream.segmentCount; s++) {
            const historyIndex = s * stream.sampleSpacing;
            if (historyIndex >= stream.trail.length) break;

            const pt = stream.trail[historyIndex];

            // Taper opacity: softly fades at head and tail ends
            const normalizedPos = s / (stream.segmentCount - 1);
            const taper = Math.sin(normalizedPos * Math.PI); // 0 at ends, 1 in middle
            const segAlpha = stream.baseAlpha * (0.28 + taper * 0.72) * opacity;

            if (segAlpha <= 0.002) continue;

            ctx.fillStyle = `rgba(255, 255, 255, ${segAlpha})`;
            ctx.fillRect(
              pt.x - stream.blockSize / 2,
              pt.y - stream.blockSize / 2,
              stream.blockSize,
              stream.blockSize
            );
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
            (p.baseAlpha + Math.sin(elapsed * p.pulseSpeed + p.phase) * 0.04) * opacity;

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
