import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface UnderTheHoodProps {
  theme?: "white" | "dark";
}

type HoverKey =
  | "sources"
  | "model"
  | "gpt"
  | "codex"
  | "kb"
  | "cards"
  | "sidekick"
  | "ais"
  | "servers"
  | null;

// Node & Frame Layout Dimensions (matching sentient-os.ai)
const U_MAC = { x: 20, y: 64, w: 676, h: 568 };
const U_FRONTIER = { x: 724, y: 64, w: 244, h: 568 };
const U_SERVERS = { x: 996, y: 64, w: 184, h: 568 };

// Top Input Sources
const INPUT_SOURCES = [
  { name: "Files", x: 56, w: 76, tint: "rgba(207,205,214,0.75)", glow: "rgba(207,205,214,0.9)" },
  { name: "WhatsApp", x: 148, w: 100, tint: "rgba(126,217,135,0.7)", glow: "rgba(74,222,128,0.9)" },
  { name: "iMessage", x: 264, w: 96, tint: "rgba(111,176,255,0.7)", glow: "rgba(96,165,250,0.9)" },
  { name: "Email", x: 376, w: 72, tint: "rgba(234,110,100,0.7)", glow: "rgba(248,113,113,0.9)" },
  { name: "…", x: 464, w: 44, tint: "rgba(255,255,255,0.45)", glow: "rgba(255,255,255,0.8)" },
];

// Node boxes coordinates
const BOX_MODEL = { x: 150, y: 208, w: 268, h: 132 };
const BOX_KB = { x: 150, y: 362, w: 260, h: 124 };
const BOX_CARDS = { x: 121, y: 516, w: 258, h: 88 };
const BOX_SIDEKICK = { x: 410, y: 516, w: 240, h: 88 };
const BOX_AIS = { x: 448, y: 362, w: 236, h: 116 };
const BOX_CODEX = { x: 536, y: 220, w: 132, h: 34 };
const BOX_FRONTIER_STACK = { x: 738, y: 138, w: 216, h: 420 };

// SVG Synapse Paths
const PATHS = {
  src: [
    "M 94 132 C 94 180, 170 200, 208 224",
    "M 198 132 C 198 178, 228 196, 242 224",
    "M 312 132 C 312 184, 288 198, 272 224",
    "M 412 132 C 412 190, 330 202, 302 224",
    "M 486 132 C 486 198, 360 208, 320 226",
  ],
  sum: "M 412 246 C 520 240, 620 238, 748 246",
  kbRet: "M 806 288 C 700 330, 520 326, 330 366",
  kbCards: "M 214 486 C 210 498, 206 506, 202 518",
  kbSide: "M 356 486 C 400 498, 440 504, 470 518",
  kbAis: "M 404 420 C 418 420, 428 420, 454 420",
};

// Explanations for each hovered node
const EXPLANATIONS: Record<string, { line: string; mono: string }> = {
  sources: {
    line: "It starts with what's already yours.",
    mono: "Files · WhatsApp · iMessage · Email · and more",
  },
  model: {
    line: "Your Mac reads your life. Raw files never leave it.",
    mono: "It runs overnight, even with the lid shut.",
  },
  gpt: {
    line: "Frontier model used for 10% of the compute for Proactive Intelligence and Sidekick.",
    mono: "PII-stripped summaries only · your sub or your endpoint",
  },
  codex: {
    line: "Sentient runs cloud compute through your own ChatGPT Codex CLI.",
    mono: "In the background · set up for you, automatically",
  },
  kb: {
    line: "The world's best LLM-created knowledge base. Not RAG.",
    mono: "An Obsidian-style vault of real markdown · created on your Mac · yours to edit",
  },
  cards: {
    line: "By morning, the work is already prepared.",
    mono: "Flagged on-device · verified by the frontier model · fires only when you tap",
  },
  sidekick: {
    line: "Sidekick acts with your whole life in context.",
    mono: "Your apps, your logins · clicks in the background; keep using your computer",
  },
  ais: {
    line: "Your other AIs can finally know you.",
    mono: "Off by default · your knowledge base over MCP · zero-access encrypted",
  },
  servers: {
    line: "And this is everything we ever see.",
    mono: "No accounts · no data at rest",
  },
};

const TEASE_TEXT = "HOVER ANYWHERE TO LEARN MORE";

// Star Constellation coordinates for Knowledge Base
const KB_STARS = [
  { x: 18, y: 9, color: "#f5dfb0" },
  { x: 52, y: 20, color: "#cbc3f5" },
  { x: 88, y: 6, color: "#bcd6f7" },
  { x: 120, y: 23, color: "#c9e8cd" },
  { x: 152, y: 11, color: "#f3c3d4" },
  { x: 182, y: 26, color: "#f5dfb0" },
  { x: 206, y: 9, color: "#cbc3f5" },
  { x: 36, y: 33, color: "#bcd6f7" },
  { x: 138, y: 38, color: "#c9e8cd" },
];

const KB_EDGES = [
  [0, 1],
  [1, 3],
  [2, 3],
  [3, 4],
  [4, 6],
  [1, 7],
  [3, 8],
];

// Moving Synapse Particle along CSS offsetPath
const FlowParticle: React.FC<{
  d: string;
  dur: number;
  delay: number;
  tint: string;
  size?: number;
}> = ({ d, dur, delay, tint, size = 5 }) => {
  return (
    <span
      aria-hidden={true}
      className="pointer-events-none absolute rounded-full"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: tint,
        boxShadow: `0 0 ${size * 2}px ${tint}, 0 0 ${size * 4}px ${tint}`,
        offsetPath: `path('${d}')`,
        offsetRotate: "0deg",
        animation: `arch-flow ${dur}s linear ${delay}s infinite`,
        opacity: 0,
      }}
    />
  );
};

export const UnderTheHood: React.FC<UnderTheHoodProps> = ({ theme = "white" }) => {
  const isWhite = theme === "white";
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [hovered, setHovered] = useState<HoverKey>(null);
  const [mcpModalOpen, setMcpModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1240) {
        setScale(1);
      } else if (w >= 840) {
        setScale((w - 48) / 1200);
      } else {
        setScale(Math.max(0.38, (w - 32) / 1200));
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hoverHandlers = (key: HoverKey) => ({
    "data-hover": key,
    onMouseEnter: () => setHovered(key),
    onMouseLeave: () => setHovered(null),
    onClick: () => setHovered((prev) => (prev === key ? null : key)),
  });

  return (
    <section
      id="hood"
      aria-label="How Sentient works — the architecture"
      className={`scroll-mt-24 sm:scroll-mt-28 relative min-h-screen select-none overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32 transition-colors duration-500 ${
        isWhite ? "bg-[#fafafa] text-slate-900" : "bg-black text-white"
      }`}
    >
      {/* Inline styles for Neural Network Keyframe animations */}
      <style>{`
        @keyframes arch-flow {
          0% {
            offset-distance: 0%;
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            offset-distance: 100%;
            opacity: 0;
          }
        }
        @keyframes arch-orb-spin {
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes arch-tease-breathe {
          0%, 100% {
            opacity: 0.45;
          }
          50% {
            opacity: 1;
          }
        }
        .arch-tease-glow {
          animation: 3.2s ease-in-out infinite arch-tease-breathe;
        }
      `}</style>

      {/* Ambient Radial Aura */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-0"
        style={{
          background: isWhite
            ? "radial-gradient(circle at 50% 12%, rgba(139,92,246,0.07) 0%, rgba(236,72,153,0.04) 35%, rgba(59,130,246,0.02) 65%, transparent 75%)"
            : "radial-gradient(circle at 50% 12%, rgba(139,92,246,0.08) 0%, rgba(90,140,220,0.02) 45%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto flex flex-col items-center px-4">
        {/* Section Heading */}
        <h2
          className={`font-instrument-serif text-3xl sm:text-5xl md:text-6xl text-center tracking-tight mb-3 ${
            isWhite ? "text-slate-900" : "text-white"
          }`}
        >
          Under the hood.
        </h2>
        <p
          className={`max-w-2xl text-center font-sans text-xs sm:text-sm mb-12 px-4 leading-relaxed ${
            isWhite ? "text-slate-600" : "text-white/50"
          }`}
        >
          The whole architecture in one sentence: your Mac does about 90% of the compute, and your frontier model does the rest. Our servers do nothing.
        </p>

        {/* ============================================================ */}
        {/* RESPONSIVE SCALED 1200px ARCHITECTURE DIAGRAM MATRIX */}
        {/* ============================================================ */}
        <div
          ref={containerRef}
          className="relative flex items-center justify-center overflow-x-auto max-w-full pb-4 scrollbar-none"
          style={{
            width: `${1200 * scale}px`,
            height: `${640 * scale}px`,
          }}
        >
          <div
            className="absolute left-0 top-0 origin-top-left"
            style={{
              width: "1200px",
              height: "640px",
              transform: `scale(${scale})`,
            }}
          >
            {/* -------------------------------------------------------- */}
            {/* COLUMN OUTLINES & HEADERS */}
            {/* -------------------------------------------------------- */}

            {/* 1. YOUR MAC Column */}
            <div
              className="absolute"
              style={{
                left: `${U_MAC.x}px`,
                top: `${U_MAC.y}px`,
                width: `${U_MAC.w}px`,
                height: `${U_MAC.h}px`,
              }}
            >
              <div className="absolute inset-x-0 bottom-full pb-3 text-center pointer-events-none">
                <p
                  className={`whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.22em] font-semibold ${
                    isWhite ? "text-slate-800" : "text-white/70"
                  }`}
                >
                  Your Mac
                </p>
                <p
                  className={`mt-1 font-mono text-[10px] uppercase tracking-[0.08em] ${
                    isWhite ? "text-slate-500" : "text-white/45"
                  }`}
                >
                  Sentient runs every night at 3 AM, as long as it's open in your menu bar &amp; your Mac's plugged in
                </p>
              </div>
              <div
                className={`absolute inset-0 rounded-2xl border transition-colors ${
                  isWhite
                    ? "border-slate-300/80 bg-white/70 shadow-sm"
                    : "border-white/[0.12] bg-white/[0.015]"
                }`}
              />
            </div>

            {/* 2. YOUR FRONTIER MODEL Column */}
            <div
              className="absolute"
              style={{
                left: `${U_FRONTIER.x}px`,
                top: `${U_FRONTIER.y}px`,
                width: `${U_FRONTIER.w}px`,
                height: `${U_FRONTIER.h}px`,
              }}
            >
              <div className="absolute inset-x-0 bottom-full pb-3 text-center pointer-events-none">
                <p
                  className={`whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.22em] font-semibold ${
                    isWhite ? "text-slate-800" : "text-white/70"
                  }`}
                >
                  Your Frontier Model
                </p>
                <p
                  className={`mt-1 font-mono text-[10px] uppercase tracking-[0.08em] ${
                    isWhite ? "text-slate-500" : "text-white/45"
                  }`}
                >
                  frontier compute · your choice
                </p>
              </div>
              <div
                className={`absolute inset-0 rounded-2xl border transition-colors ${
                  isWhite
                    ? "border-slate-300/80 bg-white/70 shadow-sm"
                    : "border-white/[0.12] bg-white/[0.015]"
                }`}
              />
            </div>

            {/* 3. SENTIENT'S SERVERS Column */}
            <div
              className="absolute"
              style={{
                left: `${U_SERVERS.x}px`,
                top: `${U_SERVERS.y}px`,
                width: `${U_SERVERS.w}px`,
                height: `${U_SERVERS.h}px`,
              }}
            >
              <div className="absolute inset-x-0 bottom-full pb-3 text-center pointer-events-none">
                <p
                  className={`whitespace-nowrap font-mono text-[12px] uppercase tracking-[0.22em] font-semibold ${
                    isWhite ? "text-slate-800" : "text-white/70"
                  }`}
                >
                  Sentient's servers
                </p>
                <p
                  className={`mt-1 font-mono text-[10px] uppercase tracking-[0.08em] ${
                    isWhite ? "text-slate-500" : "text-white/45"
                  }`}
                >
                  everything we run
                </p>
              </div>
              <div
                className={`absolute inset-0 rounded-2xl border transition-colors ${
                  isWhite
                    ? "border-slate-300/80 bg-white/70 shadow-sm"
                    : "border-white/[0.12] bg-white/[0.015]"
                }`}
              />
            </div>

            {/* -------------------------------------------------------- */}
            {/* SVG SYNAPSE WIRES */}
            {/* -------------------------------------------------------- */}
            <svg
              aria-hidden={true}
              className="pointer-events-none absolute inset-0 size-full"
              viewBox="0 0 1200 640"
              fill="none"
            >
              {/* Top Source to On-device model paths */}
              {PATHS.src.map((d, i) => (
                <path
                  key={i}
                  d={d}
                  stroke={isWhite ? "rgba(100, 116, 139, 0.35)" : "rgba(255, 255, 255, 0.18)"}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ))}
              {/* Summary wire from On-device model to Frontier model */}
              <path
                d={PATHS.sum}
                stroke={isWhite ? "rgba(100, 116, 139, 0.35)" : "rgba(255, 255, 255, 0.18)"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Knowledge base return wire */}
              <path
                d={PATHS.kbRet}
                stroke={isWhite ? "rgba(100, 116, 139, 0.35)" : "rgba(255, 255, 255, 0.18)"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* KB to Morning cards */}
              <path
                d={PATHS.kbCards}
                stroke={isWhite ? "rgba(100, 116, 139, 0.35)" : "rgba(255, 255, 255, 0.18)"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* KB to Sidekick */}
              <path
                d={PATHS.kbSide}
                stroke={isWhite ? "rgba(100, 116, 139, 0.35)" : "rgba(255, 255, 255, 0.18)"}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Dotted wire to ChatGPT & Claude */}
              <path
                d={PATHS.kbAis}
                stroke={isWhite ? "rgba(100, 116, 139, 0.5)" : "rgba(255, 255, 255, 0.32)"}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="0.1 5"
              />
            </svg>

            {/* -------------------------------------------------------- */}
            {/* LIVE MOVING NEURAL NETWORK PARTICLES (offsetPath) */}
            {/* -------------------------------------------------------- */}
            {/* 1. 5 Input source wires (Files, WhatsApp, iMessage, Email, …) -> On-device model */}
            {INPUT_SOURCES.map((source, idx) => (
              <span key={source.name}>
                <FlowParticle
                  d={PATHS.src[idx]}
                  dur={2.5}
                  delay={0.5 * idx}
                  tint={source.glow}
                  size={4.5}
                />
                <FlowParticle
                  d={PATHS.src[idx]}
                  dur={2.5}
                  delay={0.5 * idx + 0.85}
                  tint={source.tint}
                  size={3.5}
                />
                <FlowParticle
                  d={PATHS.src[idx]}
                  dur={2.5}
                  delay={0.5 * idx + 1.4}
                  tint={source.glow}
                  size={4}
                />
              </span>
            ))}

            {/* 2. On-device model -> Frontier model Summary Wire */}
            {[0, 3.5].map((delay) => (
              <FlowParticle
                key={delay}
                d={PATHS.sum}
                dur={7}
                delay={delay}
                tint={isWhite ? "rgba(99, 102, 241, 0.85)" : "rgba(255, 255, 255, 0.75)"}
                size={4.5}
              />
            ))}

            {/* 3. Frontier model -> Knowledge Base Return Wire */}
            {[0, 3.3, 6.7].map((delay) => (
              <FlowParticle
                key={delay}
                d={PATHS.kbRet}
                dur={10}
                delay={delay}
                tint={isWhite ? "rgba(168, 85, 247, 0.85)" : "rgba(142, 166, 255, 0.8)"}
                size={4.5}
              />
            ))}

            {/* 4. KB -> Morning Cards */}
            {[0, 2.2].map((delay) => (
              <FlowParticle
                key={delay}
                d={PATHS.kbCards}
                dur={4.5}
                delay={delay}
                tint="rgba(249, 115, 22, 0.85)"
                size={4}
              />
            ))}

            {/* 5. KB -> Sidekick */}
            {[0, 2.2].map((delay) => (
              <FlowParticle
                key={delay}
                d={PATHS.kbSide}
                dur={4.5}
                delay={delay}
                tint="rgba(236, 72, 153, 0.85)"
                size={4}
              />
            ))}

            {/* -------------------------------------------------------- */}
            {/* DIAGRAM NODES */}
            {/* -------------------------------------------------------- */}

            {/* TOP DATA INGESTION PILLS */}
            <div
              className="absolute cursor-pointer"
              style={{ left: "44px", top: "96px", width: "478px", height: "56px" }}
              {...hoverHandlers("sources")}
            >
              {INPUT_SOURCES.map((item) => (
                <div
                  key={item.name}
                  className={`absolute flex items-center justify-center rounded-full border shadow-sm transition-all duration-200 ${
                    hovered === "sources"
                      ? "scale-105 border-indigo-400/60"
                      : isWhite
                      ? "border-slate-200 bg-white"
                      : "border-white/10 bg-[#0f0f11]"
                  }`}
                  style={{
                    left: `${item.x - 44}px`,
                    top: "12px",
                    width: `${item.w}px`,
                    height: "32px",
                  }}
                >
                  <span
                    className={`text-[12px] font-medium ${
                      item.name === "…"
                        ? isWhite
                          ? "text-slate-400"
                          : "text-white/45"
                        : isWhite
                        ? "text-slate-800"
                        : "text-white/80"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>
              ))}
            </div>

            {/* 1. ON-DEVICE MODEL BOX */}
            <div
              className={`absolute rounded-xl px-4 py-3 border transition-all duration-200 cursor-pointer ${
                hovered === "model"
                  ? "border-indigo-400/80 shadow-[0_0_40px_rgba(139,92,246,0.3)] scale-[1.01]"
                  : isWhite
                  ? "border-slate-200/90 bg-white shadow-md hover:border-slate-400/60"
                  : "border-white/10 bg-[#0c0c0f] shadow-[0_0_34px_rgba(155,120,220,0.14)] hover:border-white/[0.28]"
              }`}
              style={{
                left: `${BOX_MODEL.x}px`,
                top: `${BOX_MODEL.y}px`,
                width: `${BOX_MODEL.w}px`,
                height: `${BOX_MODEL.h}px`,
              }}
              {...hoverHandlers("model")}
            >
              <div className="flex items-center gap-3">
                <span className="relative inline-block shrink-0 size-6">
                  <span
                    className="absolute -inset-[3px] rounded-full blur-[6px] opacity-60"
                    style={{
                      background:
                        "conic-gradient(#fde2a3, #ff8e3c, #e8388f, #6c5ce5, #4a90e2, #fde2a3)",
                      animation: "arch-orb-spin 9s linear infinite",
                    }}
                  />
                  <span
                    className={`absolute inset-0 rounded-full border-[1.6px] ${
                      isWhite ? "border-slate-900/80" : "border-white/90"
                    }`}
                  />
                  <span
                    className={`absolute left-1/2 top-1/2 size-2 rounded-full -translate-x-1/2 -translate-y-1/2 ${
                      isWhite ? "bg-slate-900" : "bg-white"
                    }`}
                  />
                </span>
                <div>
                  <p
                    className={`text-[13.5px] font-semibold ${
                      isWhite ? "text-slate-900" : "text-white"
                    }`}
                  >
                    On-device model
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                      isWhite ? "text-slate-500 font-medium" : "text-white/45"
                    }`}
                  >
                    GEMMA 4 E4B · ON YOUR SILICON
                  </p>
                </div>
              </div>
              <div
                className={`mt-3 border-t pt-2.5 font-mono text-[9px] uppercase leading-[1.8] tracking-[0.12em] ${
                  isWhite
                    ? "border-slate-200 text-slate-600"
                    : "border-white/[0.06] text-white/45"
                }`}
              >
                · summarizes &amp; understands your life
                <br />
                · filters out junk &amp; sensitive data
                <br />· runs{" "}
                <span className={isWhite ? "text-slate-900 font-bold" : "text-white/80 font-bold"}>
                  90% of sentient's compute
                </span>
              </div>
            </div>

            {/* 2. YOUR CODEX CLI PILL */}
            <div
              className={`absolute flex items-center justify-center rounded-full border transition-all duration-200 cursor-pointer ${
                hovered === "codex"
                  ? "border-indigo-400/80 scale-105"
                  : isWhite
                  ? "border-slate-300 bg-white hover:border-slate-400"
                  : "border-white/12 bg-[#0c0c0f] hover:border-white/25"
              }`}
              style={{
                left: `${BOX_CODEX.x}px`,
                top: `${BOX_CODEX.y}px`,
                width: `${BOX_CODEX.w}px`,
                height: `${BOX_CODEX.h}px`,
              }}
              {...hoverHandlers("codex")}
            >
              <span
                className={`font-mono text-[10px] font-medium ${
                  isWhite ? "text-slate-800" : "text-white/80"
                }`}
              >
                your codex cli
              </span>
            </div>
            <p
              className={`absolute text-center font-mono text-[8.5px] uppercase tracking-[0.14em] ${
                isWhite ? "text-slate-400" : "text-white/30"
              }`}
              style={{ left: `${BOX_CODEX.x - 10}px`, top: `${BOX_CODEX.y + 38}px`, width: "152px" }}
            >
              sentient sets it up
            </p>

            {/* 3. YOUR KNOWLEDGE BASE (Obsidian Vault + Mini Constellation) */}
            <div
              className={`absolute rounded-xl px-4 py-3 border transition-all duration-200 cursor-pointer ${
                hovered === "kb"
                  ? "border-indigo-400/80 shadow-[0_0_34px_rgba(139,92,246,0.25)] scale-[1.01]"
                  : isWhite
                  ? "border-slate-200/90 bg-white shadow-md hover:border-slate-400/60"
                  : "border-white/10 bg-[#0c0c0f] hover:border-white/[0.28]"
              }`}
              style={{
                left: `${BOX_KB.x}px`,
                top: `${BOX_KB.y}px`,
                width: `${BOX_KB.w}px`,
                height: `${BOX_KB.h}px`,
              }}
              {...hoverHandlers("kb")}
            >
              <p
                className={`text-[13.5px] font-semibold ${
                  isWhite ? "text-slate-900" : "text-white"
                }`}
              >
                Your knowledge base
              </p>
              <p
                className={`mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                  isWhite ? "text-slate-500 font-medium" : "text-white/45"
                }`}
              >
                PLAIN MARKDOWN · YOURS TO EDIT
              </p>
              {/* Mini Constellation */}
              <svg
                aria-hidden={true}
                className="mt-2"
                width="218"
                height="46"
                viewBox="0 0 218 46"
                fill="none"
              >
                {KB_EDGES.map(([fromIdx, toIdx], i) => (
                  <line
                    key={i}
                    x1={KB_STARS[fromIdx].x}
                    y1={KB_STARS[fromIdx].y}
                    x2={KB_STARS[toIdx].x}
                    y2={KB_STARS[toIdx].y}
                    stroke={isWhite ? "rgba(99, 102, 241, 0.35)" : "rgba(142,166,255,0.22)"}
                    strokeWidth="1"
                  />
                ))}
                {KB_STARS.map((s, i) => (
                  <circle
                    key={i}
                    cx={s.x}
                    cy={s.y}
                    r={i % 3 === 0 ? 2.6 : 1.8}
                    fill={s.color}
                    opacity={0.9}
                  />
                ))}
              </svg>
            </div>

            {/* 4. YOUR CHATGPT & CLAUDE BOX */}
            <div
              className={`absolute rounded-xl px-4 py-3 border-[1.5px] border-dotted transition-all duration-200 cursor-pointer ${
                hovered === "ais"
                  ? "border-indigo-400/80 shadow-[0_0_34px_rgba(139,92,246,0.25)] scale-[1.01]"
                  : isWhite
                  ? "border-slate-300 bg-white/90 shadow-md hover:border-slate-500"
                  : "border-white/25 bg-[#0c0c0f] hover:border-white/[0.4]"
              }`}
              style={{
                left: `${BOX_AIS.x}px`,
                top: `${BOX_AIS.y}px`,
                width: `${BOX_AIS.w}px`,
                height: `${BOX_AIS.h}px`,
              }}
              {...hoverHandlers("ais")}
            >
              <p
                className={`text-[13.5px] font-semibold ${
                  isWhite ? "text-slate-900" : "text-white"
                }`}
              >
                Your ChatGPT &amp; Claude
              </p>
              <p
                className={`mt-1 font-mono text-[9px] uppercase leading-[1.8] tracking-[0.12em] ${
                  isWhite ? "text-slate-500 font-medium" : "text-white/45"
                }`}
              >
                · can read your knowledge base
                <br />· only if you turn it on
              </p>
              <div className="absolute inset-x-4 bottom-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* OpenAI Icon */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isWhite ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.78)"}
                  >
                    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zM13.2599 22.4a4.4755 4.4755 0 0 1-2.8764-1.04l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.0615v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464z" />
                  </svg>
                  {/* Anthropic Starburst Icon */}
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill={isWhite ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.78)"}
                  >
                    <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMcpModalOpen(true);
                  }}
                  className={`cursor-pointer rounded-full border px-3 py-[3px] text-[11px] font-medium transition-colors ${
                    isWhite
                      ? "border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800"
                      : "border-white/15 bg-white/[0.04] text-white/85 hover:bg-white/[0.12]"
                  }`}
                >
                  Read More
                </button>
              </div>
            </div>

            {/* 5. MORNING CARDS BOX */}
            <div
              className={`absolute rounded-xl px-4 py-3 border transition-all duration-200 cursor-pointer ${
                hovered === "cards"
                  ? "border-orange-400/80 shadow-[0_0_34px_rgba(249,115,22,0.25)] scale-[1.01]"
                  : isWhite
                  ? "border-slate-200/90 bg-white shadow-md hover:border-slate-400/60"
                  : "border-white/10 bg-[#0c0c0f] hover:border-white/[0.28]"
              }`}
              style={{
                left: `${BOX_CARDS.x}px`,
                top: `${BOX_CARDS.y}px`,
                width: `${BOX_CARDS.w}px`,
                height: `${BOX_CARDS.h}px`,
              }}
              {...hoverHandlers("cards")}
            >
              <div className="flex items-center gap-3">
                <span className="relative block h-[34px] w-[46px] shrink-0">
                  <span
                    className="absolute left-0 top-0 h-[26px] w-[38px] rounded-[5px] border bg-[#101013]"
                    style={{ borderColor: "rgba(255,128,46,0.6)", transform: "rotate(-4deg)" }}
                  >
                    <span
                      className="absolute left-[5px] top-[5px] h-[2px] w-[14px] rounded-full"
                      style={{ background: "rgba(255,128,46,0.9)" }}
                    />
                    <span className="absolute left-[5px] top-[11px] h-[2px] w-[24px] rounded-full bg-white/30" />
                    <span className="absolute left-[5px] top-[16px] h-[2px] w-[18px] rounded-full bg-white/20" />
                  </span>
                  <span
                    className="absolute bottom-0 right-0 h-[26px] w-[38px] rounded-[5px] border bg-[#101013]"
                    style={{ borderColor: "rgba(74,222,128,0.5)", transform: "rotate(3deg)" }}
                  >
                    <span
                      className="absolute left-[5px] top-[5px] h-[2px] w-[14px] rounded-full"
                      style={{ background: "rgba(74,222,128,0.9)" }}
                    />
                    <span className="absolute left-[5px] top-[11px] h-[2px] w-[24px] rounded-full bg-white/30" />
                    <span className="absolute left-[5px] top-[16px] h-[2px] w-[18px] rounded-full bg-white/20" />
                  </span>
                </span>
                <div>
                  <p
                    className={`text-[13.5px] font-semibold ${
                      isWhite ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Morning cards
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-[9px] uppercase leading-[1.8] tracking-[0.12em] ${
                      isWhite ? "text-slate-500 font-medium" : "text-white/45"
                    }`}
                  >
                    · prepared overnight
                    <br />· fires only when you tap
                  </p>
                </div>
              </div>
            </div>

            {/* 6. SIDEKICK BOX */}
            <div
              className={`absolute rounded-xl px-4 py-3 border transition-all duration-200 cursor-pointer ${
                hovered === "sidekick"
                  ? "border-pink-400/80 shadow-[0_0_34px_rgba(236,72,153,0.25)] scale-[1.01]"
                  : isWhite
                  ? "border-slate-200/90 bg-white shadow-md hover:border-slate-400/60"
                  : "border-white/10 bg-[#0c0c0f] hover:border-white/[0.28]"
              }`}
              style={{
                left: `${BOX_SIDEKICK.x}px`,
                top: `${BOX_SIDEKICK.y}px`,
                width: `${BOX_SIDEKICK.w}px`,
                height: `${BOX_SIDEKICK.h}px`,
              }}
              {...hoverHandlers("sidekick")}
            >
              <div className="flex items-center gap-3">
                <svg
                  aria-hidden={true}
                  className="shrink-0"
                  width="46"
                  height="30"
                  viewBox="0 0 46 30"
                  fill="none"
                >
                  <defs>
                    <linearGradient id="arch-notch-rim" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0" stopColor="#fde2a3" stopOpacity="0.75" />
                      <stop offset="0.5" stopColor="#e8388f" stopOpacity="0.75" />
                      <stop offset="1" stopColor="#6c5ce5" stopOpacity="0.75" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M1 10 H45"
                    stroke={isWhite ? "rgba(15,23,42,0.3)" : "rgba(255,255,255,0.28)"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 10 v5 a3.5 3.5 0 0 0 3.5 3.5 h15 a3.5 3.5 0 0 0 3.5 -3.5 V10"
                    fill="#000"
                    stroke="url(#arch-notch-rim)"
                    strokeWidth="1.2"
                  />
                </svg>
                <div>
                  <p
                    className={`text-[13.5px] font-semibold ${
                      isWhite ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Sidekick
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-[9px] uppercase leading-[1.8] tracking-[0.12em] ${
                      isWhite ? "text-slate-500 font-medium" : "text-white/45"
                    }`}
                  >
                    · computer use
                    <br />· any app, any window
                  </p>
                </div>
              </div>
            </div>

            {/* 7. MIDDLE COLUMN: YOUR FRONTIER MODEL STACK */}
            <div
              className={`absolute rounded-xl px-4 py-3 border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                hovered === "gpt"
                  ? "border-indigo-400/80 shadow-[0_0_34px_rgba(139,92,246,0.25)] scale-[1.01]"
                  : isWhite
                  ? "border-slate-200/90 bg-white shadow-md hover:border-slate-400/60"
                  : "border-white/10 bg-[#0c0c0f] hover:border-white/[0.28]"
              }`}
              style={{
                left: `${BOX_FRONTIER_STACK.x}px`,
                top: `${BOX_FRONTIER_STACK.y}px`,
                width: `${BOX_FRONTIER_STACK.w}px`,
                height: `${BOX_FRONTIER_STACK.h}px`,
              }}
              {...hoverHandlers("gpt")}
            >
              {/* 1. ChatGPT Plus */}
              <div className="flex items-center gap-3">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill={isWhite ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.78)"}
                  className="shrink-0"
                >
                  <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.073zM13.2599 22.4a4.4755 4.4755 0 0 1-2.8764-1.04l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.0615v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464z" />
                </svg>
                <div>
                  <p
                    className={`text-[13.5px] font-semibold leading-tight ${
                      isWhite ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Your ChatGPT Plus subscription
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                      isWhite ? "text-slate-500 font-medium" : "text-white/45"
                    }`}
                  >
                    GPT-5.0 SOL
                  </p>
                </div>
              </div>

              <p
                className={`self-center font-mono text-[10px] uppercase tracking-[0.22em] ${
                  isWhite ? "text-slate-400" : "text-white/35"
                }`}
              >
                or
              </p>

              {/* 2. Claude */}
              <div className="flex items-center gap-3">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill={isWhite ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.78)"}
                  className="shrink-0"
                >
                  <path d="M4.709 15.955l4.72-2.647.08-.23-.08-.128H9.2l-.79-.048-2.698-.073-2.339-.097-2.266-.122-.571-.121L0 11.784l.055-.352.48-.321.686.06 1.52.103 2.278.158 1.652.097 2.449.255h.389l.055-.157-.134-.098-.103-.097-2.358-1.596-2.552-1.688-1.336-.972-.724-.491-.364-.462-.158-1.008.656-.722.881.06.225.061.893.686 1.908 1.476 2.491 1.833.365.304.145-.103.019-.073-.164-.274-1.355-2.446-1.446-2.49-.644-1.032-.17-.619a2.97 2.97 0 01-.104-.729L6.283.134 6.696 0l.996.134.42.364.62 1.414 1.002 2.229 1.555 3.03.456.898.243.832.091.255h.158V9.01l.128-1.706.237-2.095.23-2.695.08-.76.376-.91.747-.492.584.28.48.685-.067.444-.286 1.851-.559 2.903-.364 1.942h.212l.243-.242.985-1.306 1.652-2.064.73-.82.85-.904.547-.431h1.033l.76 1.129-.34 1.166-1.064 1.347-.881 1.142-1.264 1.7-.79 1.36.073.11.188-.02 2.856-.606 1.543-.28 1.841-.315.833.388.091.395-.328.807-1.969.486-2.309.462-3.439.813-.042.03.049.061 1.549.146.662.036h1.622l3.02.225.79.522.474.638-.079.485-1.215.62-1.64-.389-3.829-.91-1.312-.329h-.182v.11l1.093 1.068 2.006 1.81 2.509 2.33.127.578-.322.455-.34-.049-2.205-1.657-.851-.747-1.926-1.62h-.128v.17l.444.649 2.345 3.521.122 1.08-.17.353-.608.213-.668-.122-1.374-1.925-1.415-2.167-1.143-1.943-.14.08-.674 7.254-.316.37-.729.28-.607-.461-.322-.747.322-1.476.389-1.924.315-1.53.286-1.9.17-.632-.012-.042-.14.018-1.434 1.967-2.18 2.945-1.726 1.845-.414.164-.717-.37.067-.662.401-.589 2.388-3.036 1.44-1.882.93-1.086-.006-.158h-.055L4.132 18.56l-1.13.146-.487-.456.061-.746.231-.243 1.908-1.312-.006.006z" />
                </svg>
                <div>
                  <p
                    className={`text-[13.5px] font-semibold leading-tight ${
                      isWhite ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Your Claude subscription
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                      isWhite ? "text-slate-500 font-medium" : "text-white/45"
                    }`}
                  >
                    CLAUDE MODELS
                  </p>
                </div>
              </div>

              <p
                className={`self-center font-mono text-[10px] uppercase tracking-[0.22em] ${
                  isWhite ? "text-slate-400" : "text-white/35"
                }`}
              >
                or
              </p>

              {/* 3. OpenRouter */}
              <div className="flex items-center gap-3">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill={isWhite ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.78)"}
                  className="shrink-0"
                >
                  <path d="M16.778 1.844v1.919q-.569-.026-1.138-.032-.708-.008-1.415.037c-1.93.126-4.023.728-6.149 2.237-2.911 2.066-2.731 1.95-4.14 2.75-.396.223-1.342.574-2.185.798-.841.225-1.753.333-1.751.333v4.229s.768.108 1.61.333c.842.224 1.789.575 2.185.799 1.41.798 1.228.683 4.14 2.75 2.126 1.509 4.22 2.11 6.148 2.236.88.058 1.716.041 2.555.005v1.918l7.222-4.168-7.222-4.17v2.176c-.86.038-1.611.065-2.278.021-1.364-.09-2.417-.357-3.979-1.465-2.244-1.593-2.866-2.027-3.68-2.508.889-.518 1.449-.906 3.822-2.59 1.56-1.109 2.614-1.377 3.978-1.466.667-.044 1.418-.017 2.278.02v2.176L24 6.014Z" />
                </svg>
                <div>
                  <p
                    className={`text-[13.5px] font-semibold leading-tight ${
                      isWhite ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Your OpenRouter model
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                      isWhite ? "text-slate-500 font-medium" : "text-white/45"
                    }`}
                  >
                    ANY FRONTIER MODEL
                  </p>
                </div>
              </div>

              <p
                className={`self-center font-mono text-[10px] uppercase tracking-[0.22em] ${
                  isWhite ? "text-slate-400" : "text-white/35"
                }`}
              >
                or
              </p>

              {/* 4. LM Studio */}
              <div className="flex items-center gap-3">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill={isWhite ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.78)"}
                  className="shrink-0"
                >
                  <path d="M5.6 0A5.6 5.6 0 0 0 0 5.6v12.8A5.6 5.6 0 0 0 5.6 24h12.8a5.6 5.6 0 0 0 5.6-5.6V5.6A5.6 5.6 0 0 0 18.4 0zm0 2h12.8A3.6 3.6 0 0 1 22 5.6v12.8a3.6 3.6 0 0 1-3.6 3.6H5.6A3.6 3.6 0 0 1 2 18.4V5.6A3.6 3.6 0 0 1 5.6 2m-.4 2.8a1.2 1.2 0 0 0 0 2.4h10.4a1.2 1.2 0 0 0 0-2.4zm3.2 4a1.2 1.2 0 0 0 0 2.4h10.4a1.2 1.2 0 0 0 0-2.4zm-3.2 4a1.2 1.2 0 0 0 0 2.4h10.4a1.2 1.2 0 0 0 0-2.4zm3.2 4a1.2 1.2 0 0 0 0 2.4h10.4a1.2 1.2 0 0 0 0-2.4z" />
                </svg>
                <div>
                  <p
                    className={`text-[13.5px] font-semibold leading-tight ${
                      isWhite ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Your LM Studio model
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                      isWhite ? "text-slate-500 font-medium" : "text-white/45"
                    }`}
                  >
                    RUNS ON YOUR MAC
                  </p>
                </div>
              </div>

              <p
                className={`self-center font-mono text-[10px] uppercase tracking-[0.22em] ${
                  isWhite ? "text-slate-400" : "text-white/35"
                }`}
              >
                or
              </p>

              {/* 5. Custom Frontier Endpoint */}
              <div className="flex items-center gap-3">
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill={isWhite ? "rgba(15,23,42,0.8)" : "rgba(255,255,255,0.78)"}
                  className="shrink-0"
                >
                  <path d="M10 3 C11 8.2 13.8 11 19 12 C13.8 13 11 15.8 10 21 C9 15.8 6.2 13 1 12 C6.2 11 9 8.2 10 3 Z" />
                  <path d="M18.5 2.5 C18.9 4.8 20.2 6.1 22.5 6.5 C20.2 6.9 18.9 8.2 18.5 10.5 C18.1 8.2 16.8 6.9 14.5 6.5 C16.8 6.1 18.1 4.8 18.5 2.5 Z" />
                </svg>
                <div>
                  <p
                    className={`text-[13.5px] font-semibold leading-tight ${
                      isWhite ? "text-slate-900" : "text-white"
                    }`}
                  >
                    Your frontier model
                  </p>
                  <p
                    className={`mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${
                      isWhite ? "text-slate-500 font-medium" : "text-white/45"
                    }`}
                  >
                    YOUR OWN ENDPOINT
                  </p>
                </div>
              </div>
            </div>

            {/* 8. RIGHT COLUMN: SENTIENT'S SERVERS */}
            <div
              className="absolute text-center cursor-pointer"
              style={{ left: "1010px", top: "240px", width: "156px" }}
              {...hoverHandlers("servers")}
            >
              <p
                className={`font-instrument-serif text-xl italic ${
                  isWhite ? "text-slate-900" : "text-white/90"
                }`}
              >
                There's nothing here.
              </p>
              <div
                className={`mt-3 font-mono text-[9px] uppercase leading-relaxed tracking-[0.14em] ${
                  isWhite ? "text-slate-500 font-semibold" : "text-white/40"
                }`}
              >
                <p>NO ACCOUNTS</p>
                <p>
                  {hovered === "ais" ? (
                    <span className="text-emerald-500 font-bold">NO READABLE USER DATA</span>
                  ) : (
                    "NO USER DATA"
                  )}
                </p>
              </div>
            </div>

            {/* Zero-Access Encrypted pill on Sentient's Servers */}
            <motion.div
              className="absolute text-center pointer-events-none"
              style={{ left: "1018px", top: "402px", width: "140px" }}
              initial={false}
              animate={hovered === "ais" ? { opacity: 1, y: 0, scale: 1.05 } : { opacity: 0.8, y: 0, scale: 1 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className={`flex h-[34px] items-center justify-center rounded-full border-[1.5px] border-dotted transition-colors ${
                  hovered === "ais"
                    ? "border-emerald-400 bg-emerald-950/40 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
                    : isWhite
                    ? "border-slate-300 bg-white"
                    : "border-white/25 bg-[#0c0c0f]"
                }`}
              >
                <span
                  className={`font-mono text-[10px] ${
                    hovered === "ais"
                      ? "text-emerald-300 font-bold"
                      : isWhite
                      ? "text-slate-700 font-medium"
                      : "text-white/80"
                  }`}
                >
                  zero-access encrypted
                </span>
              </div>
              <p
                className={`mt-2 font-mono text-[8.5px] uppercase tracking-[0.14em] ${
                  isWhite ? "text-slate-400" : "text-white/35"
                }`}
              >
                ciphertext only
              </p>
            </motion.div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* DYNAMIC HOVER EXPLANATION CAPTION (matching media_1788699111943) */}
        {/* ============================================================ */}
        <div className="relative mt-8 min-h-[72px] w-full max-w-2xl px-4 text-center pointer-events-none">
          <AnimatePresence mode="wait">
            {hovered && EXPLANATIONS[hovered] ? (
              <motion.div
                key={hovered}
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
              >
                <p
                  className={`font-instrument-serif text-balance text-2xl sm:text-3xl leading-tight ${
                    isWhite ? "text-slate-900" : "text-white"
                  }`}
                >
                  {EXPLANATIONS[hovered].line}
                </p>
                <p
                  className={`mt-2 font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.28em] ${
                    isWhite ? "text-slate-500 font-semibold" : "text-white/50"
                  }`}
                >
                  {EXPLANATIONS[hovered].mono}
                </p>
              </motion.div>
            ) : (
              /* Default Tease text with animated chromatic glow */
              <motion.p
                key="tease"
                initial={{ opacity: 0, y: 7 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="relative font-mono text-[14px] sm:text-[16px] uppercase tracking-[0.3em]"
              >
                {[6, 14].map((blur) => (
                  <span
                    key={blur}
                    aria-hidden={true}
                    className="arch-tease-glow absolute inset-0 select-none"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, #4a90e2, #6c5ce5, #e8388f, #ff8e3c, #fde2a3)",
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      color: "transparent",
                      filter: `blur(${blur}px)`,
                    }}
                  >
                    {TEASE_TEXT}
                  </span>
                ))}
                <span
                  className={`relative ${
                    isWhite ? "text-slate-800 font-semibold" : "text-white/85 font-medium"
                  }`}
                >
                  {TEASE_TEXT}
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ============================================================ */}
      {/* OPTIONAL CLOUD MCP MODAL (Triggered by 'Read More') */}
      {/* ============================================================ */}
      <AnimatePresence>
        {mcpModalOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label="The optional cloud MCP, explained"
          >
            {/* Backdrop */}
            <motion.button
              type="button"
              aria-label="Close"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/75 backdrop-blur-[4px] cursor-pointer"
              onClick={() => setMcpModalOpen(false)}
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={`relative max-h-[85vh] w-full max-w-[620px] select-text overflow-y-auto rounded-2xl border p-7 sm:p-9 shadow-2xl ${
                isWhite
                  ? "border-slate-300 bg-white text-slate-900"
                  : "border-white/[0.14] bg-[#0c0c0f] text-white"
              }`}
            >
              {/* Close 'X' Button */}
              <button
                type="button"
                aria-label="Close"
                onClick={() => setMcpModalOpen(false)}
                className={`cursor-pointer absolute right-5 top-5 p-2 rounded-full transition-colors ${
                  isWhite
                    ? "text-slate-400 hover:text-slate-900 hover:bg-slate-100"
                    : "text-white/45 hover:text-white hover:bg-white/10"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden={true}
                >
                  <path
                    d="M1 1 L11 11 M11 1 L1 11"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>

              <p
                className={`font-mono text-[10px] uppercase tracking-[0.24em] ${
                  isWhite ? "text-indigo-600 font-semibold" : "text-white/45"
                }`}
              >
                Cloud MCP · optional, off by default
              </p>

              <h3 className="mt-3 font-instrument-serif text-2xl sm:text-[28px] leading-tight">
                Give your AIs your knowledge base.
              </h3>

              <p
                className={`mt-4 text-[13.5px] leading-relaxed ${
                  isWhite ? "text-slate-600" : "text-white/70"
                }`}
              >
                We realized this rich markdown knowledge base is incredibly helpful, and not just to Sentient. So, if you choose, you can connect it to your ChatGPT and Claude with a zero-access encrypted MCP server.
              </p>

              <div className="mt-6 space-y-4">
                <div
                  className={`rounded-xl border p-4 flex gap-3.5 ${
                    isWhite
                      ? "border-slate-200 bg-slate-50"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <span className="text-emerald-500 font-bold text-base">🛡️</span>
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider mb-1">
                      Zero-access encryption
                    </h4>
                    <p
                      className={`text-xs leading-relaxed ${
                        isWhite ? "text-slate-600" : "text-white/60"
                      }`}
                    >
                      Your Mac seals the knowledge base with AES-256-GCM before anything leaves, with a key only your Mac and your private link hold. Our relay stores nothing but ciphertext, with no key to unlock it; hack it and there's nothing to read.
                    </p>
                  </div>
                </div>

                <div
                  className={`rounded-xl border p-4 flex gap-3.5 ${
                    isWhite
                      ? "border-slate-200 bg-slate-50"
                      : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <span className="text-indigo-500 font-bold text-base">🔓</span>
                  <div>
                    <h4 className="font-semibold text-xs uppercase tracking-wider mb-1">
                      Open Source Relay
                    </h4>
                    <p
                      className={`text-xs leading-relaxed ${
                        isWhite ? "text-slate-600" : "text-white/60"
                      }`}
                    >
                      The relay in between is open source. Everything we run in the cloud is public, reproducible, and verifiable.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};