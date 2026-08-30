import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GiftBox from './GiftBox';
import { fullRevealBurst } from '../lib/confetti';
import { sfxPop, sfxWhoosh, sfxChime, sfxSparkle } from '../lib/audio';

export default function BoxReveal({ onOpenBox, canOpen = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleOpen = () => {
    if (clicked) {
      onOpenBox?.();
      return;
    }
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

    // Launch the unified popup showcase on screen
    setTimeout(() => {
      sfxChime();
      onOpenBox?.();
    }, 600);
  };

  return (
    <div
      id="box-reveal"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 20,
      }}
    >
      {/* 3D Mysterious Gift Box */}
      <motion.div
        animate={{
          scale: isOpen ? 1.08 : 1,
        }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{ position: 'relative', zIndex: 10, cursor: isOpen ? 'pointer' : 'default' }}
        onClick={isOpen ? onOpenBox : undefined}
      >
        <GiftBox wobble={!isOpen} isOpen={isOpen} scale={1.25} />
      </motion.div>

      {/* CTA Button — Shows when user scrolls to the final destination */}
      <AnimatePresence>
        {canOpen && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.88 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 240, damping: 20 }}
            style={{ marginTop: '36px', position: 'relative', zIndex: 15 }}
          >
            <button className="open-btn" onClick={handleOpen} id="open-gift-btn">
              Click to Open 🎁
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Re-open shortcut button if closed */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '24px', zIndex: 15 }}
          >
            <button
              onClick={onOpenBox}
              style={{
                background: 'linear-gradient(135deg, #ff8da1, #ff6b8b)',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '10px 24px',
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(255, 107, 139, 0.35)',
              }}
            >
              View Box Gifts Again
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
