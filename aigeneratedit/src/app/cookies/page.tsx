import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cookie Policy | AIGeneratedIt",
  description: "AIGeneratedIt Cookie Policy — what cookies we use and how to control them.",
  alternates: { canonical: "https://aigeneratedit.com/cookies" },
};

const COOKIES = [
  { name: "__session",        type: "Strictly Necessary", duration: "Session",   purpose: "Maintains your session state during a visit. Required for the platform to function." },
  { name: "_ts_csrf",         type: "Strictly Necessary", duration: "Session",   purpose: "Cross-site request forgery protection. Required for secure form submissions." },
  { name: "_ts_analytics",    type: "Analytics",          duration: "90 days",   purpose: "Anonymized usage analytics (page views, feature usage). No personal data stored." },
  { name: "_ts_perf",         type: "Performance",        duration: "30 days",   purpose: "Performance monitoring to detect and fix slow page loads and API timeouts." },
];

export default function CookiePage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F5F5F7", minHeight: "100vh", paddingTop: 72 }}>
        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EBEBED", padding: "clamp(40px,5vw,64px) 0" }}>
          <div className="container">
            <h1 className="D" style={{ fontSize: "clamp(26px,4vw,44px)", color: "#1D1D1F", marginBottom: 8 }}>Cookie Policy</h1>
            <p style={{ fontSize: 13.5, color: "#AEAEB2" }}>Last updated: March 31, 2026</p>
          </div>
        </div>
        <div className="container" style={{ paddingTop: "clamp(32px,4vw,48px)", paddingBottom: "clamp(64px,8vw,96px)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "28px 32px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F", marginBottom: 10 }}>What are cookies?</h2>
              <p style={{ fontSize: 13.5, color: "#6E6E73", lineHeight: 1.75 }}>
                Cookies are small text files placed on your device when you visit a website. AIGeneratedIt uses a minimal set of cookies — strictly necessary ones required for the platform to function, and optional analytics cookies to help us improve detection accuracy and user experience.
              </p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #F0F0F0" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F" }}>Cookies we use</h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #EBEBED", background: "#FAFAFA" }}>
                      {["Name", "Type", "Duration", "Purpose"].map(h => (
                        <th key={h} scope="col" style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#AEAEB2" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COOKIES.map((c, i) => (
                      <tr key={c.name} style={{ borderBottom: i < COOKIES.length - 1 ? "1px solid #F5F5F7" : "none" }}>
                        <td style={{ padding: "12px 16px" }}><code style={{ fontSize: 12, color: "#8DB800" }}>{c.name}</code></td>
                        <td style={{ padding: "12px 16px" }}>
                          <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 999, background: c.type === "Strictly Necessary" ? "rgba(200,241,53,0.12)" : "rgba(0,122,255,0.08)", color: c.type === "Strictly Necessary" ? "#5A7A00" : "#007AFF" }}>
                            {c.type}
                          </span>
                        </td>
                        <td style={{ padding: "12px 16px", color: "#6E6E73" }}>{c.duration}</td>
                        <td style={{ padding: "12px 16px", color: "#6E6E73", lineHeight: 1.55 }}>{c.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "28px 32px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F", marginBottom: 10 }}>How to control cookies</h2>
              <p style={{ fontSize: 13.5, color: "#6E6E73", lineHeight: 1.75 }}>
                Strictly necessary cookies cannot be disabled — they are required for the platform to function. You may disable analytics and performance cookies via your browser settings or by contacting us at <a href="mailto:privacy@aigeneratedit.com" style={{ color: "#8DB800" }}>privacy@aigeneratedit.com</a>.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
