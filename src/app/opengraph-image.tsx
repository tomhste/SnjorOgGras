import { ImageResponse } from "next/og";
import { business } from "@/lib/content";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${business.name} — ${business.tagline}`;

// Generated at build time (no stock photo, no manual design tool) — this
// is what shows up as the link preview card on social media / iMessage /
// Slack etc. when someone shares the site URL.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f7f5ee",
          color: "#16181a",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 28,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#1f5f3f",
          }}
        >
          {business.location}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 600,
            marginTop: 24,
          }}
        >
          {business.name}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 36,
            marginTop: 24,
            maxWidth: 900,
            color: "#44493f",
          }}
        >
          {business.tagline}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 56,
            fontSize: 30,
            color: "#1f5f3f",
            fontWeight: 600,
          }}
        >
          Sími {business.phone}
        </div>
      </div>
    ),
    { ...size }
  );
}
