import type { Metadata } from "next";
import AITextDetectorClient from "./AITextDetectorClient";

export const metadata: Metadata = {
  title: "AI Text Detector — Detect ChatGPT, Gemini & Claude Writing",
  description:
    "Instantly detect AI-generated text from ChatGPT, Gemini, Claude, and 50+ models. 93% accuracy. Trusted by journalists, academics, and enterprise teams.",
};

export default function AITextDetectorPage() {
  return <AITextDetectorClient />;
}
