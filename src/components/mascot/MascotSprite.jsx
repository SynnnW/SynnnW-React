// Fallback 2D maskot "Pico" — SVG inline orisinal (tanpa aset eksternal).
// Dipakai saat: WebGL tidak ada/gagal, hemat data, model belum selesai dimuat, atau sebagai underlay.
import { normalizeMood } from './moods';

const INK = '#17160F';

function Mouth({ mood }) {
  switch (mood) {
    case 'happy':
    case 'celebrate':
      return (
        <g>
          <path d="M84 134 Q100 164 116 134 Z" fill={INK} stroke={INK} strokeWidth="3" strokeLinejoin="round" />
          <path d="M92 150 Q100 158 108 150 Q100 146 92 150Z" fill="#FF8F7A" />
        </g>
      );
    case 'sad':
      return <path d="M87 150 Q100 136 113 150" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />;
    case 'thinking':
      return <ellipse cx="108" cy="144" rx="6" ry="5.5" fill={INK} />;
    default:
      return <path d="M87 138 Q100 152 113 138" fill="none" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />;
  }
}

function Brows({ mood }) {
  if (mood === 'sad') {
    return (
      <g stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M63 92 L90 99" /><path d="M137 92 L110 99" />
      </g>
    );
  }
  if (mood === 'thinking') {
    return (
      <g stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none">
        <path d="M64 92 L88 90" /><path d="M112 82 L136 88" />
      </g>
    );
  }
  return null;
}

export default function MascotSprite({ mood = 'idle', paused = false, className = '' }) {
  const m = normalizeMood(mood);
  const squint = m === 'happy' || m === 'celebrate';
  const eyeY = m === 'sad' ? 112 : 108;
  const look = m === 'thinking' ? { x: 4, y: -5 } : { x: 0, y: 0 };

  return (
    <svg
      className={`mc mc--${m}${paused ? ' mc--paused' : ''} ${className}`.trim()}
      viewBox="0 -18 200 238"
      aria-hidden="true"
      focusable="false"
    >
      <ellipse className="mc-shadow" cx="100" cy="208" rx="52" ry="8" fill={INK} opacity=".16" />
      <g className="mc-all">
        {/* kaki */}
        <ellipse cx="74" cy="198" rx="17" ry="10" fill="#A8CB1A" stroke={INK} strokeWidth="4" />
        <ellipse cx="126" cy="198" rx="17" ry="10" fill="#A8CB1A" stroke={INK} strokeWidth="4" />

        {/* lengan kiri */}
        <g className="mc-arm mc-arm-l">
          <ellipse cx="26" cy="132" rx="12" ry="18" fill="#C4EC24" stroke={INK} strokeWidth="4" transform="rotate(18 26 132)" />
        </g>

        {/* badan */}
        <g className="mc-body">
          <path d="M100 24 C152 24 174 70 174 122 C174 172 146 200 100 200 C54 200 26 172 26 122 C26 70 48 24 100 24Z" fill="#D7FF3A" stroke={INK} strokeWidth="4.5" strokeLinejoin="round" />
          <ellipse cx="100" cy="148" rx="42" ry="38" fill="#EBFF8F" opacity=".75" />

          {/* tunas */}
          <g className="mc-sprout">
            <path d="M100 26 Q97 6 105 -6" fill="none" stroke="#3E5200" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M105 -2 Q128 -16 136 6 Q114 16 105 -2Z" fill="#6E9A00" stroke="#3E5200" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M101 8 Q80 -2 70 16 Q90 26 101 8Z" fill="#8DBA10" stroke="#3E5200" strokeWidth="3.5" strokeLinejoin="round" />
          </g>

          {/* stetoskop kecil (sapaan ke dunia keperawatan) */}
          <path d="M62 66 Q100 98 138 66" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <path d="M138 66 Q166 112 142 160" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" />
          <circle cx="142" cy="164" r="8" fill="#C9CED3" stroke={INK} strokeWidth="3.5" />

          {/* wajah */}
          <g className="mc-face" style={{ transform: `translate(${look.x}px, ${look.y}px)` }}>
            <Brows mood={m} />
            <g className="mc-eyes">
              {squint ? (
                <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
                  <path d="M66 112 Q78 98 90 112" /><path d="M110 112 Q122 98 134 112" />
                </g>
              ) : (
                <>
                  <ellipse cx="78" cy={eyeY} rx="9.5" ry="12.5" fill={INK} />
                  <ellipse cx="122" cy={eyeY} rx="9.5" ry="12.5" fill={INK} />
                  <circle cx="81.5" cy={eyeY - 5} r="3.6" fill="#fff" />
                  <circle cx="125.5" cy={eyeY - 5} r="3.6" fill="#fff" />
                </>
              )}
            </g>
            <ellipse cx="60" cy="134" rx="10" ry="6.5" fill="#FF8F7A" opacity=".75" />
            <ellipse cx="140" cy="134" rx="10" ry="6.5" fill="#FF8F7A" opacity=".75" />
            <Mouth mood={m} />
          </g>
        </g>

        {/* lengan kanan (melambai / terangkat) */}
        <g className="mc-arm mc-arm-r">
          <ellipse cx="174" cy="132" rx="12" ry="18" fill="#C4EC24" stroke={INK} strokeWidth="4" transform="rotate(-18 174 132)" />
        </g>
      </g>

      {/* percikan perayaan — hanya saat celebrate, sekali jalan */}
      {m === 'celebrate' && (
        <g className="mc-sparks" fill="#D7FF3A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round">
          <path className="mc-spark s1" d="M20 40 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4z" />
          <path className="mc-spark s2" d="M182 30 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" />
          <path className="mc-spark s3" d="M12 120 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#FF8F7A" />
          <path className="mc-spark s4" d="M188 110 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z" fill="#7CC4F2" />
        </g>
      )}
    </svg>
  );
}
