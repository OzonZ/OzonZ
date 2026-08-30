/**
 * WaveOverlay — smooth layered SVG sinusoidal waves rendered as a fixed fullscreen overlay.
 * Inspired by the layered wave silhouette aesthetic (purple/pink tones at low opacity).
 * Sits on top of the pastel background at ~8% opacity per wave so the original bg shows through.
 */
export default function WaveOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {/* Wave Layer 1 — lowest, widest crests */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.09,
          animation: 'waveShift1 18s ease-in-out infinite alternate',
        }}
      >
        <path
          d="M0,520 C180,460 360,580 540,520 C720,460 900,580 1080,520 C1260,460 1350,490 1440,520 L1440,900 L0,900 Z"
          fill="#b388ff"
        />
      </svg>

      {/* Wave Layer 2 — mid layer */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.08,
          animation: 'waveShift2 22s ease-in-out infinite alternate',
        }}
      >
        <path
          d="M0,600 C200,540 400,660 600,600 C800,540 1000,660 1200,600 C1320,560 1380,580 1440,600 L1440,900 L0,900 Z"
          fill="#ff8da1"
        />
      </svg>

      {/* Wave Layer 3 — higher up, narrower crests */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.06,
          animation: 'waveShift3 26s ease-in-out infinite alternate',
        }}
      >
        <path
          d="M0,680 C240,620 480,740 720,680 C960,620 1200,720 1440,660 L1440,900 L0,900 Z"
          fill="#7c4dff"
        />
      </svg>

      {/* Wave Layer 4 — top foreground, lightest */}
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
          animation: 'waveShift4 30s ease-in-out infinite alternate',
        }}
      >
        <path
          d="M0,750 C160,710 320,790 480,750 C640,710 800,790 960,750 C1120,710 1280,760 1440,740 L1440,900 L0,900 Z"
          fill="#ffd1dc"
        />
      </svg>

      <style>{`
        @keyframes waveShift1 {
          0%   { transform: translateX(0px) scaleY(1); }
          50%  { transform: translateX(-40px) scaleY(1.04); }
          100% { transform: translateX(30px) scaleY(0.97); }
        }
        @keyframes waveShift2 {
          0%   { transform: translateX(0px) scaleY(1); }
          50%  { transform: translateX(50px) scaleY(1.06); }
          100% { transform: translateX(-30px) scaleY(0.96); }
        }
        @keyframes waveShift3 {
          0%   { transform: translateX(0px) scaleY(1); }
          50%  { transform: translateX(-60px) scaleY(1.03); }
          100% { transform: translateX(40px) scaleY(0.98); }
        }
        @keyframes waveShift4 {
          0%   { transform: translateX(0px) scaleY(1); }
          50%  { transform: translateX(35px) scaleY(1.05); }
          100% { transform: translateX(-25px) scaleY(0.97); }
        }
      `}</style>
    </div>
  );
}
