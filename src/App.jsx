import { useState, useEffect, useCallback } from 'react';
import './index.css';

import AudioToggle from './components/AudioToggle';
import ScrollJourney from './components/ScrollJourney';
import UnifiedShowcaseModal from './components/UnifiedShowcaseModal';
import { logVisit } from './lib/firebase';
import { initAutoplay } from './lib/audio';

export default function App() {
  const [showShowcaseModal, setShowShowcaseModal] = useState(false);

  // Log visitor on page load & initialize autoplay music
  useEffect(() => {
    logVisit().catch(() => {});
    initAutoplay();
  }, []);

  const handleOpenBox = useCallback(() => {
    setShowShowcaseModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowShowcaseModal(false);
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', overflowX: 'hidden' }}>
      {/* Fixed Persistent Audio Toggle (top-left) */}
      <AudioToggle />

      {/* ─── Unified Seamless Scroll Experience ─────────────────────────── */}
      <ScrollJourney onOpenBox={handleOpenBox} />

      {/* ─── 5-Step Card Deck & HBD Popup Showcase ─────────────────────── */}
      <UnifiedShowcaseModal
        isOpen={showShowcaseModal}
        onClose={handleCloseModal}
      />
    </main>
  );
}
