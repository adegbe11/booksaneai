"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

const stats = [
  { end: 4827341, label: "Scans processed",    format: (n: number) => (n / 1_000_000).toFixed(1) + "M" },
  { end: 190,     label: "Countries",           format: (n: number) => n + "+" },
  { end: 99.8,    label: "Detection accuracy",  format: (n: number) => n.toFixed(1) + "%" },
  { end: 2.8,     label: "Avg. response",       format: (n: number) => n.toFixed(1) + " s" },
];

function Counter({ end, format, run }: { end: number; format: (n: number) => string; run: boolean }) {
  const [val, setVal] = useState(0);
  const raf = useRef<number | null>(null);
  const t0  = useRef<number | null>(null);

  useEffect(() => {
    if (!run || typeof window === "undefined") return;
    const DURATION = 1800;
    const tick = (ts: number) => {
      if (!t0.current) t0.current = ts;
      const p = Math.min((ts - t0.current) / DURATION, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(parseFloat((ease * end).toFixed(1)));
      if (p < 1) raf.current = requestAnimationFrame(tick);
      else setVal(end);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [run, end]);

  return <>{format(val)}</>;
}

export default function StatsBar() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });

  return (
    <section
      ref={ref}
      aria-label="Platform statistics"
      style={{ background: "#FFFFFF", borderTop: "1px solid #EBEBED", borderBottom: "1px solid #EBEBED" }}
    >
      <div className="container">
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className={[
                "flex flex-col items-center justify-center text-center",
                i % 2 === 0 ? "border-r border-[#EBEBED]" : "",
                "sm:border-r sm:border-[#EBEBED]",
                i === 3 ? "sm:border-r-0" : "",
                i < 2 ? "border-b border-[#EBEBED] sm:border-b-0" : "",
              ].join(" ")}
              style={{ padding: "clamp(28px, 4vw, 44px) 12px" }}
            >
              <div
                className="D"
                style={{
                  fontSize: "clamp(28px, 3.2vw, 46px)",
                  color: "#1D1D1F",
                  marginBottom: 6,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                }}
              >
                <Counter end={s.end} format={s.format} run={inView} />
              </div>
              <div style={{
                fontSize: 11,
                color: "#AEAEB2",
                fontWeight: 600,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
