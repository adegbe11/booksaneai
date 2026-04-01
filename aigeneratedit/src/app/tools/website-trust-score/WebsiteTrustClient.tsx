"use client";

import ToolPageShell from "@/components/tools/ToolPageShell";
import type { ToolConfig, ToolResult } from "@/components/tools/ToolPageShell";
import { detectUrl } from "@/lib/truthscan";
import type { TruthScanResponse } from "@/lib/truthscan";
import {
  ShieldCheck, Zap, Globe, BarChart2,
  FileText, Mic, Image, ScanLine,
} from "lucide-react";

function mapResult(r: TruthScanResponse): ToolResult {
  const isAI    = r.verdict === "ai";
  const isMixed = r.verdict === "mixed";
  return {
    verdict: isAI ? "Synthetic Content Detected" : isMixed ? "Mixed Authenticity" : "Largely Authentic",
    score:   r.confidence,
    color:   isAI ? "#FF3B30" : isMixed ? "#FF9500" : "#34C759",
    summary: isAI
      ? `TruthScan's multi-modal pipeline detected significant AI or synthetic content on this page. AI probability: ${Math.round(r.ai_probability * 100)}%.`
      : isMixed
      ? `TruthScan found a mix of authentic and synthetic content. Exercise caution before sharing.`
      : `TruthScan found no significant synthetic content. Trust score: ${r.confidence}%.`,
    details: r.signals.map(s => s.label),
  };
}

const config: ToolConfig = {
  category:     "URL",
  categoryHref: "/detect/url",
  title:        "Website Trust Score",
  subtitle:     "Paste any URL for a full multi-modal forensic report — AI text, deepfake images, synthetic audio, and manipulated video. Powered by TruthScan.",
  badge:        "Multi-Modal",
  inputMode:    "url",
  placeholder:  "https://example.com/article",
  actionLabel:  "Scan URL",
  features: [
    { icon: Globe,      title: "Full-page crawl",         desc: "Extracts and analyzes all text, images, audio, and video on the page in a single pass." },
    { icon: ShieldCheck, title: "Domain trust signals",   desc: "Checks domain age, historical reputation, SSL validity, and WHOIS transparency." },
    { icon: BarChart2,  title: "Media breakdown report",  desc: "Per-asset forensic score for every image, video, and audio element found." },
    { icon: Zap,        title: "Real-time news scanning", desc: "Cross-references claims against 200+ verified news sources for factual consistency." },
    { icon: ScanLine,   title: "Shareable trust badge",   desc: "Generate a cryptographic authenticity badge to embed on your own content." },
    { icon: FileText,   title: "Full forensic PDF",       desc: "Download a complete report with per-element scores and trust verdict." },
  ],
  faq: [
    { q: "What types of content does the URL scanner analyze?",
      a: "TruthScan extracts and analyzes: all body text (AI writing), all images (GAN/ELA forensics), all embedded audio (voice clone detection), all embedded video (deepfake detection), and domain-level trust signals." },
    { q: "Does it work on paywalled pages?",
      a: "No. The scanner can only analyze publicly accessible content. For paywalled content, use our individual file upload tools." },
    { q: "Can I scan social media posts?",
      a: "Some platforms (X/Twitter, Reddit) are partially supported. JavaScript-heavy pages may have limited analysis. Upload media files directly for best results." },
    { q: "What does the Trust Score number mean?",
      a: "The confidence score reflects TruthScan's certainty in its verdict. Above 80% confidence with an AI verdict means strong evidence of synthetic content." },
    { q: "How long does a full-page scan take?",
      a: "A simple article with a few images completes in 3–8 seconds. A media-heavy page with videos may take up to 30 seconds." },
  ],
  related: [
    { title: "AI Text Detector",       href: "/tools/ai-text-detector",       icon: FileText,    desc: "Analyze text directly" },
    { title: "Image Forensic Scanner", href: "/tools/image-forensic-scanner", icon: Image,       desc: "Upload & scan images" },
    { title: "Audio Deepfake Detect",  href: "/detect/audio",                  icon: Mic,         desc: "96% voice accuracy" },
    { title: "Video Deepfake Detect",  href: "/detect/video",                  icon: ScanLine,    desc: "97% video accuracy" },
    { title: "Fact Checker",           href: "/detect/url",                    icon: ShieldCheck, desc: "Verify any claim" },
  ],
  onRun: async (url) => {
    const r = await detectUrl(url);
    return mapResult(r);
  },
};

export default function WebsiteTrustClient() {
  return <ToolPageShell config={config} />;
}
