"use client";

import { useInView } from "react-intersection-observer";

const steps = [
  {
    n: "01",
    title: "Submit",
    body: "Upload a file, paste text, or enter any public URL. Every major media format is supported — no conversion required.",
  },
  {
    n: "02",
    title: "Analyze",
    body: "A forensic ensemble examines spectral signatures, pixel artifacts, metadata consistency, and writing patterns — simultaneously.",
  },
  {
    n: "03",
    title: "Verify",
    body: "Instant verdict with confidence score, artifact map, and a cryptographically signed certificate you can share or embed.",
  },
];

export default function HowItWorks() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section
      id="how-it-works"
      aria-labelledby="howitworks-heading"
      className="section-space"
      style={{ background: "#FFFFFF" }}
    >
      <div className="container">

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "clamp(48px, 6vw, 80px)" }}>
          <div className="section-label" style={{ marginBottom: 18, display: "inline-flex" }}>
            How it works
          </div>
          <h2
            id="howitworks-heading"
            className="D"
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              color: "#1D1D1F",
              lineHeight: 1.06,
            }}
          >
            Forensic-grade analysis.<br />Three steps.
          </h2>
        </div>

        {/* Steps */}
        <div ref={ref} style={{ position: "relative" }}>
          {/* Connector line — desktop only */}
          <div
            className="hidden lg:block"
            aria-hidden
            style={{
              position: "absolute",
              top: 29,
              left: "calc(16.67% + 24px)",
              right: "calc(16.67% + 24px)",
              height: 1,
              borderTop: "1.5px dashed #E5E5E7",
            }}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center sm:items-start text-center sm:text-left ${inView ? "fade-up visible" : "fade-up"}`}
                style={{ animationDelay: `${i * 110}ms` }}
              >
                {/* Step number */}
                <div style={{
                  width: 58, height: 58, borderRadius: "50%",
                  background: "#F5F5F7", border: "1.5px solid #E5E5E7",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: 28, flexShrink: 0,
                }}>
                  <span className="D" style={{ fontSize: 15, color: "#1D1D1F", letterSpacing: "-0.01em" }}>
                    {s.n}
                  </span>
                </div>

                <h3 className="D" style={{ fontSize: 21, color: "#1D1D1F", marginBottom: 10 }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14.5, color: "#6E6E73", lineHeight: 1.72 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
