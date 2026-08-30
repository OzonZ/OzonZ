import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCw, Music2 } from 'lucide-react';
import { switchBgmTrack, sfxRustle, sfxFlip, sfxSparkle } from '../lib/audio';

export default function PostCardModal({ isOpen, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (isOpen) {
      sfxRustle();
      sfxSparkle();
      // Switch to the Dept - Strawberry Champagne track
      switchBgmTrack('postcard');
    } else {
      // Switch back to The Greenhouse Hour main track
      switchBgmTrack('main');
    }
  }, [isOpen]);

  const handleFlip = () => {
    sfxFlip();
    setIsFlipped(!isFlipped);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="finale-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          style={{ zIndex: 250 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              perspective: '1200px',
              maxWidth: '560px',
              width: '92vw',
            }}
          >
            {/* 3D Flip Card Container */}
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
              style={{
                width: '100%',
                transformStyle: 'preserve-3d',
                position: 'relative',
              }}
            >
              {/* ─── FRONT SIDE: Heartfelt Letter & Vintage Stamp ──────────── */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  background: '#FFFDF9',
                  borderRadius: '24px',
                  padding: '32px 28px',
                  boxShadow: '0 24px 70px rgba(255, 141, 161, 0.35), 0 4px 16px rgba(0,0,0,0.06)',
                  border: '8px solid #FFFFFF',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Airmail pastel candy ribbon header */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '8px',
                    background: 'repeating-linear-gradient(45deg, #ff8da1, #ff8da1 14px, #ffd1dc 14px, #ffd1dc 28px, #b388ff 28px, #b388ff 42px)',
                  }}
                />

                {/* Close Button */}
                <button
                  onClick={onClose}
                  style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'rgba(0,0,0,0.05)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                  }}
                  title="Close Postcard"
                >
                  <X size={18} />
                </button>

                {/* Postcard Top Section */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginTop: '8px',
                    marginBottom: '20px',
                    borderBottom: '2px dashed #f0d5db',
                    paddingBottom: '16px',
                  }}
                >
                  {/* Airmail Postmark Seal */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        border: '2px dashed #ff8da1',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ff6b8b',
                        fontSize: '10px',
                        fontWeight: 700,
                        transform: 'rotate(-12deg)',
                      }}
                    >
                      <span>SPECIAL</span>
                      <span>DELIVERY</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--primary-dark)', fontSize: '1.1rem' }}>
                        💌 Secret Postcard
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Music2 size={12} color="#b388ff" />
                        <span style={{ fontWeight: 600, color: '#7c4dff' }}>Dept - Strawberry Champagne</span>
                      </div>
                    </div>
                  </div>

                  {/* Stamp */}
                  <div
                    style={{
                      width: '54px',
                      height: '66px',
                      background: 'linear-gradient(135deg, #ffd1dc, #ff8da1)',
                      borderRadius: '6px',
                      border: '2px dashed #ffffff',
                      boxShadow: '0 4px 12px rgba(255, 141, 161, 0.3)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'rotate(6deg)',
                      padding: '4px',
                    }}
                  >
                    <span style={{ fontSize: '22px' }}>🎂</span>
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.5px' }}>NON'S GIFT</span>
                  </div>
                </div>

                {/* Postcard Body Message */}
                <div
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.95rem',
                    lineHeight: 1.8,
                    color: 'var(--text-main)',
                    marginBottom: '24px',
                  }}
                >
                  <p style={{ fontWeight: 700, color: '#ff6b8b', marginBottom: '8px' }}>
                    Dear someone very special ✨,
                  </p>
                  <p style={{ marginBottom: '12px' }}>
                    Thank you so much for bringing pure sunshine and laughter into my life every single day!
                  </p>
                  <p style={{ marginBottom: '12px' }}>
                    No matter what crazy adventure comes next, knowing you're around makes every single moment brighter and full of joy.
                    May your birthday (and every day after) be filled with endless smiles, sweet treats, and victory streaks!
                  </p>
                  <p style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-main)', marginTop: '16px' }}>
                    Forever your teammate & puppy,<br />
                    <span style={{ color: '#ff6b8b', fontSize: '1.05rem', fontFamily: 'var(--font-head)' }}>— Non</span>
                  </p>
                </div>

                {/* Bottom Actions */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                  <button
                    onClick={handleFlip}
                    style={{
                      background: 'rgba(179, 136, 255, 0.15)',
                      border: '1.5px solid rgba(179, 136, 255, 0.35)',
                      color: '#7c4dff',
                      borderRadius: '999px',
                      padding: '8px 18px',
                      fontFamily: 'var(--font-head)',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <RotateCw size={14} />
                    <span>Flip to Memory Photo 📸</span>
                  </button>

                  <button
                    onClick={onClose}
                    style={{
                      background: 'linear-gradient(135deg, #ff8da1, #ff6b8b)',
                      border: 'none',
                      color: '#ffffff',
                      borderRadius: '999px',
                      padding: '8px 22px',
                      fontFamily: 'var(--font-head)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(255, 107, 139, 0.35)',
                    }}
                  >
                    Keep in Box 🎁
                  </button>
                </div>
              </div>

              {/* ─── BACK SIDE: Memory Polaroid & Note ────────────────────── */}
              <div
                style={{
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  position: 'absolute',
                  inset: 0,
                  background: '#FFFDF9',
                  borderRadius: '24px',
                  padding: '32px 28px',
                  boxShadow: '0 24px 70px rgba(255, 141, 161, 0.35), 0 4px 16px rgba(0,0,0,0.06)',
                  border: '8px solid #FFFFFF',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  overflow: 'hidden',
                }}
              >
                {/* Airmail ribbon top */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '8px',
                    background: 'repeating-linear-gradient(45deg, #ff8da1, #ff8da1 14px, #ffd1dc 14px, #ffd1dc 28px, #b388ff 28px, #b388ff 42px)',
                  }}
                />

                {/* Polaroid Frame */}
                <motion.div
                  whileHover={{ scale: 1.04, rotate: 0 }}
                  style={{
                    background: '#ffffff',
                    padding: '14px 14px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                    border: '1px solid #f0e6eb',
                    transform: 'rotate(-3deg)',
                    maxWidth: '260px',
                    marginBottom: '18px',
                  }}
                >
                  <div
                    style={{
                      width: '230px',
                      height: '160px',
                      background: 'linear-gradient(135deg, #ffd1dc, #ffebf0, #b388ff)',
                      borderRadius: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    <span style={{ fontSize: '42px', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))' }}>🐶🎂💖</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff', marginTop: '6px', background: 'rgba(0,0,0,0.15)', padding: '2px 8px', borderRadius: '999px' }}>
                      Best Moments Together
                    </span>
                  </div>
                  <p style={{ marginTop: '12px', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                    "To infinity & beyond! ✨"
                  </p>
                </motion.div>

                <p style={{ fontFamily: 'var(--font-head)', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  Tap below to flip back to the message 💌
                </p>

                <button
                  onClick={handleFlip}
                  style={{
                    background: 'linear-gradient(135deg, #b388ff, #ff8da1)',
                    border: 'none',
                    color: '#ffffff',
                    borderRadius: '999px',
                    padding: '8px 24px',
                    fontFamily: 'var(--font-head)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(179, 136, 255, 0.4)',
                  }}
                >
                  <RotateCw size={14} />
                  <span>Flip Back to Letter</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
