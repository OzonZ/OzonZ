import { useRef } from 'react';
import { useScroll, useTransform, motion, AnimatePresence } from 'framer-motion';
import BoxReveal from './BoxReveal';

// Ambient floating particles that change color from pastel -> white sparkles
function AmbientParticle({ index, scrollYProgress }) {
  const leftPct = 5 + (index * 13.7) % 90;
  const size = 5 + (index % 4) * 3;
  const duration = 6 + (index % 5) * 2;
  const delay = (index % 6) * -1.5;

  const INITIAL_COLORS = ['#FFA07A', '#FF69B4', '#B388FF', '#FFD166', '#FF8DA1'];
  const FINAL_COLORS = ['rgba(255,255,255,0.9)', 'rgba(255,209,220,0.85)', 'rgba(255,255,255,0.7)', 'rgba(255,209,220,0.9)', 'rgba(255,255,255,0.8)'];

  const color = useTransform(
    scrollYProgress,
    [0.1, 0.5],
    [INITIAL_COLORS[index % 5], FINAL_COLORS[index % 5]]
  );

  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.3, 0.8, 0.8, 0.4]);

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

// Scroll-Driven Speech Bubble with spring entrance/exit
function SpeechBubbleCard({ text, side, scrollYProgress, enterRange, exitRange }) {
  const opacity = useTransform(
    scrollYProgress,
    [enterRange, enterRange + 0.05, exitRange - 0.05, exitRange],
    [0, 1, 1, 0]
  );

  const x = useTransform(
    scrollYProgress,
    [enterRange, enterRange + 0.05, exitRange - 0.05, exitRange],
    side === 'left' ? [-30, 0, 0, -20] : [30, 0, 0, 20]
  );

  const scale = useTransform(
    scrollYProgress,
    [enterRange, enterRange + 0.05, exitRange - 0.05, exitRange],
    [0.85, 1, 1, 0.9]
  );

  return (
    <motion.div
      style={{
        opacity,
        x,
        scale,
        position: 'absolute',
        [side === 'left' ? 'right' : 'left']: 'calc(50% + 120px)',
        top: '42%',
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
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Background smooth color morph
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.25, 0.65, 1],
    ['#ffffff', '#fff3f6', '#ffe8ef', '#ffebf0']
  );

  // Hero Scene 01 Opacity & Transforms (fades out as you scroll down)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.16], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.16], [0, -60]);
  const heroScale = useTransform(scrollYProgress, [0, 0.16], [1, 0.94]);
  const heroPointerEvents = useTransform(scrollYProgress, (v) => (v > 0.14 ? 'none' : 'auto'));

  // Gift Box Scene 02 Transforms
  const boxScale = useTransform(scrollYProgress, [0.08, 0.3, 0.65, 0.85], [0.75, 0.95, 1.05, 1.2]);
  const boxY = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [100, 0, 0, 0]);
  const boxOpacity = useTransform(scrollYProgress, [0.04, 0.14], [0, 1]);

  // Scroll hint text indicator at bottom
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12, 0.7, 0.85], [0.8, 0.5, 0.5, 0]);

  return (
    <div
      ref={containerRef}
      style={{
        height: '360vh', // Generous smooth scroll length for 3 steps + final dock
        position: 'relative',
      }}
    >
      {/* Sticky Fullscreen Canvas */}
      <motion.div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          backgroundColor: bgColor,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        {/* Animated Mesh Gradient Blobs */}
        <div className="mesh-bg">
          <div className="mesh-blob mesh-blob-1" />
          <div className="mesh-blob mesh-blob-2" />
          <div className="mesh-blob mesh-blob-3" />
        </div>

        {/* Ambient Floating Particles */}
        {Array.from({ length: 16 }, (_, idx) => (
          <AmbientParticle key={idx} index={idx} scrollYProgress={scrollYProgress} />
        ))}

        {/* ─── SCENE 01: HERO LANDING (Fades out seamlessly on scroll) ──── */}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
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
                marginBottom: '40px',
                maxWidth: '520px',
                margin: '0 auto 40px',
              }}
            >
              He created this secret corner of the web just for you to find
              what's waiting down below.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              <p style={{ fontFamily: 'var(--font-head)', fontWeight: 600, color: 'var(--primary)', fontSize: '1rem' }}>
                Try scrolling down to see... Good luck! ✨
              </p>
              <div className="bounce-arrow" style={{
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
              }}>
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
          enterRange={0.20}
          exitRange={0.38}
        />
        <SpeechBubbleCard
          text='"So exciting!"'
          side="right"
          scrollYProgress={scrollYProgress}
          enterRange={0.40}
          exitRange={0.58}
        />
        <SpeechBubbleCard
          text='"I wonder what could be inside...?"'
          side="left"
          scrollYProgress={scrollYProgress}
          enterRange={0.60}
          exitRange={0.78}
        />

        {/* ─── SCENE 02 & 03: CLAYMORPHIC GIFT BOX & DISCOVERY ─────────── */}
        <motion.div
          style={{
            scale: boxScale,
            y: boxY,
            opacity: boxOpacity,
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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
            bottom: '28px',
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
      </motion.div>
    </div>
  );
}
