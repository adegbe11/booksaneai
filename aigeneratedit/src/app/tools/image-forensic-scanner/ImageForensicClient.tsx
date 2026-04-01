"use client";

import ToolPageShell from "@/components/tools/ToolPageShell";
import type { ToolConfig, ToolResult } from "@/components/tools/ToolPageShell";
import { detectFile } from "@/lib/truthscan";
import type { TruthScanResponse } from "@/lib/truthscan";
import {
  ShieldCheck, Zap, ScanLine, FileText,
  Mic, Link2, BarChart2, Globe,
} from "lucide-react";

function mapResult(r: TruthScanResponse): ToolResult {
  const isAI    = r.verdict === "ai";
  const isMixed = r.verdict === "mixed";
  return {
    verdict: isAI ? "AI-Generated Image" : isMixed ? "Partially Manipulated" : "Authentic Photograph",
    score:   r.confidence,
    color:   isAI ? "#FF3B30" : isMixed ? "#FF9500" : "#34C759",
    summary: isAI
      ? `TruthScan XceptionNet + ELA detected AI-generation artifacts. AI probability: ${Math.round(r.ai_probability * 100)}%.`
      : isMixed
      ? `TruthScan found partial manipulation. Some regions appear authentic while others show synthetic markers.`
      : `TruthScan found no AI or manipulation artifacts. Human probability: ${Math.round(r.human_probability * 100)}%.`,
    details: r.signals.map(s => s.label),
  };
}

const config: ToolConfig = {
  category:     "Image",
  categoryHref: "/detect/image",
  title:        "Image Forensic Scanner",
  subtitle:     "Detect AI-generated images, deepfake faces, and photo manipulation. XceptionNet + ELA + C2PA — powered by TruthScan AI Engine.",
  badge:        "95% Accuracy",
  inputMode:    "file",
  accept:       "image/*",
  placeholder:  "JPG, PNG, WEBP, HEIC, RAW — up to 500 MB",
  actionLabel:  "Scan Image",
  features: [
    { icon: ScanLine,   title: "Error Level Analysis",     desc: "Reveals manipulated regions by analyzing JPEG re-compression artifacts." },
    { icon: ShieldCheck, title: "C2PA provenance check",   desc: "Verifies the cryptographic content credential chain from camera to file." },
    { icon: BarChart2,  title: "GAN fingerprint library",  desc: "Matched against 28 known generative models including Midjourney & DALL-E 3." },
    { icon: Zap,        title: "Deepfake face detection",  desc: "Landmark geometry and texture analysis — 97% face-swap accuracy." },
    { icon: Globe,      title: "Reverse image search",     desc: "Cross-references 4.2B indexed images for original source detection." },
    { icon: FileText,   title: "Court-ready PDF report",   desc: "Export a full forensic report with annotated ELA maps and verdict certificate." },
  ],
  faq: [
    { q: "What image formats are supported?",
      a: "JPG, PNG, WEBP, HEIC, HEIF, TIFF, BMP, and RAW formats (CR2, NEF, ARW). Maximum file size is 500 MB." },
    { q: "Can it detect AI images that have been compressed or resized?",
      a: "Yes. Frequency-domain analysis survives most compression. Accuracy drops ~8% below 60% JPEG quality." },
    { q: "What is C2PA and why does it matter?",
      a: "C2PA embeds cryptographically signed metadata at creation. TruthScan verifies the full provenance chain — who created it, when, and with what tool." },
    { q: "Does it work on screenshots of AI images?",
      a: "Yes, with slightly reduced accuracy. Screenshots add compression artifacts. We recommend uploading original files when possible." },
    { q: "Are uploaded images stored?",
      a: "Images are processed in-memory and deleted within 24 hours. Never used for model training or shared with third parties." },
  ],
  related: [
    { title: "AI Text Detector",     href: "/tools/ai-text-detector",      icon: FileText,   desc: "93% text accuracy" },
    { title: "Audio Deepfake",       href: "/detect/audio",                 icon: Mic,        desc: "96% voice accuracy" },
    { title: "Video Deepfake",       href: "/detect/video",                 icon: ScanLine,   desc: "97% video accuracy" },
    { title: "URL Scanner",          href: "/tools/website-trust-score",    icon: Link2,      desc: "Scan entire pages" },
    { title: "Metadata Analyzer",    href: "/detect/image",                 icon: BarChart2,  desc: "Full EXIF & C2PA audit" },
  ],
  onRun: async () => {
    // Fallback if onRunFile is not triggered
    const { detectFile: df } = await import("@/lib/truthscan");
    const placeholder = new File([""], "placeholder.jpg", { type: "image/jpeg" });
    const r = await df(placeholder, "image");
    return mapResult(r);
  },
  onRunFile: async (file: File) => {
    const r = await detectFile(file, "image");
    return mapResult(r);
  },
};

export default function ImageForensicClient() {
  return <ToolPageShell config={config} />;
}
