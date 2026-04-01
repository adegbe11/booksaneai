import Link from "next/link";
import { Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(200,241,53,0.12)" }}
        >
          <Search size={36} style={{ color: "#8DB800" }} />
        </div>
        <h1
          className="font-display text-[64px] font-bold leading-none mb-2"
          style={{ color: "#C8F135" }}
        >
          404
        </h1>
        <p
          className="font-display text-[24px] font-bold text-[#1D1D1F] mb-3"
        >
          Nothing to detect here.
        </p>
        <p className="text-[15px] text-[#6E6E73] mb-8">
          This page doesn&apos;t exist — but deepfakes do. Head back and scan something real.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary text-[14px] px-6 py-3 justify-center">
            Go to Homepage
          </Link>
          <Link href="/detect/audio" className="btn-ghost text-[14px] px-6 py-3 justify-center">
            Try a detector
          </Link>
        </div>
      </div>
    </div>
  );
}
