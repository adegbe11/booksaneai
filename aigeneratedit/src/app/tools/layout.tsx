import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main style={{ background: "#F5F5F7", minHeight: "100vh", paddingTop: 72 }}>
        {children}
      </main>
      <Footer />
    </>
  );
}
