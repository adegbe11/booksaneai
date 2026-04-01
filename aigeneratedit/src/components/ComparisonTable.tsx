"use client";

import { useInView } from "react-intersection-observer";

const rows = [
  { name: "aigeneratedit", hero: true,  audio: "96%", video: "97%", image: "95%", text: "93%", multimodal: "Yes" },
  { name: "Sensity",       hero: false, audio: "88%", video: "90%", image: "89%", text: "—",   multimodal: "Partial" },
  { name: "Reality Defender", hero: false, audio: "85%", video: "88%", image: "87%", text: "—", multimodal: "Partial" },
  { name: "Hive Moderation",  hero: false, audio: "84%", video: "86%", image: "88%", text: "—", multimodal: "Partial" },
  { name: "GPTZero",       hero: false, audio: "—",   video: "—",   image: "—",   text: "85%", multimodal: "No" },
];

const cols = ["Audio", "Video", "Image", "Text", "Multi-modal"];

export default function ComparisonTable() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section
      aria-labelledby="comparison-heading"
      className="section-space"
      style={{ background: "#F5F5F7" }}
    >
      <div className="container">

        {/* Heading — left-aligned */}
        <div style={{ marginBottom: "clamp(40px, 5vw, 64px)", maxWidth: 560 }}>
          <div className="section-label" style={{ marginBottom: 18 }}>
            Benchmark results
          </div>
          <h2
            id="comparison-heading"
            className="D"
            style={{ fontSize: "clamp(30px, 4vw, 52px)", color: "#1D1D1F", lineHeight: 1.06 }}
          >
            The most accurate<br />detection platform.
          </h2>
        </div>

        {/* Table */}
        <div
          ref={ref}
          style={{
            background: "#FFFFFF",
            borderRadius: 16,
            border: "1px solid #E5E5E7",
            overflow: "hidden",
            boxShadow: "0 4px 32px rgba(0,0,0,0.05)",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.55s ease, transform 0.55s ease",
          }}
        >
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #F0F0F0" }}>
                  <th scope="col" style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#AEAEB2", whiteSpace: "nowrap" }}>
                    Platform
                  </th>
                  {cols.map(c => (
                    <th key={c} scope="col" style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#AEAEB2", whiteSpace: "nowrap" }}>
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom: i < rows.length - 1 ? "1px solid #F7F7F7" : "none",
                      background: r.hero ? "rgba(200,241,53,0.05)" : "#FFFFFF",
                      borderLeft: r.hero ? "3px solid #C8F135" : "3px solid transparent",
                    }}
                  >
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className={r.hero ? "D" : ""} style={{ fontSize: 14, color: r.hero ? "#1D1D1F" : "#6E6E73", fontWeight: r.hero ? 700 : 400 }}>
                          {r.name}
                        </span>
                        {r.hero && (
                          <span style={{ fontSize: 10, fontWeight: 700, background: "#C8F135", color: "#0A0A0A", borderRadius: 999, padding: "2px 8px" }}>
                            #1
                          </span>
                        )}
                      </div>
                    </td>
                    {[r.audio, r.video, r.image, r.text, r.multimodal].map((v, j) => (
                      <td key={j} style={{ padding: "14px 20px", fontSize: 14 }}>
                        <span style={{
                          color: v === "—" ? "#D2D2D7"
                            : r.hero ? "#5A7A00"
                            : v === "No" ? "#AEAEB2"
                            : "#6E6E73",
                          fontWeight: r.hero ? 700 : 400,
                        }}>
                          {r.hero && v !== "—" && j < 4 ? "✦ " : ""}{v}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ padding: "10px 20px", background: "#FAFAFA", borderTop: "1px solid #F0F0F0" }}>
            <p style={{ fontSize: 11, color: "#C4C4C8" }}>
              Benchmarked on FaceForensics++, ASVspoof 2021, and generative image detection datasets. March 2026.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
