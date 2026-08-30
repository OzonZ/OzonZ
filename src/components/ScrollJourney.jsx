import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BoxReveal from './BoxReveal';

// Ambient floating particles
function AmbientParticle({ index, progress }) {
  const leftPct = 5 + (index * 13.7) % 90;
  const size = 5 + (index % 4) * 3;
  const duration = 6 + (index % 5) * 2;
  const delay = (index % 6) * -1.5;

  const INITIAL_COLORS = ['#FFA07A', '#FF69B4', '#B388FF', '#FFD166', '#FF8DA1'];
  const FINAL_COLORS = ['rgba(255,255,255,0.95)', 'rgba(255,209,220,0.9)', 'rgba(255,255,255,0.8)', 'rgba(255,209,220,0.95)', 'rgba(255,255,255,0.85)'];

  const color = progress > 0.35 ? FINAL_COLORS[index % 5] : INITIAL_COLORS[index % 5];
  const opacity = Math.min(Math.max(progress * 1.5, 0.3), 0.85);

  return (
    <div
      className="particle-dot"
      style={{
        position: 'absolute',
        bottom: '-20px',
        left: `${leftPct}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: color,
        opacity,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        filter: 'blur(1px)',
        pointerEvents: 'none',
        transition: 'background-color 0.6s ease',
      }}
    />
  );
}

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

  // Compute seamless background color with generous initial air time
  // Pure white (0 -> 0.20) -> Smoothly morphs to pastel pink #ffebf0 (0.20 -> 0.45)
  const morphRatio = Math.min(Math.max((progress - 0.20) / 0.25, 0), 1);
  const g = Math.round(255 - morphRatio * 20); // 255 -> 235
  const b = Math.round(255 - morphRatio * 15); // 255 -> 240
  const bgColor = `rgb(255, ${g}, ${b})`;

  // Scene 01 (Hero Landing): Stays visible during initial scroll, then fades out from 0.20 -> 0.32
  const heroOpacity = progress < 0.20 ? 1 : Math.max(1 - (progress - 0.20) / 0.12, 0);
  const heroY = progress < 0.20 ? 0 : -(progress - 0.20) * 350;
  const heroScale = progress < 0.20 ? 1 : 1 - (progress - 0.20) * 0.4;
  const heroVisible = heroOpacity > 0.01;

  // Scene 02 (Gift Box Centerpiece): Enters from 0.24 -> 0.36, stays centered throughout
  const boxOpacity = Math.min(Math.max((progress - 0.24) / 0.12, 0), 1);
  const boxScale = 0.88 + progress * 0.32;
  const canOpen = progress >= 0.75;

  // Speech bubble active ranges (with clear spacing)
  const bubble1Active = progress >= 0.36 && progress < 0.50;
  const bubble2Active = progress >= 0.50 && progress < 0.64;
  const bubble3Active = progress >= 0.64 && progress < 0.78;

  // Bottom scroll hint
  const hintOpacity = progress < 0.75 ? Math.max(0.75 - progress * 0.5, 0.35) : 0;

  return (
    <div
      style={{
        height: '380vh', // Generous 3.8 viewports for air time & 2-stage scroll morph
        position: 'relative',
      }}
    >
      {/* ─── FIXED FULLSCREEN CANVAS (Zero seams, perfect background morph) ─ */}
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

        {/* Ambient Floating Sparkle Particles */}
        {Array.from({ length: 16 }, (_, idx) => (
          <AmbientParticle key={idx} index={idx} progress={progress} />
        ))}
      </div>

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
        {/* ─── SCENE 01: HERO ENTRY (Generous Air Time, No Arrow Button) ─ */}
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
            }}
          >
            <div style={{ maxWidth: '680px', margin: '0 auto' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>✨</div>
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
                Try scrolling down to see... Good luck! ✨
              </p>
            </div>
          </div>
        )}

        {/* ─── SCENE 02: SCROLL-DRIVEN SPEECH BUBBLES ───────────────────── */}
        <SpeechBubbleCard
          text='"Oh look, a surprise gift box!"'
          side="left"
          visible={bubble1Active}
        />
        <SpeechBubbleCard
          text='"So exciting!"'
          side="right"
          visible={bubble2Active}
        />
        <SpeechBubbleCard
          text='"I wonder what could be inside...?"'
          side="left"
          visible={bubble3Active}
        />

        {/* ─── SCENE 02 & 03: CLAYMORPHIC 3D GIFT BOX CENTERPIECE ──────── */}
        <div
          style={{
            opacity: boxOpacity,
            transform: `scale(${boxScale})`,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: boxOpacity > 0.2 ? 'auto' : 'none',
            transition: 'opacity 0.2s ease-out, transform 0.15s ease-out',
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
            Scroll down to discover... 🎁
          </div>
        )}
      </div>
    </div>
  );
}
