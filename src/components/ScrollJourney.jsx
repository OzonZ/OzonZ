import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, useMotionValue, useSpring } from 'framer-motion';
import GiftBox from './GiftBox';

// Ambient floating particle
function Particle({ initialColor, finalColor, index, scrollProgress }) {
  const size = 6 + (index % 5) * 3;
  const leftPct = 5 + (index * 17.3) % 90;
  const duration = 6 + (index % 4) * 2;
  const delay = (index % 5) * -2;

  const colorVal = useTransform(scrollProgress, [0, 0.5], [initialColor, finalColor]);
  const opacityVal = useTransform(scrollProgress, [0, 0.1, 0.8, 1], [0, 0.7, 0.85, 0.4]);

  return (
    <motion.div
      style={{
        position: 'absolute',
        bottom: '-20px',
        left: `${leftPct}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: colorVal,
        opacity: opacityVal,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        filter: 'blur(1px)',
        pointerEvents: 'none',
      }}
      className="particle-dot"
    />
  );
}

// Speech bubble component
function SpeechBubble({ text, side, scrollProgress, rangeIn, rangeOut }) {
  const opacity = useTransform(scrollProgress, [rangeIn, rangeIn + 0.07, rangeOut - 0.04, rangeOut], [0, 1, 1, 0]);
  const x = useTransform(
    scrollProgress,
    [rangeIn, rangeIn + 0.07],
    side === 'left' ? [-40, 0] : [40, 0]
  );
  const y = useTransform(scrollProgress, [rangeIn, rangeIn + 0.07], [10, 0]);

  return (
    <motion.div
      style={{
        opacity,
        x,
        y,
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
  );
}

export default function ScrollJourney({ onScrollComplete }) {
  const containerRef = useRef(null);
  const [hasCompleted, setHasCompleted] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Background color morph
  const bgColor = useTransform(
    scrollYProgress,
    [0, 0.6],
    ['#ffffff', '#ffebf0']
  );

  // Gift box scale
  const boxScale = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.7, 1, 1.05, 1.1]);
  const boxY = useTransform(scrollYProgress, [0, 1], [60, 0]);

  // Detect scroll complete
  useEffect(() => {
    const unsub = scrollYProgress.on('change', (val) => {
      if (val > 0.92 && !hasCompleted) {
        setHasCompleted(true);
        onScrollComplete?.();
      }
    });
    return unsub;
  }, [scrollYProgress, hasCompleted, onScrollComplete]);

  const PARTICLES_INITIAL = ['#FFA07A', '#FF69B4', '#B388FF', '#FFD166', '#FF8DA1'];
  const PARTICLES_FINAL   = ['rgba(255,255,255,0.9)', 'rgba(255,209,220,0.8)', 'rgba(255,255,255,0.7)', 'rgba(255,209,220,0.9)', 'rgba(255,255,255,0.85)'];

  return (
    <div
      id="scroll-journey"
      ref={containerRef}
      style={{ height: '350vh', position: 'relative' }}
    >
      {/* Sticky viewport */}
      <motion.div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          backgroundColor: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Floating particles */}
        {PARTICLES_INITIAL.map((color, i) => (
          Array.from({ length: 3 }, (_, j) => (
            <Particle
              key={`p-${i}-${j}`}
              index={i * 3 + j}
              initialColor={color}
              finalColor={PARTICLES_FINAL[i]}
              scrollProgress={scrollYProgress}
            />
          ))
        ))}

        {/* Speech bubbles */}
        <SpeechBubble
          text='"Oh look, a surprise gift box!"'
          side="left"
          scrollProgress={scrollYProgress}
          rangeIn={0.15}
          rangeOut={0.32}
        />
        <SpeechBubble
          text='"So exciting!"'
          side="right"
          scrollProgress={scrollYProgress}
          rangeIn={0.38}
          rangeOut={0.52}
        />
        <SpeechBubble
          text='"I wonder what could be inside...?"'
          side="left"
          scrollProgress={scrollYProgress}
          rangeIn={0.58}
          rangeOut={0.74}
        />

        {/* Centered gift box */}
        <motion.div
          style={{
            scale: boxScale,
            y: boxY,
            zIndex: 10,
          }}
        >
          <GiftBox wobble={true} isOpen={false} scale={1} />
        </motion.div>

        {/* Scroll progress hint at bottom */}
        <motion.div
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            opacity: useTransform(scrollYProgress, [0, 0.08, 0.85, 1], [0.8, 0.6, 0.4, 0]),
            fontFamily: 'var(--font-head)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textAlign: 'center',
          }}
        >
          Keep scrolling... 🎁
        </motion.div>
      </motion.div>
    </div>
  );
}
