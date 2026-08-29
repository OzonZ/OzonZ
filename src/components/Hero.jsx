import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

/**
 * Hero — Scene 01
 * bgProgress (0→1): passed from App, drives white→pink background transition
 * as user scrolls into the scroll journey section.
 */
export default function Hero({ bgProgress = 0 }) {
  // Interpolate white → #ffebf0 based on scroll
  // rgb(255,255,255) → rgb(255,235,240)
  const r = 255;
  const g = Math.round(255 - bgProgress * 20); // 255 → 235
  const b = Math.round(255 - bgProgress * 15); // 255 → 240
  const heroBg = `rgb(${r},${g},${b})`;

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: heroBg,
        transition: 'background 0.05s linear',
      }}
    >
      {/* Animated Mesh Gradient Background */}
      <div className="mesh-bg">
        <div className="mesh-blob mesh-blob-1" />
        <div className="mesh-blob mesh-blob-2" />
        <div className="mesh-blob mesh-blob-3" />
      </div>

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 24px',
          maxWidth: '680px',
        }}
      >
        {/* Emoji decoration */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
          style={{ fontSize: '4rem', marginBottom: '16px', display: 'block' }}
        >
          ✨
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
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
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
        </motion.p>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              color: 'var(--primary)',
              fontSize: '1rem',
            }}
          >
            Try scrolling down to see... Good luck! ✨
          </p>

          {/* Bouncing arrow */}
          <motion.div
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
              cursor: 'pointer',
            }}
            onClick={() => {
              document.getElementById('scroll-journey')?.scrollIntoView({ behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronDown size={22} color="#fff" strokeWidth={2.5} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
