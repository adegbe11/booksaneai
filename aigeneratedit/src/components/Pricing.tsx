import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    tagline: "For individuals exploring the platform.",
    dark: false,
    popular: false,
    features: [
      "10 scans/month",
      "50 MB max file size",
      "Basic report — verdict + confidence %",
      "All 5 detector types",
      "No API access",
      "No badge generator",
    ],
    cta: "Get Started Free",
    ctaHref: "/signup",
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    tagline: "For journalists, researchers, and professionals.",
    dark: true,
    popular: true,
    features: [
      "500 scans/month",
      "500 MB max file size",
      "Full report — heatmap + artifact list",
      "Model-by-model breakdown",
      "API access (1,000 calls/month)",
      "Transparency badge generator",
      "PDF report export",
      "Priority queue (< 3 s avg)",
      "Email scan notifications",
    ],
    cta: "Start Pro →",
    ctaHref: "/signup?plan=pro",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    tagline: "For organizations that need scale and control.",
    dark: false,
    popular: false,
    features: [
      "Unlimited scans",
      "Custom model fine-tuning",
      "White-label reports",
      "SLA 99.9% uptime",
      "On-premise deployment",
      "Dedicated Slack support",
      "Custom integrations",
      "Legal-grade certificates",
    ],
    cta: "Talk to Sales →",
    ctaHref: "/contact",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" style={{ background: "#FFFFFF", padding: "clamp(64px,9vw,112px) 0" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">

        {/* Heading */}
        <div className="text-center" style={{ marginBottom: "clamp(40px,5vw,64px)" }}>
          <div className="section-label mb-5 mx-auto" style={{ width: "fit-content" }}>
            Pricing
          </div>
          <h2
            className="D"
            style={{ fontSize: "clamp(30px,4.5vw,52px)", color: "#1D1D1F", lineHeight: 1.1, marginBottom: 12 }}
          >
            Start free. Scale when you&apos;re ready.
          </h2>
          <p style={{ fontSize: 17, color: "#6E6E73" }}>
            No credit card required for free tier. Cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map(plan => (
            <div
              key={plan.name}
              style={{
                position: "relative",
                borderRadius: 20,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                gap: 24,
                background: plan.dark ? "#0A0A0A" : "#FFFFFF",
                border: plan.dark ? "1px solid #1F1F1F" : "1px solid #E5E5E7",
                boxShadow: plan.dark ? "0 8px 48px rgba(0,0,0,0.4)" : "0 2px 20px rgba(0,0,0,0.06)",
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, background: "#C8F135", color: "#0A0A0A", borderRadius: 999, padding: "5px 14px", whiteSpace: "nowrap" }}>
                    Most popular
                  </span>
                </div>
              )}

              {/* Plan info */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8, color: plan.dark ? "rgba(255,255,255,0.4)" : "#AEAEB2" }}>
                  {plan.name}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span className="D" style={{ fontSize: 44, color: plan.dark ? "#FFFFFF" : "#1D1D1F", lineHeight: 1 }}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span style={{ fontSize: 14, color: plan.dark ? "rgba(255,255,255,0.35)" : "#AEAEB2" }}>
                      {plan.period}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: plan.dark ? "rgba(255,255,255,0.45)" : "#6E6E73" }}>
                  {plan.tagline}
                </p>
              </div>

              {/* Divider */}
              <div style={{ height: 1, background: plan.dark ? "rgba(255,255,255,0.07)" : "#F0F0F0" }} />

              {/* Features */}
              <ul style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, padding: 0, margin: 0, listStyle: "none" }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      style={{ color: plan.dark ? "#C8F135" : "#8DB800", flexShrink: 0, marginTop: 2 }}
                    />
                    <span style={{ fontSize: 13, lineHeight: 1.5, color: plan.dark ? "rgba(255,255,255,0.7)" : "#6E6E73" }}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                className={`btn ${plan.dark ? "btn-soul" : "btn-outline"}`}
                style={{ fontSize: 14, padding: "13px 0", width: "100%", textAlign: "center" }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Trust note */}
        <p style={{ textAlign: "center", fontSize: 12, color: "#AEAEB2", marginTop: 28 }}>
          All plans include GDPR compliance · Files deleted within 24 h · Never used to train models
        </p>
      </div>
    </section>
  );
}
