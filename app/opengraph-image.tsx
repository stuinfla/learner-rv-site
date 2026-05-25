import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

// Open Graph share image — 1200×630, the universal social-card spec.
// Rendered server-side at build time via @vercel/og; embeds the real
// v0 Appliance photo as base64 so it works at first deploy without a URL.

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt =
  "Cognitum Learn — turn any topic into an in-house expert you can ask anything. Videos → cited answers on your hardware.";

export default async function OpengraphImage() {
  // Embed the real v0 Appliance photo (no URL dependency)
  const seedPhoto = await readFile(
    join(process.cwd(), "public", "img", "seed-on-mac.png")
  );
  const seedDataUri = `data:image/png;base64,${seedPhoto.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background:
            "radial-gradient(circle at 22% 30%, #1e293b 0%, #020617 65%)",
          color: "#e2e8f0",
          fontFamily: "sans-serif",
          padding: "60px 64px",
          position: "relative",
        }}
      >
        {/* Subtle grid texture overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* LEFT — wordmark + headline + tagline + url */}
        <div
          style={{
            flex: "1 1 60%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            paddingRight: 40,
            position: "relative",
          }}
        >
          {/* Top — wordmark */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Inline brand mark */}
            <svg width="40" height="40" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="11" fill="none" stroke="#fcd34d" strokeWidth="1.4" opacity="0.55" />
              <circle cx="16" cy="16" r="6.5" fill="none" stroke="#38bdf8" strokeWidth="1.4" />
              <circle cx="16" cy="16" r="2.6" fill="#fb923c" />
            </svg>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#fcd34d",
                textTransform: "uppercase",
              }}
            >
              Cognitum Learn
            </div>
          </div>

          {/* Middle — headline (split into single-text divs so Satori is happy) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "#f8fafc",
                }}
              >
                Turn any topic into
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 18,
                  fontSize: 72,
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: "-0.02em",
                  color: "#f8fafc",
                }}
              >
                <span>an in-house</span>
                <span style={{ color: "#fcd34d", fontStyle: "italic" }}>expert.</span>
              </div>
            </div>
            <div
              style={{
                fontSize: 24,
                lineHeight: 1.45,
                color: "#94a3b8",
                maxWidth: 580,
              }}
            >
              Videos and content on the internet, distilled to cited answers — on a device that lives on your desk. No cloud. No subscription.
            </div>
          </div>

          {/* Bottom — url + version */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 18,
              color: "#64748b",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                color: "#10b981",
              }}
            >
              <div style={{ width: 8, height: 8, background: "#10b981", borderRadius: 0 }} />
              shipping v0.4.0
            </div>
            <div style={{ color: "#334155" }}>·</div>
            <div>cognitum-learn-site.vercel.app</div>
          </div>
        </div>

        {/* RIGHT — Seed photo */}
        <div
          style={{
            flex: "0 0 38%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              width: 380,
              height: 440,
              borderRadius: 10,
              border: "1px solid rgba(252,211,77,0.25)",
              overflow: "hidden",
              boxShadow: "0 24px 60px rgba(120,53,15,0.4)",
            }}
          >
            <img
              src={seedDataUri}
              width={380}
              height={440}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt=""
            />
          </div>
          {/* Now-shipping pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              border: "1px solid rgba(16,185,129,0.4)",
              background: "rgba(16,185,129,0.08)",
              color: "#6ee7b7",
              fontSize: 14,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fontFamily: "monospace",
              borderRadius: 3,
            }}
          >
            <div style={{ width: 6, height: 6, background: "#34d399", borderRadius: 999 }} />
            Cognitum One Seed · now shipping
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
