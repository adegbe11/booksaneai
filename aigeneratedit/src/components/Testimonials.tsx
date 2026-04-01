"use client";

import { useCallback, useEffect, useState } from "react";

const quotes = [
  {
    text: "We used aigeneratedit to verify audio from a source before going to air. It flagged a cloned voice in under 4 seconds — saving us from an error that would have been impossible to walk back.",
    name: "Sarah Mitchell",
    role: "Senior Producer, BBC Verify",
    init: "S",
  },
  {
    text: "The heatmap overlay on the image detector shows exactly which pixels were synthesized. No other platform does this at this accuracy level. It has become essential to our research workflow.",
    name: "Dr. James Okafor",
    role: "Research Fellow, MIT Media Lab",
    init: "J",
  },
  {
    text: "We integrated the API into our editorial pipeline. Every image from freelancers is now automatically scanned before it reaches an editor. Zero extra effort, zero synthetic media making it to print.",
    name: "Priya Nair",
    role: "Digital Editor, Reuters",
    init: "P",
  },
  {
    text: "Our legal team now authenticates video evidence through aigeneratedit before presenting in proceedings. The cryptographic certificate has been accepted in three federal courts.",
    name: "Marcus Chen",
    role: "Partner, Chen & Associates Law",
    init: "M",
  },
];

export default function Testimonials() {
  const [idx,    setIdx]    = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIdx(i => (i + 1) % quotes.length), []);
  const prev = () => setIdx(i => (i - 1 + quotes.length) % quotes.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5400);
    return () => clearInterval(t);
  }, [paused, next]);

  const q = quotes[idx];

  return (
    <section
      aria-labelledby="testimonials-heading"
      className="section-space"
      style={{ background: "#F5F5F7" }}
    >
      <div className="container-narrow">

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 5vw, 60px)" }}>
          <div className="section-label" style={{ marginBottom: 18, display: "inline-flex" }}>
            Testimonials
          </div>
          <h2
            id="testimonials-heading"
            className="D"
            style={{ fontSize: "clamp(28px, 4vw, 48px)", color: "#1D1D1F", lineHeight: 1.1 }}
          >
            The people who verify the world trust us.
          </h2>
        </div>

        {/* Quote card */}
        <div
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E5E7",
            borderRadius: 20,
            padding: "clamp(28px, 5vw, 52px)",
            boxShadow: "0 4px 40px rgba(0,0,0,0.06)",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Decorative quote mark */}
          <div
            className="D"
            aria-hidden
            style={{
              position: "absolute", top: 16, left: 24,
              fontSize: 120, lineHeight: 1,
              color: "#C8F135", opacity: 0.35,
              userSelect: "none", pointerEvents: "none",
            }}
          >
            &ldquo;
          </div>

          <div style={{ position: "relative" }}>
            {/* Quote */}
            <blockquote>
              <p
                key={idx}
                style={{
                  fontSize: "clamp(15px, 1.8vw, 18px)",
                  color: "#1D1D1F",
                  lineHeight: 1.75,
                  fontStyle: "italic",
                  marginBottom: 28,
                  paddingTop: 32,
                  animation: "fadeUp 0.4s ease forwards",
                }}
              >
                &ldquo;{q.text}&rdquo;
              </p>

              {/* Author */}
              <footer style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: "50%",
                  background: "#F0F0F2",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 15, fontWeight: 700, color: "#6E6E73", flexShrink: 0,
                }}>
                  {q.init}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1D1D1F" }}>{q.name}</p>
                  <p style={{ fontSize: 13, color: "#6E6E73" }}>{q.role}</p>
                </div>
              </footer>
            </blockquote>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 28 }}>
              {/* Dots */}
              <div style={{ display: "flex", gap: 6 }} role="tablist" aria-label="Testimonials">
                {quotes.map((_, i) => (
                  <button
                    key={i}
                    role="tab"
                    aria-selected={i === idx}
                    onClick={() => setIdx(i)}
                    className={`dot ${i === idx ? "active" : ""}`}
                    aria-label={`Testimonial ${i + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next */}
              <div style={{ display: "flex", gap: 8 }}>
                {[{ fn: prev, label: "Previous testimonial", ch: "‹" }, { fn: next, label: "Next testimonial", ch: "›" }].map(({ fn, label, ch }) => (
                  <button
                    key={label}
                    onClick={fn}
                    aria-label={label}
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      border: "1.5px solid #D2D2D7", background: "transparent",
                      cursor: "pointer", fontSize: 18, color: "#6E6E73",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 180ms ease",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#C8F135"; e.currentTarget.style.color = "#8DB800"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#D2D2D7"; e.currentTarget.style.color = "#6E6E73"; }}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
