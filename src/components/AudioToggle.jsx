import { useState, useCallback } from 'react';
import { Music, Music2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toggleBgm } from '../lib/audio';

export default function AudioToggle() {
  const [isOn, setIsOn] = useState(false);

  const handleClick = useCallback(() => {
    const nowOn = toggleBgm();
    setIsOn(nowOn);
  }, []);

  return (
    <motion.button
      className="audio-toggle"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={isOn ? 'Pause BGM' : 'Play BGM'}
    >
      <motion.span
        animate={{ rotate: isOn ? [0, 10, -10, 0] : 0 }}
        transition={{ repeat: isOn ? Infinity : 0, duration: 0.6 }}
      >
        {isOn ? <Music2 size={14} /> : <Music size={14} />}
      </motion.span>
      <span>BGM: {isOn ? 'ON' : 'OFF'}</span>
    </motion.button>
  );
}
