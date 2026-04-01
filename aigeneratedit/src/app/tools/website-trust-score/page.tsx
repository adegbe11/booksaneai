import type { Metadata } from "next";
import WebsiteTrustClient from "./WebsiteTrustClient";

export const metadata: Metadata = {
  title: "Website Trust Score — Scan Any URL for AI & Deepfake Content",
  description:
    "Scan any webpage URL for AI-generated text, deepfake images, synthetic audio, and manipulated video simultaneously. Multi-modal forensic analysis in seconds.",
};

export default function WebsiteTrustPage() {
  return <WebsiteTrustClient />;
}
