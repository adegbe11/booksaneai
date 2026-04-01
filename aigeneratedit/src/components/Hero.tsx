"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Mic, Video, Image, FileText, Link2, Upload, ArrowRight } from "lucide-react";

const TABS = [
  { id: "audio", label: "Audio",  icon: Mic,      accept: "audio/*",  hint: "MP3, WAV, M4A, FLAC — up to 500 MB" },
  { id: "video", label: "Video",  icon: Video,     accept: "video/*",  hint: "MP4, MOV, AVI, WEBM — up to 500 MB" },
  { id: "image", label: "Image",  icon: Image,     accept: "image/*",  hint: "JPG, PNG, WEBP, HEIC, RAW" },
  { id: "text",  label: "Text",   icon: FileText,  accept: "",         hint: "Paste any text — essays, articles, reports" },
  { id: "url",   label: "URL",    icon: Link2,     accept: "",         hint: "Scans all media on the page simultaneously" },
];

const TRUST = [
  { label: "EU AI Act Compliant" },
  { label: "C2PA Verified" },
  { label: "99.8% Accuracy Rating" },
];

export default function Hero() {
  const [tab,      setTab]  = useState("audio");
  const [dragging, setDrag] = useState(false);
  const [textVal,  setText] = useState("");
  const [urlVal,   setUrl]  = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const current = TABS.find(t => t.id === tab)!;

  return (
    <section
      aria-label="Hero"
      style={{
        background: "#F5F5F7",
        paddingTop: "clamp(100px, 13vw, 152px)",
        paddingBottom: "clamp(72px, 9vw, 120px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow — subtle, not distracting */}
      <div aria-hidden style={{
        position: "absolute", top: -240, right: -120,
        width: "min(700px, 60vw)", height: "min(700px, 60vw)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,241,53,0.055) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />
      <div aria-hidden style={{
        position: "absolute", bottom: -200, left: -160,
        width: "min(500px, 40vw)", height: "min(500px, 40vw)",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,241,53,0.03) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div className="container">
        {/* Overline */}
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#8DB800",
          }}>
            <span className="live-dot" />
            Media Verification Platform · 2026
          </span>
        </div>

        {/* H1 — primary SEO target */}
        <h1
          className="D"
          style={{
            fontSize: "clamp(36px, 6vw, 72px)",
            lineHeight: 1.04,
            color: "#1D1D1F",
            letterSpacing: "-0.035em",
            textAlign: "center",
            marginBottom: 20,
            maxWidth: 860,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          Is this AI or Real?{" "}
          <span style={{ color: "#8DB800" }}>Stop Guessing.</span>
          <br />
          Know if AI Generated It.
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: "clamp(16px, 1.8vw, 19px)",
          color: "#6E6E73",
          lineHeight: 1.72,
          maxWidth: 540,
          textAlign: "center",
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: 48,
        }}>
          The world&apos;s #1 forensic scanner for the 2026 Synthetic Era.
          Instantly verify images, text, and voice with 99.8% accuracy.
        </p>

        {/* Upload Card */}
        <div style={{
          maxWidth: 680,
          marginLeft: "auto",
          marginRight: "auto",
          background: "#FFFFFF",
          borderRadius: 20,
          border: "1px solid #E5E5E7",
          boxShadow: "0 24px 80px rgba(0,0,0,0.08), 0 4px 20px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}>

          {/* Tab bar */}
          <div style={{
            display: "flex", gap: 4, padding: "10px 10px",
            borderBottom: "1px solid #F0F0F0", overflowX: "auto",
            scrollbarWidth: "none",
          }}>
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                aria-pressed={tab === id}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "7px 16px", borderRadius: 999,
                  fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap",
                  flexShrink: 0, border: "none", cursor: "pointer",
                  transition: "all 160ms ease",
                  background: tab === id ? "#C8F135" : "transparent",
                  color:      tab === id ? "#0A0A0A"  : "#6E6E73",
                }}
              >
                <Icon size={13} strokeWidth={2.2} />
                {label}
              </button>
            ))}
          </div>

          {/* Input area */}
          <div style={{ padding: "20px 20px 0" }}>
            {tab === "text" ? (
              <div>
                <textarea
                  value={textVal}
                  onChange={e => setText(e.target.value)}
                  placeholder="Paste text to verify authorship — articles, reports, academic papers…"
                  aria-label="Paste text to analyze"
                  style={{
                    width: "100%", height: 148, resize: "none",
                    fontSize: 14, color: "#1D1D1F",
                    border: "1.5px solid #EBEBED", borderRadius: 12,
                    padding: "14px 16px", outline: "none",
                    fontFamily: "inherit", lineHeight: 1.65,
                    transition: "border-color 200ms", background: "#FAFAFA",
                  }}
                  onFocus={e => (e.target.style.borderColor = "#C8F135")}
                  onBlur={e  => (e.target.style.borderColor = "#EBEBED")}
                />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10, marginBottom: 20 }}>
                  <span style={{ fontSize: 12, color: "#AEAEB2" }}>{textVal.length} characters</span>
                  <Link href="/detect/text" className="btn btn-soul" style={{ fontSize: 13.5, padding: "9px 20px" }}>
                    Analyze <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ) : tab === "url" ? (
              <div style={{ paddingBottom: 20 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="url"
                    value={urlVal}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    aria-label="Enter URL to scan"
                    style={{
                      flex: 1, fontSize: 14, color: "#1D1D1F",
                      border: "1.5px solid #EBEBED", borderRadius: 12,
                      padding: "12px 16px", outline: "none",
                      fontFamily: "inherit", transition: "border-color 200ms",
                      background: "#FAFAFA",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#C8F135")}
                    onBlur={e  => (e.target.style.borderColor = "#EBEBED")}
                  />
                  <Link href="/detect/url" className="btn btn-soul" style={{ fontSize: 13.5, padding: "12px 20px" }}>
                    Scan
                  </Link>
                </div>
                <p style={{ fontSize: 12, color: "#AEAEB2", marginTop: 8 }}>
                  Simultaneously scans all audio, video, images, and text on the page.
                </p>
              </div>
            ) : (
              <div
                className={`upload-zone ${dragging ? "dragging" : ""}`}
                onDragOver={e  => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e      => { e.preventDefault(); setDrag(false); }}
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label={`Upload ${tab} file for scanning`}
              >
                <input ref={fileRef} type="file" accept={current.accept} className="sr-only" />
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "clamp(32px,5vw,52px) 24px" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: "rgba(200,241,53,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 14,
                  }}>
                    <Upload size={22} color="#8DB800" strokeWidth={2} />
                  </div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1D1D1F", marginBottom: 6 }}>
                    {dragging ? "Release to scan" : "Drop a file or click to upload"}
                  </p>
                  <p style={{ fontSize: 13, color: "#AEAEB2" }}>{current.hint}</p>
                </div>
                <div className="scan-line" />
              </div>
            )}
          </div>

          {/* Privacy strip */}
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center",
            justifyContent: "center", gap: "4px 18px",
            padding: "10px 20px 14px",
            borderTop: "1px solid #F5F5F7",
          }}>
            {["Files deleted within 24 h", "Never used to train models", "GDPR compliant"].map(t => (
              <span key={t} style={{ fontSize: 11.5, color: "#C4C4C8", display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#D2D2D7", display: "inline-block", flexShrink: 0 }} />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Trust Row ── */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "center",
          marginTop: 22, gap: "8px 0",
        }}>
          {TRUST.map(({ label }, i, arr) => (
            <div key={label} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 18px" }}>
                <span style={{
                  width: 20, height: 20, borderRadius: "50%",
                  background: "rgba(141,184,0,0.10)",
                  border: "1.5px solid rgba(141,184,0,0.28)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <svg width="9" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="#8DB800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#3D3D3F", whiteSpace: "nowrap" }}>
                  {label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <span aria-hidden style={{ width: 1, height: 16, background: "#DADADD", flexShrink: 0 }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
