import { useState, useEffect, useCallback } from 'react';
import './index.css';

import AudioToggle from './components/AudioToggle';
import ScrollJourney from './components/ScrollJourney';
import TicketShowcaseModal from './components/TicketShowcaseModal';
import PostCardModal from './components/PostCardModal';
import FinaleModal from './components/FinaleModal';
import ToastPill from './components/ToastPill';
import { logVisit } from './lib/firebase';
import { sfxChime } from './lib/audio';

export default function App() {
  // Modal states
  const [showTicketsModal, setShowTicketsModal] = useState(false);
  const [showPostcardModal, setShowPostcardModal] = useState(false);
  const [showFinaleModal, setShowFinaleModal] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Log visitor on page load
  useEffect(() => {
    logVisit().catch(() => {});
  }, []);

  // When Red Envelope is tapped -> Open Ticket Showcase popup
  const handleOpenEnvelope = useCallback(() => {
    setShowTicketsModal(true);
  }, []);

  // When Postcard is tapped -> Open Postcard popup & switch BGM
  const handleOpenPostcard = useCallback(() => {
    setShowPostcardModal(true);
  }, []);

  // When all tickets have been viewed/trophy flipped -> trigger teaser and finale
  const handleAllTicketsViewed = useCallback(() => {
    setShowTicketsModal(false);
    setShowToast(true);
    sfxChime();

    setTimeout(() => {
      setShowToast(false);
      setShowFinaleModal(true);
    }, 2200);
  }, []);

  return (
    <main style={{ minHeight: '100vh', background: '#ffffff', overflowX: 'hidden' }}>
      {/* Fixed Persistent Audio Toggle (top-left) */}
      <AudioToggle />

      {/* Floating Teaser Toast Notification */}
      <ToastPill
        visible={showToast}
        text={`"Wait a second... looks like there's one final birthday gift tucked away here! 🎂🎉"`}
      />

      {/* ─── Unified Seamless Scroll Experience (Scene 01 + 02 + 03) ─── */}
      <ScrollJourney
        onOpenEnvelope={handleOpenEnvelope}
        onOpenPostcard={handleOpenPostcard}
      />

      {/* ─── Scene 04: Interactive Ticket Showcase Modal (Pop-up deck) ─── */}
      <TicketShowcaseModal
        isOpen={showTicketsModal}
        onClose={() => setShowTicketsModal(false)}
        onOpenPostcard={handleOpenPostcard}
        onAllViewed={handleAllTicketsViewed}
      />

      {/* ─── Special Secret Postcard Modal (with BGM Switch & 3D Flip) ──── */}
      <PostCardModal
        isOpen={showPostcardModal}
        onClose={() => setShowPostcardModal(false)}
      />

      {/* ─── Scene 05: Multi-Dimensional Birthday Finale Modal ─────────── */}
      <FinaleModal
        isOpen={showFinaleModal}
        onClose={() => setShowFinaleModal(false)}
      />
    </main>
  );
}
