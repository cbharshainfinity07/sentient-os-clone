import React, { useState, useEffect } from "react";
import { GithubIcon } from "./Icons";
import { Sun, Moon } from "lucide-react";

interface NavbarProps {
  onDownloadClick?: () => void;
  theme?: "white" | "dark";
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onDownloadClick,
  theme = "white",
  onToggleTheme,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isWhite = theme === "white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? isWhite
            ? "bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            : "bg-black/75 backdrop-blur-xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Brand Logo with authentic spinning rainbow conic gradient halo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="film-logo-link group inline-flex items-center gap-2.5 transition-opacity hover:opacity-95 cursor-pointer select-none"
        >
          <div className="film-logo-halo-wrap size-6 sm:size-7">
            {/* Spinning Rainbow Conic Gradient Aura */}
            <div className="film-logo-halo-bg" />
            {/* Center Disk */}
            <div
              className={`relative size-3.5 sm:size-4 rounded-full flex items-center justify-center ${
                isWhite ? "bg-white" : "bg-black"
              }`}
            >
              <span
                className={`film-logo-inner-dot size-1.5 rounded-full ${
                  isWhite ? "bg-indigo-600 shadow-[0_0_6px_rgba(79,70,229,0.8)]" : "bg-white shadow-[0_0_6px_#fff]"
                }`}
              />
            </div>
          </div>
          <span
            className={`whitespace-nowrap font-sans text-sm sm:text-[15px] font-semibold tracking-tight ${
              isWhite ? "text-slate-900" : "text-white"
            }`}
          >
            Sentient OS
          </span>
        </a>

        {/* Right Actions: Theme Toggle, GitHub Icon & Download for macOS */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle (White Mode / Dark Mode) */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              title={isWhite ? "Switch to Dark Mode" : "Switch to White Mode"}
              className={`cursor-pointer flex size-8 sm:size-9 items-center justify-center rounded-full border transition-all shadow-sm ${
                isWhite
                  ? "border-slate-300 bg-white/90 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  : "border-white/20 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
              }`}
            >
              {isWhite ? <Moon className="size-3.5 sm:size-4" /> : <Sun className="size-3.5 sm:size-4 text-amber-300" />}
            </button>
          )}

          {/* GitHub Repository */}
          <a
            href="https://github.com/Sentient-OS-Labs/sentient-os"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className={`hidden min-[400px]:flex size-8 sm:size-9 items-center justify-center rounded-full border transition-all shadow-sm ${
              isWhite
                ? "border-slate-300 bg-white/90 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                : "border-white/20 bg-white/5 text-white/80 hover:bg-white/15 hover:text-white"
            }`}
          >
            <GithubIcon className="size-3.5 sm:size-4" />
          </a>

          {/* Download for macOS with Spinning Rainbow Halo */}
          <div className="glow-halo-wrap">
            {/* Spinning Rainbow Conic Gradient Aura */}
            <div className="glow-halo-bg" />
            <button
              onClick={onDownloadClick}
              className={`relative z-10 cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full font-sans text-[11.5px] sm:text-xs font-semibold shadow-lg transition-transform active:scale-95 whitespace-nowrap ${
                isWhite
                  ? "bg-slate-950 text-white hover:bg-slate-900 shadow-slate-950/20"
                  : "bg-white text-black hover:bg-white/95 shadow-white/20"
              }`}
            >
              <span>Download for macOS</span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
