import { useState, useEffect, useCallback } from 'react';
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
  // Scene gate states — each unlocks on user action
  const [showBoxReveal, setShowBoxReveal] = useState(false);
  const [showVouchers, setShowVouchers]   = useState(false);
  const [showToast, setShowToast]         = useState(false);
  const [showFinale, setShowFinale]       = useState(false);

  // Log visit on mount
  useEffect(() => {
    logVisit().catch(() => {}); // Silent fail
  }, []);

  // Scene 02 → 03 trigger
  const handleScrollComplete = useCallback(() => {
    if (!showBoxReveal) setShowBoxReveal(true);
  }, [showBoxReveal]);

  // Scene 03 → 04 trigger (envelope opened)
  const handleEnvelopeOpen = useCallback(() => {
    setTimeout(() => setShowVouchers(true), 400);
    // Smooth scroll to voucher grid
    setTimeout(() => {
      document.getElementById('voucher-grid')?.scrollIntoView({ behavior: 'smooth' });
    }, 600);
  }, []);

  // Scene 04 → 05 trigger (all cards viewed)
  const handleAllViewed = useCallback(() => {
    // Show toast first
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
    // Open finale modal after toast
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

      {/* Scene 01 — Hero */}
      <Hero />

      {/* Scene 02 — Scroll Journey */}
      <ScrollJourney onScrollComplete={handleScrollComplete} />

      {/* Scene 03 — Box Reveal (shown after scroll complete) */}
      {showBoxReveal && (
        <BoxReveal onEnvelopeOpen={handleEnvelopeOpen} />
      )}

      {/* Scene 04 — Voucher Grid (shown after envelope opened) */}
      {showVouchers && (
        <VoucherGrid onAllViewed={handleAllViewed} />
      )}

      {/* Scene 05 is the FinaleModal above (portal-style) */}
    </>
  );
}
