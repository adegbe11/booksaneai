import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About AIGeneratedIt — The TruthScan AI Detection Platform",
  description:
    "AIGeneratedIt is the world's #1 AI content detection platform, powered by TruthScan AI Engine. Detect AI-generated images, audio, video, and text with 99.8% accuracy.",
  alternates: { canonical: "https://aigeneratedit.com/about" },
};

const STATS = [
  { value: "4.83M+", label: "Scans completed" },
  { value: "190+",   label: "Countries served" },
  { value: "99.8%",  label: "Accuracy rating" },
  { value: "2.8 s",  label: "Avg response time" },
];

const TEAM_VALUES = [
  {
    title: "Truth as infrastructure",
    desc:  "In the 2026 Synthetic Era, the ability to verify what is real is foundational — as critical as encryption or identity. We build the tools that make truth verifiable.",
  },
  {
    title: "Forensics, not guesswork",
    desc:  "Every result is backed by a multi-model ensemble — RawNet2, XceptionNet, RoBERTa, SyncNet — not a single classifier. We report confidence, not certainty theater.",
  },
  {
    title: "Privacy by design",
    desc:  "Files are processed in-memory and deleted within 24 hours. We never train on user data, never sell signals to third parties, and never store content longer than necessary.",
  },
  {
    title: "Open standards",
    desc:  "We are active contributors to C2PA (Coalition for Content Provenance and Authenticity) and advocate for EU AI Act compliance across the industry.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F5F5F7", minHeight: "100vh", paddingTop: 72 }}>

        {/* Hero */}
        <div style={{ background: "#0A0A0A", padding: "clamp(64px,8vw,96px) 0" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8DB800", display: "block", marginBottom: 16 }}>
              Our mission
            </span>
            <h1 className="D" style={{ fontSize: "clamp(32px,5vw,60px)", color: "#FFFFFF", lineHeight: 1.06, marginBottom: 20 }}>
              Protecting truth in the<br />
              <span style={{ color: "#C8F135" }}>2026 Synthetic Era</span>
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,18px)", color: "rgba(255,255,255,0.45)", maxWidth: 520, margin: "0 auto", lineHeight: 1.72 }}>
              AIGeneratedIt is the world&apos;s #1 forensic AI detection platform. We built TruthScan AI Engine so that journalists, researchers, legal teams, and everyday people can verify what is real.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EBEBED" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))" }}>
              {STATS.map(s => (
                <div key={s.label} style={{ padding: "28px 0", textAlign: "center", borderRight: "1px solid #EBEBED" }}>
                  <p className="D" style={{ fontSize: 32, color: "#1D1D1F", marginBottom: 4 }}>{s.value}</p>
                  <p style={{ fontSize: 12.5, color: "#AEAEB2" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingTop: "clamp(48px,6vw,80px)", paddingBottom: "clamp(64px,8vw,96px)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Story */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "clamp(28px,4vw,40px)" }}>
              <h2 className="D" style={{ fontSize: 26, color: "#1D1D1F", marginBottom: 16 }}>The problem we solve</h2>
              <p style={{ fontSize: 15, color: "#6E6E73", lineHeight: 1.8, marginBottom: 14 }}>
                By 2026, synthetic media generation reached a threshold where unaided human perception can no longer reliably distinguish real from fake. Voice clones pass family recognition tests. AI images fool experienced journalists. Deepfake video is used in courtrooms.
              </p>
              <p style={{ fontSize: 15, color: "#6E6E73", lineHeight: 1.8, marginBottom: 14 }}>
                AIGeneratedIt was built to close that gap. We combine the most accurate open-source forensic models — RawNet2 for voice, XceptionNet for faces, RoBERTa for text — with proprietary ensemble scoring to deliver the highest detection accuracy available anywhere.
              </p>
              <p style={{ fontSize: 15, color: "#6E6E73", lineHeight: 1.8 }}>
                We are compliant with the EU AI Act and are a contributing member of the C2PA (Coalition for Content Provenance and Authenticity), co-designing the open standards for content credentials alongside Adobe, Microsoft, and the BBC.
              </p>
            </div>

            {/* Values */}
            <div>
              <h2 className="D" style={{ fontSize: 22, color: "#1D1D1F", marginBottom: 16 }}>What we stand for</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 16 }}>
                {TEAM_VALUES.map(v => (
                  <div key={v.title} style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 14, padding: "24px" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#C8F135", marginBottom: 14 }} />
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1D1D1F", marginBottom: 8 }}>{v.title}</h3>
                    <p style={{ fontSize: 13.5, color: "#6E6E73", lineHeight: 1.7 }}>{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background: "#0A0A0A", borderRadius: 16, padding: "40px", textAlign: "center" }}>
              <h3 className="D" style={{ fontSize: 24, color: "#FFFFFF", marginBottom: 8 }}>Start verifying content today</h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)", marginBottom: 24 }}>Free. No account required. Results in seconds.</p>
              <Link href="/detect/audio" className="btn btn-soul" style={{ fontSize: 14, padding: "13px 28px" }}>
                Start Scanning →
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
