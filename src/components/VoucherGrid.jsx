import { useState } from 'react';
import { motion } from 'framer-motion';
import VoucherCard from './VoucherCard';
import TrophyCard from './TrophyCard';

const VOUCHERS = [
  {
    id: 'pass_01',
    badge: '⚡ 1x Single Use',
    title: '⚡ Instant Non-Summon Pass',
    description: 'Summons Non immediately to your location!',
    terms: "Send the message 'Come here, doggy!' — the exact second Non reads it, he must rush over to find you right away with zero hesitation.",
  },
  {
    id: 'pass_02',
    badge: '🐶 2x Available',
    title: "🐶 1-Minute 'Bark Bark' Pass",
    description: 'Forces Non to unleash his inner puppy!',
    terms: "Non is contractually obligated to bark ('Bark! Bark!') for 1 full continuous minute upon activation.",
  },
  {
    id: 'pass_03',
    badge: '👂 3x Available',
    title: '👂 24-Hour Non-Stop Venting Pass',
    description: 'Your personal non-judgmental listening ear.',
    terms: 'Non will sit and patiently listen to you vent and complain for 24 hours straight — attentive, empathetic, and without any judgment.',
  },
];

/**
 * Scene 04 — Voucher grid + trophy flip card
 * Props: onAllViewed — callback when all cards have been seen
 */
export default function VoucherGrid({ onAllViewed }) {
  const [trophyFlipped, setTrophyFlipped] = useState(false);

  const handleTrophyFlipped = () => {
    setTrophyFlipped(true);
    // Small delay then trigger finale
    setTimeout(() => {
      onAllViewed?.();
    }, 1200);
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
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ textAlign: 'center', marginBottom: '48px' }}
      >
        <motion.div
          style={{ fontSize: '2.5rem', marginBottom: '12px' }}
          animate={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
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
          These are all yours — collectible, redeemable, and completely official. 💅
        </p>
      </motion.div>

      {/* Grid */}
      <div
        className="section-container"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Voucher cards */}
        {VOUCHERS.map((v, i) => (
          <VoucherCard key={v.id} {...v} index={i} />
        ))}

        {/* Trophy flip card */}
        <TrophyCard index={3} onFlipped={handleTrophyFlipped} />
      </div>

      {/* Teaser after trophy flipped */}
      {trophyFlipped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{
            textAlign: 'center',
            marginTop: '48px',
            fontFamily: 'var(--font-head)',
            fontWeight: 600,
            color: 'var(--primary)',
            fontSize: '0.95rem',
          }}
        >
          ✨ Psst... scroll down, there's one more surprise waiting!
        </motion.div>
      )}
    </section>
  );
}
