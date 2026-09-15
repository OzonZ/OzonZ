import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { sfxSparkle } from '../lib/audio';

/**
 * Global helper to trigger ticket toast notification from anywhere in the app
 */
export function showTicketToast({ title, subtitle, duration = 5000 }) {
  window.dispatchEvent(
    new CustomEvent('show-ticket-notification', {
      detail: { title, subtitle, duration, id: Date.now() + Math.random() },
    })
  );
}

export default function TicketToast() {
  const [toast, setToast] = useState(null);

  const handleDismiss = useCallback(() => {
    setToast(null);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      const data = e.detail;
      setToast(data);
      try {
        sfxSparkle();
      } catch (_) {}
    };

    window.addEventListener('show-ticket-notification', handler);
    return () => window.removeEventListener('show-ticket-notification', handler);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast((curr) => (curr?.id === toast.id ? null : curr));
    }, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <aside
      aria-label="Notifications"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
      }}
    >
      <style>{`
        @keyframes toastWaveLoop1 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes toastWaveLoop2 {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            aria-live="polite"
            initial={{
              opacity: 0,
              width: 50,
              height: 50,
              borderRadius: 25,
              scale: 0.6,
              y: 40,
            }}
            animate={{
              opacity: 1,
              width: 330,
              height: 80,
              borderRadius: 12,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.85,
              y: 20,
              transition: { duration: 0.24, ease: 'easeIn' },
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 22,
              mass: 0.85,
            }}
            style={{
              position: 'relative',
              boxSizing: 'border-box',
              padding: '10px 14px',
              backgroundColor: '#ffffff',
              boxShadow: '0 12px 32px rgba(149, 157, 165, 0.28), 0 4px 16px rgba(4, 228, 0, 0.12)',
              border: '1px solid rgba(4, 228, 0, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              pointerEvents: 'auto',
              cursor: 'default',
            }}
          >
            {/* Animated Wave Background Layers (เหมือนหน้าแรก) */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                overflow: 'hidden',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            >
              {/* Wave Layer 1 */}
              <svg
                viewBox="0 0 660 60"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '200%',
                  height: '42px',
                  opacity: 0.18,
                  animation: 'toastWaveLoop1 9s linear infinite',
                }}
              >
                <path
                  d="M0,30 Q82.5,12 165,30 T330,30 Q412.5,12 495,30 T660,30 L660,60 L0,60 Z"
                  fill="#04e400"
                />
              </svg>

              {/* Wave Layer 2 */}
              <svg
                viewBox="0 0 660 60"
                preserveAspectRatio="none"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '200%',
                  height: '32px',
                  opacity: 0.14,
                  animation: 'toastWaveLoop2 6s linear infinite',
                }}
              >
                <path
                  d="M0,20 Q82.5,38 165,20 T330,20 Q412.5,38 495,20 T660,20 L660,60 L0,60 Z"
                  fill="#269b24"
                />
              </svg>
            </div>

            {/* Left Decorative Scalloped Wave Edge */}
            <svg
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '14px',
                height: '100%',
                fill: '#04e4003a',
                pointerEvents: 'none',
                zIndex: 1,
              }}
              viewBox="0 0 14 80"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 L4,0 C1,10 9,15 4,25 C-1,35 9,40 4,50 C-1,60 9,65 4,75 L4,80 L0,80 Z"
                fill="#04e40040"
              />
            </svg>

            {/* Icon Container (Green check circle) */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.08, type: 'spring', stiffness: 320, damping: 18 }}
              style={{
                width: '36px',
                height: '36px',
                minWidth: '36px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#04e40038',
                borderRadius: '50%',
                marginLeft: '6px',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <Check size={18} strokeWidth={2.8} color="#269b24" />
            </motion.div>

            {/* Message Text Container (Morphs outward smoothly) */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.16, duration: 0.28, ease: 'easeOut' }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                flexGrow: 1,
                overflow: 'hidden',
                position: 'relative',
                zIndex: 2,
                paddingRight: '6px',
              }}
            >
              <span
                style={{
                  color: '#269b24',
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-head)',
                  lineHeight: 1.25,
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                {toast.title || 'New Pass Unlocked'}
              </span>
              <span
                style={{
                  fontSize: '13px',
                  color: '#4b5563',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  marginTop: '2px',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  width: '100%',
                }}
              >
                {toast.subtitle || 'Special pass unlocked'}
              </span>
            </motion.div>

            {/* Cross Dismiss Icon */}
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.24 }}
              onClick={handleDismiss}
              style={{
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                borderRadius: '6px',
                transition: 'color 0.15s, background 0.15s',
                position: 'relative',
                zIndex: 2,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#374151';
                e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#9ca3af';
                e.currentTarget.style.background = 'none';
              }}
              aria-label="Close notification"
            >
              <X size={16} strokeWidth={2.4} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
