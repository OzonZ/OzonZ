import { useState, useEffect, useCallback, useRef } from 'react';
import './index.css';

import AudioToggle from './components/AudioToggle';
import Hero from './components/Hero';
import ScrollJourney from './components/ScrollJourney';
import BoxReveal from './components/BoxReveal';
import VoucherGrid from './components/VoucherGrid';
import FinaleModal from './components/FinaleModal';
import ToastPill from './components/ToastPill';
import { logVisit } from './lib/firebase';

export default function App() {
  // Scene gate states
  const [showBoxReveal, setShowBoxReveal] = useState(false);
  const [showVouchers,  setShowVouchers]  = useState(false);
  const [showToast,     setShowToast]     = useState(false);
  const [showFinale,    setShowFinale]    = useState(false);

  // Hero background progress (0→1 as user scrolls down from hero)
  const [heroBgProgress, setHeroBgProgress] = useState(0);

  // Ref to ScrollJourney's reset function (called when user scrolls back to top)
  const scrollJourneyResetRef = useRef(null);

  // ── Visit log ────────────────────────────────────────────────────────────
  useEffect(() => {
    logVisit().catch(() => {});
  }, []);

  // ── Scroll listener: hero bg transition + full reset on scroll-to-top ────
  useEffect(() => {
    const handleScroll = () => {
      const scrollY  = window.scrollY;
      const heroH    = window.innerHeight;

      // Hero background color: 0→1 over the first viewport height of scrolling
      const progress = Math.min(scrollY / heroH, 1);
      setHeroBgProgress(progress);

      // Reset all scene gates when user scrolls back near the very top
      if (scrollY < 60) {
        setShowBoxReveal(false);
        setShowVouchers(false);
        setShowToast(false);
        setShowFinale(false);
        // Tell ScrollJourney to reset its step counter
        scrollJourneyResetRef.current?.();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Scene 02 → 03 trigger ────────────────────────────────────────────────
  const handleScrollComplete = useCallback(() => {
    setShowBoxReveal(true);
    // Scroll down past the journey section so BoxReveal is in view
    setTimeout(() => {
      document.getElementById('box-reveal')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, []);

  // ── Scene 03 → 04 trigger ────────────────────────────────────────────────
  const handleEnvelopeOpen = useCallback(() => {
    setTimeout(() => setShowVouchers(true), 400);
    setTimeout(() => {
      document.getElementById('voucher-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  }, []);

  // ── Scene 04 → 05 trigger ────────────────────────────────────────────────
  const handleAllViewed = useCallback(() => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    setTimeout(() => setShowFinale(true), 1800);
  }, []);

  return (
    <>
      {/* Fixed UI */}
      <AudioToggle />
      <ToastPill
        visible={showToast}
        text={`"Wait a second... looks like there's one final gift tucked away here! 🎁"`}
      />

      {/* Finale modal */}
      <FinaleModal
        isOpen={showFinale}
        onClose={() => setShowFinale(false)}
      />

      {/* Scene 01 — Hero (receives bg progress for seamless color shift) */}
      <Hero bgProgress={heroBgProgress} />

      {/* Scene 02 — Scroll Journey (step-based morph, receives reset ref) */}
      <ScrollJourney
        onScrollComplete={handleScrollComplete}
        onReset={scrollJourneyResetRef}
      />

      {/* Scene 03 — Box Reveal */}
      {showBoxReveal && (
        <BoxReveal onEnvelopeOpen={handleEnvelopeOpen} />
      )}

      {/* Scene 04 — Voucher Grid (click one-by-one) */}
      {showVouchers && (
        <VoucherGrid onAllViewed={handleAllViewed} />
      )}

      {/* Scene 05 — FinaleModal (portal above) */}
    </>
  );
}
