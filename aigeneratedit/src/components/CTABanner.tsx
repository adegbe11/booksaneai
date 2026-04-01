import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTABanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      style={{
        background: "#0A0A0A",
        padding: "clamp(96px, 12vw, 152px) 0",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow — stays subtle */}
      <div aria-hidden style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "min(900px, 80vw)", height: "min(600px, 60vw)",
        borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(200,241,53,0.055) 0%, transparent 65%)",
        pointerEvents: "none",
      }} />

      <div className="container-narrow" style={{ textAlign: "center", position: "relative" }}>

        {/* Overline */}
        <div style={{ marginBottom: 24 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.14em",
            textTransform: "uppercase", color: "#8DB800",
          }}>
            <span className="live-dot" />
            Scanning now
          </span>
        </div>

        <h2
          id="cta-heading"
          className="D"
          style={{
            fontSize: "clamp(36px, 5.5vw, 66px)",
            color: "#FFFFFF",
            lineHeight: 1.05,
            letterSpacing: "-0.035em",
            marginBottom: 20,
          }}
        >
          Verify the media<br />
          <span style={{ color: "#C8F135" }}>the world relies on.</span>
        </h2>

        <p style={{
          fontSize: "clamp(15px, 1.7vw, 18px)",
          color: "rgba(255,255,255,0.38)",
          marginBottom: 44,
          lineHeight: 1.75,
          maxWidth: 440,
          marginLeft: "auto",
          marginRight: "auto",
        }}>
          Forensic analysis on any media. Results in seconds.
          Trusted by the institutions that cannot afford to get it wrong.
        </p>

        <div style={{
          display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "center", gap: 12,
        }}>
          <Link
            href="/detect/audio"
            className="btn btn-soul"
            style={{ fontSize: 15, padding: "14px 30px" }}
          >
            Start Scanning
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/contact"
            className="btn"
            style={{
              fontSize: 15, padding: "14px 30px",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.65)",
              border: "1.5px solid rgba(255,255,255,0.1)",
            }}
          >
            Talk to Sales
          </Link>
        </div>

        {/* API line */}
        <div style={{ marginTop: 44, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 12.5, color: "rgba(255,255,255,0.22)" }}>
            Integrating into a pipeline?
          </span>
          <Link
            href="/developers"
            style={{
              fontSize: 12.5, fontWeight: 700, color: "#C8F135",
              display: "inline-flex", alignItems: "center", gap: 4,
              textDecoration: "none",
            }}
          >
            View API docs <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </section>
  );
}
