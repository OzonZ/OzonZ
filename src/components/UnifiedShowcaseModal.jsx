import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, RotateCw, Music2, Sparkles, Heart } from 'lucide-react';
import VoucherCard from './VoucherCard';
import TrophyCard from './TrophyCard';
import { triggerPostcardMusicPermanent, sfxPop, sfxWhoosh, sfxChime, sfxSparkle, sfxRustle, sfxFlip } from '../lib/audio';
import { finaleConfetti } from '../lib/confetti';

const TOTAL_STEPS = 5;

export default function UnifiedShowcaseModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 4 (Items 1 to 5)
  const [direction, setDirection] = useState(1);
  const [isPostcardFlipped, setIsPostcardFlipped] = useState(false);

  // When step 1 (Postcard) is reached, permanently activate Strawberry Champagne song!
  useEffect(() => {
    if (isOpen && currentStep === 1) {
      triggerPostcardMusicPermanent();
      sfxRustle();
      sfxSparkle();
    } else if (isOpen && currentStep === 4) {
      // Step 5: HBD celebration confetti!
      sfxChime();
      setTimeout(finaleConfetti, 300);
    }
  }, [isOpen, currentStep]);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      sfxWhoosh();
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      sfxWhoosh();
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepSelect = (idx) => {
    sfxPop();
    setDirection(idx > currentStep ? 1 : -1);
    setCurrentStep(idx);
  };

  const handleFlipPostcard = () => {
    sfxFlip();
    setIsPostcardFlipped(!isPostcardFlipped);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="finale-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{ zIndex: 220, padding: '16px' }}
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
            maxWidth: '560px',
            width: '100%',
            boxShadow: '0 25px 80px rgba(255, 141, 161, 0.35), 0 8px 24px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            position: 'relative',
            padding: '24px 22px',
          }}
        >
          {/* Header & Close */}
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
                🎁 SURPRISE BOX DISCOVERY
              </span>
              <h3
                style={{
                  fontFamily: 'var(--font-head)',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                  color: 'var(--text-main)',
                  marginTop: '4px',
                }}
              >
                Gift {currentStep + 1} of {TOTAL_STEPS}
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

          {/* Progress Step Bar */}
          <div
            style={{
              display: 'flex',
              gap: '6px',
              marginBottom: '20px',
            }}
          >
            {Array.from({ length: TOTAL_STEPS }).map((_, idx) => {
              const isActive = idx === currentStep;
              const isPast = idx < currentStep;
              return (
                <button
                  key={idx}
                  onClick={() => handleStepSelect(idx)}
                  style={{
                    flex: 1,
                    height: '6px',
                    borderRadius: '999px',
                    border: 'none',
                    background: isActive
                      ? 'linear-gradient(90deg, #ff8da1, #ff6b8b)'
                      : isPast
                      ? '#ffd1dc'
                      : '#f0f2f5',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  title={`Go to Gift ${idx + 1}`}
                />
              );
            })}
          </div>

          {/* ─── Sequenced Showcase Area (1 to 5) ─────────────────────────── */}
          <div style={{ minHeight: '310px', position: 'relative' }}>
            <AnimatePresence mode="wait" custom={direction}>
              {/* ─── 1. TICKET 1: Instant Non-Summon Pass ─────────────────── */}
              {currentStep === 0 && (
                <motion.div
                  key="step-1-ticket"
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction * -50, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                >
                  <VoucherCard
                    badge="⚡ 1x Single Use"
                    title="⚡ Instant Non-Summon Pass"
                    description="Summons Non immediately to your location!"
                    terms="Send the message 'Come here, doggy!' — the exact second Non reads it, he must rush over to find you right away with zero hesitation."
                    index={0}
                  />
                </motion.div>
              )}

              {/* ─── 2. SECRET POSTCARD (Dept - Strawberry Champagne) ──────── */}
              {currentStep === 1 && (
                <motion.div
                  key="step-2-postcard"
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction * -50, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                  style={{ perspective: '1000px' }}
                >
                  <motion.div
                    animate={{ rotateY: isPostcardFlipped ? 180 : 0 }}
                    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                      width: '100%',
                      transformStyle: 'preserve-3d',
                      position: 'relative',
                    }}
                  >
                    {/* Front: Letter */}
                    <div
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: '#FFFDF9',
                        borderRadius: '20px',
                        padding: '24px 20px',
                        boxShadow: '0 12px 36px rgba(255, 141, 161, 0.25)',
                        border: '2px solid rgba(255, 141, 161, 0.3)',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          borderBottom: '2px dashed #f0d5db',
                          paddingBottom: '12px',
                          marginBottom: '14px',
                        }}
                      >
                        <div>
                          <div style={{ fontFamily: 'var(--font-head)', fontWeight: 700, color: 'var(--primary-dark)', fontSize: '1.05rem' }}>
                          Secret Postcard
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <Music2 size={12} color="#b388ff" />
                            <span style={{ fontWeight: 700, color: '#7c4dff' }}>Dept - Strawberry Champagne</span>
                          </div>
                        </div>

                        {/* Stamp */}
                        <div
                          style={{
                            width: '46px',
                            height: '56px',
                            background: 'linear-gradient(135deg, #ffd1dc, #ff8da1)',
                            borderRadius: '6px',
                            border: '2px dashed #ffffff',
                            boxShadow: '0 3px 8px rgba(255, 141, 161, 0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transform: 'rotate(6deg)',
                          }}
                        >
                          <span style={{ fontSize: '18px' }}>&#x1F382;</span>
                          <span style={{ fontSize: '8px', fontWeight: 800, color: '#ffffff' }}>NON'S GIFT</span>
                        </div>
                      </div>

                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.7, color: 'var(--text-main)', marginBottom: '16px' }}>
                        <p style={{ fontWeight: 700, color: '#ff6b8b', marginBottom: '6px' }}>
                          Dear someone very special,
                        </p>
                        <p style={{ marginBottom: '8px' }}>
                          Thank you so much for bringing pure sunshine and laughter into my life every single day!
                        </p>
                        <p style={{ marginBottom: '8px' }}>
                          May your birthday and every single day ahead be filled with smiles, sweet treats, and nonstop joy!
                        </p>
                        <p style={{ textAlign: 'right', fontWeight: 700, color: '#ff6b8b', marginTop: '10px' }}>
                          — Non
                        </p>
                      </div>

                      <button
                        onClick={handleFlipPostcard}
                        style={{
                          background: 'rgba(179, 136, 255, 0.15)',
                          border: '1.5px solid rgba(179, 136, 255, 0.35)',
                          color: '#7c4dff',
                          borderRadius: '999px',
                          padding: '6px 14px',
                          fontFamily: 'var(--font-head)',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          margin: '0 auto',
                        }}
                      >
                        <RotateCw size={13} />
                        <span>Flip to Polaroid Photo</span>
                      </button>
                    </div>

                    {/* Back: Polaroid */}
                    <div
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        position: 'absolute',
                        inset: 0,
                        background: '#FFFDF9',
                        borderRadius: '20px',
                        padding: '24px 20px',
                        boxShadow: '0 12px 36px rgba(255, 141, 161, 0.25)',
                        border: '2px solid rgba(255, 141, 161, 0.3)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <div
                        style={{
                          background: '#ffffff',
                          padding: '10px 10px 18px',
                          borderRadius: '10px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          border: '1px solid #f0e6eb',
                          transform: 'rotate(-2deg)',
                          maxWidth: '220px',
                          marginBottom: '14px',
                        }}
                      >
                        <div
                          style={{
                            width: '200px',
                            height: '130px',
                            background: 'linear-gradient(135deg, #ffd1dc, #ffebf0, #b388ff)',
                            borderRadius: '6px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span style={{ fontSize: '36px' }}>🐶</span>
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
                            Best Moments Together
                          </span>
                        </div>
                        <p style={{ marginTop: '8px', fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.78rem', color: 'var(--text-main)' }}>
                          "To infinity & beyond!"
                        </p>
                      </div>

                      <button
                        onClick={handleFlipPostcard}
                        style={{
                          background: 'linear-gradient(135deg, #b388ff, #ff8da1)',
                          border: 'none',
                          color: '#ffffff',
                          borderRadius: '999px',
                          padding: '6px 18px',
                          fontFamily: 'var(--font-head)',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                        }}
                      >
                        <RotateCw size={13} />
                        <span>Flip Back to Letter</span>
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* ─── 3. TICKET 2: Bark Bark Pass ─────────────────────────── */}
              {currentStep === 2 && (
                <motion.div
                  key="step-3-ticket"
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction * -50, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                >
                  <VoucherCard
                    badge="🐶 2x Available"
                    title="🐶 1-Minute 'Bark Bark' Pass"
                    description="Forces Non to unleash his inner puppy!"
                    terms="Non is contractually obligated to bark ('Bark! Bark!') for 1 full continuous minute upon activation."
                    index={0}
                  />
                </motion.div>
              )}

              {/* ─── 4. TICKET 3 & TROPHY CARD: 24h Venting / RoV Carry ────── */}
              {currentStep === 3 && (
                <motion.div
                  key="step-4-ticket"
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: direction * -50, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                >
                  <TrophyCard index={0} />
                </motion.div>
              )}

              {/* ─── 5. PIECE OF PAPER: Happy Birthday Letter Note ────────── */}
              {currentStep === 4 && (
                <motion.div
                  key="step-5-hbd-paper"
                  custom={direction}
                  initial={{ opacity: 0, y: 30, scale: 0.92, rotate: -2 }}
                  animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                  style={{
                    background: '#FFFDF6',
                    borderRadius: '16px',
                    padding: '26px 20px',
                    border: '2px solid #F3E8D2',
                    boxShadow: '0 14px 40px rgba(244, 162, 97, 0.25)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Lined paper texture background lines */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'linear-gradient(transparent 26px, #F0E6D2 27px)',
                      backgroundSize: '100% 27px',
                      opacity: 0.5,
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Tape decoration at top */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '80px',
                      height: '20px',
                      background: 'rgba(255, 209, 220, 0.75)',
                      backdropFilter: 'blur(4px)',
                      borderRadius: '3px',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    }}
                  />

                  <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    <div style={{ fontSize: '2.8rem', marginBottom: '6px' }}>🎂</div>
                    <h2
                      style={{
                        fontFamily: 'var(--font-head)',
                        fontWeight: 800,
                        fontSize: '1.45rem',
                        color: 'var(--text-main)',
                        marginBottom: '12px',
                      }}
                    >
                      HAPPY BIRTHDAY!
                    </h2>
                    <p
                      style={{
                        fontFamily: 'var(--font-body)',
                        fontSize: '0.96rem',
                        lineHeight: 1.8,
                        color: 'var(--text-main)',
                        marginBottom: '16px',
                      }}
                    >
                      Wishing you the happiest, sweetest, most magical birthday ever! Whether this is advance, right on time, or belated — you deserve all the love, happiness, and wins in the world!
                    </p>

                    {/* Stickers Row */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                      {['Best Wish', 'Puppy Love', 'Derp of Year', 'RoV Carries'].map((tag) => (
                        <span
                          key={tag}
                          style={{
                            background: 'rgba(255, 141, 161, 0.15)',
                            border: '1px solid rgba(255, 141, 161, 0.3)',
                            borderRadius: '999px',
                            padding: '4px 10px',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            color: 'var(--primary-dark)',
                            fontFamily: 'var(--font-head)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      With all my love & loyalty, from Non 🐶
                    </p>
                  </div>
                </motion.div>
              )}
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
              disabled={currentStep === 0}
              style={{
                background: 'none',
                border: '1.5px solid #ffd1dc',
                color: currentStep === 0 ? '#cbd5e1' : 'var(--primary-dark)',
                borderRadius: '999px',
                padding: '10px 18px',
                fontFamily: 'var(--font-head)',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                opacity: currentStep === 0 ? 0.4 : 1,
              }}
            >
              <ChevronLeft size={16} />
              <span>Prev</span>
            </button>

            {currentStep === TOTAL_STEPS - 1 ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                  background: 'linear-gradient(135deg, #ff8da1, #ff6b8b)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '10px 24px',
                  fontFamily: 'var(--font-head)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(255, 107, 139, 0.4)',
                }}
              >
                <span>Thank You!</span>
              </motion.button>
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
                  fontSize: '0.88rem',
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
    </AnimatePresence>
  );
}
