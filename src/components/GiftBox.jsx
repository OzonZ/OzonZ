import { motion } from 'framer-motion';

/**
 * CSS Claymorphic 3D Gift Box
 * Props:
 *  - wobble: boolean — continuous wobble idle animation
 *  - isOpen: boolean — lid pops off
 *  - scale: number — size multiplier (default 1)
 */
export default function GiftBox({ wobble = true, isOpen = false, scale = 1 }) {
  return (
    <motion.div
      style={{
        width: `${160 * scale}px`,
        height: `${180 * scale}px`,
        position: 'relative',
        filter: 'drop-shadow(0 20px 40px rgba(255, 141, 161, 0.4))',
      }}
      animate={
        wobble && !isOpen
          ? {
              rotate: [0, -2, 2, -1.5, 1.5, 0],
              y: [0, -4, 0],
            }
          : {}
      }
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {/* Lid */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: `-${6 * scale}px`,
          right: `-${6 * scale}px`,
          height: `${52 * scale}px`,
          background: 'linear-gradient(135deg, #ff6b8b 0%, #e63946 100%)',
          borderRadius: `${14 * scale}px`,
          boxShadow: `inset 0 ${4 * scale}px ${10 * scale}px rgba(255,255,255,0.3), 0 ${6 * scale}px ${16 * scale}px rgba(230, 57, 70, 0.3)`,
          transformOrigin: 'center bottom',
          zIndex: 2,
          overflow: 'hidden',
        }}
        animate={isOpen ? { y: -80 * scale, rotate: -15, opacity: 0 } : { y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18, delay: isOpen ? 0.1 : 0 }}
      >
        {/* Lid ribbon stripe */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: `${28 * scale}px`,
            height: '100%',
            background: 'linear-gradient(180deg, #ffd1dc, #ffb0c0)',
            borderRadius: `${4 * scale}px`,
          }}
        />
      </motion.div>

      {/* Bow */}
      <motion.div
        style={{
          position: 'absolute',
          top: `-${20 * scale}px`,
          left: '50%',
          transform: 'translateX(-50%)',
          width: `${56 * scale}px`,
          height: `${40 * scale}px`,
          zIndex: 3,
        }}
        animate={isOpen ? { y: -90 * scale, opacity: 0, scale: 0 } : { y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 160, damping: 16, delay: isOpen ? 0 : 0 }}
      >
        {/* Left loop */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${22 * scale}px`,
            height: `${22 * scale}px`,
            background: 'radial-gradient(circle at 40% 40%, #fff5f7, #ffd1dc)',
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(45deg)',
            boxShadow: `0 ${3 * scale}px ${8 * scale}px rgba(255, 141, 161, 0.4)`,
          }}
        />
        {/* Right loop */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: `${22 * scale}px`,
            height: `${22 * scale}px`,
            background: 'radial-gradient(circle at 40% 40%, #fff5f7, #ffd1dc)',
            borderRadius: '50% 50% 50% 0',
            transform: 'rotate(-45deg) scaleX(-1)',
            boxShadow: `0 ${3 * scale}px ${8 * scale}px rgba(255, 141, 161, 0.4)`,
          }}
        />
        {/* Center knot */}
        <div
          style={{
            position: 'absolute',
            width: `${14 * scale}px`,
            height: `${14 * scale}px`,
            background: 'radial-gradient(circle, #ff8da1, #ff6b8b)',
            borderRadius: '50%',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            boxShadow: `0 ${2 * scale}px ${6 * scale}px rgba(255,107,139,0.5)`,
          }}
        />
      </motion.div>

      {/* Box body */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: `${110 * scale}px`,
          background: 'linear-gradient(135deg, #ff8da1 0%, #ff6b8b 100%)',
          borderRadius: `0 0 ${18 * scale}px ${18 * scale}px`,
          boxShadow: `inset 0 -${4 * scale}px ${12 * scale}px rgba(0,0,0,0.1), inset 0 ${4 * scale}px ${8 * scale}px rgba(255,255,255,0.3)`,
          overflow: 'hidden',
        }}
      >
        {/* Body ribbon stripe */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: `${28 * scale}px`,
            height: '100%',
            background: 'linear-gradient(180deg, #ffd1dc, #ffa0b4)',
          }}
        />
      </div>
    </motion.div>
  );
}
