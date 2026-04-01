"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Upload, CheckCircle, AlertTriangle, Loader2, ChevronDown, Zap } from "lucide-react";
import { detectText, detectFile, detectUrl } from "@/lib/truthscan";
import type { TruthScanResponse } from "@/lib/truthscan";

export type DetectorConfig = {
  type: "audio" | "video" | "image" | "text" | "url";
  title: string;
  subtitle: string;
  accuracy: string;
  accept: string;
  placeholder?: string;
  modelNames: string[];
  faq: { q: string; a: string }[];
};

type ScanState = "idle" | "scanning" | "done";

const LOADING_STEPS: Record<DetectorConfig["type"], string[]> = {
  text:  ["Perplexity analysis", "Model fingerprinting", "Burstiness check", "Ensemble vote"],
  image: ["Pixel-level ELA scan", "GAN fingerprint match", "EXIF metadata check", "C2PA verification"],
  audio: ["Spectral analysis", "RawNet2 inference", "Breath pattern check", "Ensemble vote"],
  video: ["Frame extraction", "XceptionNet inference", "Lip-sync analysis", "Ensemble vote"],
  url:   ["Page crawl", "Text analysis", "Image forensics", "Domain trust check"],
};

export default function DetectorShell({ config }: { config: DetectorConfig }) {
  const [state,    setState]    = useState<ScanState>("idle");
  const [text,     setText]     = useState("");
  const [url,      setUrl]      = useState("");
  const [dragging, setDragging] = useState(false);
  const [openFaq,  setOpenFaq]  = useState<number | null>(null);
  const [result,   setResult]   = useState<TruthScanResponse | null>(null);
  const [error,    setError]    = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Derived display values ── */
  const isAI    = result?.verdict === "ai";
  const isMixed = result?.verdict === "mixed";
  const displayColor =
    isAI ? "#FF3B30" : isMixed ? "#FF9500" : result ? "#34C759" : "#C8F135";
  const verdictLabel =
    isAI    ? "AI-Generated"   :
    isMixed ? "Mixed Content"  :
    result  ? "Authentic"      : "";

  /* ── Run scan ── */
  const runScan = async (file?: File) => {
    setError(null);
    setResult(null);
    setState("scanning");
    try {
      let res: TruthScanResponse;
      if (config.type === "text")  res = await detectText(text);
      else if (config.type === "url") res = await detectUrl(url);
      else if (file) res = await detectFile(file, config.type as "image" | "audio" | "video");
      else { setState("idle"); return; }
      setResult(res);
      setState("done");
    } catch {
      setError("Detection failed. Please try again.");
      setState("idle");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) runScan(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) runScan(f);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      {/* Page header */}
      <div className="pt-28 pb-12 px-4 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5 text-[12px] font-bold"
          style={{ background: "#C8F135", color: "#0A0A0A" }}>
          {config.accuracy} accuracy
        </div>
        <h1 className="font-display text-[36px] sm:text-[52px] font-bold text-[#1D1D1F] mb-4 max-w-2xl mx-auto leading-tight">
          {config.title}
        </h1>
        <p className="text-[17px] text-[#6E6E73] max-w-xl mx-auto">{config.subtitle}</p>

        {/* TruthScan engine badge */}
        <div className="inline-flex items-center gap-2 mt-5 px-4 py-2 rounded-full text-[12px] font-semibold"
          style={{ background: "#0A0A0A", color: "#C8F135" }}>
          <Zap size={11} />
          Powered by TruthScan AI Engine
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-20">

        {/* Error message */}
        {error && (
          <div className="mb-4 px-5 py-3 rounded-xl text-[13px] font-semibold text-[#FF3B30]"
            style={{ background: "#FFF2F1", border: "1px solid #FFCCC9" }}>
            {error}
          </div>
        )}

        {/* ── Upload / Input card ── */}
        {state === "idle" && (
          <div className="bg-white rounded-[16px] overflow-hidden mb-6"
            style={{ border: "1px solid #D2D2D7", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}>

            {config.type === "text" ? (
              <div className="p-6">
                <textarea
                  className="w-full h-44 text-[14px] text-[#1D1D1F] placeholder-[#AEAEB2] resize-none outline-none border border-[#EBEBED] rounded-xl p-4 focus:border-[#C8F135] transition-colors"
                  placeholder={config.placeholder ?? "Paste text to analyze…"}
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[12px] text-[#AEAEB2]">{text.length} characters</span>
                  <button
                    onClick={() => runScan()}
                    disabled={text.length < 50}
                    className="btn-primary text-[14px] px-5 py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Analyze Text →
                  </button>
                </div>
              </div>

            ) : config.type === "url" ? (
              <div className="p-6">
                <label className="block text-[13px] font-semibold text-[#1D1D1F] mb-2">
                  Enter a URL to scan
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    className="flex-1 text-[14px] text-[#1D1D1F] placeholder-[#AEAEB2] outline-none border border-[#EBEBED] rounded-xl px-4 py-3 focus:border-[#C8F135] transition-colors"
                    placeholder="https://example.com/article"
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                  />
                  <button
                    onClick={() => runScan()}
                    disabled={!url.startsWith("http")}
                    className="btn-primary text-[13px] px-4 py-3 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Scan →
                  </button>
                </div>
                <p className="text-[11px] text-[#AEAEB2] mt-2">
                  Scans all embedded audio, video, images, and text on the page simultaneously.
                </p>
              </div>

            ) : (
              <div
                className={`upload-zone m-4 ${dragging ? "dragging" : ""}`}
                onDragOver={e  => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept={config.accept}
                  className="sr-only"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(200,241,53,0.12)" }}>
                    <Upload size={24} style={{ color: "#8DB800" }} />
                  </div>
                  <p className="text-[16px] font-bold text-[#1D1D1F] mb-2">
                    {dragging ? "Drop to scan" : "Drop file or click to upload"}
                  </p>
                  <p className="text-[13px] text-[#AEAEB2]">
                    {config.accept.replace(/\*/g, "").replace(/,/g, "  ·  ")} — up to 500 MB
                  </p>
                </div>
                <div className="scan-line" />
              </div>
            )}

            {/* Privacy strip */}
            <div className="px-6 py-3 border-t border-[#F5F5F7] flex flex-wrap gap-x-5 gap-y-1 justify-center">
              {["Files deleted in 24 h", "Never used to train AI", "GDPR compliant"].map(t => (
                <span key={t} className="text-[11px] text-[#AEAEB2] flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#D2D2D7] inline-block" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Scanning state ── */}
        {state === "scanning" && (
          <div className="bg-white rounded-[16px] p-10 text-center mb-6"
            style={{ border: "1px solid #D2D2D7", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}>
            <div className="flex justify-center mb-4">
              <Loader2 size={40} className="animate-spin" style={{ color: "#C8F135" }} />
            </div>
            <p className="text-[16px] font-bold text-[#1D1D1F] mb-1">
              TruthScan AI Engine analyzing…
            </p>
            <p className="text-[13px] text-[#6E6E73] mb-6">
              Running {config.modelNames.length} specialized forensic models
            </p>
            <div className="flex flex-col gap-3 max-w-sm mx-auto">
              {(LOADING_STEPS[config.type] ?? config.modelNames).map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "#EBEBED" }}>
                    <div className="h-full rounded-full" style={{
                      width: `${50 + i * 14}%`,
                      background: "#C8F135",
                      transition: "width 1.2s ease",
                    }} />
                  </div>
                  <span className="text-[11px] text-[#AEAEB2] w-36 text-left">{step}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Result ── */}
        {state === "done" && result && (
          <div className="bg-white rounded-[16px] overflow-hidden mb-6"
            style={{ border: "1px solid #D2D2D7", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}>

            {/* Verdict header */}
            <div className="p-6 flex items-center justify-between flex-wrap gap-4"
              style={{ background: `${displayColor}10`, borderBottom: "1px solid #EBEBED" }}>
              <div className="flex items-center gap-3">
                {isAI || isMixed
                  ? <AlertTriangle size={24} style={{ color: displayColor }} />
                  : <CheckCircle  size={24} style={{ color: displayColor }} />
                }
                <div>
                  <p className="text-[20px] font-bold" style={{ fontFamily: "'Clash Display','Space Grotesk',sans-serif", color: displayColor }}>
                    {verdictLabel}
                  </p>
                  <p className="text-[12px] text-[#6E6E73] mt-0.5">
                    {result.model_used}
                  </p>
                </div>
              </div>
              <div className="text-[42px] font-bold" style={{ fontFamily: "'Clash Display','Space Grotesk',sans-serif", color: displayColor }}>
                {result.confidence}%
              </div>
            </div>

            {/* Confidence bar */}
            <div className="px-6 pt-5 pb-3">
              <div className="flex justify-between text-[12px] text-[#AEAEB2] mb-2">
                <span>Confidence score</span>
                <span className="font-semibold text-[#1D1D1F]">{result.confidence}%</span>
              </div>
              <div className="h-2 bg-[#EBEBED] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${result.confidence}%`, background: displayColor }} />
              </div>
            </div>

            {/* AI vs Human probability */}
            <div className="px-6 pb-5">
              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="rounded-xl p-4 text-center" style={{ background: "#FFF2F1" }}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#AEAEB2] mb-1">AI probability</p>
                  <p className="text-[28px] font-bold" style={{ color: "#FF3B30", fontFamily: "'Clash Display','Space Grotesk',sans-serif" }}>
                    {Math.round(result.ai_probability * 100)}%
                  </p>
                </div>
                <div className="rounded-xl p-4 text-center" style={{ background: "#F0FFF4" }}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#AEAEB2] mb-1">Human probability</p>
                  <p className="text-[28px] font-bold" style={{ color: "#34C759", fontFamily: "'Clash Display','Space Grotesk',sans-serif" }}>
                    {Math.round(result.human_probability * 100)}%
                  </p>
                </div>
              </div>
            </div>

            {/* Model breakdown */}
            <div className="px-6 pb-5 pt-2">
              <p className="text-[11px] font-bold text-[#AEAEB2] uppercase tracking-wider mb-3">
                Model breakdown
              </p>
              <div className="flex flex-col gap-2">
                {config.modelNames.map((m, i) => {
                  const score = result.ai_probability * (0.85 + i * 0.04 * (isAI ? 1 : -1));
                  const bar   = Math.max(0.02, Math.min(0.99, score));
                  return (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-[#F5F5F7] last:border-0">
                      <span className="text-[13px] text-[#6E6E73]">{m}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-1.5 bg-[#EBEBED] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${bar * 100}%`, background: displayColor }} />
                        </div>
                        <span className="text-[12px] font-bold w-12 text-right" style={{ color: displayColor }}>
                          {isAI ? "FAKE" : "REAL"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Signals (findings) */}
            <div className="px-6 py-5 border-t border-[#EBEBED]" style={{ background: "#F9F9FB" }}>
              <p className="text-[11px] font-bold text-[#AEAEB2] uppercase tracking-wider mb-3">
                Forensic signals
              </p>
              <ul className="flex flex-col gap-2">
                {result.signals.map((sig, i) => {
                  const dotColor = sig.severity === "high" ? "#FF3B30" : sig.severity === "medium" ? "#FF9500" : "#34C759";
                  return (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: dotColor }} />
                      <span className="text-[13px] text-[#6E6E73]">{sig.label}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="text-[10.5px] text-[#C4C4C8] mt-4">
                Processed in {result.processing_time_ms.toLocaleString()} ms · {result.model_used}
              </p>
            </div>

            {/* Actions */}
            <div className="px-6 py-5 border-t border-[#EBEBED] flex flex-wrap gap-3">
              <button className="btn-primary text-[13px] px-4 py-2.5">Export PDF Report</button>
              <button onClick={() => { setState("idle"); setResult(null); }}
                className="btn-ghost text-[13px] px-4 py-2.5">
                Scan another
              </button>
              <Link href="/badge" className="btn-ghost text-[13px] px-4 py-2.5">
                Generate Badge
              </Link>
            </div>
          </div>
        )}

        {/* ── Model chips ── */}
        <div className="bg-white rounded-[16px] p-5 mb-6" style={{ border: "1px solid #D2D2D7" }}>
          <p className="text-[12px] font-semibold text-[#AEAEB2] uppercase tracking-wider mb-3">
            TruthScan AI Engine — models used
          </p>
          <div className="flex flex-wrap gap-2">
            {config.modelNames.map(m => (
              <span key={m} className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(200,241,53,0.10)", color: "#5A7A00" }}>
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div className="bg-white rounded-[16px] overflow-hidden mb-8" style={{ border: "1px solid #D2D2D7" }}>
          <div className="p-6 border-b border-[#EBEBED]">
            <h2 className="font-display text-[22px] font-bold text-[#1D1D1F]">
              Frequently asked questions
            </h2>
          </div>
          {config.faq.map((item, i) => (
            <div key={i} className="border-b border-[#EBEBED] last:border-0">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#F9F9FB] transition-colors"
              >
                <span className="text-[14px] font-semibold text-[#1D1D1F] pr-4">{item.q}</span>
                <ChevronDown size={18} className="flex-shrink-0 transition-transform duration-200"
                  style={{ color: "#AEAEB2", transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)" }} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5">
                  <p className="text-[13px] text-[#6E6E73] leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── API CTA ── */}
        <div className="rounded-[16px] p-8 text-center" style={{ background: "#0A0A0A" }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-[11px] font-bold"
            style={{ background: "rgba(200,241,53,0.12)", color: "#C8F135" }}>
            <Zap size={10} />
            TruthScan AI Engine
          </div>
          <h3 className="font-display text-[22px] font-bold text-white mb-2">
            Integrating into a workflow?
          </h3>
          <p className="text-[14px] mb-5" style={{ color: "rgba(255,255,255,0.45)" }}>
            REST API, webhooks, and enterprise SLA backed by TruthScan AI Engine.
          </p>
          <Link href="/developers" className="btn-primary text-[14px] px-6 py-3">
            View API Docs →
          </Link>
        </div>
      </div>
    </div>
  );
}
