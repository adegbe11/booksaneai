import type { Metadata } from "next";
import DetectorShell from "@/components/detect/DetectorShell";

export const metadata: Metadata = {
  title: "Free Image Deepfake Detector — Is This AI Generated? | aigeneratedit",
  description:
    "Detect AI-generated images from Midjourney, DALL-E, Stable Diffusion. GAN detection, diffusion fingerprints, EXIF forensics. 95% accuracy. Free.",
  alternates: { canonical: "https://aigeneratedit.com/detect/image" },
  openGraph: {
    title: "Image Deepfake Detector — 95% Accuracy | aigeneratedit",
    description: "GAN detection, diffusion fingerprints, EXIF forensics, heatmap overlay.",
    url: "https://aigeneratedit.com/detect/image",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can it detect images from Midjourney, DALL-E, and Stable Diffusion?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. aigeneratedit detects images from Midjourney v4–v6, DALL-E 2 and 3, Stable Diffusion XL, Flux, Firefly, and other major generators with 95% accuracy.",
      },
    },
    {
      "@type": "Question",
      name: "What is the heatmap overlay?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The heatmap highlights which specific pixels or regions were likely synthesized by an AI model, using gradient-weighted class activation mapping (Grad-CAM).",
      },
    },
    {
      "@type": "Question",
      name: "Does it check EXIF metadata?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We inspect EXIF metadata for inconsistencies — AI generators often strip metadata or produce inconsistent camera data that reveals synthetic origin.",
      },
    },
    {
      "@type": "Question",
      name: "What image formats are supported?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JPG, PNG, WEBP, HEIC, TIFF, BMP. Maximum 20MB on free plan.",
      },
    },
    {
      "@type": "Question",
      name: "How is this different from Google's image search?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Reverse image search finds where an image appeared online. aigeneratedit analyzes the actual pixel patterns and neural fingerprints to determine if the content itself was AI-generated, regardless of whether it's been posted before.",
      },
    },
  ],
};

export default function ImageDetectorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <DetectorShell
        config={{
          type: "image",
          title: "Image Authenticity Scanner",
          subtitle:
            "Detect AI-generated images from Midjourney, DALL-E, Stable Diffusion, and more. Includes pixel-level heatmap and EXIF forensics.",
          accuracy: "95%",
          accept: "image/*",
          modelNames: ["NPR Detector", "UniversalFakeDetect", "EfficientNet-B4", "EXIF Forensics", "Freq. Analysis"],
          faq: [
            {
              q: "Can it detect images from Midjourney, DALL-E, and Stable Diffusion?",
              a: "Yes. aigeneratedit detects images from Midjourney v4–v6, DALL-E 2 and 3, Stable Diffusion XL, Flux, Firefly, and more with 95% accuracy.",
            },
            {
              q: "What is the heatmap overlay?",
              a: "The heatmap highlights which specific pixels were likely synthesized by an AI model, using gradient-weighted class activation mapping (Grad-CAM).",
            },
            {
              q: "Does it check EXIF metadata?",
              a: "Yes. We inspect EXIF metadata for inconsistencies — AI generators often strip metadata or produce inconsistent camera data that reveals synthetic origin.",
            },
            {
              q: "What image formats are supported?",
              a: "JPG, PNG, WEBP, HEIC, TIFF, BMP. Maximum 20MB on free plan.",
            },
            {
              q: "How is this different from Google reverse image search?",
              a: "Reverse image search finds where an image appeared. aigeneratedit analyzes the actual pixel patterns to determine if the content was AI-generated, regardless of where it's been posted.",
            },
          ],
        }}
      />
    </>
  );
}
