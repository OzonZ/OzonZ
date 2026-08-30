import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BoxReveal from './BoxReveal';
import WaveOverlay from './WaveOverlay';
import PinkWindParticles from './PinkWindParticles';

// Speech Bubble with spring animation
function SpeechBubbleCard({ text, side, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: side === 'left' ? -35 : 35, scale: 0.85 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: side === 'left' ? -20 : 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{
            position: 'absolute',
            [side === 'left' ? 'right' : 'left']: 'calc(50% + 120px)',
            top: '38%',
            transform: 'translateY(-50%)',
            zIndex: 25,
            pointerEvents: 'none',
          }}
        >
          <div className={`speech-bubble ${side === 'left' ? 'left' : 'right'}`}>
            {text}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ScrollJourney({ onOpenBox }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const totalScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const currentProgress = Math.min(Math.max(scrollY / totalScroll, 0), 1);
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ─── STAGE 2: BACKGROUND GRADUAL COLOR MORPH (0.08 -> 0.48) ────────────────
  // Little by little transforms into warm pastel pink rgb(255, 222, 234)
  const morphRatio = Math.min(Math.max((progress - 0.08) / 0.40, 0), 1);
  const g = Math.round(255 - morphRatio * 33); // 255 -> 222
  const b = Math.round(255 - morphRatio * 21); // 255 -> 234
  const bgColor = `rgb(255, ${g}, ${b})`;

  // ─── STAGE 1: HERO TEXT FLOATS OUT & UP (0.00 -> 0.18) ─────────────────────
  const heroFloatRatio = Math.min(progress / 0.18, 1);
  const heroOpacity = Math.max(1 - heroFloatRatio, 0);
  const heroY = -heroFloatRatio * 260; // Floats out and UP
  const heroScale = 1 - heroFloatRatio * 0.1;
  const heroVisible = heroOpacity > 0.01;

  // ─── STAGE 1 & 2: PINK WIND PARTICLES (0.00 -> 0.26) ────────────────────────
  // Floats up from bottom like wind, then opacity fades down to none
  const particleOpacity = progress <= 0.08
    ? 1.0
    : Math.max(0, 1 - (progress - 0.08) / 0.18);

  // ─── STAGE 3: WAVES FLOAT UP TO TOP AND FADE TO NONE (0.12 -> 0.54) ────────
  const waveRiseRatio = Math.min(Math.max((progress - 0.12) / 0.42, 0), 1);
  const waveYPercent = -waveRiseRatio * 105; // Rises all the way past top of viewport
  const waveOpacity = progress <= 0.38
    ? 1.0
    : Math.max(0, 1 - (progress - 0.38) / 0.16);

  // ─── STAGE 4: FOURTH SCROLL BOX REVEAL (0.56 -> 1.00) ──────────────────────
  const boxProgress = Math.min(Math.max((progress - 0.56) / 0.16, 0), 1);
  const boxOpacity = boxProgress;
  const boxScale = 0.82 + boxProgress * 0.18 + (progress > 0.72 ? (progress - 0.72) * 0.08 : 0);
  const canOpen = progress >= 0.78;

  // Speech bubbles leading up to and during box stage
  const bubble1Active = progress >= 0.60 && progress < 0.72;
  const bubble2Active = progress >= 0.72 && progress < 0.84;
  const bubble3Active = progress >= 0.84 && progress < 0.98;

  // Dynamic bottom scroll hint
  const hintOpacity = progress < 0.75 ? Math.max(0.8 - progress * 0.6, 0.3) : 0;

  return (
    <div
      style={{
        height: '420vh', // 4 distinct immersive scroll stages
        position: 'relative',
      }}
    >
      {/* ─── FIXED FULLSCREEN CANVAS (Seamless Background & Wave Morph) ────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: bgColor,
          zIndex: 1,
          pointerEvents: 'none',
          transition: 'background-color 0.1s linear',
        }}
      >
        {/* Animated Mesh Gradient Blobs */}
        <div className="mesh-bg">
          <div className="mesh-blob mesh-blob-1" />
          <div className="mesh-blob mesh-blob-2" />
          <div className="mesh-blob mesh-blob-3" />
        </div>

        {/* Dynamic Sinusoidal Waves (Floating Upward & Fading Out) */}
        <WaveOverlay translateYPercent={waveYPercent} opacity={waveOpacity} />
      </div>

      {/* ─── SCENE 1: PINK WIND PARTICLES (Float from Bottom) ─────────────── */}
      <PinkWindParticles opacity={particleOpacity} />

      {/* ─── FIXED INTERACTIVE VIEWPORT SCENE ───────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {/* ─── SCENE 01: HERO ENTRY (Floats Out and UP on First Scroll) ─── */}
        {heroVisible && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 24px',
              textAlign: 'center',
              opacity: heroOpacity,
              transform: `translateY(${heroY}px) scale(${heroScale})`,
              pointerEvents: heroOpacity > 0.2 ? 'auto' : 'none',
              zIndex: 15,
              willChange: 'transform, opacity',
            }}
          >
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <h1
                style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 700,
                  fontSize: 'clamp(1.8rem, 5vw, 3rem)',
                  color: 'var(--text-main)',
                  lineHeight: 1.25,
                  marginBottom: '16px',
                  letterSpacing: '-0.01em',
                }}
              >
                Hello! You are someone{' '}
                <span className="gradient-text">truly special</span>{' '}
                to Non.
              </h1>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                  color: 'var(--text-muted)',
                  lineHeight: 1.7,
                  marginBottom: '28px',
                  maxWidth: '520px',
                  margin: '0 auto 28px',
                }}
              >
                He created this secret corner of the web just for you to find
                what's waiting down below.
              </p>
              <p style={{ fontFamily: 'var(--font-head)', fontWeight: 600, color: 'var(--primary)', fontSize: '1rem' }}>
                Try scrolling down to see... Good luck!
              </p>
            </div>
          </div>
        )}

        {/* ─── SCENE 04: SCROLL-DRIVEN SPEECH BUBBLES ───────────────────── */}
        <SpeechBubbleCard
          text='"Oh look, a surprise gift box!"'
          side="left"
          visible={bubble1Active}
        />
        <SpeechBubbleCard
          text='"So exciting! I wonder what is inside...?"'
          side="right"
          visible={bubble2Active}
        />
        <SpeechBubbleCard
          text='"Tap the box to open! 🎁"'
          side="left"
          visible={bubble3Active}
        />

        {/* ─── SCENE 04: CLAYMORPHIC 3D GIFT BOX CENTERPIECE ────────────── */}
        <div
          style={{
            opacity: boxOpacity,
            transform: `scale(${boxScale})`,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: boxOpacity > 0.3 ? 'auto' : 'none',
            transition: 'opacity 0.15s ease-out, transform 0.15s ease-out',
            willChange: 'transform, opacity',
          }}
        >
          <BoxReveal
            onOpenBox={onOpenBox}
            canOpen={canOpen}
          />
        </div>

        {/* Dynamic bottom scroll indicator */}
        {hintOpacity > 0.01 && (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              opacity: hintOpacity,
              fontFamily: 'var(--font-head)',
              fontSize: '0.82rem',
              color: 'var(--text-muted)',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 30,
            }}
          >
            Scroll down to discover...
          </div>
        )}
      </div>
    </div>
  );
}
