import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ShieldCheck, ChevronDown, Sparkles } from "lucide-react";

export const HeroMacBook: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position across the hero container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Buttery-smooth spring physics for 60/120fps motion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.8,
  });

  // MacBook 3D Lid: Starts tightly closed (-78deg), rotates open to 0deg (upright)
  const lidRotateX = useTransform(smoothProgress, [0, 0.42], [-78, 0]);
  
  // Screen illumination & video fade-in as lid cracks open
  const screenOpacity = useTransform(smoothProgress, [0.08, 0.36], [0, 1]);
  
  // Glowing seam along the laptop front edge when cracking open
  const seamGlowOpacity = useTransform(smoothProgress, [0.02, 0.15, 0.35], [0, 1, 0]);

  // Laptop scale and elevation on desk
  const laptopScale = useTransform(smoothProgress, [0, 0.45, 0.85], [0.92, 1, 1.06]);
  const laptopY = useTransform(smoothProgress, [0, 0.5, 1], [20, 0, -20]);

  // Stage 1: Hero Text ("Your Mac, sentient.")
  const text1Opacity = useTransform(smoothProgress, [0, 0.22], [1, 0]);
  const text1Y = useTransform(smoothProgress, [0, 0.22], [0, -30]);

  // Stage 2: 3:00 AM Processing Text
  const text2Opacity = useTransform(smoothProgress, [0.28, 0.38, 0.62, 0.72], [0, 1, 1, 0]);
  const text2Y = useTransform(smoothProgress, [0.28, 0.38, 0.62, 0.72], [25, 0, 0, -25]);

  // Stage 3: Knowledge Base Text
  const text3Opacity = useTransform(smoothProgress, [0.75, 0.85, 0.98], [0, 1, 1]);
  const text3Y = useTransform(smoothProgress, [0.75, 0.85, 0.98], [25, 0, 0]);

  return (
    <section
      ref={containerRef}
      className="relative bg-[#FBFBFD] select-none"
      style={{ height: "300vh" }}
    >
      {/* Sticky Fullscreen Frame */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-between overflow-hidden pt-20 pb-8 px-4">
        {/* Soft Ambient Studio Lighting */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] sm:w-[1300px] h-[600px] sm:h-[800px] opacity-60"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(99, 102, 241, 0.12) 0%, rgba(244, 114, 182, 0.06) 40%, transparent 70%)",
          }}
        />

        {/* Dynamic Staged Headings */}
        <div className="relative z-20 w-full max-w-4xl text-center min-h-[140px] flex items-center justify-center">
          {/* Stage 1: Hero Opener */}
          <motion.div
            style={{ opacity: text1Opacity, y: text1Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-200/80 bg-white/90 shadow-xs text-indigo-700 font-mono-code text-[11px] uppercase tracking-wider mb-3">
              <Sparkles className="size-3 text-indigo-500" />
              <span>Scroll to open MacBook</span>
            </div>
            <h1 className="font-serif-title text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-slate-900 leading-[1.05] mb-3">
              Your Mac, <span className="italic font-serif-title text-indigo-600">sentient</span>.
            </h1>
            <p className="max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed font-sans">
              An <strong className="font-semibold text-slate-900">on-device LLM</strong> understands
              your entire life, then <strong className="font-semibold text-slate-900">proactively</strong> offers
              to get your work done through <strong className="font-semibold text-slate-900">computer use</strong>.
            </p>
          </motion.div>

          {/* Stage 2: 3:00 AM Processing */}
          <motion.div
            style={{ opacity: text2Opacity, y: text2Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 pointer-events-none"
          >
            <h2 className="font-serif-title text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-slate-900 leading-[1.05] mb-3">
              While you sleep,<br className="hidden sm:block" /> your Mac understands your entire life.
            </h2>
            <div className="inline-flex items-center gap-2 mt-2 px-3.5 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-mono-code text-xs uppercase tracking-widest">
              <ShieldCheck className="size-3.5 text-emerald-600" />
              <span>3:00 AM · On This Mac · Nothing Leaves</span>
            </div>
          </motion.div>

          {/* Stage 3: Knowledge Base */}
          <motion.div
            style={{ opacity: text3Opacity, y: text3Y }}
            className="absolute inset-0 flex flex-col items-center justify-center px-4 pointer-events-none"
          >
            <h2 className="font-serif-title text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-slate-900 leading-[1.05] mb-3">
              To create a knowledge base of everything.
            </h2>
            <p className="font-mono-code text-xs sm:text-sm text-indigo-700 font-semibold uppercase tracking-[0.2em] mt-1">
              Plain markdown &amp; folders · On your Mac · Yours
            </p>
          </motion.div>
        </div>

        {/* Photorealistic 3D MacBook Pro Assembly */}
        <motion.div
          style={{ scale: laptopScale, y: laptopY }}
          className="relative z-10 w-full max-w-[770px] my-auto flex flex-col items-center"
        >
          {/* Main 3D Perspective Stage */}
          <div
            className="relative w-full aspect-[770/520]"
            style={{
              perspective: "4000px",
              perspectiveOrigin: "50% 92%",
            }}
          >
            {/* The Rotating Display Lid (Clamshell) */}
            <motion.div
              style={{
                rotateX: lidRotateX,
                transformOrigin: "50% 100%",
                transformStyle: "preserve-3d",
              }}
              className="absolute inset-0 z-20 rounded-[23px] will-change-transform"
            >
              {/* Lid Outer Shell (Front Plate) */}
              <div
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
                className="absolute inset-0 rounded-[23px] overflow-hidden shadow-2xl"
              >
                <img
                  src="/film/lid-front.png"
                  alt="MacBook Lid"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>

              {/* Inside Display Screen & macOS Video Player */}
              <motion.div
                style={{
                  opacity: screenOpacity,
                  transform: "translateZ(1px)",
                }}
                className="absolute inset-[10px] sm:inset-[12px] bottom-[14px] sm:bottom-[18px] rounded-[14px] sm:rounded-[18px] bg-black overflow-hidden shadow-inner flex flex-col justify-between"
              >
                {/* Menu bar header */}
                <div className="relative z-30 flex items-center justify-between px-3 py-1.5 bg-black/60 backdrop-blur-md text-[10px] text-white/70 font-sans border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-white">Sentient OS</span>
                    <span className="hidden sm:inline text-white/40">File</span>
                    <span className="hidden sm:inline text-white/40">Edit</span>
                    <span className="hidden sm:inline text-white/40">View</span>
                  </div>
                  <div className="font-mono-code text-white/50 text-[9.5px]">
                    Wed 3:00 AM · Apple Silicon
                  </div>
                </div>

                {/* Embedded Video of Sentient OS macOS App */}
                <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    src="/sentient-rec-h264.mp4"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle Screen Glass Reflection Overlay */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                      background:
                        "linear-gradient(125deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.05) 30%, transparent 60%)",
                    }}
                  />
                </div>
              </motion.div>

              {/* Lid Top Edge Chamfer */}
              <div className="absolute top-0 inset-x-0 h-[10px] pointer-events-none">
                <img
                  src="/film/lid-edge.png"
                  alt="MacBook Lid Edge"
                  className="w-full h-full object-cover select-none"
                />
              </div>

              {/* Glowing Seam Breathe Animation when cracking open */}
              <motion.div
                style={{ opacity: seamGlowOpacity }}
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2 z-30"
              >
                <div
                  className="w-full h-full rounded-full blur-xs"
                  style={{
                    background:
                      "linear-gradient(90deg, #4a90e2, #6c5ce5, #9b48d4, #e8388f, #ff4646, #ff8e3c, #fde2a3)",
                  }}
                />
              </motion.div>
            </motion.div>

            {/* The Stationary MacBook Base (Bottom Chassis & Notch) */}
            <div className="absolute inset-x-0 bottom-0 h-[36px] z-10">
              <img
                src="/film/base.png"
                alt="MacBook Base"
                className="w-full h-full object-cover select-none pointer-events-none drop-shadow-2xl"
              />
            </div>
          </div>
        </motion.div>

        {/* Scroll Helper */}
        <div className="relative z-20 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer">
          <span className="text-[11px] font-mono-code uppercase tracking-widest font-semibold">
            Scroll down to open · Scroll up to close
          </span>
          <ChevronDown className="size-4 animate-bounce text-slate-500" />
        </div>
      </div>
    </section>
  );
};
