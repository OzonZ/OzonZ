import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoucherCard from './VoucherCard';
import TrophyCard from './TrophyCard';
import { sfxPop } from '../lib/audio';

const ALL_CARDS = [
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
  },
];

const REVEAL_LABELS = [
  '✨ Reveal First Gift',
  '🎁 Open Next Gift',
  '🎁 One More...',
  '🏆 Last One!',
];

/**
 * Scene 04 — Voucher grid with one-by-one click reveal
 * Props: onAllViewed — callback after trophy card is flipped
 */
export default function VoucherGrid({ onAllViewed }) {
  const [revealCount, setRevealCount]   = useState(0);
  const [trophyFlipped, setTrophyFlipped] = useState(false);

  const canRevealMore  = revealCount < ALL_CARDS.length;
  const allRevealed    = revealCount >= ALL_CARDS.length;

  const handleReveal = () => {
    if (!canRevealMore) return;
    sfxPop();
    setRevealCount(c => c + 1);
  };

  const handleTrophyFlipped = () => {
    setTrophyFlipped(true);
    setTimeout(() => onAllViewed?.(), 1200);
  };

  return (
    <section
      id="voucher-grid"
      style={{
        background: '#ffebf0',
        padding: '80px 24px 100px',
        position: 'relative',
      }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', marginBottom: '48px' }}
      >
        <motion.div
          style={{ fontSize: '2.5rem', marginBottom: '12px' }}
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        >
          🎉
        </motion.div>
        <h2
          style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 700,
            fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
            color: 'var(--text-main)',
            marginBottom: '10px',
          }}
        >
          Your Gift Collection
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            color: 'var(--text-muted)',
            fontSize: '1rem',
            maxWidth: '400px',
            margin: '0 auto',
          }}
        >
          {allRevealed
            ? 'All gifts revealed! Flip the trophy card to see your bonus! 💅'
            : `${revealCount} of ${ALL_CARDS.length} gifts revealed — tap to open the next one!`}
        </p>
      </motion.div>

      {/* Cards grid */}
      <div
        className="section-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        <AnimatePresence>
          {ALL_CARDS.slice(0, revealCount).map((card, i) => (
            card.type === 'voucher' ? (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, scale: 0.88, rotate: -2 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              >
                <VoucherCard {...card} index={i} />
              </motion.div>
            ) : (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 50, scale: 0.88, rotate: 2 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              >
                <TrophyCard index={i} onFlipped={handleTrophyFlipped} />
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>

      {/* Reveal button */}
      <AnimatePresence>
        {canRevealMore && (
          <motion.div
            key="reveal-btn"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 240, damping: 22, delay: revealCount === 0 ? 0.3 : 0 }}
            style={{ textAlign: 'center', marginTop: revealCount === 0 ? '0' : '32px' }}
          >
            <motion.button
              onClick={handleReveal}
              whileHover={{ scale: 1.06, y: -3 }}
              whileTap={{ scale: 0.96 }}
              style={{
                background: 'linear-gradient(135deg, #ff8da1, #ff6b8b)',
                color: '#fff',
                border: 'none',
                borderRadius: '999px',
                padding: '15px 36px',
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 8px 28px rgba(255, 107, 139, 0.4)',
                animation: 'pulsateGlow 2.5s ease-in-out infinite',
              }}
              id={`reveal-btn-${revealCount}`}
            >
              {REVEAL_LABELS[revealCount] ?? '🎁 Open Next Gift'}
            </motion.button>
            <p style={{
              marginTop: '12px',
              fontSize: '0.78rem',
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
            }}>
              {ALL_CARDS.length - revealCount} gift{ALL_CARDS.length - revealCount !== 1 ? 's' : ''} remaining
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teaser after trophy flipped */}
      <AnimatePresence>
        {trophyFlipped && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              textAlign: 'center',
              marginTop: '40px',
              fontFamily: 'var(--font-head)',
              fontWeight: 600,
              color: 'var(--primary)',
              fontSize: '0.95rem',
            }}
          >
            ✨ Psst... one more surprise is on its way!
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
