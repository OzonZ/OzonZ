import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GiftBox from './GiftBox';
import RedEnvelope from './RedEnvelope';
import { fullRevealBurst } from '../lib/confetti';
import { sfxPop, sfxWhoosh, sfxChime, sfxSparkle } from '../lib/audio';

export default function BoxReveal({ onOpenEnvelope, onOpenPostcard }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleOpen = () => {
    if (clicked) return;
    setClicked(true);
    sfxPop();
    sfxSparkle();

    // Fire festive multi-wave confetti
    fullRevealBurst();

    // Open box lid with spring
    setTimeout(() => {
      setIsOpen(true);
      sfxWhoosh();
    }, 150);

    // Reveal treasures inside
    setTimeout(() => {
      setShowItems(true);
      sfxChime();
    }, 650);
  };

  return (
    <div
      id="box-reveal"
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* Gift Box Container */}
      <motion.div
        animate={{ scale: isOpen ? 1.08 : 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ position: 'relative', zIndex: 10 }}
      >
        <GiftBox wobble={!isOpen} isOpen={isOpen} scale={1.25} />
      </motion.div>

      {/* CTA Button — Click to Open 🎁 */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.4 }}
            style={{ marginTop: '36px', position: 'relative', zIndex: 15 }}
          >
            <button className="open-btn" onClick={handleOpen} id="open-gift-btn">
              Click to Open 🎁
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inside the Box: 2 Interactive Treasures */}
      <AnimatePresence>
        {showItems && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            style={{
              marginTop: '32px',
              position: 'relative',
              zIndex: 20,
              width: '100%',
              maxWidth: '560px',
              padding: '0 16px',
            }}
          >
            <div
              style={{
                textAlign: 'center',
                marginBottom: '20px',
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                color: 'var(--text-main)',
                fontSize: '1.15rem',
              }}
            >
              🎉 Look what's inside the box! (2 Treasures)
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '20px',
                justifyContent: 'center',
                alignItems: 'stretch',
              }}
            >
              {/* Item 1: Red Envelope of Vouchers */}
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenEnvelope}
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #fff5f7)',
                  borderRadius: '24px',
                  padding: '24px 18px',
                  boxShadow: '0 14px 40px rgba(230, 57, 70, 0.18), 0 2px 8px rgba(0,0,0,0.04)',
                  border: '2px solid rgba(230, 57, 70, 0.25)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3.2rem', marginBottom: '8px', filter: 'drop-shadow(0 4px 8px rgba(230,57,70,0.3))' }}>
                  🧧
                </div>
                <span
                  style={{
                    background: '#e63946',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-head)',
                    marginBottom: '8px',
                  }}
                >
                  4 COLLECTIBLE PASSES
                </span>
                <h4 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Red Envelope
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                  Exclusive Non-Summon passes, puppy bark coupon & trophy award!
                </p>
                <div
                  style={{
                    marginTop: 'auto',
                    background: 'linear-gradient(135deg, #e63946, #c1121f)',
                    color: '#fff',
                    borderRadius: '999px',
                    padding: '8px 18px',
                    fontFamily: 'var(--font-head)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    boxShadow: '0 4px 12px rgba(230,57,70,0.3)',
                  }}
                >
                  Open Passes ➔
                </div>
              </motion.div>

              {/* Item 2: Secret Birthday Postcard */}
              <motion.div
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.96 }}
                onClick={onOpenPostcard}
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #f7f3ff)',
                  borderRadius: '24px',
                  padding: '24px 18px',
                  boxShadow: '0 14px 40px rgba(179, 136, 255, 0.22), 0 2px 8px rgba(0,0,0,0.04)',
                  border: '2px solid rgba(179, 136, 255, 0.35)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: '3.2rem', marginBottom: '8px', filter: 'drop-shadow(0 4px 8px rgba(179,136,255,0.35))' }}>
                  💌
                </div>
                <span
                  style={{
                    background: '#b388ff',
                    color: '#fff',
                    padding: '3px 10px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-head)',
                    marginBottom: '8px',
                  }}
                >
                  MUSIC & PHOTO
                </span>
                <h4 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)', marginBottom: '6px' }}>
                  Secret Postcard
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '14px' }}>
                  A personal heartfelt letter, souvenir polaroid, and melody!
                </p>
                <div
                  style={{
                    marginTop: 'auto',
                    background: 'linear-gradient(135deg, #b388ff, #ff8da1)',
                    color: '#fff',
                    borderRadius: '999px',
                    padding: '8px 18px',
                    fontFamily: 'var(--font-head)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    boxShadow: '0 4px 12px rgba(179,136,255,0.35)',
                  }}
                >
                  Read Postcard ➔
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
