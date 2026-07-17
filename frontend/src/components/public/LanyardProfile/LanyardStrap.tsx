'use client';

/**
 * Lanyard strap SVG — realistic woven strap with chrome clip.
 *
 * Visual structure (top → bottom):
 *   1. Woven nylon strap (light gray)
 *   2. Metal end-piece 
 *   3. Swivel ring joint
 *   4. Lobster-claw snap hook
 *   5. Bottom connection ring → connects to badge notch
 */
export const LanyardStrap: React.FC = () => {
  return (
    <svg
      width="80"
      height="260"
      viewBox="0 0 80 260"
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        top: '-120px',
        filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.45))',
        pointerEvents: 'none',
      }}
    >
      <defs>
        {/* ─── Woven fabric texture ─── */}
        <pattern id="weave" patternUnits="userSpaceOnUse" width="4" height="4">
          <line x1="0" y1="0.5" x2="4" y2="0.5" stroke="#d4d4d4" strokeWidth="0.6" opacity="0.6" />
          <line x1="0" y1="2" x2="4" y2="2" stroke="#c8c8c8" strokeWidth="0.5" opacity="0.4" />
          <line x1="2" y1="0" x2="2" y2="4" stroke="#bfbfbf" strokeWidth="0.3" opacity="0.2" />
        </pattern>

        {/* ─── Strap gradient (cylindrical) ─── */}
        <linearGradient id="strapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#b8b8b8" />
          <stop offset="15%"  stopColor="#e8e8e8" />
          <stop offset="40%"  stopColor="#f5f5f5" />
          <stop offset="60%"  stopColor="#f0f0f0" />
          <stop offset="85%"  stopColor="#e0e0e0" />
          <stop offset="100%" stopColor="#b0b0b0" />
        </linearGradient>

        {/* ─── Chrome gradients ─── */}
        <linearGradient id="chromeH" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#c8c8c8" />
          <stop offset="25%"  stopColor="#f0f0f0" />
          <stop offset="50%"  stopColor="#d8d8d8" />
          <stop offset="75%"  stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#a0a0a0" />
        </linearGradient>

        <linearGradient id="chromeV" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#e8e8e8" />
          <stop offset="40%"  stopColor="#c0c0c0" />
          <stop offset="100%" stopColor="#999" />
        </linearGradient>

        <radialGradient id="chromeR" cx="40%" cy="35%" r="60%">
          <stop offset="0%"  stopColor="#f5f5f5" />
          <stop offset="50%" stopColor="#c8c8c8" />
          <stop offset="100%" stopColor="#888" />
        </radialGradient>
      </defs>

      {/* ═══ WOVEN STRAP ═══ */}
      {/* Strap drop shadow */}
      <rect x="28" y="2" width="26" height="205" rx="3"
        fill="rgba(0,0,0,0.25)" filter="blur(4px)" opacity="0.3"
      />

      {/* Main strap body */}
      <rect x="30" y="0" width="20" height="205" rx="3" fill="url(#strapGrad)" />
      
      {/* Weave overlay */}
      <rect x="30" y="0" width="20" height="205" rx="3" fill="url(#weave)" opacity="0.5" />

      {/* Left edge highlight */}
      <rect x="30" y="0" width="3" height="205" rx="1.5" fill="rgba(255,255,255,0.15)" />

      {/* Right edge shadow */}
      <rect x="47" y="0" width="3" height="205" rx="1.5" fill="rgba(0,0,0,0.08)" />

      {/* Center seam stitch */}
      <line x1="40" y1="8" x2="40" y2="200"
        stroke="#bbb" strokeWidth="0.5" opacity="0.3" strokeDasharray="3 3" />

      {/* ═══ METAL END-PIECE ═══ */}
      <rect x="32" y="202" width="16" height="10" rx="2" fill="url(#chromeH)" />
      <rect x="32" y="203" width="16" height="2" rx="1" fill="rgba(255,255,255,0.2)" />
      <line x1="33" y1="206" x2="47" y2="206" stroke="rgba(0,0,0,0.06)" strokeWidth="0.3" />

      {/* Rivets */}
      <circle cx="35" cy="207" r="1.5" fill="#aaa" />
      <circle cx="35" cy="207" r="0.8" fill="#eee" opacity="0.6" />
      <circle cx="45" cy="207" r="1.5" fill="#aaa" />
      <circle cx="45" cy="207" r="0.8" fill="#eee" opacity="0.6" />

      {/* ═══ SWIVEL JOINT ═══ */}
      <rect x="36" y="212" width="8" height="6" rx="1.5" fill="url(#chromeV)" />
      <ellipse cx="40" cy="224" rx="5" ry="4" stroke="url(#chromeH)" strokeWidth="3" fill="none" />

      {/* ═══ LOBSTER CLAW ═══ */}
      {/* Clip shadow */}
      <path d="M34,232 L34,247 Q34,255 40,255 Q46,255 46,247 L46,232 Z"
        fill="rgba(0,0,0,0.2)" transform="translate(2,2)" filter="blur(3px)" opacity="0.4"
      />

      {/* Hook outer */}
      <path d="M35,230 L35,248 Q35,256 40,256 Q45,256 45,248 L45,230 Z"
        fill="url(#chromeV)" stroke="#aaa" strokeWidth="0.3"
      />

      {/* Hook inner cavity */}
      <path d="M38,234 L38,249 Q38,253 40,253 Q42,253 42,249 L42,234 Z"
        fill="#030d1a" opacity="0.8"
      />

      {/* Gate bar */}
      <rect x="38.5" y="230" width="3" height="20" rx="1.5" fill="url(#chromeH)"
        stroke="#aaa" strokeWidth="0.2"
      />

      {/* Gate pivot */}
      <circle cx="40" cy="230" r="2.5" fill="url(#chromeR)" />
      <circle cx="39.7" cy="229.7" r="0.6" fill="#fff" opacity="0.5" />

      {/* ═══ BOTTOM RING ═══ */}
      <ellipse cx="40" cy="258" rx="4" ry="3" fill="none" stroke="url(#chromeH)" strokeWidth="2.5" />
    </svg>
  );
};