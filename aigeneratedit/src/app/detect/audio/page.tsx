import type { Metadata } from "next";
import DetectorShell from "@/components/detect/DetectorShell";

export const metadata: Metadata = {
  title: "Free Audio Deepfake Detector — Detect Cloned Voices | aigeneratedit",
  description:
    "Detect AI-cloned and synthesized voices instantly. Our Wav2Vec2 + CNN-BiLSTM ensemble achieves 96% accuracy. Free, no account needed.",
  alternates: { canonical: "https://aigeneratedit.com/detect/audio" },
  openGraph: {
    title: "Audio Deepfake Detector — 96% Accuracy | aigeneratedit",
    description: "Detect cloned voices, AI-synthesized speech, and voice deepfakes in seconds.",
    url: "https://aigeneratedit.com/detect/audio",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How accurate is the audio deepfake detector?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "aigeneratedit's audio detector achieves 96% accuracy on the ASVspoof 2021 benchmark using an ensemble of Wav2Vec2, CNN-BiLSTM, and MFCC-CNN models.",
      },
    },
    {
      "@type": "Question",
      name: "What audio formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We support MP3, WAV, M4A, OGG, FLAC, and AAC. Maximum file size is 50MB on the free plan.",
      },
    },
    {
      "@type": "Question",
      name: "Can it detect voice cloning from tools like ElevenLabs?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our ensemble is trained on synthetic audio from ElevenLabs, Resemble.ai, VALL-E, and other state-of-the-art TTS systems.",
      },
    },
    {
      "@type": "Question",
      name: "How long does an audio scan take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most audio files under 10 minutes return results in under 8 seconds. Pro users get priority queue access with average latency under 3 seconds.",
      },
    },
    {
      "@type": "Question",
      name: "Is my audio stored or used to train AI models?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Your files are stored temporarily on encrypted Cloudflare R2 storage and automatically deleted within 24 hours. We never use uploaded content to train our models.",
      },
    },
  ],
};

export default function AudioDetectorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <DetectorShell
        config={{
          type: "audio",
          title: "Audio Deepfake Detector",
          subtitle:
            "Detect AI-cloned voices, synthetic speech, and audio deepfakes using an ensemble of 3 specialized neural networks.",
          accuracy: "96%",
          accept: "audio/*",
          modelNames: ["Wav2Vec2", "CNN-BiLSTM", "MFCC-CNN", "Spectral Analyzer", "Breath Detector"],
          faq: [
            {
              q: "How accurate is the audio deepfake detector?",
              a: "aigeneratedit's audio detector achieves 96% accuracy on the ASVspoof 2021 benchmark using an ensemble of Wav2Vec2, CNN-BiLSTM, and MFCC-CNN models.",
            },
            {
              q: "What audio formats are supported?",
              a: "We support MP3, WAV, M4A, OGG, FLAC, and AAC. Maximum file size is 50MB on the free plan.",
            },
            {
              q: "Can it detect voice cloning from tools like ElevenLabs?",
              a: "Yes. Our ensemble is trained on synthetic audio from ElevenLabs, Resemble.ai, VALL-E, and other state-of-the-art TTS systems.",
            },
            {
              q: "How long does an audio scan take?",
              a: "Most audio files under 10 minutes return results in under 8 seconds. Pro users get priority queue with average latency under 3 seconds.",
            },
            {
              q: "Is my audio stored or used to train AI models?",
              a: "No. Files are automatically deleted within 24 hours and never used to train our models.",
            },
          ],
        }}
      />
    </>
  );
}
