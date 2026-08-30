import { useState, useEffect, useCallback } from 'react';
import { Music, Music2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { toggleBgm, subscribeAudioState } from '../lib/audio';

export default function AudioToggle() {
  const [audioState, setAudioState] = useState({
    isBgmPlaying: false,
    currentTrack: 'main',
    isMuted: false,
    trackInfo: { title: 'A Slow Turn of the Page' },
  });

  useEffect(() => {
    return subscribeAudioState((state) => {
      setAudioState({ ...state });
    });
  }, []);

  const handleClick = useCallback(() => {
    toggleBgm();
  }, []);

  const isPostcard = audioState.currentTrack === 'postcard';

  return (
    <motion.button
      className="audio-toggle"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={audioState.isBgmPlaying ? 'Pause Music' : 'Play Music'}
      style={{
        borderColor: isPostcard ? 'rgba(179, 136, 255, 0.5)' : 'rgba(255, 141, 161, 0.4)',
        background: isPostcard ? 'rgba(255, 245, 250, 0.94)' : 'rgba(255, 255, 255, 0.94)',
      }}
    >
      <motion.span
        animate={{
          rotate: audioState.isBgmPlaying ? [0, 12, -12, 0] : 0,
          scale: audioState.isBgmPlaying ? [1, 1.15, 1] : 1,
        }}
        transition={{ repeat: audioState.isBgmPlaying ? Infinity : 0, duration: 1.2 }}
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {audioState.isBgmPlaying ? (
          isPostcard ? <Sparkles size={15} color="#b388ff" /> : <Music2 size={15} color="#ff6b8b" />
        ) : (
          <Music size={15} color="#8d99ae" />
        )}
      </motion.span>

      <span style={{ fontSize: '0.78rem', fontWeight: 700 }}>
        {audioState.isBgmPlaying ? (
          `🎵 ${audioState.trackInfo?.title || (isPostcard ? 'Dept - Strawberry Champagne' : 'A Slow Turn of the Page')}`
        ) : (
          '🔇 Music: OFF'
        )}
      </span>
    </motion.button>
  );
}
