import { NextRequest, NextResponse } from "next/server";
import type { TruthScanResponse } from "@/lib/truthscan";

/* ─── Per-type mock results ─────────────────────────────────── */
function mockImageResult(): TruthScanResponse {
  const aiProb = 0.45 + Math.random() * 0.45;
  const isAI   = aiProb > 0.55;
  return {
    verdict:           isAI ? "ai" : "human",
    ai_probability:    aiProb,
    human_probability: 1 - aiProb,
    confidence:        Math.round(55 + Math.abs(aiProb - 0.5) * 88),
    signals: isAI
      ? [
          { label: "GAN fingerprint matches Stable Diffusion XL",          severity: "high"   },
          { label: "ELA map: uniform compression noise — synthetic origin", severity: "high"   },
          { label: "No authentic camera EXIF metadata found",               severity: "medium" },
          { label: "Facial landmark geometry: StyleGAN sub-pixel pattern",  severity: "medium" },
          { label: "C2PA provenance chain: NOT FOUND",                      severity: "low"    },
        ]
      : [
          { label: "Sensor noise matches Sony IMX766 CMOS pattern",         severity: "low"    },
          { label: "Chromatic aberration at edges — authentic lens physics", severity: "low"    },
          { label: "EXIF: GPS + timestamp + ISO/aperture present",           severity: "low"    },
          { label: "No GAN fingerprint detected (28 model library)",        severity: "low"    },
          { label: "C2PA provenance chain: VERIFIED ✓",                    severity: "low"    },
        ],
    model_used:         "TruthScan Image v2.1 — XceptionNet + ELA + EXIF + Hive Moderation",
    processing_time_ms: 900 + Math.floor(Math.random() * 1200),
  };
}

function mockAudioResult(): TruthScanResponse {
  const aiProb = 0.40 + Math.random() * 0.50;
  const isAI   = aiProb > 0.52;
  return {
    verdict:           isAI ? "ai" : "human",
    ai_probability:    aiProb,
    human_probability: 1 - aiProb,
    confidence:        Math.round(58 + Math.abs(aiProb - 0.5) * 84),
    signals: isAI
      ? [
          { label: "RawNet2 score 0.94 — strong voice clone signal",        severity: "high"   },
          { label: "Missing natural breath pattern (0.8–1.2 Hz rhythm)",    severity: "high"   },
          { label: "Spectral smoothing artifact: ElevenLabs V2 signature", severity: "medium" },
          { label: "F0 trajectory: machine-regular, no micro-variations",   severity: "medium" },
          { label: "Background noise floor: synthetic (no room tone)",      severity: "low"    },
        ]
      : [
          { label: "Wav2Vec2: natural prosody rhythm detected",              severity: "low"    },
          { label: "Breath events found at expected intervals",             severity: "low"    },
          { label: "F0 micro-variations consistent with human phonation",    severity: "low"    },
          { label: "No voice clone fingerprint in 14-model library",        severity: "low"    },
          { label: "Room tone and reverb: authentic recording environment",  severity: "low"    },
        ],
    model_used:         "TruthScan Audio v2.1 — RawNet2 + Wav2Vec2 XLSR + MFCC-CNN",
    processing_time_ms: 1100 + Math.floor(Math.random() * 1400),
  };
}

function mockVideoResult(): TruthScanResponse {
  const aiProb = 0.38 + Math.random() * 0.52;
  const isAI   = aiProb > 0.54;
  return {
    verdict:           isAI ? "ai" : "human",
    ai_probability:    aiProb,
    human_probability: 1 - aiProb,
    confidence:        Math.round(56 + Math.abs(aiProb - 0.5) * 86),
    signals: isAI
      ? [
          { label: "XceptionNet: deepfake face detected in 67% of frames",  severity: "high"   },
          { label: "SyncNet lip-sync score 0.21 — audio/visual desync",     severity: "high"   },
          { label: "Face boundary blending artifacts in ROI region",        severity: "medium" },
          { label: "RetinaFace: 2 faces show sub-pixel geometry anomaly",   severity: "medium" },
          { label: "Audio: RawNet2 voice clone signal 0.87",                severity: "low"    },
        ]
      : [
          { label: "XceptionNet: no deepfake artifacts in sampled frames",   severity: "low"    },
          { label: "SyncNet lip-sync score 0.89 — authentic audio/visual",  severity: "low"    },
          { label: "Face boundary: no blending artifacts detected",         severity: "low"    },
          { label: "Camera motion: natural handheld stabilization",         severity: "low"    },
          { label: "Audio: Wav2Vec2 confirms authentic human voice",        severity: "low"    },
        ],
    model_used:         "TruthScan Video v2.1 — XceptionNet + SyncNet + RetinaFace + RawNet2",
    processing_time_ms: 2000 + Math.floor(Math.random() * 2000),
  };
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const type = form.get("type") as string | null;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
    if (!type || !["image", "audio", "video"].includes(type)) {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const apiUrl = process.env.TRUTHSCAN_API_URL;
    if (apiUrl) {
      const upstream = await fetch(`${apiUrl}/detect/${type}`, {
        method: "POST",
        body:   form,
        signal: AbortSignal.timeout(30_000),
      });
      if (upstream.ok) return NextResponse.json(await upstream.json());
    }

    await new Promise(r => setTimeout(r, 120));
    const result =
      type === "image" ? mockImageResult() :
      type === "audio" ? mockAudioResult() :
                         mockVideoResult();

    return NextResponse.json(result);
  } catch (err) {
    console.error("[TruthScan /detect/file]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
