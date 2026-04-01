"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const tabs = [
  {
    id: "journalists",
    label: "Journalism",
    heading: "Verify before you publish.",
    body: "Catch deepfake audio interviews, AI-generated press images, and cloned voices before they damage your credibility. Built for reporters working under deadline pressure.",
    detail: "The only platform that checks audio, video, and images in a single workflow — with results before your next editorial meeting.",
    cta: "Audio Detector",
    href: "/detect/audio",
    verdict: "SYNTHETIC AUDIO",
    confidence: 94,
    verdictColor: "#FF3B30",
    artifact: "Cloned voice detected · 0:02 – 0:08",
  },
  {
    id: "academics",
    label: "Academia",
    heading: "Academic integrity at scale.",
    body: "Detect AI-written submissions with per-sentence scoring, verify research media authenticity, and generate transparency certificates for published work.",
    detail: "Model attribution identifies which generation system was responsible — critical for institutional review and academic publishing standards.",
    cta: "Text Detector",
    href: "/detect/text",
    verdict: "SYNTHETIC TEXT",
    confidence: 89,
    verdictColor: "#FF3B30",
    artifact: "Generative patterns in paragraphs 2, 4, 7",
  },
  {
    id: "legal",
    label: "Legal",
    heading: "Evidence you can stand behind.",
    body: "Verify identity documents, authenticate video evidence, and detect synthetic voice in recorded depositions — with cryptographic certificates accepted in legal proceedings.",
    detail: "PDF reports include timestamp, file hash, confidence scores, and a public-key signature accepted in federal proceedings.",
    cta: "Video Detector",
    href: "/detect/video",
    verdict: "AUTHENTIC",
    confidence: 98,
    verdictColor: "#8DB800",
    artifact: "No synthetic artifacts detected",
  },
  {
    id: "creators",
    label: "Creators",
    heading: "Prove your work is yours.",
    body: "Protect your content with a cryptographically signed transparency badge. Embed it on your portfolio or site to prove human authorship to your audience.",
    detail: "The badge contains a cryptographic hash of your content — verifiable by anyone, unforgeable by anyone.",
    cta: "Badge Generator",
    href: "/badge",
    verdict: "HUMAN VERIFIED",
    confidence: 100,
    verdictColor: "#8DB800",
    artifact: "Badge issued · BGE-2026-3841",
  },
  {
    id: "enterprise",
    label: "Enterprise",
    heading: "Detection at organizational scale.",
    body: "API integration, custom model fine-tuning on proprietary data, white-label reporting, and SLA guarantees — built for content pipelines that can't afford false negatives.",
    detail: "Integrates with your CMS, moderation workflow, or broadcast stack via REST API, Webhooks, Slack, and Teams.",
    cta: "Contact Sales",
    href: "/contact",
    verdict: "API ACTIVE",
    confidence: 100,
    verdictColor: "#8DB800",
    artifact: "1,247 items verified in last 24 h",
  },
];

export default function UseCaseTabs() {
  const [active, setActive] = useState("journalists");
  const cur = tabs.find(t => t.id === active)!;

  return (
    <section
      aria-labelledby="usecases-heading"
      className="section-space"
      style={{ background: "#FFFFFF" }}
    >
      <div className="container">

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "clamp(40px, 5vw, 64px)" }}>
          <div className="section-label" style={{ marginBottom: 18, display: "inline-flex" }}>
            Use cases
          </div>
          <h2
            id="usecases-heading"
            className="D"
            style={{
              fontSize: "clamp(30px, 4vw, 52px)",
              color: "#1D1D1F",
              lineHeight: 1.06,
              maxWidth: 580,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Built for those who can&apos;t afford to be wrong.
          </h2>
        </div>

        {/* Tab bar */}
        <div
          role="tablist"
          aria-label="Use cases"
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 6, marginBottom: 36 }}
        >
          {tabs.map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={active === t.id}
              aria-controls={`panel-${t.id}`}
              onClick={() => setActive(t.id)}
              style={{
                padding: "8px 20px",
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 160ms ease",
                border: active === t.id ? "none" : "1.5px solid #E5E5E7",
                background: active === t.id ? "#1D1D1F" : "#FFFFFF",
                color:      active === t.id ? "#FFFFFF"  : "#6E6E73",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div
          key={active}
          id={`panel-${active}`}
          role="tabpanel"
          style={{
            background: "#FFFFFF",
            border: "1px solid #E5E5E7",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 8px 48px rgba(0,0,0,0.06)",
            animation: "scaleIn 0.28s cubic-bezier(0.16,1,0.3,1) forwards",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left — copy */}
            <div style={{
              padding: "clamp(32px, 5vw, 56px)",
              display: "flex", flexDirection: "column", gap: 18,
              justifyContent: "center",
            }}>
              <h3
                className="D"
                style={{ fontSize: "clamp(22px, 2.8vw, 32px)", color: "#1D1D1F", lineHeight: 1.15 }}
              >
                {cur.heading}
              </h3>
              <p style={{ fontSize: 15, color: "#6E6E73", lineHeight: 1.75 }}>{cur.body}</p>
              <p style={{ fontSize: 13.5, color: "#AEAEB2", lineHeight: 1.68 }}>{cur.detail}</p>
              <Link
                href={cur.href}
                className="btn btn-soul"
                style={{ fontSize: 14, padding: "12px 22px", width: "fit-content" }}
              >
                {cur.cta}
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Right — result mock-up */}
            <div style={{
              background: "#F9F9FB",
              borderLeft: "1px solid #EBEBED",
              padding: "clamp(32px, 5vw, 56px)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                background: "#FFFFFF",
                border: "1px solid #E5E5E7",
                borderRadius: 16,
                padding: 24,
                width: "100%",
                maxWidth: 300,
                boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
              }}>
                {/* Verdict pill */}
                <div style={{
                  background: cur.verdictColor + "12",
                  borderRadius: 10, padding: "13px 16px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  marginBottom: 16,
                }}>
                  <span className="D" style={{ fontSize: 12, color: cur.verdictColor, letterSpacing: "0.04em" }}>
                    {cur.verdict}
                  </span>
                  <span className="D" style={{ fontSize: 30, color: cur.verdictColor, letterSpacing: "-0.03em" }}>
                    {cur.confidence}%
                  </span>
                </div>

                {/* Confidence bar */}
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, fontSize: 11, color: "#AEAEB2" }}>
                    <span>Confidence</span>
                    <span style={{ fontWeight: 600, color: "#1D1D1F" }}>{cur.confidence}%</span>
                  </div>
                  <div style={{ height: 5, background: "#EBEBED", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{
                      height: "100%",
                      width: `${cur.confidence}%`,
                      background: cur.verdictColor,
                      borderRadius: 999,
                      transition: "width 0.6s ease",
                    }} />
                  </div>
                </div>

                {/* Artifact */}
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <span style={{ color: cur.verdictColor, fontSize: 11, flexShrink: 0, marginTop: 1 }}>
                    {cur.verdictColor === "#FF3B30" ? "●" : "✓"}
                  </span>
                  <span style={{ fontSize: 12.5, color: "#6E6E73", lineHeight: 1.55 }}>{cur.artifact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
