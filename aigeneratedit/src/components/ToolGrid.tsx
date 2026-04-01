"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, Video, Image, FileText, Link2, Award, ArrowRight } from "lucide-react";

const tools = [
  {
    id: "audio",
    icon: Mic,
    title: "Audio Deepfake Detector",
    badge: "96% accuracy",
    desc: "Spectral analysis, voice biometrics, and synthesis fingerprinting — catches cloned voices in under 3 seconds.",
    href: "/detect/audio",
    cat: "detection",
  },
  {
    id: "video",
    icon: Video,
    title: "Video Deepfake Detector",
    badge: "97% accuracy",
    desc: "Frame-by-frame forensic analysis detects face-swaps, lip-sync manipulation, and generative video artifacts.",
    href: "/detect/video",
    cat: "detection",
  },
  {
    id: "image",
    icon: Image,
    title: "Image Authenticity Scanner",
    badge: "95% accuracy",
    desc: "GAN fingerprinting, diffusion model detection, EXIF forensics, and pixel-level synthesis heatmaps.",
    href: "/detect/image",
    cat: "detection",
  },
  {
    id: "text",
    icon: FileText,
    title: "AI Text Detector",
    badge: "93% accuracy",
    desc: "Per-sentence scoring identifies synthetic text from any language model, with model attribution.",
    href: "/detect/text",
    cat: "detection",
  },
  {
    id: "url",
    icon: Link2,
    title: "URL Media Scanner",
    badge: "Multi-modal",
    desc: "Scan any webpage — every image, audio clip, video, and paragraph is analyzed in a single pass.",
    href: "/detect/url",
    cat: "verification",
  },
  {
    id: "badge",
    icon: Award,
    title: "Transparency Badge",
    badge: "Cryptographic",
    desc: "Cryptographically signed proof of human authorship — embeddable on any site, verifiable by anyone.",
    href: "/badge",
    cat: "reporting",
  },
];

const FILTERS = [
  { id: "all",          label: "All tools" },
  { id: "detection",    label: "Detection" },
  { id: "verification", label: "Verification" },
  { id: "reporting",    label: "Reporting" },
];

export default function ToolGrid() {
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? tools : tools.filter(t => t.cat === filter);

  return (
    <section
      id="tools"
      aria-labelledby="tools-heading"
      className="section-space"
      style={{ background: "#F5F5F7" }}
    >
      <div className="container">

        {/* Heading — left-aligned, editorial */}
        <div style={{ marginBottom: "clamp(40px, 5vw, 64px)", maxWidth: 560 }}>
          <div className="section-label" style={{ marginBottom: 18 }}>
            Detection suite
          </div>
          <h2
            id="tools-heading"
            className="D"
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              color: "#1D1D1F",
              lineHeight: 1.06,
              marginBottom: 14,
            }}
          >
            Every format.<br />One platform.
          </h2>
          <p style={{ fontSize: "clamp(15px, 1.6vw, 17px)", color: "#6E6E73", lineHeight: 1.72, maxWidth: 420 }}>
            From a single audio clip to a full webpage — detect synthetic media wherever it hides.
          </p>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40 }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              style={{
                padding: "7px 18px",
                borderRadius: 999,
                fontSize: 13.5,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 160ms ease",
                border: filter === f.id ? "none" : "1.5px solid #E0E0E3",
                background: filter === f.id ? "#1D1D1F" : "#FFFFFF",
                color:      filter === f.id ? "#FFFFFF"  : "#6E6E73",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {shown.map(tool => {
            const Icon = tool.icon;
            return (
              <Link key={tool.id} href={tool.href} className="tool-card" aria-label={tool.title}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: "#F0F0F2",
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <Icon size={19} color="#1D1D1F" strokeWidth={1.8} />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    background: "rgba(200,241,53,0.14)", color: "#5A7A00",
                    borderRadius: 999, padding: "4px 10px",
                    flexShrink: 0, whiteSpace: "nowrap",
                  }}>
                    {tool.badge}
                  </span>
                </div>

                <h3 className="D" style={{ fontSize: 17, color: "#1D1D1F", lineHeight: 1.25 }}>
                  {tool.title}
                </h3>

                <p style={{ fontSize: 14, color: "#6E6E73", lineHeight: 1.68, flex: 1 }}>
                  {tool.desc}
                </p>

                <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13.5, fontWeight: 700, color: "#8DB800" }}>
                  {tool.id === "badge" ? "Generate badge" : "Open detector"}
                  <ArrowRight size={13} strokeWidth={2.5} />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
