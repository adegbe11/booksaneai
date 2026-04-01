"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText, Image, Mic, Video, Link2, Monitor, Search, Layers, Volume2,
  CheckCircle, AlertTriangle, Star, Globe, ArrowLeftRight, Zap, MessageSquare, BookOpen, ExternalLink,
  MessageCircle, Hash, Smartphone, Camera, Send, Play, Users,
  Heart, UserCheck,
  RefreshCw, AlignLeft, Sliders, TrendingUp, Edit, Languages,
  Film, Activity, Database, Eye, ScanLine,
  Type, File, Info, Music,
  Award, Tag, Shield, ClipboardList, LayoutDashboard,
  HelpCircle, Code,
  AtSign, Network, Radio,
  Bot, Brain,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  cat: string;
};

const categories = [
  { id: "all",       label: "All" },
  { id: "detection", label: "Detection" },
  { id: "verification", label: "Verification" },
  { id: "social",    label: "Social Media" },
  { id: "messaging", label: "Messaging" },
  { id: "dating",    label: "Dating" },
  { id: "writing",   label: "Writing" },
  { id: "forensics", label: "Media Forensics" },
  { id: "files",     label: "File Tools" },
  { id: "creator",   label: "Creator Tools" },
  { id: "assistant", label: "AI Assistant" },
  { id: "integrations", label: "Integrations" },
];

const features: Feature[] = [
  // ── Detection ──────────────────────────────────────────────
  { title: "AI Text Detector",              desc: "Identify AI-generated writing in any document or paste",  icon: FileText,        href: "/tools/ai-text-detector",    cat: "detection" },
  { title: "AI Image Detector",             desc: "Spot synthetic, GAN-generated, or diffusion images",      icon: Image,           href: "/detect/image",   cat: "detection" },
  { title: "AI Audio Deepfake Detector",    desc: "Detect cloned voices and synthesized speech",             icon: Mic,             href: "/detect/audio",   cat: "detection" },
  { title: "AI Video Deepfake Detector",    desc: "Frame-by-frame analysis for face-swaps and lip-syncs",    icon: Video,           href: "/detect/video",   cat: "detection" },
  { title: "URL Content Scanner",           desc: "Scan an entire webpage for all synthetic media at once",  icon: Link2,           href: "/detect/url",     cat: "detection" },
  { title: "Screenshot Analyzer",          desc: "Upload a screenshot and verify every element within it",  icon: Monitor,         href: "/detect/image",   cat: "detection" },
  { title: "Document AI Detector",         desc: "Analyze PDFs and Word files for AI-generated passages",   icon: File,            href: "/detect/text",    cat: "detection" },
  { title: "Batch File Detection",          desc: "Run hundreds of files through the detector simultaneously", icon: Layers,         href: "/developers",            cat: "detection" },
  { title: "AI Voice Clone Detector",       desc: "Identify voice cloning from ElevenLabs, VALL-E, and more", icon: Volume2,        href: "/detect/audio",   cat: "detection" },
  { title: "AI Writing Pattern Analyzer",   desc: "Reveal statistical fingerprints of machine-generated text", icon: Brain,         href: "/detect/text",    cat: "detection" },

  // ── Verification ───────────────────────────────────────────
  { title: "Fact Checker",                  desc: "Cross-reference claims against verified sources instantly", icon: CheckCircle,   href: "/detect/url",     cat: "verification" },
  { title: "Source Finder",                 desc: "Trace claims back to their original, primary source",      icon: Search,         href: "/detect/url",     cat: "verification" },
  { title: "Misinformation Detector",       desc: "Flag content that contradicts established facts",          icon: AlertTriangle,  href: "/detect/text",    cat: "verification" },
  { title: "Content Authenticity Score",    desc: "Get a 0–100 trust rating for any piece of content",       icon: Star,           href: "/detect/text",    cat: "verification" },
  { title: "Website Trust Score",           desc: "Assess a domain's credibility, age, and bias signals",    icon: Globe,          href: "/tools/website-trust-score",     cat: "verification" },
  { title: "AI vs Human Comparison Tool",   desc: "Side-by-side analysis of AI vs human-authored content",   icon: ArrowLeftRight, href: "/tools/ai-vs-human-comparison",    cat: "verification" },
  { title: "Claim Verification Engine",     desc: "Submit any claim — get evidence for and against it",      icon: Zap,            href: "/detect/text",    cat: "verification" },
  { title: "Context Analyzer",              desc: "Detect out-of-context media used to mislead audiences",   icon: MessageSquare,  href: "/detect/image",   cat: "verification" },
  { title: "News Authenticity Checker",     desc: "Verify breaking news articles before sharing or publishing", icon: BookOpen,    href: "/detect/url",     cat: "verification" },
  { title: "Evidence Link Generator",       desc: "Generate shareable evidence links for verified content",  icon: ExternalLink,   href: "/badge",          cat: "verification" },

  // ── Social Media ────────────────────────────────────────────
  { title: "X (Twitter) Post Verifier",     desc: "Verify tweets, threads, and attached media for authenticity", icon: AtSign,     href: "/detect/url",     cat: "social" },
  { title: "Facebook Post Verifier",        desc: "Analyze Facebook posts, images, and videos for manipulation", icon: Users,      href: "/detect/url",     cat: "social" },
  { title: "Instagram Post Verifier",       desc: "Detect AI-generated or heavily manipulated Instagram content", icon: Image,     href: "/detect/image",   cat: "social" },
  { title: "TikTok Video Verifier",         desc: "Identify deepfake faces, voice clones, and synthetic TikToks", icon: Play,      href: "/detect/video",   cat: "social" },
  { title: "YouTube Video Verifier",        desc: "Scan YouTube videos for face-swaps and AI-dubbed audio",   icon: Radio,         href: "/detect/video",   cat: "social" },
  { title: "Reddit Thread Verifier",        desc: "Cross-check Reddit posts and embedded images for authenticity", icon: Hash,     href: "/detect/url",     cat: "social" },
  { title: "LinkedIn Post Verifier",        desc: "Verify LinkedIn profiles, posts, and headshots",           icon: Network,       href: "/detect/image",   cat: "social" },
  { title: "Snapchat Media Verifier",       desc: "Detect AI filters and synthetic media in Snapchat content", icon: Camera,      href: "/detect/image",   cat: "social" },

  // ── Chat & Messaging ────────────────────────────────────────
  { title: "WhatsApp Chat Verifier",        desc: "Detect forwarded misinformation and AI text in chats",    icon: MessageCircle,  href: "/detect/text",    cat: "messaging" },
  { title: "Telegram Chat Verifier",        desc: "Analyze Telegram messages and shared media for authenticity", icon: Send,      href: "/detect/text",    cat: "messaging" },
  { title: "Messenger Chat Verifier",       desc: "Verify Messenger conversations and shared content",       icon: MessageSquare,  href: "/detect/text",    cat: "messaging" },
  { title: "iMessage Chat Verifier",        desc: "Check iMessage screenshots and embedded media",           icon: Smartphone,     href: "/detect/image",   cat: "messaging" },
  { title: "Discord Chat Verifier",         desc: "Scan Discord messages, images, and voice clips",          icon: Hash,           href: "/detect/text",    cat: "messaging" },
  { title: "SMS/Text Message Analyzer",     desc: "Detect AI-generated phishing and scam SMS messages",     icon: Smartphone,     href: "/detect/text",    cat: "messaging" },

  // ── Dating & Profile ────────────────────────────────────────
  { title: "Tinder Profile Verifier",       desc: "Detect AI-generated profile photos and catfish personas", icon: Heart,         href: "/detect/image",   cat: "dating" },
  { title: "Bumble Profile Verifier",       desc: "Verify profile authenticity before matching",             icon: UserCheck,      href: "/detect/image",   cat: "dating" },
  { title: "Hinge Profile Verifier",        desc: "Spot synthetic images and AI-written bios on Hinge",     icon: Heart,          href: "/detect/image",   cat: "dating" },
  { title: "Badoo Profile Verifier",        desc: "Identify fake accounts and AI-generated profile content", icon: Users,         href: "/detect/image",   cat: "dating" },
  { title: "Profile Image Authenticity",    desc: "Check any profile photo for GAN generation or manipulation", icon: Image,      href: "/detect/image",   cat: "dating" },
  { title: "Dating Chat AI Detector",       desc: "Detect AI-written responses in dating app conversations", icon: MessageCircle,  href: "/detect/text",    cat: "dating" },

  // ── Writing & Content ───────────────────────────────────────
  { title: "AI Humanizer",                  desc: "Transform AI-generated text into natural human writing",  icon: RefreshCw,      href: "/detect/text",    cat: "writing" },
  { title: "AI Paraphraser",               desc: "Rewrite any text while preserving meaning and tone",      icon: Edit,           href: "/detect/text",    cat: "writing" },
  { title: "AI Summarizer",                desc: "Condense long documents into clear, concise summaries",   icon: AlignLeft,      href: "/detect/text",    cat: "writing" },
  { title: "Grammar & Spell Checker",      desc: "Catch errors and improve clarity in any written content", icon: CheckCircle,    href: "/detect/text",    cat: "writing" },
  { title: "Tone Adjuster",                desc: "Shift content tone from formal to casual, or vice versa", icon: Sliders,        href: "/detect/text",    cat: "writing" },
  { title: "Content Improver",             desc: "Elevate readability, flow, and impact of any text",       icon: TrendingUp,     href: "/detect/text",    cat: "writing" },
  { title: "AI Translator",               desc: "Translate content into 50+ languages with context accuracy", icon: Languages,   href: "/detect/text",    cat: "writing" },
  { title: "Sentence Rewriter",            desc: "Restructure individual sentences for clarity and impact",  icon: Edit,          href: "/detect/text",    cat: "writing" },

  // ── Media Forensics ─────────────────────────────────────────
  { title: "Image Forensic Scanner",       desc: "Deep pixel-level analysis for tampering and synthesis",   icon: ScanLine,      href: "/tools/image-forensic-scanner",   cat: "forensics" },
  { title: "Video Frame Analyzer",         desc: "Extract and inspect individual frames for artifacts",     icon: Film,           href: "/detect/video",   cat: "forensics" },
  { title: "Audio Frequency Analyzer",     desc: "Visualize spectrograms and detect synthesis signatures",  icon: Activity,       href: "/detect/audio",   cat: "forensics" },
  { title: "Metadata Analyzer",            desc: "Inspect hidden file metadata for signs of manipulation",  icon: Database,       href: "/detect/image",   cat: "forensics" },
  { title: "Reverse Image Checker",        desc: "Find original image source and detect re-used content",   icon: Search,         href: "/detect/image",   cat: "forensics" },
  { title: "Deepfake Pattern Detector",    desc: "Identify blending artifacts, face boundaries, and GAN noise", icon: Eye,        href: "/detect/video",   cat: "forensics" },

  // ── File & Document Tools ───────────────────────────────────
  { title: "Word Counter",                 desc: "Count words, characters, sentences, and reading time",    icon: Type,           href: "/detect/text",    cat: "files" },
  { title: "PDF Analyzer",                 desc: "Extract and analyze text content from any PDF file",      icon: FileText,       href: "/detect/text",    cat: "files" },
  { title: "PDF Converter",               desc: "Convert PDFs to Word, text, or other formats instantly",  icon: File,           href: "/detect/text",    cat: "files" },
  { title: "Image Converter",             desc: "Convert between JPG, PNG, WEBP, HEIC, and more",          icon: Image,          href: "/detect/image",   cat: "files" },
  { title: "Video Converter",             desc: "Convert video files to any format before scanning",        icon: Video,          href: "/detect/video",   cat: "files" },
  { title: "Audio Converter",             desc: "Convert audio to MP3, WAV, FLAC before analysis",         icon: Music,          href: "/detect/audio",   cat: "files" },
  { title: "File Metadata Viewer",         desc: "Inspect EXIF, ID3, and embedded metadata in any file",   icon: Info,           href: "/detect/image",   cat: "files" },

  // ── Creator & Trust ─────────────────────────────────────────
  { title: "Transparency Badge Generator", desc: "Embed cryptographic proof of human authorship anywhere",  icon: Award,         href: "/badge",          cat: "creator" },
  { title: '"AI Used" Label Generator',    desc: "Disclose AI assistance responsibly with a verified label", icon: Tag,          href: "/badge",          cat: "creator" },
  { title: "Authenticity Certificate",     desc: "Generate a signed PDF certificate for any verified content", icon: Shield,     href: "/badge",          cat: "creator" },
  { title: "Verification Report (PDF)",    desc: "Export a full forensic report as a shareable PDF",        icon: ClipboardList,  href: "/badge",          cat: "creator" },
  { title: "Creator Dashboard",            desc: "Track all your scans, badges, and certificates in one place", icon: LayoutDashboard, href: "/badge",  cat: "creator" },

  // ── AI Assistant ─────────────────────────────────────────────
  { title: "AI Chat (Verification)",       desc: "Ask anything about authenticity — get sourced answers",   icon: Bot,            href: "/detect/text",    cat: "assistant" },
  { title: '"Is This Real?" Assistant',    desc: "Paste any content and get an instant truth assessment",   icon: HelpCircle,     href: "/detect/text",    cat: "assistant" },

  // ── Integrations ─────────────────────────────────────────────
  { title: "Browser Extension",            desc: "Scan any webpage or image with one click from Chrome",    icon: Globe,          href: "/developers",            cat: "integrations" },
  { title: "API Access for Developers",    desc: "Integrate detection into any product via REST API",       icon: Code,           href: "/developers",            cat: "integrations" },
];

// Group features by category for the "All" view
const CATEGORY_ORDER = [
  "detection", "verification", "social", "messaging",
  "dating", "writing", "forensics", "files", "creator", "assistant", "integrations",
];
const CATEGORY_LABELS: Record<string, string> = {
  detection:    "Detection",
  verification: "Verification",
  social:       "Social Media Verification",
  messaging:    "Chat & Messaging",
  dating:       "Dating & Profile",
  writing:      "Writing & Content",
  forensics:    "Media Forensics",
  files:        "File & Document Tools",
  creator:      "Creator & Trust",
  assistant:    "AI Assistant",
  integrations: "Integrations",
};

function FeatureCard({ f }: { f: Feature }) {
  const Icon = f.icon;
  return (
    <Link
      href={f.href}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "16px 18px",
        background: "#FFFFFF",
        border: "1px solid #E8E8EC",
        borderRadius: 12,
        textDecoration: "none",
        transition: "border-color 180ms ease, box-shadow 180ms ease",
        cursor: "pointer",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "rgba(200,241,53,0.5)";
        e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.06)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#E8E8EC";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Icon */}
      <div style={{
        width: 38, height: 38,
        borderRadius: 9,
        background: "#F5F5F7",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1,
      }}>
        <Icon size={17} color="#5A7A00" strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div style={{ minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#1D1D1F", marginBottom: 2, lineHeight: 1.3 }}>
          {f.title}
        </p>
        <p style={{ fontSize: 12.5, color: "#8E8E93", lineHeight: 1.5 }}>
          {f.desc}
        </p>
      </div>
    </Link>
  );
}

export default function FeatureGrid() {
  const [active, setActive] = useState("all");

  const filtered = active === "all"
    ? features
    : features.filter(f => f.cat === active);

  // Build grouped view for "all"
  const grouped = CATEGORY_ORDER.map(cat => ({
    cat,
    label: CATEGORY_LABELS[cat],
    items: features.filter(f => f.cat === cat),
  }));

  return (
    <section
      aria-labelledby="features-heading"
      style={{ background: "#FAFAFA", padding: "clamp(72px, 9vw, 120px) 0" }}
    >
      <div className="container">

        {/* Heading */}
        <div style={{ textAlign: "center", marginBottom: "clamp(36px, 4vw, 52px)" }}>
          <h2
            id="features-heading"
            className="D"
            style={{
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "#1D1D1F",
              lineHeight: 1.1,
              marginBottom: 12,
            }}
          >
            70 tools. One verification platform.
          </h2>
          <p style={{ fontSize: "clamp(15px, 1.6vw, 17px)", color: "#6E6E73", maxWidth: 520, margin: "0 auto" }}>
            Everything you need to detect, verify, and certify content authenticity — across every format and platform.
          </p>
        </div>

        {/* ── Tab bar — QuillBot style ── */}
        <div style={{
          borderBottom: "1.5px solid #EBEBED",
          marginBottom: "clamp(32px, 4vw, 48px)",
          overflowX: "auto",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
        }}>
          <div style={{
            display: "flex",
            gap: 0,
            minWidth: "max-content",
          }}>
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                aria-pressed={active === c.id}
                style={{
                  padding: "10px 18px",
                  fontSize: 14,
                  fontWeight: active === c.id ? 700 : 500,
                  color: active === c.id ? "#1D1D1F" : "#6E6E73",
                  background: "none",
                  border: "none",
                  borderBottom: active === c.id ? "2.5px solid #C8F135" : "2.5px solid transparent",
                  cursor: "pointer",
                  transition: "color 160ms ease, border-color 160ms ease",
                  whiteSpace: "nowrap",
                  marginBottom: "-1.5px",
                }}
                onMouseEnter={e => {
                  if (active !== c.id) e.currentTarget.style.color = "#1D1D1F";
                }}
                onMouseLeave={e => {
                  if (active !== c.id) e.currentTarget.style.color = "#6E6E73";
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── All view — grouped by category ── */}
        {active === "all" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "clamp(36px, 4vw, 52px)" }}>
            {grouped.map(({ cat, label, items }) => (
              <div key={cat}>
                {/* Category label */}
                <p style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#8DB800",
                  marginBottom: 16,
                }}>
                  {label}
                </p>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map(f => (
                    <FeatureCard key={f.title} f={f} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // ── Filtered view ──
          <div>
            <p style={{
              fontSize: 11, fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.12em", color: "#8DB800", marginBottom: 16,
            }}>
              {CATEGORY_LABELS[active]}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map(f => (
                <FeatureCard key={f.title} f={f} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
