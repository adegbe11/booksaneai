import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact AIGeneratedIt — Sales, Enterprise & API Inquiries",
  description:
    "Contact the AIGeneratedIt team for enterprise plans, API access, press inquiries, and TruthScan integration support.",
  alternates: { canonical: "https://aigeneratedit.com/contact" },
};

const CHANNELS = [
  {
    title:   "Enterprise & Sales",
    desc:    "Custom plans, volume pricing, on-premise deployment, and SLA agreements.",
    email:   "sales@aigeneratedit.com",
    cta:     "Email Sales",
  },
  {
    title:   "API & Developer Support",
    desc:    "API key requests, integration support, webhooks, and technical documentation.",
    email:   "api@aigeneratedit.com",
    cta:     "Email Dev Support",
  },
  {
    title:   "Press & Media",
    desc:    "Press kits, interview requests, research partnerships, and media inquiries.",
    email:   "press@aigeneratedit.com",
    cta:     "Email Press",
  },
  {
    title:   "General",
    desc:    "Questions, feedback, bug reports, and everything else.",
    email:   "hello@aigeneratedit.com",
    cta:     "Email Us",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F5F5F7", minHeight: "100vh", paddingTop: 72 }}>

        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EBEBED", padding: "clamp(48px,6vw,72px) 0" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8DB800" }}>
              Get in touch
            </span>
            <h1 className="D" style={{ fontSize: "clamp(28px,4.5vw,52px)", color: "#1D1D1F", lineHeight: 1.07, marginTop: 12, marginBottom: 12 }}>
              Contact AIGeneratedIt
            </h1>
            <p style={{ fontSize: "clamp(14px,1.5vw,16px)", color: "#6E6E73", maxWidth: 440, margin: "0 auto" }}>
              We respond to all inquiries within one business day. For urgent matters, email sales directly.
            </p>
          </div>
        </div>

        <div className="container" style={{ paddingTop: "clamp(40px,5vw,64px)", paddingBottom: "clamp(64px,8vw,96px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, maxWidth: 860, margin: "0 auto" }}>
            {CHANNELS.map(c => (
              <div key={c.title} style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "28px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F" }}>{c.title}</h2>
                <p style={{ fontSize: 13.5, color: "#6E6E73", lineHeight: 1.68, flex: 1 }}>{c.desc}</p>
                <a
                  href={`mailto:${c.email}`}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 13, fontWeight: 700, color: "#8DB800",
                    textDecoration: "none", marginTop: 4,
                  }}
                >
                  {c.cta} →
                </a>
                <p style={{ fontSize: 11.5, color: "#AEAEB2" }}>{c.email}</p>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: 860, margin: "24px auto 0" }}>
            <div style={{ background: "#0A0A0A", borderRadius: 16, padding: "32px", textAlign: "center" }}>
              <h3 className="D" style={{ fontSize: 22, color: "#FFFFFF", marginBottom: 8 }}>
                Powered by TruthScan AI Engine
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 0 }}>
                EU AI Act compliant · C2PA verified · 99.8% accuracy · GDPR compliant
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
