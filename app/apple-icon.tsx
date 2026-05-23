import { ImageResponse } from "next/og";

// Apple touch icon — shown when someone adds the site to their iOS home screen.
// 180×180 PNG generated server-side from the same brand mark used in the favicon.

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 50% 35%, #1e293b 0%, #020617 70%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Concentric brand mark — bigger, glowing variant for retina home-screen */}
        <svg width="140" height="140" viewBox="0 0 140 140">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Outer amber ring */}
          <circle cx="70" cy="70" r="55" fill="none" stroke="#fcd34d" strokeWidth="3" opacity="0.55" />
          {/* Inner cyan ring */}
          <circle cx="70" cy="70" r="30" fill="none" stroke="#38bdf8" strokeWidth="3" />
          {/* Center seed */}
          <circle cx="70" cy="70" r="11" fill="#fb923c" filter="url(#glow)" />
          {/* Cardinal ticks */}
          <line x1="70" y1="6" x2="70" y2="15" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="70" y1="125" x2="70" y2="134" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="6" y1="70" x2="15" y2="70" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="125" y1="70" x2="134" y2="70" stroke="#fcd34d" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
