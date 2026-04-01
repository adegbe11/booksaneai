import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata: Metadata = {
  title: "TruthScan API — Developer Documentation | AIGeneratedIt",
  description:
    "Integrate TruthScan AI detection into any product via REST API. Detect AI-generated text, images, audio, video, and URLs programmatically with 99.8% accuracy.",
  alternates: { canonical: "https://aigeneratedit.com/developers" },
};

const ENDPOINTS = [
  {
    method: "POST",
    path:   "/api/detect/text",
    desc:   "Detect AI-generated text. Supports 50+ languages.",
    body:   `{ "text": "string" }`,
    example: `curl -X POST https://aigeneratedit.com/api/detect/text \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"text": "The quick brown fox jumps..."}'`,
  },
  {
    method: "POST",
    path:   "/api/detect/file",
    desc:   "Detect AI-generated images, audio, or video. Multipart upload.",
    body:   `FormData: file (blob), type ("image" | "audio" | "video")`,
    example: `curl -X POST https://aigeneratedit.com/api/detect/file \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@image.jpg" \\
  -F "type=image"`,
  },
  {
    method: "POST",
    path:   "/api/detect/url",
    desc:   "Multi-modal scan of any public URL — text, images, audio, and video.",
    body:   `{ "url": "string" }`,
    example: `curl -X POST https://aigeneratedit.com/api/detect/url \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"url": "https://example.com/article"}'`,
  },
];

const RESPONSE_EXAMPLE = `{
  "verdict": "ai",
  "ai_probability": 0.91,
  "human_probability": 0.09,
  "confidence": 94,
  "signals": [
    { "label": "Low perplexity score — GPT-family smoothness", "severity": "high" },
    { "label": "Burstiness coefficient 0.09 — below human baseline", "severity": "high" },
    { "label": "GPT-4o model signature detected (71% confidence)", "severity": "medium" }
  ],
  "model_used": "TruthScan Text v2.1 — RoBERTa + Binoculars + Fast-Detect-GPT",
  "processing_time_ms": 1243
}`;

const MODELS = [
  { name: "RoBERTa-base-OpenAI-detector", type: "Text",  acc: "93%",  desc: "Hugging Face fine-tuned classifier" },
  { name: "Binoculars perplexity",        type: "Text",  acc: "91%",  desc: "Zero-shot LLM scoring" },
  { name: "Fast-Detect-GPT",              type: "Text",  acc: "90%",  desc: "Perturbation-based detection" },
  { name: "XceptionNet",                  type: "Image", acc: "95%",  desc: "Deepfake face + GAN detection" },
  { name: "Error Level Analysis (ELA)",   type: "Image", acc: "89%",  desc: "JPEG compression forensics" },
  { name: "Hive Moderation API",          type: "Image", acc: "93%",  desc: "AI image generation classifier" },
  { name: "RawNet2",                      type: "Audio", acc: "96%",  desc: "Voice clone detection (ASVspoof)" },
  { name: "Wav2Vec2 XLSR",               type: "Audio", acc: "94%",  desc: "Synthetic speech detection" },
  { name: "MFCC-CNN",                    type: "Audio", acc: "91%",  desc: "Spectral feature classifier" },
  { name: "SyncNet",                     type: "Video", acc: "97%",  desc: "Lip-sync deepfake detection" },
  { name: "RetinaFace",                  type: "Video", acc: "95%",  desc: "Face detection + boundary check" },
];

export default function DevelopersPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F5F5F7", minHeight: "100vh", paddingTop: 72 }}>

        {/* Hero */}
        <div style={{ background: "#0A0A0A", padding: "clamp(64px,8vw,96px) 0 clamp(48px,6vw,72px)" }}>
          <div className="container">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 999, background: "rgba(200,241,53,0.12)", marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#C8F135", display: "inline-block" }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C8F135" }}>
                TruthScan API · v2.1
              </span>
            </div>
            <h1 className="D" style={{ fontSize: "clamp(32px,5vw,56px)", color: "#FFFFFF", marginBottom: 16, lineHeight: 1.05 }}>
              TruthScan API<br />
              <span style={{ color: "#C8F135" }}>for Developers</span>
            </h1>
            <p style={{ fontSize: "clamp(15px,1.6vw,17px)", color: "rgba(255,255,255,0.5)", maxWidth: 520, lineHeight: 1.72, marginBottom: 32 }}>
              Detect AI-generated text, images, audio, and video in your own product.
              REST API with JSON responses, webhooks, and enterprise SLA.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="mailto:api@aigeneratedit.com" className="btn btn-soul" style={{ fontSize: 14, padding: "12px 24px" }}>
                Request API Key
              </a>
              <a href="#endpoints" className="btn" style={{ fontSize: 14, padding: "12px 24px", background: "rgba(255,255,255,0.08)", color: "#FFFFFF", borderRadius: 999, textDecoration: "none" }}>
                View Endpoints ↓
              </a>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EBEBED" }}>
          <div className="container">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 0 }}>
              {[
                { label: "Avg response time", value: "2.8 s" },
                { label: "Uptime SLA",         value: "99.9%" },
                { label: "Models in ensemble", value: "11"    },
                { label: "Languages supported", value: "50+"  },
              ].map(s => (
                <div key={s.label} style={{ padding: "24px 0", textAlign: "center", borderRight: "1px solid #EBEBED" }}>
                  <p className="D" style={{ fontSize: 28, color: "#1D1D1F" }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: "#AEAEB2", marginTop: 4 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container" style={{ paddingTop: "clamp(48px,6vw,80px)", paddingBottom: "clamp(64px,8vw,96px)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)", gap: 24, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>

            {/* Auth */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "28px 32px" }}>
              <h2 className="D" style={{ fontSize: 20, color: "#1D1D1F", marginBottom: 8 }}>Authentication</h2>
              <p style={{ fontSize: 14, color: "#6E6E73", lineHeight: 1.72, marginBottom: 16 }}>
                All API requests require a Bearer token in the <code style={{ background: "#F5F5F7", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>Authorization</code> header.
                <Link href="mailto:api@aigeneratedit.com" style={{ color: "#8DB800", marginLeft: 6 }}>Request an API key →</Link>
              </p>
              <pre style={{ background: "#0A0A0A", borderRadius: 10, padding: "16px 20px", fontSize: 13, color: "#C8F135", overflow: "auto" }}>
                {`Authorization: Bearer ts_live_xxxxxxxxxxxxxxxxxxxxxxxx`}
              </pre>
            </div>

            {/* Endpoints */}
            <div id="endpoints">
              <h2 className="D" style={{ fontSize: 22, color: "#1D1D1F", marginBottom: 16 }}>Endpoints</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {ENDPOINTS.map(ep => (
                  <div key={ep.path} style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, overflow: "hidden" }}>
                    <div style={{ padding: "20px 24px", borderBottom: "1px solid #F0F0F0", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, padding: "4px 10px", borderRadius: 6, background: "rgba(200,241,53,0.15)", color: "#5A7A00" }}>
                        {ep.method}
                      </span>
                      <code style={{ fontSize: 14, fontWeight: 600, color: "#1D1D1F" }}>{ep.path}</code>
                    </div>
                    <div style={{ padding: "16px 24px", borderBottom: "1px solid #F5F5F7" }}>
                      <p style={{ fontSize: 13.5, color: "#6E6E73" }}>{ep.desc}</p>
                      <p style={{ fontSize: 12, color: "#AEAEB2", marginTop: 8 }}>
                        <strong style={{ color: "#1D1D1F" }}>Request body:</strong> {ep.body}
                      </p>
                    </div>
                    <div style={{ padding: "16px 24px" }}>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#AEAEB2", marginBottom: 10 }}>Example</p>
                      <pre style={{ background: "#0A0A0A", borderRadius: 10, padding: "14px 18px", fontSize: 12, color: "#C8F135", overflow: "auto", margin: 0 }}>
                        {ep.example}
                      </pre>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response format */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "28px 32px" }}>
              <h2 className="D" style={{ fontSize: 20, color: "#1D1D1F", marginBottom: 8 }}>Response Format</h2>
              <p style={{ fontSize: 13.5, color: "#6E6E73", marginBottom: 16 }}>All endpoints return the same standardized JSON structure:</p>
              <pre style={{ background: "#0A0A0A", borderRadius: 10, padding: "20px 24px", fontSize: 12.5, color: "#E5E5E7", overflow: "auto", margin: 0, lineHeight: 1.7 }}>
                {RESPONSE_EXAMPLE}
              </pre>
              <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 12 }}>
                {[
                  { field: "verdict",           type: `"ai" | "human" | "mixed"`,  desc: "Final classification" },
                  { field: "ai_probability",     type: "number (0–1)",              desc: "Probability this is AI" },
                  { field: "confidence",         type: "integer (0–100)",           desc: "Model certainty %" },
                  { field: "signals",            type: "Signal[]",                  desc: "Forensic evidence list" },
                  { field: "model_used",         type: "string",                    desc: "Models that ran" },
                  { field: "processing_time_ms", type: "integer",                   desc: "Latency in milliseconds" },
                ].map(f => (
                  <div key={f.field} style={{ background: "#F9F9FB", border: "1px solid #EBEBED", borderRadius: 10, padding: "12px 14px" }}>
                    <code style={{ fontSize: 12, fontWeight: 700, color: "#8DB800" }}>{f.field}</code>
                    <p style={{ fontSize: 11, color: "#AEAEB2", marginTop: 3 }}>{f.type}</p>
                    <p style={{ fontSize: 12, color: "#6E6E73", marginTop: 4 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Models */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, padding: "28px 32px" }}>
              <h2 className="D" style={{ fontSize: 20, color: "#1D1D1F", marginBottom: 4 }}>TruthScan AI Models</h2>
              <p style={{ fontSize: 13.5, color: "#6E6E73", marginBottom: 20 }}>All models run in ensemble. Results are voted and weighted by confidence.</p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #EBEBED" }}>
                      {["Model", "Type", "Accuracy", "Description"].map(h => (
                        <th key={h} scope="col" style={{ padding: "8px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#AEAEB2" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MODELS.map((m, i) => (
                      <tr key={m.name} style={{ borderBottom: "1px solid #F5F5F7", background: i % 2 === 0 ? "#FFFFFF" : "#FAFAFA" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 600, color: "#1D1D1F" }}>{m.name}</td>
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: "rgba(200,241,53,0.12)", color: "#5A7A00" }}>
                            {m.type}
                          </span>
                        </td>
                        <td style={{ padding: "10px 12px", fontWeight: 700, color: "#1D1D1F" }}>{m.acc}</td>
                        <td style={{ padding: "10px 12px", color: "#6E6E73" }}>{m.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rate limits */}
            <div style={{ background: "#0A0A0A", borderRadius: 16, padding: "32px", textAlign: "center" }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#C8F135", marginBottom: 12 }}>
                TruthScan API Access
              </p>
              <h3 className="D" style={{ fontSize: 24, color: "#FFFFFF", marginBottom: 8 }}>
                Ready to integrate TruthScan?
              </h3>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", maxWidth: 440, margin: "0 auto 24px" }}>
                Free tier available. Enterprise plans include dedicated inference, SLA guarantees, webhooks, and custom model fine-tuning.
              </p>
              <a href="mailto:api@aigeneratedit.com" className="btn btn-soul" style={{ fontSize: 14, padding: "13px 28px" }}>
                Request API Key →
              </a>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
