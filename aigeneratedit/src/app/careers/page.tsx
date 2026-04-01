import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Careers at AIGeneratedIt — Join the TruthScan Team",
  description:
    "Work on hard problems in AI detection, forensic media analysis, and content authenticity. Join the team building the world's #1 deepfake detection platform.",
  alternates: { canonical: "https://aigeneratedit.com/careers" },
};

const ROLES = [
  { title: "Senior ML Engineer — Audio Forensics",   team: "Engineering", loc: "Remote", type: "Full-time" },
  { title: "Research Scientist — Deepfake Detection", team: "Research",    loc: "Remote", type: "Full-time" },
  { title: "Full-Stack Engineer (Next.js + FastAPI)",  team: "Engineering", loc: "Remote", type: "Full-time" },
  { title: "Enterprise Account Executive",             team: "Sales",       loc: "Remote", type: "Full-time" },
  { title: "DevRel / Developer Advocate",              team: "Developer",   loc: "Remote", type: "Full-time" },
];

const VALUES = [
  { title: "Remote-first",    desc: "We are fully distributed. Work from anywhere — results are what matter." },
  { title: "Mission-driven",  desc: "Every line of code helps journalists, researchers, and citizens trust what they see." },
  { title: "Deep technical",  desc: "You will work on the hardest unsolved problems in forensic AI detection." },
  { title: "Equity + upside", desc: "Competitive compensation, meaningful equity, and a product the world needs." },
];

export default function CareersPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F5F5F7", minHeight: "100vh", paddingTop: 72 }}>

        <div style={{ background: "#0A0A0A", padding: "clamp(64px,8vw,96px) 0" }}>
          <div className="container">
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8DB800", display: "block", marginBottom: 16 }}>
              We&apos;re hiring
            </span>
            <h1 className="D" style={{ fontSize: "clamp(32px,5vw,56px)", color: "#FFFFFF", lineHeight: 1.07, marginBottom: 16 }}>
              Build the future of<br />
              <span style={{ color: "#C8F135" }}>media authenticity</span>
            </h1>
            <p style={{ fontSize: "clamp(14px,1.5vw,17px)", color: "rgba(255,255,255,0.45)", maxWidth: 480, lineHeight: 1.72 }}>
              Join a small team solving hard problems in forensic AI detection. Remote-first, mission-driven, and moving fast.
            </p>
          </div>
        </div>

        <div className="container" style={{ paddingTop: "clamp(40px,5vw,64px)", paddingBottom: "clamp(64px,8vw,96px)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Values */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 16 }}>
              {VALUES.map(v => (
                <div key={v.title} style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 14, padding: "20px" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8F135", marginBottom: 12 }} />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#1D1D1F", marginBottom: 6 }}>{v.title}</h3>
                  <p style={{ fontSize: 13, color: "#6E6E73", lineHeight: 1.65 }}>{v.desc}</p>
                </div>
              ))}
            </div>

            {/* Open roles */}
            <div>
              <h2 className="D" style={{ fontSize: 22, color: "#1D1D1F", marginBottom: 16 }}>Open roles</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {ROLES.map(r => (
                  <a
                    key={r.title}
                    href="mailto:careers@aigeneratedit.com"
                    style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 14, padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, textDecoration: "none" }}
                  >
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#1D1D1F", marginBottom: 4 }}>{r.title}</p>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[r.team, r.loc, r.type].map(tag => (
                          <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: "#8E8E93", padding: "2px 8px", background: "#F5F5F7", borderRadius: 999 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#8DB800" }}>Apply →</span>
                  </a>
                ))}
              </div>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "24px", textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#6E6E73" }}>
                Don&apos;t see your role? Email us at{" "}
                <a href="mailto:careers@aigeneratedit.com" style={{ color: "#8DB800", fontWeight: 700, textDecoration: "none" }}>
                  careers@aigeneratedit.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
