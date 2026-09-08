import React, { useState } from "react";
import { Navbar } from "./components/Navbar";
import { FilmExperience } from "./components/FilmExperience";
import { UnderTheHood } from "./components/UnderTheHood";
import { DownloadSection } from "./components/DownloadSection";
import { TechnicalMoat } from "./components/TechnicalMoat";
import { FAQSection } from "./components/FAQSection";
import { Footer } from "./components/Footer";

export const App: React.FC = () => {
  // User requested: "colour i told u i need white and with matching colour ful website"
  // Default to "white" theme with vibrant colourful accents, and provide seamless 1-click toggle to dark
  const [theme, setTheme] = useState<"white" | "dark">("white");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "white" ? "dark" : "white"));
  };

  const scrollToDownload = () => {
    const el = document.getElementById("download");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isWhite = theme === "white";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans antialiased ${
        isWhite
          ? "bg-[#fafafa] text-slate-900 selection:bg-indigo-500/20"
          : "bg-black text-white selection:bg-indigo-500/30"
      }`}
    >
      {/* Fixed Navigation Bar */}
      <Navbar
        onDownloadClick={scrollToDownload}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Flow Matching sentient-os.ai */}
      <main>
        {/* 1. Cinematic Film Experience */}
        <FilmExperience theme={theme} />

        {/* 2. Under The Hood Architecture Matrix */}
        <UnderTheHood theme={theme} />

        {/* 3. Download CTA & Homebrew Terminal */}
        <DownloadSection theme={theme} />

        {/* 4. Our Thesis & Technical Moat */}
        <TechnicalMoat theme={theme} />

        {/* 5. Frequently Asked Questions */}
        <FAQSection theme={theme} />
      </main>

      {/* 6. Global Footer */}
      <Footer theme={theme} />
    </div>
  );
};

export default App;
