/**
 * WaveOverlay — 4 smooth SVG sinusoidal wave layers that loop horizontally forever.
 * Supports translateYPercent and opacity props for scroll-driven floating upward transitions.
 */
export default function WaveOverlay({ translateYPercent = 0, opacity = 1 }) {
  if (opacity <= 0.001) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 2,
        transform: `translateY(${translateYPercent}%)`,
        opacity: opacity,
        transition: 'opacity 0.08s linear, transform 0.08s linear',
        willChange: 'transform, opacity',
      }}
    >
      <style>{`
        @keyframes waveLoop1 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes waveLoop2 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes waveLoop3 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes waveLoop4 {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* Wave Layer 1 — deepest, slowest */}
      <svg
        viewBox="0 0 2880 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '100%',
          opacity: 0.12,
          animation: 'waveLoop1 18s linear infinite',
        }}
      >
        {/* Two seamlessly tiled periods */}
        <path
          d="M0,500 C180,430 360,570 540,500 C720,430 900,570 1080,500 C1260,430 1440,500 1440,500
             C1620,430 1800,570 1980,500 C2160,430 2340,570 2520,500 C2700,430 2880,500 2880,500
             L2880,900 L0,900 Z"
          fill="#b388ff"
        />
      </svg>

      {/* Wave Layer 2 — mid height, opposite direction */}
      <svg
        viewBox="0 0 2880 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '100%',
          opacity: 0.10,
          animation: 'waveLoop2 24s linear infinite reverse',
        }}
      >
        <path
          d="M0,580 C240,510 480,650 720,580 C960,510 1200,650 1440,580
             C1680,510 1920,650 2160,580 C2400,510 2640,620 2880,580
             L2880,900 L0,900 Z"
          fill="#ff8da1"
        />
      </svg>

      {/* Wave Layer 3 — higher, faster */}
      <svg
        viewBox="0 0 2880 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '100%',
          opacity: 0.08,
          animation: 'waveLoop3 14s linear infinite',
        }}
      >
        <path
          d="M0,650 C200,600 400,700 600,650 C800,600 1000,700 1200,650 C1400,600 1440,640 1440,650
             C1640,600 1840,700 2040,650 C2240,600 2440,700 2640,650 C2780,615 2880,640 2880,650
             L2880,900 L0,900 Z"
          fill="#7c4dff"
        />
      </svg>

      {/* Wave Layer 4 — foreground, fastest, lightest */}
      <svg
        viewBox="0 0 2880 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '200%',
          height: '100%',
          opacity: 0.09,
          animation: 'waveLoop4 10s linear infinite reverse',
        }}
      >
        <path
          d="M0,730 C160,700 320,760 480,730 C640,700 800,760 960,730 C1120,700 1280,750 1440,730
             C1600,700 1760,760 1920,730 C2080,700 2240,760 2400,730 C2560,700 2720,750 2880,730
             L2880,900 L0,900 Z"
          fill="#ffd1dc"
        />
      </svg>
    </div>
  );
}
