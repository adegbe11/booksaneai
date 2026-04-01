import type { Metadata } from "next";
import BadgeGenerator from "@/components/BadgeGenerator";

export const metadata: Metadata = {
  title: "Transparency Badge Generator — Prove Your Content is Human-Made | aigeneratedit",
  description:
    "Generate a cryptographically signed transparency badge for your content. Embed it anywhere to prove human authorship. Free.",
  alternates: { canonical: "https://aigeneratedit.com/badge" },
  openGraph: {
    title: "Transparency Badge Generator | aigeneratedit",
    description: "Prove your content is human-made with a cryptographically signed embeddable badge.",
    url: "https://aigeneratedit.com/badge",
  },
};

export default function BadgePage() {
  return <BadgeGenerator />;
}
