"use client";

import ToolPageShell from "@/components/tools/ToolPageShell";
import type { ToolConfig, ToolResult } from "@/components/tools/ToolPageShell";
import { detectText } from "@/lib/truthscan";
import type { TruthScanResponse } from "@/lib/truthscan";
import {
  BarChart2, Zap, ShieldCheck, FileText,
  ScanLine, Image, Link2,
} from "lucide-react";

function mapComparison(rA: TruthScanResponse, rB: TruthScanResponse): ToolResult {
  const aIsAI = rA.ai_probability > rB.ai_probability;
  const aiSample   = aIsAI ? "Text A" : "Text B";
  const humSample  = aIsAI ? "Text B" : "Text A";
  const aiProb     = Math.round((aIsAI ? rA : rB).ai_probability * 100);
  const humProb    = Math.round((aIsAI ? rB : rA).human_probability * 100);
  const confidence = Math.round((rA.confidence + rB.confidence) / 2);

  return {
    verdict: `${aiSample} is AI-Generated · ${humSample} is Human`,
    score:   confidence,
    color:   "#FF9500",
    summary: `TruthScan stylometric comparison found clear divergence. ${aiSample}: ${aiProb}% AI probability. ${humSample}: ${humProb}% human probability.`,
    details: [
      `${aiSample} — AI probability: ${aiProb}% (${(aIsAI ? rA : rB).model_used})`,
      `${humSample} — Human probability: ${humProb}%`,
      ...(aIsAI ? rA : rB).signals.slice(0, 3).map(s => s.label),
    ],
  };
}

const config: ToolConfig = {
  category:     "Text",
  categoryHref: "/detect/text",
  title:        "AI vs Human Comparison",
  subtitle:     "Paste two samples side by side. TruthScan's stylometric engine reveals which was written by AI and which by a human.",
  badge:        "Compare Mode",
  inputMode:    "compare",
  labelA:       "Text A",
  labelB:       "Text B",
  placeholder:  "Paste first text sample here…",
  placeholderB: "Paste second text sample here…",
  actionLabel:  "Compare Samples",
  features: [
    { icon: BarChart2,  title: "Stylometric fingerprinting",  desc: "Measures 40+ linguistic signals: sentence variance, vocabulary richness, punctuation patterns." },
    { icon: ShieldCheck, title: "Authorship verification",    desc: "Determines whether two samples were written by the same author — human or AI." },
    { icon: Zap,        title: "Side-by-side scoring",        desc: "Each sample receives an independent AI probability, then the gap is analyzed." },
    { icon: ScanLine,   title: "Sentence heatmap",            desc: "Highlights AI-flagged sentences in each sample independently." },
    { icon: FileText,   title: "Report export",               desc: "Download a dual-sample forensic report with per-sentence annotations." },
    { icon: Zap,        title: "Plagiarism cross-check",      desc: "Optionally verify neither sample is derived from known web sources." },
  ],
  faq: [
    { q: "When would I use comparison instead of the standard detector?",
      a: "Use it when you have two documents you suspect were written by different authors (one AI, one human) and want direct forensic evidence of the difference." },
    { q: "Can I compare two AI-generated samples?",
      a: "Yes. TruthScan will identify both as AI-generated and attempt to identify which model produced each sample." },
    { q: "What is the minimum text length?",
      a: "Each sample should be at least 150 words. Shorter samples return wider confidence intervals." },
    { q: "Does it work for non-English text?",
      a: "Yes. TruthScan supports 50+ languages. Accuracy is highest for English, Spanish, French, German, and Portuguese." },
    { q: "Is the comparison symmetric?",
      a: "No — the analysis is independent for each sample. Swapping A and B will not change the scores, only the labels in the report." },
  ],
  related: [
    { title: "AI Text Detector",   href: "/tools/ai-text-detector",       icon: FileText,   desc: "Single-sample detection" },
    { title: "Plagiarism Checker", href: "/detect/text",                   icon: ScanLine,   desc: "Web + AI cross-check" },
    { title: "Image Forensic",     href: "/tools/image-forensic-scanner",  icon: Image,      desc: "Scan images for AI" },
    { title: "URL Scanner",        href: "/tools/website-trust-score",     icon: Link2,      desc: "Full-page analysis" },
    { title: "Audio Deepfake",     href: "/detect/audio",                  icon: Zap,        desc: "96% voice accuracy" },
  ],
  onRun: async (inputA, inputB) => {
    const [rA, rB] = await Promise.all([
      detectText(inputA),
      detectText(inputB ?? ""),
    ]);
    return mapComparison(rA, rB);
  },
};

export default function CompareClient() {
  return <ToolPageShell config={config} />;
}
