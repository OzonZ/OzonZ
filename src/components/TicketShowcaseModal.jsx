import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from 'lucide-react';
import VoucherCard from './VoucherCard';
import TrophyCard from './TrophyCard';
import { sfxPop, sfxWhoosh, sfxChime } from '../lib/audio';

const TICKETS_DATA = [
  {
    type: 'voucher',
    id: 'pass_01',
    badge: '⚡ 1x Single Use',
    title: '⚡ Instant Non-Summon Pass',
    description: 'Summons Non immediately to your location!',
    terms: "Send the message 'Come here, doggy!' — the exact second Non reads it, he must rush over to find you right away with zero hesitation.",
  },
  {
    type: 'voucher',
    id: 'pass_02',
    badge: '🐶 2x Available',
    title: "🐶 1-Minute 'Bark Bark' Pass",
    description: 'Forces Non to unleash his inner puppy!',
    terms: "Non is contractually obligated to bark ('Bark! Bark!') for 1 full continuous minute upon activation.",
  },
  {
    type: 'voucher',
    id: 'pass_03',
    badge: '👂 3x Available',
    title: '👂 24-Hour Non-Stop Venting Pass',
    description: 'Your personal non-judgmental listening ear.',
    terms: 'Non will sit and patiently listen to you vent and complain for 24 hours straight — attentive, empathetic, and without any judgment.',
  },
  {
    type: 'trophy',
    id: 'pass_04_trophy_flip',
    title: '🏆 Annual Derp of the Year Award',
  },
];

export default function TicketShowcaseModal({ isOpen, onClose, onOpenPostcard, onAllViewed }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedIndices, setViewedIndices] = useState(new Set([0]));
  const [direction, setDirection] = useState(1);

  const currentItem = TICKETS_DATA[currentIndex];
  const isLast = currentIndex === TICKETS_DATA.length - 1;
  const allViewed = viewedIndices.size === TICKETS_DATA.length;

  const handleNext = () => {
    if (currentIndex < TICKETS_DATA.length - 1) {
      sfxWhoosh();
      setDirection(1);
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setViewedIndices((prev) => new Set([...prev, nextIdx]));
    } else {
      sfxChime();
      onAllViewed?.();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      sfxWhoosh();
      setDirection(-1);
      setCurrentIndex(currentIndex - 1);
    }
  };

  const selectIndex = (idx) => {
    sfxPop();
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    setViewedIndices((prev) => new Set([...prev, idx]));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="finale-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{ zIndex: 220 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '28px',
              maxWidth: '520px',
              width: '92vw',
              boxShadow: '0 25px 80px rgba(255, 141, 161, 0.3), 0 8px 24px rgba(0,0,0,0.08)',
              overflow: 'hidden',
              position: 'relative',
              padding: '24px 20px',
            }}
          >
            {/* Header / Close */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <div>
                <span
                  style={{
                    background: 'linear-gradient(135deg, #ff8da1, #ff6b8b)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    fontFamily: 'var(--font-head)',
                    letterSpacing: '0.5px',
                  }}
                >
                  🧧 RED ENVELOPE TREASURE
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-head)',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    color: 'var(--text-main)',
                    marginTop: '4px',
                  }}
                >
                  Gift {currentIndex + 1} of {TICKETS_DATA.length}
                </h3>
              </div>

              <button
                onClick={onClose}
                style={{
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
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Step Indicators */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '20px',
              }}
            >
              {TICKETS_DATA.map((t, idx) => {
                const isActive = idx === currentIndex;
                const isViewed = viewedIndices.has(idx);
                return (
                  <button
                    key={t.id}
                    onClick={() => selectIndex(idx)}
                    style={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '999px',
                      border: 'none',
                      background: isActive
                        ? 'linear-gradient(90deg, #ff8da1, #ff6b8b)'
                        : isViewed
                        ? '#ffd1dc'
                        : '#f0f2f5',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                    title={`View Gift ${idx + 1}`}
                  />
                );
              })}
            </div>

            {/* Animated Card View Area */}
            <div style={{ minHeight: '290px', position: 'relative', overflow: 'hidden' }}>
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={currentItem.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction * -50, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  style={{ width: '100%' }}
                >
                  {currentItem.type === 'voucher' ? (
                    <VoucherCard
                      badge={currentItem.badge}
                      title={currentItem.title}
                      description={currentItem.description}
                      terms={currentItem.terms}
                      index={0}
                    />
                  ) : (
                    <TrophyCard index={0} onFlipped={onAllViewed} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1.5px dashed #f0d5db',
                gap: '10px',
              }}
            >
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                style={{
                  background: 'none',
                  border: '1.5px solid #ffd1dc',
                  color: currentIndex === 0 ? '#cbd5e1' : 'var(--primary-dark)',
                  borderRadius: '999px',
                  padding: '10px 18px',
                  fontFamily: 'var(--font-head)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentIndex === 0 ? 0.4 : 1,
                }}
              >
                <ChevronLeft size={16} />
                <span>Prev</span>
              </button>

              {isLast ? (
                <div style={{ display: 'flex', gap: '8px' }}>
                  {onOpenPostcard && (
                    <motion.button
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        onClose();
                        onOpenPostcard();
                      }}
                      style={{
                        background: 'linear-gradient(135deg, #b388ff, #ff8da1)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '10px 18px',
                        fontFamily: 'var(--font-head)',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 16px rgba(179, 136, 255, 0.4)',
                      }}
                    >
                      <span>Open Postcard 💌</span>
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={onClose}
                    style={{
                      background: 'linear-gradient(135deg, #ff8da1, #ff6b8b)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '10px 20px',
                      fontFamily: 'var(--font-head)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 4px 16px rgba(255, 107, 139, 0.4)',
                    }}
                  >
                    <span>Done ✨</span>
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  style={{
                    background: 'linear-gradient(135deg, #ff8da1, #ff6b8b)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '10px 22px',
                    fontFamily: 'var(--font-head)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(255, 107, 139, 0.4)',
                  }}
                >
                  <span>Next Gift</span>
                  <ChevronRight size={16} />
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
