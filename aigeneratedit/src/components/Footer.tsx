"use client";

import Link from "next/link";

const cols = [
  {
    heading: "Detectors",
    links: [
      { label: "Audio Detector",  href: "/detect/audio" },
      { label: "Video Detector",  href: "/detect/video" },
      { label: "Image Scanner",   href: "/detect/image" },
      { label: "Text Detector",   href: "/detect/text" },
      { label: "URL Scanner",     href: "/detect/url" },
      { label: "Badge Generator", href: "/badge" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About",    href: "/about" },
      { label: "Blog",     href: "/blog" },
      { label: "API",      href: "/developers" },
      { label: "Contact",  href: "/contact" },
      { label: "Careers",  href: "/careers" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy",   href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy",    href: "/cookies" },
      { label: "GDPR",             href: "/gdpr" },
    ],
  },
];

const socials = [
  {
    label: "Twitter / X",
    href: "https://twitter.com/aigeneratedit",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.84L2.25 2.25h6.928l4.26 5.631L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/aigeneratedit",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "GitHub",
    href: "https://github.com/aigeneratedit",
    svg: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      style={{ background: "#0A0A0A", borderTop: "1px solid rgba(255,255,255,0.06)" }}
      aria-label="Site footer"
    >
      <div className="container-wide" style={{ paddingTop: "clamp(48px, 6vw, 80px)", paddingBottom: "clamp(32px, 4vw, 48px)" }}>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10" style={{ marginBottom: "clamp(40px, 5vw, 64px)" }}>

          {/* Brand col */}
          <div className="col-span-2">
            <Link
              href="/"
              aria-label="aigeneratedit home"
              style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", marginBottom: 16 }}
            >
              <span className="D" style={{ fontSize: 18, color: "#FFFFFF" }}>aigeneratedit</span>
              <span aria-hidden style={{ width: 4, height: 4, borderRadius: "50%", background: "#C8F135", marginLeft: 2, marginBottom: 8, flexShrink: 0 }} />
            </Link>
            <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.28)", lineHeight: 1.72, maxWidth: 260, marginBottom: 16 }}>
              Forensic-grade deepfake detection for journalists, researchers, legal teams, and enterprises.
            </p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, background: "rgba(200,241,53,0.08)", border: "1px solid rgba(200,241,53,0.15)", marginBottom: 20 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#C8F135", display: "inline-block", flexShrink: 0 }} />
              <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#C8F135" }}>
                Powered by TruthScan AI Engine
              </span>
            </div>
            <nav aria-label="Social media" style={{ display: "flex", gap: 6 }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  style={{
                    width: 34, height: 34, borderRadius: 8,
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.28)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 160ms ease", textDecoration: "none",
                    border: "1px solid rgba(255,255,255,0.07)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(200,241,53,0.1)";
                    e.currentTarget.style.color = "#C8F135";
                    e.currentTarget.style.borderColor = "rgba(200,241,53,0.2)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.28)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  }}
                >
                  {s.svg}
                </a>
              ))}
            </nav>
          </div>

          {/* Nav cols */}
          {cols.map(col => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 style={{
                fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.15em", color: "rgba(255,255,255,0.18)",
                marginBottom: 16,
              }}>
                {col.heading}
              </h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      style={{ fontSize: 13.5, color: "rgba(255,255,255,0.32)", textDecoration: "none", transition: "color 150ms ease" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#FFFFFF")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.32)")}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between",
          gap: 12, paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.18)" }}>
            © 2026 aigeneratedit &nbsp;·&nbsp; &ldquo;Verify Everything.&rdquo;
          </p>
          <nav aria-label="Legal links" style={{ display: "flex", flexWrap: "wrap", gap: "4px 18px" }}>
            {["Privacy", "Terms", "Cookies", "GDPR"].map(t => (
              <Link
                key={t}
                href={`/${t.toLowerCase()}`}
                style={{ fontSize: 12.5, color: "rgba(255,255,255,0.18)", textDecoration: "none", transition: "color 150ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.18)")}
              >
                {t}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
