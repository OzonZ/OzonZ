import { motion } from 'framer-motion';

/**
 * Standard voucher card
 * Props: badge, title, description, terms, index (for stagger)
 */
export default function VoucherCard({ badge, title, description, terms, index = 0 }) {
  return (
    <motion.div
      className="voucher-card"
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 20,
        delay: index * 0.12,
      }}
      whileHover={{ y: -6 }}
    >
      {/* Header */}
      <div className="voucher-card-header">
        <span className="voucher-badge">{badge}</span>
        <h3 className="voucher-title">{title}</h3>
      </div>

      {/* Perforated divider */}
      <div style={{ position: 'relative', height: '2px', margin: '0' }}>
        <div className="voucher-perforations" style={{ top: 0 }} />
        {/* Notch circles */}
        <div style={{
          position: 'absolute',
          left: '-12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '20px',
          height: '20px',
          background: '#ffebf0',
          borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute',
          right: '-12px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '20px',
          height: '20px',
          background: '#ffebf0',
          borderRadius: '50%',
        }} />
      </div>

      {/* Body */}
      <div className="voucher-card-body">
        <p className="voucher-description">{description}</p>
        <p className="voucher-terms">📋 {terms}</p>
      </div>
    </motion.div>
  );
}
