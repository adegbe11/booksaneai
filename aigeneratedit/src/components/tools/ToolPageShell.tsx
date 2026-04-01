"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Upload, Loader2, CheckCircle, AlertTriangle,
  ChevronDown, Copy, Check, ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────── */

export type InputMode = "text" | "file" | "url" | "compare";

export type ToolRelated = {
  title: string;
  href: string;
  icon: LucideIcon;
  desc: string;
};

export type ToolFeature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export type ToolFAQ = { q: string; a: string };

export type ToolConfig = {
  category: string;
  categoryHref: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor?: string;
  inputMode: InputMode;
  accept?: string;
  placeholder?: string;
  placeholderB?: string;        // for compare mode: second input
  labelA?: string;              // compare: left label
  labelB?: string;              // compare: right label
  actionLabel: string;
  features: ToolFeature[];
  faq: ToolFAQ[];
  related: ToolRelated[];
  onRun: (input: string, inputB?: string) => Promise<ToolResult>;
  onRunFile?: (file: File) => Promise<ToolResult>;  // optional: used for file-mode tools
};

export type ToolResult = {
  verdict: string;
  score: number;                // 0–100
  color: string;                // hex
  summary: string;
  details: string[];
  output?: string;              // for writing tools — transformed text
};

/* ─── Sub-components ────────────────────────────────────────── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5,
        fontSize: 12, fontWeight: 600, color: "#6E6E73",
        background: "none", border: "none", cursor: "pointer",
        padding: "4px 8px", borderRadius: 6,
        transition: "color 160ms ease",
      }}
    >
      {copied ? <Check size={13} color="#8DB800" /> : <Copy size={13} />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function FAQItem({ item, open, toggle }: { item: ToolFAQ; open: boolean; toggle: () => void }) {
  return (
    <div style={{ borderBottom: "1px solid #F0F0F0" }}>
      <button
        onClick={toggle}
        style={{
          width: "100%", display: "flex", alignItems: "center",
          justifyContent: "space-between", padding: "16px 0",
          background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <span style={{ fontSize: 14.5, fontWeight: 600, color: "#1D1D1F", paddingRight: 16 }}>{item.q}</span>
        <ChevronDown
          size={18}
          style={{ flexShrink: 0, color: "#AEAEB2", transition: "transform 200ms ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      {open && (
        <div style={{ paddingBottom: 16 }}>
          <p style={{ fontSize: 14, color: "#6E6E73", lineHeight: 1.72 }}>{item.a}</p>
        </div>
      )}
    </div>
  );
}

/* ─── Main Shell ─────────────────────────────────────────────── */

export default function ToolPageShell({ config }: { config: ToolConfig }) {
  const [input,    setInput]    = useState("");
  const [inputB,   setInputB]   = useState("");
  const [urlVal,   setUrl]      = useState("");
  const [dragging, setDragging] = useState(false);
  const [status,   setStatus]   = useState<"idle" | "loading" | "done">("idle");
  const [result,   setResult]   = useState<ToolResult | null>(null);
  const [openFaq,  setOpenFaq]  = useState<number | null>(null);
  const [scanErr,  setScanErr]  = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const canRun =
    config.inputMode === "text"    ? input.trim().length > 30 :
    config.inputMode === "url"     ? urlVal.startsWith("http") :
    config.inputMode === "compare" ? input.trim().length > 10 && inputB.trim().length > 10 :
    true;

  const run = async (file?: File) => {
    setScanErr(null);
    setStatus("loading");
    setResult(null);
    try {
      let res: ToolResult;
      if (config.inputMode === "file" && file && config.onRunFile) {
        res = await config.onRunFile(file);
      } else {
        res = await config.onRun(
          config.inputMode === "url" ? urlVal : input,
          inputB,
        );
      }
      setResult(res);
      setStatus("done");
    } catch {
      setScanErr("Detection failed — please try again.");
      setStatus("idle");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) run(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) run(f);
  };

  return (
    <div style={{ background: "#F5F5F7", minHeight: "100vh" }}>

      {/* ── Breadcrumb ── */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EBEBED" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 0", fontSize: 13, color: "#AEAEB2" }}>
            <Link href="/" style={{ color: "#AEAEB2", textDecoration: "none", transition: "color 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#1D1D1F")}
              onMouseLeave={e => (e.currentTarget.style.color = "#AEAEB2")}
            >Home</Link>
            <span>/</span>
            <Link href={config.categoryHref} style={{ color: "#AEAEB2", textDecoration: "none", transition: "color 150ms" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#1D1D1F")}
              onMouseLeave={e => (e.currentTarget.style.color = "#AEAEB2")}
            >{config.category}</Link>
            <span>/</span>
            <span style={{ color: "#1D1D1F", fontWeight: 500 }}>{config.title}</span>
          </div>
        </div>
      </div>

      {/* ── Page header ── */}
      <div style={{ background: "#FFFFFF", paddingTop: "clamp(40px,5vw,64px)", paddingBottom: "clamp(32px,4vw,52px)", borderBottom: "1px solid #EBEBED" }}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div style={{ maxWidth: 680 }}>
              <span style={{
                display: "inline-block", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.12em", textTransform: "uppercase",
                color: "#8DB800", background: "rgba(200,241,53,0.1)",
                border: "1px solid rgba(200,241,53,0.25)",
                borderRadius: 999, padding: "4px 12px", marginBottom: 16,
              }}>
                {config.badge}
              </span>
              <h1 className="D" style={{ fontSize: "clamp(28px, 4vw, 48px)", color: "#1D1D1F", lineHeight: 1.07, marginBottom: 12 }}>
                {config.title}
              </h1>
              <p style={{ fontSize: "clamp(15px, 1.6vw, 17px)", color: "#6E6E73", lineHeight: 1.72, maxWidth: 520 }}>
                {config.subtitle}
              </p>
            </div>
            {/* Trust stamps */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
              {["EU AI Act Compliant", "C2PA Verified", "99.8% Accuracy"].map(t => (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#6E6E73" }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", background: "rgba(141,184,0,0.1)", border: "1.5px solid rgba(141,184,0,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="8" height="7" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#8DB800" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </span>
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="container" style={{ paddingTop: "clamp(32px,4vw,52px)", paddingBottom: "clamp(48px,6vw,80px)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 20, maxWidth: 860, marginLeft: "auto", marginRight: "auto" }}>

          {/* Error */}
          {scanErr && (
            <div style={{ background: "#FFF2F1", border: "1px solid #FFCCC9", borderRadius: 12, padding: "12px 18px", fontSize: 13, fontWeight: 600, color: "#FF3B30" }}>
              {scanErr}
            </div>
          )}

          {/* ── Input card ── */}
          {status !== "done" && (
            <div style={{
              background: "#FFFFFF", borderRadius: 16,
              border: "1px solid #E5E5E7",
              boxShadow: "0 4px 32px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}>
              {/* Card header */}
              <div style={{ padding: "18px 24px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F" }}>
                  {config.inputMode === "compare" ? "Compare Content" : config.inputMode === "url" ? "Enter URL" : config.inputMode === "file" ? "Upload File" : "Enter Content"}
                </span>
                {config.inputMode === "text" && (
                  <span style={{ fontSize: 12, color: "#AEAEB2" }}>{input.length} chars</span>
                )}
              </div>

              <div style={{ padding: 24 }}>

                {/* TEXT */}
                {config.inputMode === "text" && (
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={config.placeholder}
                    style={{
                      width: "100%", height: 180, resize: "vertical",
                      fontSize: 14, color: "#1D1D1F", lineHeight: 1.68,
                      border: "1.5px solid #EBEBED", borderRadius: 12,
                      padding: "14px 16px", outline: "none",
                      fontFamily: "inherit", background: "#FAFAFA",
                      transition: "border-color 180ms",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#C8F135")}
                    onBlur={e => (e.target.style.borderColor = "#EBEBED")}
                  />
                )}

                {/* FILE */}
                {config.inputMode === "file" && (
                  <div
                    className={`upload-zone ${dragging ? "dragging" : ""}`}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input ref={fileRef} type="file" accept={config.accept} className="sr-only" onChange={handleFileChange} />
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "48px 24px" }}>
                      <div style={{ width: 60, height: 60, borderRadius: 16, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                        <Upload size={24} color="#8DB800" strokeWidth={2} />
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 700, color: "#1D1D1F", marginBottom: 6 }}>
                        {dragging ? "Release to analyze" : "Drop file here or click to upload"}
                      </p>
                      <p style={{ fontSize: 13, color: "#AEAEB2" }}>{config.placeholder}</p>
                    </div>
                    <div className="scan-line" />
                  </div>
                )}

                {/* URL */}
                {config.inputMode === "url" && (
                  <input
                    type="url"
                    value={urlVal}
                    onChange={e => setUrl(e.target.value)}
                    placeholder={config.placeholder || "https://example.com/article"}
                    style={{
                      width: "100%", fontSize: 14, color: "#1D1D1F",
                      border: "1.5px solid #EBEBED", borderRadius: 12,
                      padding: "14px 16px", outline: "none",
                      fontFamily: "inherit", background: "#FAFAFA",
                      transition: "border-color 180ms",
                    }}
                    onFocus={e => (e.target.style.borderColor = "#C8F135")}
                    onBlur={e => (e.target.style.borderColor = "#EBEBED")}
                  />
                )}

                {/* COMPARE */}
                {config.inputMode === "compare" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { val: input,  set: setInput,  label: config.labelA || "Original", ph: config.placeholder },
                      { val: inputB, set: setInputB, label: config.labelB || "Compare",  ph: config.placeholderB },
                    ].map(({ val, set, label, ph }) => (
                      <div key={label}>
                        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#AEAEB2", marginBottom: 8 }}>{label}</p>
                        <textarea
                          value={val}
                          onChange={e => set(e.target.value)}
                          placeholder={ph}
                          style={{
                            width: "100%", height: 160, resize: "none",
                            fontSize: 13.5, color: "#1D1D1F", lineHeight: 1.65,
                            border: "1.5px solid #EBEBED", borderRadius: 10,
                            padding: "12px 14px", outline: "none",
                            fontFamily: "inherit", background: "#FAFAFA",
                            transition: "border-color 180ms",
                          }}
                          onFocus={e => (e.target.style.borderColor = "#C8F135")}
                          onBlur={e => (e.target.style.borderColor = "#EBEBED")}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Action row */}
                {config.inputMode !== "file" && (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, flexWrap: "wrap", gap: 10 }}>
                    <p style={{ fontSize: 11.5, color: "#C4C4C8" }}>
                      Files deleted in 24 h · Never used to train models · GDPR compliant
                    </p>
                    <button
                      onClick={() => run()}
                      disabled={!canRun || status === "loading"}
                      className="btn btn-soul"
                      style={{ fontSize: 14, padding: "10px 24px", opacity: canRun ? 1 : 0.45, cursor: canRun ? "pointer" : "not-allowed" }}
                    >
                      {status === "loading" ? (
                        <><Loader2 size={15} className="animate-spin" /> Analyzing…</>
                      ) : (
                        <>{config.actionLabel} <ArrowRight size={14} /></>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── Loading state ── */}
          {status === "loading" && (
            <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E5E5E7", padding: "clamp(40px,5vw,64px)", textAlign: "center", boxShadow: "0 4px 32px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <Loader2 size={44} style={{ color: "#C8F135", animation: "spin 1s linear infinite" }} />
              </div>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F", marginBottom: 8 }}>Analyzing content…</p>
              <p style={{ fontSize: 13.5, color: "#6E6E73" }}>Running forensic checks across multiple detection layers</p>
              {/* Progress bars */}
              <div style={{ maxWidth: 360, margin: "28px auto 0", display: "flex", flexDirection: "column", gap: 10 }}>
                {["Pattern analysis", "Source verification", "Metadata inspection", "Ensemble vote"].map((step, i) => (
                  <div key={step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1, height: 4, background: "#EBEBED", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", background: "#C8F135", borderRadius: 999, width: `${55 + i * 12}%`, transition: "width 0.8s ease" }} />
                    </div>
                    <span style={{ fontSize: 11.5, color: "#AEAEB2", width: 130, textAlign: "left" }}>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Result card ── */}
          {status === "done" && result && (
            <>
              <div style={{ background: "#FFFFFF", borderRadius: 16, border: "1px solid #E5E5E7", overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.05)" }}>

                {/* Verdict header */}
                <div style={{ padding: "20px 24px", background: result.color + "0D", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {result.score > 50
                      ? <AlertTriangle size={26} style={{ color: result.color, flexShrink: 0 }} />
                      : <CheckCircle size={26} style={{ color: result.color, flexShrink: 0 }} />
                    }
                    <div>
                      <p className="D" style={{ fontSize: 20, color: result.color, lineHeight: 1 }}>{result.verdict}</p>
                      <p style={{ fontSize: 13, color: "#6E6E73", marginTop: 4 }}>{result.summary}</p>
                    </div>
                  </div>
                  <div className="D" style={{ fontSize: 48, color: result.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {result.score}%
                  </div>
                </div>

                {/* Confidence bar */}
                <div style={{ padding: "16px 24px", borderBottom: "1px solid #F7F7F7" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, color: "#AEAEB2", marginBottom: 8 }}>
                    <span>Confidence score</span>
                    <span style={{ fontWeight: 700, color: "#1D1D1F" }}>{result.score}%</span>
                  </div>
                  <div style={{ height: 7, background: "#EBEBED", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${result.score}%`, background: result.color, borderRadius: 999, transition: "width 0.8s ease" }} />
                  </div>
                </div>

                {/* Output text (writing tools) */}
                {result.output && (
                  <div style={{ padding: "16px 24px", borderBottom: "1px solid #F7F7F7" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#AEAEB2" }}>Result</p>
                      <CopyButton text={result.output} />
                    </div>
                    <div style={{ background: "#F9F9FB", borderRadius: 10, padding: "14px 16px", border: "1px solid #EBEBED" }}>
                      <p style={{ fontSize: 14, color: "#1D1D1F", lineHeight: 1.72 }}>{result.output}</p>
                    </div>
                  </div>
                )}

                {/* Details list */}
                <div style={{ padding: "16px 24px", background: "#FAFAFA" }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#AEAEB2", marginBottom: 12 }}>Findings</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                    {result.details.map((d, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, fontSize: 13.5, color: "#6E6E73", lineHeight: 1.55 }}>
                        <span style={{ color: result.color, flexShrink: 0, marginTop: 2 }}>
                          {result.score > 50 ? "⚠" : "✓"}
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action row */}
                <div style={{ padding: "14px 24px", borderTop: "1px solid #EBEBED", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button className="btn-primary" style={{ fontSize: 13, padding: "9px 18px" }}>Export PDF Report</button>
                  <button onClick={() => { setStatus("idle"); setResult(null); }} className="btn-ghost" style={{ fontSize: 13, padding: "9px 18px" }}>
                    Analyze again
                  </button>
                  <Link href="/badge" className="btn-ghost" style={{ fontSize: 13, padding: "9px 18px" }}>Generate Badge</Link>
                </div>
              </div>
            </>
          )}

          {/* ── Features strip ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginTop: 8 }}>
            {config.features.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 14, padding: "20px 20px" }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(200,241,53,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                    <Icon size={18} color="#8DB800" strokeWidth={1.8} />
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1D1D1F", marginBottom: 5 }}>{f.title}</p>
                  <p style={{ fontSize: 13, color: "#6E6E73", lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* ── FAQ ── */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "24px 28px" }}>
            <h2 className="D" style={{ fontSize: 20, color: "#1D1D1F", marginBottom: 20 }}>
              Frequently asked questions
            </h2>
            {config.faq.map((item, i) => (
              <FAQItem key={i} item={item} open={openFaq === i} toggle={() => setOpenFaq(openFaq === i ? null : i)} />
            ))}
          </div>

          {/* ── Related tools ── */}
          {config.related.length > 0 && (
            <div>
              <h3 className="D" style={{ fontSize: 18, color: "#1D1D1F", marginBottom: 16 }}>Related tools</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {config.related.map(r => {
                  const Icon = r.icon;
                  return (
                    <Link
                      key={r.href}
                      href={r.href}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        background: "#FFFFFF", border: "1px solid #E5E5E7",
                        borderRadius: 12, padding: "14px 16px",
                        textDecoration: "none",
                        transition: "border-color 160ms, box-shadow 160ms",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(200,241,53,0.5)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.06)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#E5E5E7"; e.currentTarget.style.boxShadow = "none"; }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: "#F5F5F7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <Icon size={16} color="#5A7A00" strokeWidth={1.8} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F", marginBottom: 2 }}>{r.title}</p>
                        <p style={{ fontSize: 11.5, color: "#8E8E93" }}>{r.desc}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
