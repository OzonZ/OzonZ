import { motion } from 'framer-motion';

/**
 * 3D Claymorphic Mysterious Gift Box
 * Props:
 *  - wobble: boolean — idle anticipation wobble
 *  - isOpen: boolean — lid pops off
 *  - scale: number — size multiplier
 */
export default function GiftBox({ wobble = true, isOpen = false, scale = 1 }) {
  return (
    <motion.div
      style={{
        width: `${170 * scale}px`,
        height: `${190 * scale}px`,
        position: 'relative',
        filter: 'drop-shadow(0 24px 48px rgba(255, 107, 139, 0.45))',
      }}
      animate={
        wobble && !isOpen
          ? {
              rotate: [0, -3, 3, -2, 2, 0],
              y: [0, -6, 0],
              scale: [1, 1.02, 1],
            }
          : {}
      }
      transition={{
        duration: 3.2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Ambient mysterious glow aura behind the box */}
      {!isOpen && (
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: `-${25 * scale}px`,
            background: 'radial-gradient(circle, rgba(255, 141, 161, 0.6) 0%, rgba(255, 209, 220, 0.3) 50%, transparent 75%)',
            borderRadius: '50%',
            zIndex: 0,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Floating mysterious sparkle & question mark chips */}
      {!isOpen && (
        <>
          <motion.div
            animate={{
              y: [-5, -18, -5],
              x: [-4, 4, -4],
              opacity: [0.6, 1, 0.6],
              rotate: [0, 15, 0],
            }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              position: 'absolute',
              top: `-${28 * scale}px`,
              right: `-${12 * scale}px`,
              fontSize: `${18 * scale}px`,
              zIndex: 10,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 2px 6px rgba(255,141,161,0.5))',
            }}
          >
            ✨
          </motion.div>
          <motion.div
            animate={{
              y: [-2, -14, -2],
              x: [3, -3, 3],
              opacity: [0.4, 0.9, 0.4],
              rotate: [0, -15, 0],
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
            style={{
              position: 'absolute',
              top: `-${18 * scale}px`,
              left: `-${14 * scale}px`,
              fontSize: `${16 * scale}px`,
              zIndex: 10,
              pointerEvents: 'none',
              filter: 'drop-shadow(0 2px 6px rgba(255,141,161,0.5))',
            }}
          >
            💖
          </motion.div>
        </>
      )}

      {/* ─── Box Lid ─────────────────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: `-${8 * scale}px`,
          right: `-${8 * scale}px`,
          height: `${56 * scale}px`,
          background: 'linear-gradient(135deg, #ff758f 0%, #ff4d6d 50%, #e63946 100%)',
          borderRadius: `${16 * scale}px`,
          boxShadow: `
            inset 0 ${4 * scale}px ${8 * scale}px rgba(255, 255, 255, 0.55),
            inset 0 -${4 * scale}px ${8 * scale}px rgba(0, 0, 0, 0.15),
            0 ${8 * scale}px ${20 * scale}px rgba(230, 57, 70, 0.35)
          `,
          transformOrigin: 'center bottom',
          zIndex: 4,
          overflow: 'hidden',
        }}
        animate={isOpen ? { y: -95 * scale, rotate: -18, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, delay: isOpen ? 0.08 : 0 }}
      >
        {/* Lid Ribbon Stripe (Vertical Gold/Pink) */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: `${30 * scale}px`,
            height: '100%',
            background: 'linear-gradient(180deg, #fff2f5 0%, #ffd1dc 50%, #ffa0b4 100%)',
            boxShadow: `inset 0 0 ${4 * scale}px rgba(255,255,255,0.8), 0 0 ${8 * scale}px rgba(255,141,161,0.4)`,
            borderRadius: `${3 * scale}px`,
          }}
        />
      </motion.div>

      {/* ─── Ribbon Bow on Top ───────────────────────────────────────── */}
      <motion.div
        style={{
          position: 'absolute',
          top: `-${24 * scale}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${64 * scale}px`,
          height: `${44 * scale}px`,
          zIndex: 5,
        }}
        animate={isOpen ? { y: -110 * scale, opacity: 0, scale: 0 } : { y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 16 }}
      >
        {/* Left Bow Loop */}
        <div
          style={{
            position: 'absolute',
            left: `${2 * scale}px`,
            top: `${2 * scale}px`,
            width: `${26 * scale}px`,
            height: `${26 * scale}px`,
            background: 'radial-gradient(circle at 35% 35%, #ffffff, #ffd1dc 60%, #ff8da1 100%)',
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(45deg)',
            boxShadow: `0 ${4 * scale}px ${10 * scale}px rgba(255, 107, 139, 0.45)`,
          }}
        />
        {/* Right Bow Loop */}
        <div
          style={{
            position: 'absolute',
            right: `${2 * scale}px`,
            top: `${2 * scale}px`,
            width: `${26 * scale}px`,
            height: `${26 * scale}px`,
            background: 'radial-gradient(circle at 35% 35%, #ffffff, #ffd1dc 60%, #ff8da1 100%)',
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg) scaleX(-1)',
            boxShadow: `0 ${4 * scale}px ${10 * scale}px rgba(255, 107, 139, 0.45)`,
          }}
        />
        {/* Center Ribbon Knot */}
        <div
          style={{
            position: 'absolute',
            width: `${18 * scale}px`,
            height: `${18 * scale}px`,
            background: 'radial-gradient(circle at 35% 35%, #fff0f3, #ff8da1 60%, #ff4d6d 100%)',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 ${3 * scale}px ${8 * scale}px rgba(255,77,109,0.5)`,
          }}
        />
      </motion.div>

      {/* ─── Box Body (Claymorphic Gradient & Rounded Base) ─────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${120 * scale}px`,
          background: 'linear-gradient(145deg, #ff8da1 0%, #ff6b8b 50%, #ff4d6d 100%)',
          borderRadius: `0 0 ${22 * scale}px ${22 * scale}px`,
          boxShadow: `
            inset 0 -${6 * scale}px ${14 * scale}px rgba(0,0,0,0.15),
            inset 0 ${6 * scale}px ${12 * scale}px rgba(255,255,255,0.4),
            0 ${12 * scale}px ${28 * scale}px rgba(255, 107, 139, 0.3)
          `,
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
        {/* Body Ribbon Stripe */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: `${30 * scale}px`,
            height: '100%',
            background: 'linear-gradient(180deg, #fff2f5 0%, #ffd1dc 50%, #ffa0b4 100%)',
            boxShadow: `inset 0 0 ${4 * scale}px rgba(255,255,255,0.7)`,
          }}
        />
      </div>
    </motion.div>
  );
}
