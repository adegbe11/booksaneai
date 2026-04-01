import type { Metadata } from "next";
import ImageForensicClient from "./ImageForensicClient";

export const metadata: Metadata = {
  title: "Image Forensic Scanner — Detect AI-Generated & Manipulated Images",
  description:
    "Detect AI-generated images, deepfake faces, and photo manipulations with 95% accuracy. C2PA metadata analysis, ELA, and GAN fingerprint detection.",
};

export default function ImageForensicPage() {
  return <ImageForensicClient />;
}
