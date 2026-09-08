import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { GithubIcon, AppleIcon } from "./Icons";

interface DownloadSectionProps {
  theme?: "white" | "dark";
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ theme = "white" }) => {
  const [copied, setCopied] = useState(false);
  const brewCommand = "brew install --cask sentient-os-labs/tap/sentient-os";
  const isWhite = theme === "white";

  const handleCopy = () => {
    navigator.clipboard.writeText(brewCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="download"
      className={`scroll-mt-24 sm:scroll-mt-28 relative py-28 sm:py-36 px-6 border-t text-center overflow-hidden select-none transition-colors duration-300 ${
        isWhite
          ? "bg-white text-slate-900 border-slate-200"
          : "bg-black text-white border-white/10"
      }`}
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(129, 140, 248, 0.4) 0%, rgba(244, 114, 182, 0.2) 45%, transparent 75%)",
        }}
      />

      <div className="mx-auto max-w-4xl relative z-10">
        <h2
          className={`font-instrument-serif text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight mb-4 ${
            isWhite ? "text-slate-900" : "text-white"
          }`}
        >
          Make your Mac sentient.
        </h2>
        <p
          className={`font-mono text-xs sm:text-sm font-medium uppercase tracking-[0.2em] mb-10 ${
            isWhite ? "text-slate-500 font-semibold" : "text-white/50"
          }`}
        >
          Free · macOS 15+ · Apple Silicon · 8 GB is enough
        </p>

        {/* Download Button */}
        <div className="relative inline-block group">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-500 opacity-60 group-hover:opacity-85 transition-opacity blur-xl" />
          <a
            href="https://github.com/Sentient-OS-Labs/sentient-os/releases/latest"
            target="_blank"
            rel="noopener noreferrer"
            className={`cursor-pointer relative z-10 inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full font-sans text-base sm:text-lg font-bold shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all ${
              isWhite
                ? "bg-slate-950 text-white hover:bg-slate-900"
                : "bg-white text-black hover:bg-white/95"
            }`}
          >
            <AppleIcon className="size-5 sm:size-6" />
            <span>Download for Apple Silicon</span>
          </a>
        </div>

        {/* Homebrew Terminal Command Box */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div
            className={`flex items-center justify-between px-4 py-3 rounded-2xl backdrop-blur-md shadow-lg border ${
              isWhite
                ? "bg-slate-100/90 border-slate-300/80 text-slate-800"
                : "bg-neutral-900/90 border-white/10 text-white"
            }`}
          >
            <div className="flex items-center gap-3 overflow-x-auto sm:overflow-visible min-w-0 pr-2">
              <span className={`font-mono text-sm select-none shrink-0 ${isWhite ? "text-slate-400" : "text-white/40"}`}>
                $
              </span>
              <code
                className={`font-mono text-xs sm:text-[13.5px] md:text-sm select-all whitespace-nowrap overflow-x-auto scrollbar-none sm:overflow-visible ${
                  isWhite ? "text-indigo-600 font-semibold" : "text-indigo-300"
                }`}
              >
                {brewCommand}
              </code>
            </div>
            <button
              onClick={handleCopy}
              className={`cursor-pointer ml-3 px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 font-mono text-xs shrink-0 ${
                isWhite
                  ? "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border-slate-300"
                  : "bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border-white/10"
              }`}
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-600 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className={`mt-4 flex items-center justify-center gap-6 text-xs font-mono ${isWhite ? "text-slate-500" : "text-white/45"}`}>
            <span>Requires macOS Sequoia (15.0+)</span>
            <span>•</span>
            <a
              href="https://github.com/Sentient-OS-Labs/sentient-os"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors underline flex items-center gap-1"
            >
              <GithubIcon className="size-3" />
              <span>Source Code (Apache 2.0)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
