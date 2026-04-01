"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { label: "Audio",   href: "/detect/audio" },
  { label: "Video",   href: "/detect/video" },
  { label: "Image",   href: "/detect/image" },
  { label: "Text",    href: "/detect/text" },
  { label: "URL",     href: "/detect/url" },
  { label: "Badge",   href: "/badge" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "nav-blur" : ""}`}
      style={{ background: scrolled ? "rgba(245,245,247,0.92)" : "transparent" }}
      aria-label="Main navigation"
    >
      <div className="container-wide">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <Link href="/" aria-label="aigeneratedit home" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            <span className="D" style={{ fontSize: 20, color: "#1D1D1F", letterSpacing: "-0.03em" }}>
              aigeneratedit
            </span>
            <span aria-hidden style={{
              width: 5, height: 5, borderRadius: "50%",
              background: "#C8F135", marginLeft: 2, marginBottom: 10,
              boxShadow: "0 0 8px rgba(200,241,53,0.9)", flexShrink: 0,
            }} />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Detectors">
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                style={{ color: "#6E6E73", fontSize: 14, fontWeight: 500, padding: "6px 12px", borderRadius: 8, textDecoration: "none", transition: "color 160ms ease" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#1D1D1F")}
                onMouseLeave={e => (e.currentTarget.style.color = "#6E6E73")}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/about"
              style={{ fontSize: 14, fontWeight: 500, color: "#6E6E73", textDecoration: "none", transition: "color 160ms ease" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#1D1D1F")}
              onMouseLeave={e => (e.currentTarget.style.color = "#6E6E73")}
            >
              About
            </Link>
            <Link href="/detect/audio" className="btn btn-soul" style={{ fontSize: 14, padding: "9px 22px" }}>
              Start Scanning
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="lg:hidden"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "#1D1D1F" }}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          style={{ background: "#F5F5F7", borderTop: "1px solid #EBEBED" }}
          aria-label="Mobile navigation"
        >
          <div style={{ padding: "8px 16px 4px" }}>
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "block", fontSize: 15, fontWeight: 500,
                  color: "#1D1D1F", padding: "12px 8px",
                  borderBottom: "1px solid #F0F0F0", textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
          <div style={{ padding: "12px 24px 20px" }}>
            <Link
              href="/detect/audio"
              className="btn btn-soul"
              onClick={() => setOpen(false)}
              style={{ fontSize: 15, padding: "13px 0", width: "100%", justifyContent: "center" }}
            >
              Start Scanning
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
