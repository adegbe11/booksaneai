import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service | AIGeneratedIt",
  description: "AIGeneratedIt Terms of Service — acceptable use, liability, and API terms.",
  alternates: { canonical: "https://aigeneratedit.com/terms" },
};

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body:  "By accessing or using AIGeneratedIt (the 'Service'), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.",
  },
  {
    title: "2. Acceptable use",
    body:  "You may use the Service for lawful purposes only. Prohibited uses include: submitting content for which you do not have rights; attempting to reverse-engineer or circumvent our detection models; using the Service to generate or spread disinformation; automated scraping without an authorized API key; and any use that violates applicable law or third-party rights.",
  },
  {
    title: "3. Accuracy disclaimer",
    body:  "Our detection models achieve 93–99.8% accuracy depending on modality. Results are probabilistic, not definitive. AIGeneratedIt results should not be used as the sole basis for legal, editorial, or judicial decisions without additional verification. We disclaim liability for decisions made solely on the basis of our detection results.",
  },
  {
    title: "4. Intellectual property",
    body:  "The Service, TruthScan AI Engine, detection models, and all associated software are proprietary to AIGeneratedIt. You may not copy, modify, distribute, or create derivative works without explicit written permission. Content you submit remains your property; you grant us a limited license to process it for detection purposes only.",
  },
  {
    title: "5. API terms",
    body:  "API access is subject to rate limits and additional API-specific terms provided at the time of key issuance. Unauthorized use of the API, sharing of API keys, or use beyond agreed rate limits may result in immediate key revocation.",
  },
  {
    title: "6. Limitation of liability",
    body:  "To the maximum extent permitted by law, AIGeneratedIt shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service. Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.",
  },
  {
    title: "7. Changes to terms",
    body:  "We reserve the right to modify these terms at any time. Continued use of the Service after changes constitutes acceptance of the new terms. We will notify registered API users of material changes by email.",
  },
  {
    title: "8. Governing law",
    body:  "These terms are governed by the laws of the European Union, specifically GDPR and the EU AI Act where applicable, without regard to conflict of law principles. Any disputes shall be resolved in accordance with applicable EU jurisdiction.",
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F5F5F7", minHeight: "100vh", paddingTop: 72 }}>
        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EBEBED", padding: "clamp(40px,5vw,64px) 0" }}>
          <div className="container">
            <h1 className="D" style={{ fontSize: "clamp(26px,4vw,44px)", color: "#1D1D1F", marginBottom: 8 }}>Terms of Service</h1>
            <p style={{ fontSize: 13.5, color: "#AEAEB2" }}>Last updated: March 31, 2026</p>
          </div>
        </div>
        <div className="container" style={{ paddingTop: "clamp(32px,4vw,48px)", paddingBottom: "clamp(64px,8vw,96px)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <div style={{ background: "#FFFFFF", border: "1px solid #E5E5E7", borderRadius: 16, overflow: "hidden" }}>
              {SECTIONS.map((s, i) => (
                <div key={s.title} style={{ padding: "24px 32px", borderBottom: i < SECTIONS.length - 1 ? "1px solid #F0F0F0" : "none" }}>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1D1D1F", marginBottom: 8 }}>{s.title}</h2>
                  <p style={{ fontSize: 13.5, color: "#6E6E73", lineHeight: 1.75 }}>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
