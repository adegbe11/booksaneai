import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "GDPR Compliance | AIGeneratedIt",
  description: "AIGeneratedIt GDPR compliance statement — data subject rights, lawful basis for processing, and DPA contact.",
  alternates: { canonical: "https://aigeneratedit.com/gdpr" },
};

const RIGHTS = [
  { right: "Right of access",             desc: "Request a copy of all personal data we hold about you." },
  { right: "Right to rectification",       desc: "Correct inaccurate personal data we hold about you." },
  { right: "Right to erasure",             desc: "Request deletion of your personal data ('right to be forgotten')." },
  { right: "Right to restrict processing", desc: "Ask us to limit how we use your personal data." },
  { right: "Right to data portability",    desc: "Receive your data in a machine-readable format." },
  { right: "Right to object",              desc: "Object to our processing of your data at any time." },
];

export default function GDPRPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F5F5F7", minHeight: "100vh", paddingTop: 72 }}>
        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EBEBED", padding: "clamp(40px,5vw,64px) 0" }}>
          <div className="container">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 999, background: "rgba(200,241,53,0.1)", border: "1px solid rgba(200,241,53,0.25)", marginBottom: 14 }}>
              <svg width="8" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#8DB800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#8DB800" }}>EU AI Act Compliant</span>
            </div>
            <h1 className="D" style={{ fontSize: "clamp(26px,4vw,44px)", color: "#1D1D1F", marginBottom: 8 }}>GDPR Compliance</h1>
            <p style={{ fontSize: 13.5, color: "#AEAEB2" }}>Last updated: March 31, 2026</p>
          </div>
        </div>

        <div className="container" style={{ paddingTop: "clamp(32px,4vw,48px)", paddingBottom: "clamp(64px,8vw,96px)" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>

            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "28px 32px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F", marginBottom: 10 }}>Our commitment</h2>
              <p style={{ fontSize: 13.5, color: "#6E6E73", lineHeight: 1.75 }}>
                AIGeneratedIt is fully compliant with the EU General Data Protection Regulation (GDPR) and the EU AI Act. We process the minimum data necessary to provide our detection service, retain it for the minimum time possible (24 hours), and apply cryptographic protections throughout.
              </p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "28px 32px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F", marginBottom: 10 }}>Lawful basis for processing</h2>
              <p style={{ fontSize: 13.5, color: "#6E6E73", lineHeight: 1.75 }}>
                We process submitted content under the lawful basis of <strong>legitimate interests</strong> (Art. 6(1)(f) GDPR) — specifically, the legitimate interest of providing the AI detection service requested by the user. No special category data is intentionally collected. Content is processed for detection purposes only and deleted within 24 hours.
              </p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "28px 32px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F", marginBottom: 16 }}>Your data subject rights</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {RIGHTS.map(r => (
                  <div key={r.right} style={{ display: "flex", gap: 16, padding: "14px 0", borderBottom: "1px solid #F5F5F7" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8F135", marginTop: 6, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#1D1D1F", marginBottom: 3 }}>{r.right}</p>
                      <p style={{ fontSize: 13, color: "#6E6E73" }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#AEAEB2", marginTop: 16 }}>
                To exercise any right, email <a href="mailto:privacy@aigeneratedit.com" style={{ color: "#8DB800" }}>privacy@aigeneratedit.com</a>. We respond within 30 days.
              </p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "28px 32px" }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F", marginBottom: 10 }}>Data Protection Officer</h2>
              <p style={{ fontSize: 13.5, color: "#6E6E73", lineHeight: 1.75 }}>
                Our Data Protection Officer can be reached at <a href="mailto:dpo@aigeneratedit.com" style={{ color: "#8DB800" }}>dpo@aigeneratedit.com</a>. You also have the right to lodge a complaint with your national data protection authority.
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
