import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy | AIGeneratedIt",
  description: "AIGeneratedIt Privacy Policy — how we collect, use, and protect your data. GDPR compliant.",
  alternates: { canonical: "https://aigeneratedit.com/privacy" },
};

const SECTIONS = [
  {
    title: "1. Data we collect",
    body: "When you use our detection services, we temporarily process the content you submit (text, files, or URLs) to provide detection results. We do not collect personally identifiable information unless you voluntarily provide it (e.g., via the contact form or API key request). We collect anonymized usage analytics (page views, feature usage) to improve the platform.",
  },
  {
    title: "2. How we use your data",
    body: "Submitted content is processed solely to generate detection results. It is never used to train our models, sold to third parties, or shared with advertisers. Anonymized usage statistics help us improve detection accuracy and platform performance.",
  },
  {
    title: "3. Data retention",
    body: "All submitted files and text are processed in-memory and permanently deleted from our infrastructure within 24 hours of submission. Detection results may be cached for up to 1 hour to improve response times for identical inputs. No long-term storage of user content occurs.",
  },
  {
    title: "4. Cookies",
    body: "We use strictly necessary cookies for session management and a small number of analytics cookies to understand platform usage. We do not use advertising or tracking cookies. You may opt out of analytics cookies at any time via our cookie preference centre.",
  },
  {
    title: "5. GDPR & your rights",
    body: "If you are in the European Economic Area, you have the right to access, correct, delete, and port your personal data. You may also object to processing or withdraw consent at any time. To exercise these rights, contact privacy@aigeneratedit.com. We respond to all requests within 30 days.",
  },
  {
    title: "6. Security",
    body: "All data in transit is encrypted via TLS 1.3. File uploads are processed over encrypted channels and stored temporarily on Cloudflare R2 with AES-256 encryption. We undergo regular security audits and penetration testing.",
  },
  {
    title: "7. Third-party services",
    body: "Detection may optionally use third-party AI APIs (Hive Moderation, Hugging Face Inference API, ElevenLabs) to augment results. These services are bound by their own privacy policies and data processing agreements. We do not send personally identifiable information to any third-party detection service.",
  },
  {
    title: "8. Contact",
    body: "For privacy inquiries: privacy@aigeneratedit.com. Data Protection Officer: dpo@aigeneratedit.com. Registered address: AIGeneratedIt, hello@aigeneratedit.com.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F5F5F7", minHeight: "100vh", paddingTop: 72 }}>
        <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EBEBED", padding: "clamp(40px,5vw,64px) 0" }}>
          <div className="container">
            <h1 className="D" style={{ fontSize: "clamp(26px,4vw,44px)", color: "#1D1D1F", marginBottom: 8 }}>Privacy Policy</h1>
            <p style={{ fontSize: 13.5, color: "#AEAEB2" }}>Last updated: March 31, 2026</p>
          </div>
        </div>
        <div className="container" style={{ paddingTop: "clamp(32px,4vw,48px)", paddingBottom: "clamp(64px,8vw,96px)" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 0 }}>
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
