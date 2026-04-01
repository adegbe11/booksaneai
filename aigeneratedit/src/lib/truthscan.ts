/**
 * TruthScan AI Engine — Client SDK
 *
 * Calls Next.js API routes (/api/detect/*) which proxy to the
 * TruthScan backend (TRUTHSCAN_API_URL env var) or fall back to
 * a realistic statistical mock when the backend is not configured.
 *
 * Detection models (deepfake-TruthscanAi + truthscan):
 *  • Text  — RoBERTa-base-OpenAI-detector, Binoculars perplexity, Fast-Detect-GPT
 *  • Image — XceptionNet, ELA, EXIF analysis, Hive Moderation
 *  • Audio — RawNet2, Wav2Vec2 XLSR, MFCC-CNN, ElevenLabs detector
 *  • Video — XceptionNet frame-level, SyncNet lip-sync, RetinaFace
 *  • URL   — Multi-modal cascaded pipeline across all page assets
 */

export type TruthScanVerdict = "ai" | "human" | "mixed" | "error";
export type SeverityLevel   = "high" | "medium" | "low";

export interface TruthScanSignal {
  label:    string;
  severity: SeverityLevel;
}

export interface TruthScanResponse {
  verdict:           TruthScanVerdict;
  ai_probability:    number;   // 0–1
  human_probability: number;   // 0–1
  confidence:        number;   // 0–100
  signals:           TruthScanSignal[];
  model_used:        string;
  processing_time_ms: number;
}

/* ── Text detection ─────────────────────────────────────────── */
export async function detectText(text: string): Promise<TruthScanResponse> {
  const res = await fetch("/api/detect/text", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error(`TruthScan text detection failed: ${res.status}`);
  return res.json();
}

/* ── File detection (image / audio / video) ─────────────────── */
export async function detectFile(
  file: File,
  type: "image" | "audio" | "video",
): Promise<TruthScanResponse> {
  const form = new FormData();
  form.append("file", file);
  form.append("type", type);
  const res = await fetch("/api/detect/file", {
    method: "POST",
    body:   form,
  });
  if (!res.ok) throw new Error(`TruthScan file detection failed: ${res.status}`);
  return res.json();
}

/* ── URL detection ──────────────────────────────────────────── */
export async function detectUrl(url: string): Promise<TruthScanResponse> {
  const res = await fetch("/api/detect/url", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ url }),
  });
  if (!res.ok) throw new Error(`TruthScan URL detection failed: ${res.status}`);
  return res.json();
}

/* ── Helpers ────────────────────────────────────────────────── */

/** Map a TruthScanResponse verdict + probability to a display color */
export function verdictColor(r: TruthScanResponse): string {
  if (r.verdict === "ai")    return "#FF3B30";
  if (r.verdict === "mixed") return "#FF9500";
  if (r.verdict === "human") return "#34C759";
  return "#AEAEB2";
}

/** Map a TruthScanResponse to a human-readable verdict label */
export function verdictLabel(r: TruthScanResponse, mediaType?: string): string {
  const media = mediaType ?? "Content";
  if (r.verdict === "ai")    return `AI-Generated ${media}`;
  if (r.verdict === "mixed") return `Mixed AI & Human ${media}`;
  if (r.verdict === "human") return `Authentic ${media}`;
  return "Detection Error";
}
