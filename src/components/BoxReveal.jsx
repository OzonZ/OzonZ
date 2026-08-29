import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GiftBox from './GiftBox';
import RedEnvelope from './RedEnvelope';
import { fullRevealBurst } from '../lib/confetti';
import { sfxPop, sfxWhoosh } from '../lib/audio';

export default function BoxReveal({ onEnvelopeOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showEnvelope, setShowEnvelope] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleOpen = () => {
    if (clicked) return;
    setClicked(true);
    sfxPop();

    // Fire confetti
    fullRevealBurst();

    // Open box after brief delay
    setTimeout(() => {
      setIsOpen(true);
      sfxWhoosh();
    }, 150);

    // Slide in envelope
    setTimeout(() => {
      setShowEnvelope(true);
    }, 600);
  };

  return (
    <section
      id="box-reveal"
      style={{
        minHeight: '100vh',
        background: '#ffebf0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Soft glow orb behind */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(255,141,161,0.18) 0%, transparent 70%)',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      />

      {/* Gift Box */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.1 }}
        style={{ position: 'relative', zIndex: 10 }}
      >
        <GiftBox wobble={!isOpen} isOpen={isOpen} scale={1.2} />
      </motion.div>

      {/* CTA Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ marginTop: '40px', position: 'relative', zIndex: 10 }}
          >
            <button className="open-btn" onClick={handleOpen} id="open-gift-btn">
              Click to Open 🎁
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Red Envelope reveal */}
      <AnimatePresence>
        {showEnvelope && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 140, damping: 18, delay: 0.2 }}
            style={{ marginTop: '36px', position: 'relative', zIndex: 10 }}
          >
            <div style={{
              textAlign: 'center',
              marginBottom: '16px',
              fontFamily: 'var(--font-head)',
              fontWeight: 700,
              color: 'var(--text-main)',
              fontSize: '1.05rem',
            }}>
              🎉 Something's inside... tap to reveal!
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <RedEnvelope onOpen={onEnvelopeOpen} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
