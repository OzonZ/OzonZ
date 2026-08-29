import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import GiftBox from './GiftBox';

/**
 * Floating ambient particle — color and opacity driven by step (0-3)
 */
function Particle({ index, step }) {
  const leftPct = 5 + (index * 17.3) % 90;
  const size = 6 + (index % 5) * 3;
  const duration = 6 + (index % 4) * 2;
  const delay = (index % 5) * -1.5;

  // Color morphs from colorful → white at step 2+
  const isWhite = step >= 2;

  const COLORS_INITIAL = ['#FFA07A', '#FF69B4', '#B388FF', '#FFD166', '#FF8DA1'];
  const COLORS_FINAL   = ['rgba(255,255,255,0.85)', 'rgba(255,209,220,0.75)', 'rgba(255,255,255,0.65)', 'rgba(255,209,220,0.8)', 'rgba(255,255,255,0.7)'];

  const color = isWhite ? COLORS_FINAL[index % 5] : COLORS_INITIAL[index % 5];

  return (
    <motion.div
      className="particle-dot"
      animate={{ backgroundColor: color, opacity: step === 0 ? 0 : 0.75 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'absolute',
        bottom: '-20px',
        left: `${leftPct}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        filter: 'blur(1px)',
        pointerEvents: 'none',
      }}
    />
  );
}

/**
 * Speech bubble — appears/disappears based on active step
 */
function SpeechBubble({ text, side, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: side === 'left' ? -30 : 30, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: side === 'left' ? -20 : 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{
            position: 'absolute',
            [side === 'left' ? 'right' : 'left']: 'calc(50% + 110px)',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 20,
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

/* ─── Step config ─────────────────────────────────────────────────────────────
 * step 0: box appears, white bg, no bubbles
 * step 1: bubble 1, bg starts pinking
 * step 2: bubble 2, bg pinker, particles morph
 * step 3: bubble 3, bg full pink
 * step 4: done → trigger onScrollComplete
 * ─────────────────────────────────────────────────────────────────────────── */
const MAX_STEP = 4;

// Background colors per step
const BG_COLORS = [
  '#ffffff',   // step 0
  '#fff0f4',   // step 1
  '#ffe5ee',   // step 2
  '#ffebf0',   // step 3
  '#ffebf0',   // step 4
];

// Box scales per step
const BOX_SCALES = [0.85, 0.95, 1.0, 1.08, 1.12];

export default function ScrollJourney({ onScrollComplete, onReset }) {
  const containerRef    = useRef(null);
  const sectionRef      = useRef(null);
  const [step, setStep] = useState(0);
  const [isActive, setIsActive]     = useState(false);
  const [hasFired, setHasFired]     = useState(false);
  const stepRef = useRef(step);
  stepRef.current = step;

  // ── Intersection: detect when section is sticky in view ──────────────────
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Expose reset so App can call it on scroll-to-top ─────────────────────
  useEffect(() => {
    if (onReset) onReset.current = () => {
      setStep(0);
      setHasFired(false);
    };
  }, [onReset]);

  // ── Wheel / touch step advancement ───────────────────────────────────────
  useEffect(() => {
    let lastTime = 0;
    const THROTTLE = 600; // ms between step advances

    const advance = (dir) => {
      const now = Date.now();
      if (now - lastTime < THROTTLE) return;
      lastTime = now;

      const cur = stepRef.current;
      if (dir > 0) {
        if (cur < MAX_STEP) {
          const next = cur + 1;
          setStep(next);
          if (next >= MAX_STEP && !hasFired) {
            setHasFired(true);
            // small delay so final step animation plays, then release scroll
            setTimeout(() => onScrollComplete?.(), 500);
          }
        }
        // If already at max, allow natural scroll (don't preventDefault)
      } else {
        if (cur > 0) setStep(c => c - 1);
      }
    };

    const handleWheel = (e) => {
      if (!isActive || stepRef.current >= MAX_STEP) return;
      e.preventDefault();
      advance(e.deltaY);
    };

    let touchStartY = 0;
    const handleTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const handleTouchEnd   = (e) => {
      if (!isActive || stepRef.current >= MAX_STEP) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 30) advance(delta);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend',   handleTouchEnd,   { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend',   handleTouchEnd);
    };
  }, [isActive, hasFired, onScrollComplete]);

  // ── Reset hasFired if user scrolls back to step 0 ────────────────────────
  useEffect(() => {
    if (step < MAX_STEP) setHasFired(false);
  }, [step]);

  const bgColor  = BG_COLORS[Math.min(step, BG_COLORS.length - 1)];
  const boxScale = BOX_SCALES[Math.min(step, BOX_SCALES.length - 1)];

  const PARTICLE_COUNT = 15;

  return (
    <div
      id="scroll-journey"
      ref={containerRef}
      style={{ position: 'relative' }}
    >
      <motion.div
        ref={sectionRef}
        animate={{ backgroundColor: bgColor }}
        transition={{ duration: 0.55, ease: 'easeInOut' }}
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Floating particles */}
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <Particle key={i} index={i} step={step} />
        ))}

        {/* Speech bubbles — one active at a time */}
        <SpeechBubble
          text='"Oh look, a surprise gift box!"'
          side="left"
          visible={step === 1}
        />
        <SpeechBubble
          text='"So exciting!"'
          side="right"
          visible={step === 2}
        />
        <SpeechBubble
          text='"I wonder what could be inside...?"'
          side="left"
          visible={step === 3}
        />

        {/* Gift box */}
        <motion.div
          animate={{ scale: boxScale, y: step === 0 ? 30 : 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
          style={{ zIndex: 10 }}
        >
          <GiftBox wobble={step > 0} isOpen={false} scale={1} />
        </motion.div>

        {/* Scroll hint — visible on step 0, fades out */}
        <AnimatePresence>
          {step < MAX_STEP && (
            <motion.div
              key="scroll-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: step === 0 ? 0.75 : 0.4 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'absolute',
                bottom: '32px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontFamily: 'var(--font-head)',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                fontWeight: 600,
                letterSpacing: '0.05em',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              {step === 0 ? 'Scroll to peek inside... 🎁' : `Step ${step} / 3 — keep scrolling ↓`}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step dots progress */}
        <div style={{
          position: 'absolute',
          right: '24px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 30,
        }}>
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              animate={{
                scale: step >= s ? 1.2 : 1,
                backgroundColor: step >= s ? '#ff8da1' : 'rgba(255,141,161,0.25)',
              }}
              transition={{ duration: 0.3 }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                border: '1.5px solid rgba(255,141,161,0.5)',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Spacer — keep container tall enough for natural scroll to reach BoxReveal below */}
      <div style={{ height: '60px' }} />
    </div>
  );
}
