import type { Metadata } from "next";
import DetectorShell from "@/components/detect/DetectorShell";

export const metadata: Metadata = {
  title: "Free AI Text Detector — Detect ChatGPT, Claude, Gemini | aigeneratedit",
  description:
    "Detect AI-written text from ChatGPT, Claude, Gemini, and Llama. Per-sentence analysis, 93% accuracy. Free, no account needed.",
  alternates: { canonical: "https://aigeneratedit.com/detect/text" },
  openGraph: {
    title: "AI Text Detector — 93% Accuracy | aigeneratedit",
    description: "Identify GPT-4, Claude, Gemini, and Llama-written content per sentence.",
    url: "https://aigeneratedit.com/detect/text",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can it detect text from ChatGPT-4o?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. aigeneratedit detects AI-generated text from GPT-4o, Claude 3.5/4, Gemini 1.5/2.0, Llama 3, Mistral, and other major language models.",
      },
    },
    {
      "@type": "Question",
      name: "Does it identify which AI wrote the text?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our model attribution layer identifies the most likely source model. Attribution is shown as a probability distribution — not a binary yes/no.",
      },
    },
    {
      "@type": "Question",
      name: "What is per-sentence analysis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each sentence is independently scored. This is critical for mixed-content documents where a human writer has partially edited AI-generated text.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a minimum text length?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We recommend at least 150 characters for reliable results. Short snippets under 50 characters will return low-confidence results.",
      },
    },
    {
      "@type": "Question",
      name: "Can paraphrasing tools fool the detector?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Paraphrasing reduces detection accuracy. However, our ensemble uses multiple independent signals (perplexity, burstiness, semantic patterns) making it significantly harder to fool than single-model detectors.",
      },
    },
  ],
};

export default function TextDetectorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <DetectorShell
        config={{
          type: "text",
          title: "AI Text Detector",
          subtitle:
            "Identify GPT-4, Claude, Gemini, and Llama-written content with per-sentence analysis and model attribution.",
          accuracy: "93%",
          accept: ".txt,.pdf,.doc,.docx",
          placeholder: "Paste your text here (minimum 150 characters for best results)…\n\nWorks with essays, emails, news articles, academic papers, and any written content.",
          modelNames: ["RoBERTa Classifier", "Binoculars", "Perplexity Scorer", "Sapling API", "Burstiness Detector"],
          faq: [
            {
              q: "Can it detect text from ChatGPT-4o?",
              a: "Yes. aigeneratedit detects AI-generated text from GPT-4o, Claude 4, Gemini 2.0, Llama 3, Mistral, and other major language models.",
            },
            {
              q: "Does it identify which AI wrote the text?",
              a: "Yes. Our model attribution layer identifies the most likely source model as a probability distribution.",
            },
            {
              q: "What is per-sentence analysis?",
              a: "Each sentence is independently scored, critical for mixed-content documents where a human writer has partially edited AI text.",
            },
            {
              q: "Is there a minimum text length?",
              a: "We recommend at least 150 characters for reliable results.",
            },
            {
              q: "Can paraphrasing tools fool the detector?",
              a: "Paraphrasing reduces accuracy. Our ensemble uses multiple signals (perplexity, burstiness, semantic patterns) making it harder to fool than single-model detectors.",
            },
          ],
        }}
      />
    </>
  );
}
