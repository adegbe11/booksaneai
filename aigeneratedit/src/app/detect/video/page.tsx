import type { Metadata } from "next";
import DetectorShell from "@/components/detect/DetectorShell";

export const metadata: Metadata = {
  title: "Free Video Deepfake Detector — 97% Accuracy | aigeneratedit",
  description:
    "Detect face-swaps, lip-sync deepfakes, and full-body synthetic video. EfficientNetV2-B3 + CrossEfficientViT ensemble. Free, instant results.",
  alternates: { canonical: "https://aigeneratedit.com/detect/video" },
  openGraph: {
    title: "Video Deepfake Detector — 97% Accuracy | aigeneratedit",
    description: "Catch face-swaps, lip-sync fakes, and full-body deepfakes frame by frame.",
    url: "https://aigeneratedit.com/detect/video",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What types of deepfake videos can it detect?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "aigeneratedit detects face-swap deepfakes (FaceSwap, DeepFaceLab), lip-sync fakes (Wav2Lip, SadTalker), full-body generation (Sora, Kling), and GAN-based face replacements.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is the video deepfake detector?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "97% accuracy on the FaceForensics++ benchmark using an ensemble of EfficientNetV2-B3, CrossEfficientViT, and RestNext+LSTM.",
      },
    },
    {
      "@type": "Question",
      name: "What video formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MP4, MOV, AVI, WEBM, MKV. Maximum 50MB on free plan. Longer videos use our async queue and notify you by email when done.",
      },
    },
    {
      "@type": "Question",
      name: "Does it analyze every frame?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We sample frames at a density that maximises detection while keeping scan time under 30 seconds. Pro users can request full-frame analysis.",
      },
    },
    {
      "@type": "Question",
      name: "Can it detect AI-generated video from tools like Sora?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our models are continuously updated to detect video from Sora, Runway Gen-3, Kling, Pika, and other video generation systems.",
      },
    },
  ],
};

export default function VideoDetectorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <DetectorShell
        config={{
          type: "video",
          title: "Video Deepfake Detector",
          subtitle:
            "Catch face-swaps, lip-sync fakes, and full-body deepfakes frame by frame using our 3-model video ensemble.",
          accuracy: "97%",
          accept: "video/*",
          modelNames: ["EfficientNetV2-B3", "CrossEfficientViT", "RestNext+LSTM", "Temporal Analyzer", "Compression Forensics"],
          faq: [
            {
              q: "What types of deepfake videos can it detect?",
              a: "aigeneratedit detects face-swap deepfakes, lip-sync fakes, full-body generation (Sora, Kling), and GAN-based face replacements.",
            },
            {
              q: "How accurate is the video deepfake detector?",
              a: "97% accuracy on the FaceForensics++ benchmark using EfficientNetV2-B3, CrossEfficientViT, and RestNext+LSTM.",
            },
            {
              q: "What video formats are supported?",
              a: "MP4, MOV, AVI, WEBM, MKV. Maximum 50MB on free plan.",
            },
            {
              q: "Does it analyze every frame?",
              a: "We use intelligent frame sampling to maximise detection while keeping scan time under 30 seconds.",
            },
            {
              q: "Can it detect AI-generated video from Sora or Runway?",
              a: "Yes. Our models are updated regularly to detect Sora, Runway Gen-3, Kling, Pika, and other video generation systems.",
            },
          ],
        }}
      />
    </>
  );
}
