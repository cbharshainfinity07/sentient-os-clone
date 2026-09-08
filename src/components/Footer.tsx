import React from "react";
import { GithubIcon } from "./Icons";

interface FooterProps {
  theme?: "white" | "dark";
}

export const Footer: React.FC<FooterProps> = ({ theme = "white" }) => {
  const isWhite = theme === "white";

  return (
    <footer
      className={`relative py-16 px-6 border-t select-none text-xs font-mono transition-colors duration-300 ${
        isWhite
          ? "bg-slate-50 border-slate-200 text-slate-500"
          : "bg-black border-white/10 text-white/60"
      }`}
    >
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="size-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
          <span
            className={`font-sans font-bold text-sm ${
              isWhite ? "text-slate-900" : "text-white"
            }`}
          >
            Sentient OS
          </span>
          <span className={isWhite ? "text-slate-400" : "text-white/40"}>
            © {new Date().getFullYear()} Sentient OS Labs
          </span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/Sentient-OS-Labs/sentient-os"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors flex items-center gap-1.5 ${
              isWhite ? "hover:text-slate-900" : "hover:text-white"
            }`}
          >
            <GithubIcon className="size-4" />
            <span>GitHub</span>
          </a>
          <a
            href="#hood"
            className={`transition-colors ${
              isWhite ? "hover:text-slate-900" : "hover:text-white"
            }`}
          >
            Architecture
          </a>
          <a
            href="#download"
            className={`transition-colors ${
              isWhite ? "hover:text-slate-900" : "hover:text-white"
            }`}
          >
            Download
          </a>
          <a
            href="#faq"
            className={`transition-colors ${
              isWhite ? "hover:text-slate-900" : "hover:text-white"
            }`}
          >
            FAQ
          </a>
        </div>
      </div>
    </footer>
  );
};
