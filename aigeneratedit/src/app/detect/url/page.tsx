import type { Metadata } from "next";
import DetectorShell from "@/components/detect/DetectorShell";

export const metadata: Metadata = {
  title: "URL Deepfake Scanner — Scan Any News Page or Social Post | aigeneratedit",
  description:
    "Scan any URL for deepfake audio, video, AI images, and AI text simultaneously. One link, full multi-modal analysis. Free.",
  alternates: { canonical: "https://aigeneratedit.com/detect/url" },
  openGraph: {
    title: "URL Media Scanner — Multi-modal Deepfake Detection | aigeneratedit",
    description: "Scan any news page, tweet, or social post for ALL synthetic media at once.",
    url: "https://aigeneratedit.com/detect/url",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does the URL scanner check?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It extracts all media from the page — images, embedded audio, embedded video, and article text — and runs each through the appropriate detection model simultaneously.",
      },
    },
    {
      "@type": "Question",
      name: "Does it work on social media posts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It works on most public URLs including news articles, blog posts, and pages with embedded media. Social media platforms with login walls may limit extraction.",
      },
    },
    {
      "@type": "Question",
      name: "How long does a URL scan take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Pages with multiple media items take 15–60 seconds. Simple pages with one or two images return results in under 10 seconds.",
      },
    },
    {
      "@type": "Question",
      name: "Is the URL stored or shared?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The URL is used only to fetch the page content. Results are stored for 24 hours so you can share a link to the report, after which they are permanently deleted.",
      },
    },
    {
      "@type": "Question",
      name: "Can journalists use this to verify sources?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. This is our most popular tool for newsrooms. Paste a story URL before publishing to verify all media in it. We recommend pairing it with the standalone audio and image detectors for critical stories.",
      },
    },
  ],
};

export default function UrlScannerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <DetectorShell
        config={{
          type: "url",
          title: "URL Media Scanner",
          subtitle:
            "Enter any URL and we'll scan every image, audio clip, video, and text on the page for synthetic content — all at once.",
          accuracy: "Multi-modal",
          accept: "",
          modelNames: ["Page Crawler", "Image Pipeline", "Audio Pipeline", "Video Pipeline", "Text Pipeline"],
          faq: [
            {
              q: "What does the URL scanner check?",
              a: "It extracts all media from the page — images, embedded audio, embedded video, and article text — and runs each through the appropriate detection model simultaneously.",
            },
            {
              q: "Does it work on social media posts?",
              a: "It works on most public URLs including news articles and pages with embedded media. Login-walled pages may limit extraction.",
            },
            {
              q: "How long does a URL scan take?",
              a: "Pages with multiple media items take 15–60 seconds. Simple pages return results in under 10 seconds.",
            },
            {
              q: "Is the URL stored?",
              a: "Results are stored for 24 hours for sharing, then permanently deleted.",
            },
            {
              q: "Can journalists use this to verify sources?",
              a: "Yes. Paste a story URL before publishing to verify all media in it. Our most popular tool for newsrooms.",
            },
          ],
        }}
      />
    </>
  );
}
