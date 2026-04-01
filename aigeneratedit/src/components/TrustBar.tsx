"use client";

const logos = [
  "Reuters", "BBC Verify", "MIT Media Lab", "AFP",
  "Stanford", "Oxford", "The Guardian", "AP News",
  "Poynter", "Nieman Lab", "DW News", "Le Monde",
];

const track = [...logos, ...logos];

export default function TrustBar() {
  return (
    <section
      aria-label="Trusted by"
      style={{
        background: "#FFFFFF",
        borderTop: "1px solid #EBEBED",
        borderBottom: "1px solid #EBEBED",
        padding: "clamp(32px, 4vw, 48px) 0",
        overflow: "hidden",
      }}
    >
      <p style={{
        textAlign: "center",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: "#C4C4C8",
        marginBottom: 24,
      }}>
        Trusted by newsrooms, universities &amp; research institutions
      </p>

      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Fade edges */}
        <div aria-hidden style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, #fff, transparent)", zIndex: 10, pointerEvents: "none" }} />
        <div aria-hidden style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, #fff, transparent)", zIndex: 10, pointerEvents: "none" }} />

        <div className="marquee-track">
          {track.map((name, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex", alignItems: "center",
                padding: "0 clamp(20px, 3vw, 40px)",
                fontSize: "clamp(13px, 1.4vw, 16px)",
                fontWeight: 700,
                fontFamily: "'Clash Display', var(--font-clash), 'Space Grotesk', sans-serif",
                letterSpacing: "-0.01em",
                color: "#C4C4C8",
                whiteSpace: "nowrap",
                cursor: "default",
                transition: "color 240ms ease",
                userSelect: "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#8DB800")}
              onMouseLeave={e => (e.currentTarget.style.color = "#C4C4C8")}
            >
              <span aria-hidden style={{ width: 4, height: 4, borderRadius: "50%", background: "#E8E8EA", marginRight: "clamp(16px, 2.5vw, 36px)", flexShrink: 0, display: "inline-block" }} />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
