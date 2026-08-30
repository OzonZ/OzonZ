import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import BoxReveal from './BoxReveal';

// Ambient floating particles
function AmbientParticle({ index, scrollYProgress }) {
  const leftPct = 5 + (index * 13.7) % 90;
  const size = 5 + (index % 4) * 3;
  const duration = 6 + (index % 5) * 2;
  const delay = (index % 6) * -1.5;

  const INITIAL_COLORS = ['#FFA07A', '#FF69B4', '#B388FF', '#FFD166', '#FF8DA1'];
  const FINAL_COLORS = ['rgba(255,255,255,0.95)', 'rgba(255,209,220,0.9)', 'rgba(255,255,255,0.8)', 'rgba(255,209,220,0.95)', 'rgba(255,255,255,0.85)'];

  const color = useTransform(
    scrollYProgress,
    [0.1, 0.45],
    [INITIAL_COLORS[index % 5], FINAL_COLORS[index % 5]]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.3, 0.85, 0.85, 0.4]);

  return (
    <motion.div
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
      }}
    />
  );
}

// Speech Bubble with smooth scroll range transitions
function SpeechBubbleCard({ text, side, scrollYProgress, enterRange, exitRange }) {
  const opacity = useTransform(
    scrollYProgress,
    [enterRange, enterRange + 0.04, exitRange - 0.04, exitRange],
    [0, 1, 1, 0]
  );

  const x = useTransform(
    scrollYProgress,
    [enterRange, enterRange + 0.04, exitRange - 0.04, exitRange],
    side === 'left' ? [-30, 0, 0, -20] : [30, 0, 0, 20]
  );

  const scale = useTransform(
    scrollYProgress,
    [enterRange, enterRange + 0.04, exitRange - 0.04, exitRange],
    [0.85, 1, 1, 0.9]
  );

  return (
    <motion.div
      style={{
        opacity,
        x,
        scale,
        position: 'absolute',
        [side === 'left' ? 'right' : 'left']: 'calc(50% + 115px)',
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
  );
}

export default function ScrollJourney({ onOpenEnvelope, onOpenPostcard }) {
  const trackRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  });

  // Global background color morph: Pure white -> Dreamy pastel pink
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.22, 0.6, 1],
    ['#ffffff', '#fff3f6', '#ffe8ef', '#ffebf0']
  );

  // Scene 01 (Hero Landing): Fades out cleanly as user scrolls down
  const heroOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.16], [0, -70]);
  const heroScale = useTransform(scrollYProgress, [0, 0.16], [1, 0.94]);
  const heroPointerEvents = useTransform(scrollYProgress, (v) => (v > 0.14 ? 'none' : 'auto'));

  // Scene 02 (Gift Box Centerpiece): Enters as Hero fades out
  const boxOpacity = useTransform(scrollYProgress, [0.12, 0.22], [0, 1]);
  const boxScale = useTransform(scrollYProgress, [0.15, 0.35, 0.65, 0.85], [0.8, 0.95, 1.08, 1.2]);
  const boxY = useTransform(scrollYProgress, [0.12, 0.25], [60, 0]);
  const boxPointerEvents = useTransform(scrollYProgress, (v) => (v < 0.15 ? 'none' : 'auto'));

  // Scroll Hint Indicator
  const hintOpacity = useTransform(scrollYProgress, [0, 0.08, 0.7, 0.85], [0.75, 0.45, 0.45, 0]);

  return (
    <div
      ref={trackRef}
      style={{
        height: '320vh', // Generous smooth scroll length for 3 steps + final dock
        position: 'relative',
      }}
    >
      {/* ─── FIXED FULLSCREEN CANVAS (No seams, no cutoffs, perfect morph) ─── */}
      <motion.div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: bgColor,
          zIndex: 1,
          pointerEvents: 'none',
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
          <AmbientParticle key={idx} index={idx} scrollYProgress={scrollYProgress} />
        ))}
      </motion.div>

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
        {/* ─── SCENE 01: HERO ENTRY (Fades to none on scroll) ─────────── */}
        <motion.div
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
            y: heroY,
            scale: heroScale,
            pointerEvents: heroPointerEvents,
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
                marginBottom: '36px',
                maxWidth: '520px',
                margin: '0 auto 36px',
              }}
            >
              He created this secret corner of the web just for you to find
              what's waiting down below.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <p style={{ fontFamily: 'var(--font-head)', fontWeight: 600, color: 'var(--primary)', fontSize: '1rem' }}>
                Try scrolling down to see... Good luck! ✨
              </p>
              <div
                className="bounce-arrow"
                style={{
                  width: '44px',
                  height: '44px',
                  background: 'linear-gradient(135deg, #ff8da1, #ff6b8b)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(255, 141, 161, 0.4)',
                  color: '#fff',
                  fontSize: '20px',
                  cursor: 'pointer',
                  pointerEvents: 'auto',
                }}
                onClick={() => {
                  window.scrollTo({ top: window.innerHeight * 1.5, behavior: 'smooth' });
                }}
              >
                ↓
              </div>
            </div>
          </div>
        </motion.div>

        {/* ─── SCENE 02: SCROLL-DRIVEN SPEECH BUBBLES ───────────────────── */}
        <SpeechBubbleCard
          text='"Oh look, a surprise gift box!"'
          side="left"
          scrollYProgress={scrollYProgress}
          enterRange={0.22}
          exitRange={0.38}
        />
        <SpeechBubbleCard
          text='"So exciting!"'
          side="right"
          scrollYProgress={scrollYProgress}
          enterRange={0.42}
          exitRange={0.58}
        />
        <SpeechBubbleCard
          text='"I wonder what could be inside...?"'
          side="left"
          scrollYProgress={scrollYProgress}
          enterRange={0.62}
          exitRange={0.78}
        />

        {/* ─── SCENE 02 & 03: CLAYMORPHIC GIFT BOX & DISCOVERY ─────────── */}
        <motion.div
          style={{
            opacity: boxOpacity,
            scale: boxScale,
            y: boxY,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: boxPointerEvents,
          }}
        >
          <BoxReveal
            onOpenEnvelope={onOpenEnvelope}
            onOpenPostcard={onOpenPostcard}
          />
        </motion.div>

        {/* Dynamic bottom scroll indicator */}
        <motion.div
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
        </motion.div>
      </div>
    </div>
  );
}
