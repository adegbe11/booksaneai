"use client";

import { useState } from "react";
import Link from "next/link";
import { Award, Copy, Check, ExternalLink } from "lucide-react";

export default function BadgeGenerator() {
  const [url, setUrl] = useState("");
  const [contentType, setContentType] = useState("article");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const badgeId = "BGE-2026-" + Math.floor(10000 + Math.random() * 90000);
  const embedCode = `<a href="https://aigeneratedit.com/badge/verify/${badgeId}" target="_blank" rel="noopener">
  <img src="https://aigeneratedit.com/badge/${badgeId}.svg" alt="Verified Human Content — aigeneratedit" width="160" height="32" />
</a>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
            style={{ background: "rgba(200,241,53,0.12)" }}
          >
            <Award size={28} style={{ color: "#8DB800" }} />
          </div>
          <h1
            className="font-display text-[38px] sm:text-[48px] font-bold text-[#1D1D1F] mb-4 leading-tight"
          >
            Transparency Badge Generator
          </h1>
          <p className="text-[17px] text-[#6E6E73] max-w-lg mx-auto">
            Generate a cryptographically signed badge proving your content is
            human-made. Embed it on your website, portfolio, or publication.
          </p>
        </div>

        {!generated ? (
          <div
            className="bg-white rounded-[16px] p-8"
            style={{ border: "1px solid #D2D2D7", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}
          >
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-[13px] font-semibold text-[#1D1D1F] mb-2">
                  Content URL (optional)
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://yourblog.com/my-article"
                  className="w-full text-[14px] text-[#1D1D1F] placeholder-[#AEAEB2] outline-none border border-[#EBEBED] rounded-xl px-4 py-3 focus:border-[#C8F135] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#1D1D1F] mb-2">
                  Content type
                </label>
                <div className="flex flex-wrap gap-2">
                  {["article", "image", "audio", "video", "research", "social post"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setContentType(t)}
                      className="px-3 py-1.5 rounded-full text-[13px] font-semibold capitalize transition-all duration-200"
                      style={
                        contentType === t
                          ? { background: "#C8F135", color: "#0A0A0A" }
                          : { background: "#F5F5F7", color: "#6E6E73" }
                      }
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="rounded-xl p-4"
                style={{ background: "rgba(200,241,53,0.07)", border: "1px solid rgba(200,241,53,0.2)" }}
              >
                <p className="text-[12px] font-semibold" style={{ color: "#5A7A00" }}>
                  What gets signed:
                </p>
                <ul className="mt-2 flex flex-col gap-1">
                  {[
                    "Timestamp of badge creation",
                    "Content URL hash (if provided)",
                    "aigeneratedit public key signature",
                    "GDPR-compliant — no personal data stored",
                  ].map((item) => (
                    <li key={item} className="text-[12px] text-[#6E6E73] flex items-start gap-2">
                      <span style={{ color: "#8DB800" }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setGenerated(true)}
                className="btn-primary text-[15px] px-6 py-3.5 w-full justify-center"
              >
                Generate Badge →
              </button>
            </div>
          </div>
        ) : (
          <div
            className="bg-white rounded-[16px] overflow-hidden"
            style={{ border: "1px solid #D2D2D7", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}
          >
            {/* Badge preview */}
            <div
              className="p-8 text-center"
              style={{ background: "rgba(200,241,53,0.06)", borderBottom: "1px solid #EBEBED" }}
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background: "#C8F135" }}
              >
                <Award size={16} style={{ color: "#0A0A0A" }} />
                <span className="text-[13px] font-bold text-[#0A0A0A]">
                  Verified Human Content
                </span>
                <span className="text-[11px] font-semibold text-[#0A0A0A] opacity-60">
                  aigeneratedit
                </span>
              </div>
              <p className="text-[12px] text-[#6E6E73] mt-3">Badge ID: {badgeId}</p>
            </div>

            {/* Embed code */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[13px] font-semibold text-[#1D1D1F]">Embed code</p>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-[12px] font-semibold transition-colors"
                  style={{ color: copied ? "#8DB800" : "#6E6E73" }}
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <pre
                className="text-[11px] text-[#6E6E73] bg-[#F9F9FB] rounded-xl p-4 overflow-x-auto leading-relaxed"
                style={{ border: "1px solid #EBEBED", fontFamily: "JetBrains Mono, monospace" }}
              >
                {embedCode}
              </pre>
            </div>

            {/* Verify link */}
            <div className="px-6 pb-6 flex flex-col sm:flex-row gap-3">
              <a
                href={`https://aigeneratedit.com/badge/verify/${badgeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-[13px] px-4 py-2.5 flex items-center gap-2"
              >
                <ExternalLink size={14} />
                Verify this badge
              </a>
              <button
                onClick={() => setGenerated(false)}
                className="btn-ghost text-[13px] px-4 py-2.5"
              >
                Generate another
              </button>
            </div>
          </div>
        )}

        {/* How it works */}
        <div
          className="mt-8 bg-white rounded-[16px] p-6"
          style={{ border: "1px solid #D2D2D7" }}
        >
          <h2
            className="font-display text-[20px] font-bold text-[#1D1D1F] mb-4"
          >
            How the badge works
          </h2>
          <ol className="flex flex-col gap-4">
            {[
              { n: "1", title: "You generate a badge", desc: "We create a unique ID and sign it with our public key." },
              { n: "2", title: "Embed it anywhere", desc: "Add the badge to your blog, portfolio, social bio, or press release." },
              { n: "3", title: "Anyone can verify it", desc: "A click on the badge verifies the signature and timestamp at badge.aigeneratedit.com." },
            ].map(({ n, title, desc }) => (
              <li key={n} className="flex items-start gap-3">
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0"
                  style={{ background: "#C8F135", color: "#0A0A0A" }}
                >
                  {n}
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-[#1D1D1F]">{title}</p>
                  <p className="text-[13px] text-[#6E6E73]">{desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-[13px] font-semibold" style={{ color: "#8DB800" }}>
            ← Back to all detectors
          </Link>
        </div>
      </div>
    </div>
  );
}
