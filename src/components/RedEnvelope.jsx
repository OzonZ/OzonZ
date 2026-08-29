import { useState } from 'react';
import { motion } from 'framer-motion';
import { sfxRustle } from '../lib/audio';

export default function RedEnvelope({ onOpen }) {
  const [isOpen, setIsOpen] = useState(false);
  const [opened, setOpened] = useState(false);

  const handleClick = () => {
    if (opened) return;
    sfxRustle();
    setIsOpen(true);
    setTimeout(() => {
      setOpened(true);
      onOpen?.();
    }, 700);
  };

  return (
    <motion.div
      className="envelope-wrap"
      onClick={handleClick}
      style={{ cursor: opened ? 'default' : 'pointer' }}
      whileHover={!opened ? { scale: 1.05, y: -4 } : {}}
      whileTap={!opened ? { scale: 0.97 } : {}}
      title={opened ? '' : 'Click to open the envelope!'}
    >
      {/* Envelope body */}
      <div className="envelope-body" />

      {/* Pocket triangles */}
      <div className="envelope-pocket-left" />
      <div className="envelope-pocket-right" />

      {/* Flap */}
      <motion.div
        className="envelope-flap"
        animate={isOpen ? { rotateX: 180, originY: 0 } : { rotateX: 0 }}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
      />

      {/* Gold seal */}
      <motion.div
        className="envelope-gold-circle"
        animate={isOpen ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        💖
      </motion.div>

      {/* Hint text below envelope */}
      {!opened && (
        <motion.div
          style={{
            position: 'absolute',
            bottom: '-36px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: 'var(--font-head)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--primary)',
            whiteSpace: 'nowrap',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨ Tap to open
        </motion.div>
      )}
    </motion.div>
  );
}
