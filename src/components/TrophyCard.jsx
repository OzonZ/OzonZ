import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCw } from 'lucide-react';
import { sfxFlip, sfxPop } from '../lib/audio';

export default function TrophyCard({ index = 3, onFlipped }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDialog, setShowDialog] = useState(true);

  const handleFlip = (e) => {
    e?.stopPropagation?.();
    sfxFlip();
    setShowDialog(false);
    setIsFlipped((prev) => {
      const next = !prev;
      if (next) onFlipped?.();
      return next;
    });
  };

  const handleDialogClick = (e) => {
    e?.stopPropagation?.();
    handleFlip(e);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 150, damping: 20, delay: index * 0.12 }}
      style={{ position: 'relative', width: '100%' }}
    >
      {/* Dialog popup hint */}
      <AnimatePresence>
        {showDialog && !isFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            style={{
              position: 'absolute',
              top: '-85px',
              right: '0',
              zIndex: 50,
              background: 'rgba(255,255,255,0.98)',
              border: '1.5px solid rgba(255,141,161,0.35)',
              borderRadius: '16px',
              padding: '12px 16px',
              maxWidth: '260px',
              width: '85vw',
              boxShadow: '0 12px 36px rgba(255,141,161,0.22)',
              textAlign: 'center',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '0.83rem',
              color: 'var(--text-main)',
              lineHeight: 1.5,
            }}
            onClick={handleDialogClick}
          >
            "Awarded to the ultimate goofball of the year... Hmm, I wonder who this could possibly belong to?"
            <div
              style={{
                marginTop: '6px',
                fontSize: '0.72rem',
                color: 'var(--primary)',
                fontWeight: 700,
                fontFamily: 'var(--font-head)',
              }}
            >
              Tap to flip the card →
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Flip Card Scene */}
      <div
        style={{
          perspective: '1000px',
          width: '100%',
          cursor: 'pointer',
          minHeight: '260px',
        }}
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleFlip()}
        aria-label="Trophy card — click to flip"
      >
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            position: 'relative',
            minHeight: '260px',
          }}
        >
          {/* FRONT */}
          <div
            className="voucher-card"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              position: 'relative',
              width: '100%',
              minHeight: '260px',
            }}
          >
            <div
              className="voucher-card-header"
              style={{
                background: 'linear-gradient(135deg, #f4a261, #ffd166)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                paddingBottom: '20px',
              }}
            >
              <span className="voucher-badge">Special Collectible</span>
              {/* Trophy illustration */}
              <div
                style={{
                  fontSize: '3.5rem',
                  textAlign: 'center',
                  margin: '8px 0',
                  filter: 'drop-shadow(0 4px 8px rgba(244,162,97,0.4))',
                }}
              >
                🏆
              </div>
              <h3 className="voucher-title" style={{ textAlign: 'center', color: '#3d2000' }}>
                Annual Derp of the Year Award
              </h3>
            </div>
            <div className="voucher-card-body" style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontSize: '0.82rem',
                  color: 'var(--text-muted)',
                  fontStyle: 'italic',
                  marginBottom: '8px',
                }}
              >
                Awarded to someone very special...
              </p>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(244,162,97,0.15)',
                  borderRadius: '999px',
                  padding: '6px 14px',
                  fontFamily: 'var(--font-head)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  color: '#c87533',
                }}
              >
                ↩ Click card to flip!
              </motion.div>
            </div>
          </div>

          {/* BACK */}
          <div
            className="voucher-card"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '260px',
            }}
          >
            <div
              className="voucher-card-header"
              style={{ background: 'linear-gradient(135deg, #6c63ff, #b388ff)' }}
            >
              <span className="voucher-badge">🎮 10x Redeemable</span>
              <h3 className="voucher-title">10-Game RoV Carry Coupon (Arena of Valor)</h3>
            </div>
            <div
              className="voucher-card-body"
              style={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p className="voucher-description">
                  Can be redeemed individually across 10 separate gaming matches.
                </p>
                <p className="voucher-terms">
                  Condition: Non has strictly 0% right of refusal — he MUST team up and carry every single time, no excuses allowed!
                </p>
              </div>
              <motion.div
                style={{
                  marginTop: '10px',
                  fontSize: '0.75rem',
                  color: '#b388ff',
                  fontFamily: 'var(--font-head)',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                ↩ Tap to flip back
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>


    </motion.div>
  );
}
