import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — AI Detection Research & Deepfake News | AIGeneratedIt",
  description:
    "Research, guides, and news on AI detection, deepfakes, synthetic media, and content authenticity from the AIGeneratedIt team.",
  alternates: { canonical: "https://aigeneratedit.com/blog" },
};

const POSTS = [
  {
    category: "Research",
    title:    "How TruthScan Achieves 99.8% Accuracy Across Audio, Video, Image & Text",
    desc:     "A deep dive into our ensemble architecture — RawNet2, XceptionNet, RoBERTa, and SyncNet — and how we weight votes across modalities.",
    date:     "March 28, 2026",
    read:     "12 min read",
    slug:     "#",
  },
  {
    category: "Deepfakes",
    title:    "The 2026 State of Synthetic Media: What Changed in 12 Months",
    desc:     "ElevenLabs V3, Sora 2, and Stable Diffusion XL Turbo changed the threat model. Here is what detection teams need to know.",
    date:     "March 22, 2026",
    read:     "9 min read",
    slug:     "#",
  },
  {
    category: "Standards",
    title:    "C2PA Content Credentials Explained: A Plain-English Guide",
    desc:     "What are content credentials, how do they work cryptographically, and why does AIGeneratedIt check them on every image scan?",
    date:     "March 15, 2026",
    read:     "7 min read",
    slug:     "#",
  },
  {
    category: "Enterprise",
    title:    "How Reuters Verification Desk Uses AI Detection at Scale",
    desc:     "An inside look at how a global newsroom processes 3,000+ media assets per day through forensic AI detection workflows.",
    date:     "March 8, 2026",
    read:     "6 min read",
    slug:     "#",
  },
  {
    category: "Guide",
    title:    "EU AI Act Article 52: What Publishers Must Disclose About AI Content",
    desc:     "A compliance guide for media companies, publishers, and content creators operating in the European Union.",
    date:     "March 1, 2026",
    read:     "10 min read",
    slug:     "#",
  },
  {
    category: "Research",
    title:    "Voice Clone Detection Benchmark: RawNet2 vs Wav2Vec2 vs MFCC-CNN",
    desc:     "We tested 3 audio detection models on 12,000 samples from ElevenLabs, VALL-E, and Resemble.ai. Here are the results.",
    date:     "February 22, 2026",
    read:     "14 min read",
    slug:     "#",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Research:   "#C8F135",
  Deepfakes:  "#FF9500",
  Standards:  "#007AFF",
  Enterprise: "#34C759",
  Guide:      "#AF52DE",
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F5F5F7", minHeight: "100vh", paddingTop: 72 }}>

        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EBEBED", padding: "clamp(48px,6vw,72px) 0" }}>
          <div className="container">
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#8DB800", display: "block", marginBottom: 12 }}>
              TruthScan Research
            </span>
            <h1 className="D" style={{ fontSize: "clamp(28px,4.5vw,52px)", color: "#1D1D1F", marginBottom: 12 }}>
              Blog
            </h1>
            <p style={{ fontSize: 15, color: "#6E6E73", maxWidth: 480 }}>
              Research, detection guides, and synthetic media news from the AIGeneratedIt team.
            </p>
          </div>
        </div>

        <div className="container" style={{ paddingTop: "clamp(40px,5vw,60px)", paddingBottom: "clamp(64px,8vw,96px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20, maxWidth: 1100, margin: "0 auto" }}>
            {POSTS.map(p => (
              <Link
                key={p.title}
                href={p.slug}
                style={{ textDecoration: "none" }}
              >
                <article style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "24px", height: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", padding: "3px 10px", borderRadius: 999, background: `${CATEGORY_COLORS[p.category] ?? "#C8F135"}18`, color: CATEGORY_COLORS[p.category] ?? "#8DB800" }}>
                      {p.category}
                    </span>
                    <span style={{ fontSize: 11.5, color: "#AEAEB2" }}>{p.read}</span>
                  </div>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F", lineHeight: 1.4, flex: 1 }}>{p.title}</h2>
                  <p style={{ fontSize: 13.5, color: "#6E6E73", lineHeight: 1.65 }}>{p.desc}</p>
                  <p style={{ fontSize: 11.5, color: "#C4C4C8", marginTop: "auto" }}>{p.date}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
