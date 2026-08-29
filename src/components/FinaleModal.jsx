import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { finaleConfetti } from '../lib/confetti';
import { sfxChime } from '../lib/audio';

const STICKERS = ['🎈', '🐾', '✨', '🎂', '🥳', '🎉'];

export default function FinaleModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      sfxChime();
      setTimeout(finaleConfetti, 400);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="finale-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
          >
            {/* Card */}
            <motion.div
              className="finale-card"
              initial={{ opacity: 0, scale: 0.8, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22, delay: 0.1 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Floating stickers */}
              {STICKERS.map((s, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: 'absolute',
                    fontSize: '1.5rem',
                    pointerEvents: 'none',
                    top: `${10 + (i % 3) * 18}%`,
                    left: i % 2 === 0 ? `${5 + i * 3}%` : `${75 + (i % 3) * 5}%`,
                  }}
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, i % 2 === 0 ? 10 : -10, 0],
                  }}
                  transition={{
                    duration: 2.5 + i * 0.3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeInOut',
                  }}
                >
                  {s}
                </motion.div>
              ))}

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{ textAlign: 'center', marginBottom: '20px' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🎂</div>
                <h2
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 700,
                    fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                    color: 'var(--text-main)',
                    lineHeight: 1.2,
                  }}
                >
                  The Multi-Dimensional{' '}
                  <span className="gradient-text">Birthday Card</span>
                </h2>
              </motion.div>

              {/* Divider */}
              <div
                style={{
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #ffd1dc, #b388ff, transparent)',
                  marginBottom: '20px',
                  borderRadius: '999px',
                }}
              />

              {/* Birthday message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                  color: 'var(--text-main)',
                  textAlign: 'center',
                  marginBottom: '24px',
                }}
              >
                Wishing you the happiest of birthdays! Whether this is way in
                advance, horribly belated, or right on time today...{' '}
                <strong>Honestly, who knows?!</strong> Just know you're
                celebrated across all timelines! 🎉🥳
              </motion.p>

              {/* Sticker row */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '12px',
                  marginBottom: '28px',
                  flexWrap: 'wrap',
                }}
              >
                {['🎈 Balloons', '🐾 Dog Paw Print', '✨ Magic Sparks'].map((sticker) => (
                  <span
                    key={sticker}
                    style={{
                      background: 'rgba(255, 141, 161, 0.12)',
                      border: '1.5px solid rgba(255, 141, 161, 0.25)',
                      borderRadius: '999px',
                      padding: '6px 14px',
                      fontFamily: 'var(--font-head)',
                      fontWeight: 600,
                      fontSize: '0.82rem',
                      color: 'var(--primary-dark)',
                    }}
                  >
                    {sticker}
                  </span>
                ))}
              </motion.div>

              {/* Close button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{ textAlign: 'center' }}
              >
                <button
                  onClick={onClose}
                  style={{
                    background: 'linear-gradient(135deg, #ff8da1, #ff6b8b)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '12px 32px',
                    fontFamily: 'var(--font-head)',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    boxShadow: '0 6px 20px rgba(255, 107, 139, 0.35)',
                    transition: 'transform 0.2s',
                  }}
                  onMouseEnter={(e) => (e.target.style.transform = 'scale(1.05)')}
                  onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
                  id="finale-close-btn"
                >
                  Thank you! 💖
                </button>
              </motion.div>

              {/* Signed */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                style={{
                  textAlign: 'center',
                  marginTop: '16px',
                  fontFamily: 'var(--font-head)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  color: 'var(--text-muted)',
                }}
              >
                With love, from Non 🐶💕
              </motion.p>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
