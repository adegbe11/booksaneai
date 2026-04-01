import type { Metadata } from "next";
import CompareClient from "./CompareClient";

export const metadata: Metadata = {
  title: "AI vs Human Writing Comparison — Side-by-Side Analysis",
  description:
    "Compare two pieces of text side by side to determine which was written by AI and which by a human. Detailed stylometric breakdown and authorship verdict.",
};

export default function ComparisonPage() {
  return <CompareClient />;
}
