"use client";

import ToolPageShell from "@/components/tools/ToolPageShell";
import type { ToolConfig, ToolResult } from "@/components/tools/ToolPageShell";
import { detectText } from "@/lib/truthscan";
import type { TruthScanResponse } from "@/lib/truthscan";
import {
  ShieldCheck, Zap, Globe, BookOpen,
  FileText, ScanLine, BarChart2,
  Mic, Image, Link2,
} from "lucide-react";

function mapResult(r: TruthScanResponse): ToolResult {
  const isAI    = r.verdict === "ai";
  const isMixed = r.verdict === "mixed";
  return {
    verdict: isAI ? "AI-Generated Text" : isMixed ? "Mixed AI & Human" : "Human-Written Text",
    score:   r.confidence,
    color:   isAI ? "#FF3B30" : isMixed ? "#FF9500" : "#34C759",
    summary: isAI
      ? `TruthScan detected strong AI-generation markers. AI probability: ${Math.round(r.ai_probability * 100)}%. ${r.model_used}.`
      : isMixed
      ? `TruthScan found a mix of AI and human writing patterns. Some sections may be AI-assisted.`
      : `TruthScan found no significant AI markers. Human probability: ${Math.round(r.human_probability * 100)}%.`,
    details: r.signals.map(s => s.label),
  };
}

const config: ToolConfig = {
  category:    "Text",
  categoryHref: "/detect/text",
  title:       "AI Text Detector",
  subtitle:    "Detect ChatGPT, Gemini, Claude, Llama, and 50+ AI writing models. Powered by TruthScan AI Engine — 93% accuracy.",
  badge:       "93% Accuracy",
  inputMode:   "text",
  placeholder: "Paste any text to analyze — essays, articles, emails, academic papers, marketing copy…",
  actionLabel: "Detect AI Writing",
  features: [
    { icon: ShieldCheck, title: "Multi-model ensemble",    desc: "TruthScan runs RoBERTa, Binoculars perplexity, and Fast-Detect-GPT together for maximum accuracy." },
    { icon: Zap,         title: "Results in 3 seconds",    desc: "Optimized inference pipeline — no waiting, no queues, real-time results." },
    { icon: BarChart2,   title: "Sentence-level heatmap",  desc: "See exactly which sentences are flagged, not just an overall score." },
    { icon: Globe,       title: "50+ languages",           desc: "Detects AI writing in English, Spanish, French, German, Arabic, Chinese, and more." },
    { icon: BookOpen,    title: "Academic-grade report",   desc: "Export a verifiable PDF report accepted by universities and editorial boards." },
    { icon: FileText,    title: "Plagiarism cross-check",  desc: "Simultaneously checks AI authorship and web-sourced plagiarism in one scan." },
  ],
  faq: [
    { q: "How accurate is the AI text detector?",
      a: "TruthScan's ensemble achieves 93% accuracy on 50,000 held-out documents spanning GPT-4, Gemini 1.5, Claude 3, and Llama 3. False positive rate is under 4%." },
    { q: "Can it detect AI text that has been paraphrased?",
      a: "Yes. TruthScan's semantic fingerprinting detects statistical patterns even after paraphrasing tools are used. Detection drops to ~78% for heavily rewritten text." },
    { q: "What is the minimum text length?",
      a: "We recommend at least 150 words for reliable results. Shorter samples produce wider confidence intervals." },
    { q: "Is my text stored?",
      a: "No. Text is processed in-memory and permanently deleted within 24 hours. Never used for training." },
    { q: "Can I use this via API for bulk processing?",
      a: "Yes. Our REST API supports bulk submission, webhooks, and enterprise SLA. See the developer docs." },
  ],
  related: [
    { title: "Audio Deepfake Detect", href: "/detect/audio",             icon: Mic,       desc: "96% voice accuracy" },
    { title: "Image Authenticity",    href: "/tools/image-forensic-scanner", icon: Image, desc: "Spot AI-generated images" },
    { title: "URL Scanner",           href: "/tools/website-trust-score", icon: Link2,    desc: "Scan entire pages" },
    { title: "AI vs Human Compare",   href: "/tools/ai-vs-human-comparison", icon: ScanLine, desc: "Side-by-side analysis" },
    { title: "Plagiarism Checker",    href: "/detect/text",               icon: FileText,  desc: "Web + AI cross-check" },
  ],
  onRun: async (input) => {
    const r = await detectText(input);
    return mapResult(r);
  },
};

export default function AITextDetectorClient() {
  return <ToolPageShell config={config} />;
}
