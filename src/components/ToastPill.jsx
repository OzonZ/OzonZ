import { motion, AnimatePresence } from 'framer-motion';

export default function ToastPill({ visible, text }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="toast-pill"
          initial={{ opacity: 0, y: -20, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -16, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
