import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-clash",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://aigeneratedit.com"),
  title: {
    default: "The #1 AI Detection Platform for Images, Audio, Video & Text | AIGeneratedIt",
    template: "%s | AIGeneratedIt",
  },
  description:
    "Detect AI-generated content across images, audio, video, and text in seconds. AIGeneratedIt helps you verify authenticity, spot deepfakes, and trust what you see online.",
  keywords: [
    "ai detector",
    "deepfake detector",
    "is this AI generated",
    "ai content detector",
    "deepfake audio detector",
    "video deepfake detector",
    "image authenticity checker",
    "ai text detector",
    "detect ai generated content",
    "synthetic media detection",
    "voice clone detector",
    "url deepfake scanner",
    "C2PA verified",
    "EU AI Act compliant",
    "transparency badge generator",
    "aigeneratedit",
  ],
  authors: [{ name: "aigeneratedit", url: "https://aigeneratedit.com" }],
  creator: "aigeneratedit",
  publisher: "aigeneratedit",
  category: "Technology",
  openGraph: {
    title: "The #1 AI Detection Platform for Images, Audio, Video & Text | AIGeneratedIt",
    description:
      "Detect AI-generated content across images, audio, video, and text in seconds. Verify authenticity, spot deepfakes, and trust what you see online.",
    url: "https://aigeneratedit.com",
    images: [
      {
        url: "/og/home.png",
        width: 1200,
        height: 630,
        alt: "aigeneratedit — AI & Deepfake Detector",
      },
    ],
    type: "website",
    siteName: "aigeneratedit",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@aigeneratedit",
    creator: "@aigeneratedit",
    title: "The #1 AI Detection Platform for Images, Audio, Video & Text | AIGeneratedIt",
    description:
      "Detect AI-generated content across images, audio, video, and text in seconds. Verify authenticity, spot deepfakes, and trust what you see online.",
    images: ["/og/home.png"],
  },
  alternates: {
    canonical: "https://aigeneratedit.com",
    languages: {
      "en-US": "https://aigeneratedit.com",
      "es":    "https://aigeneratedit.com/es",
      "fr":    "https://aigeneratedit.com/fr",
      "de":    "https://aigeneratedit.com/de",
      "ar":    "https://aigeneratedit.com/ar",
      "pt":    "https://aigeneratedit.com/pt",
      "ja":    "https://aigeneratedit.com/ja",
      "zh":    "https://aigeneratedit.com/zh",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "replace-with-your-google-search-console-token",
  },
};

const schemaWebApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "aigeneratedit",
  url: "https://aigeneratedit.com",
  description:
    "Detect AI-generated content across images, audio, video, and text in seconds. AIGeneratedIt helps you verify authenticity, spot deepfakes, and trust what you see online.",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  browserRequirements: "Requires JavaScript",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "4827",
    bestRating: "5",
    worstRating: "1",
  },
  featureList: [
    "Audio deepfake detection — 96% accuracy",
    "Video deepfake detection — 97% accuracy",
    "Image authenticity scanning — 95% accuracy",
    "AI text detection — 93% accuracy",
    "URL media scanner — multi-modal",
    "Transparency badge generator — cryptographic",
    "EU AI Act compliant",
    "C2PA verified",
  ],
};

const schemaOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "aigeneratedit",
  url: "https://aigeneratedit.com",
  logo: "https://aigeneratedit.com/og/home.png",
  sameAs: [
    "https://twitter.com/aigeneratedit",
    "https://linkedin.com/company/aigeneratedit",
    "https://github.com/aigeneratedit",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    url: "https://aigeneratedit.com/contact",
  },
};

const schemaSiteLinks = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "aigeneratedit",
  url: "https://aigeneratedit.com",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://aigeneratedit.com/detect/text?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#F5F5F7" />
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="anonymous" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaSiteLinks) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
