import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Command, Check } from "lucide-react";


export const SidekickNotch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [sidekickMode, setSidekickMode] = useState<"interactive" | "gif">("interactive");

  const samplePrompts = [
    "Finish this for me: put recipe ingredients in my cart",
    "Reply with the update from Sarah",
    "Cancel that subscription before it renews tomorrow",
  ];

  const [currentPrompt, setCurrentPrompt] = useState(samplePrompts[0]);

  const handleToggle = (promptText?: string) => {
    if (promptText) {
      setCurrentPrompt(promptText);
    }
    setIsOpen(!isOpen);
    setActiveStep(1);
    setTimeout(() => setActiveStep(2), 1100);
    setTimeout(() => setActiveStep(3), 2400);
  };

  return (
    <section id="sidekick" className="relative bg-[#FBFBFD] py-28 sm:py-36 px-6 border-t border-slate-200/80 overflow-hidden select-none">
      <div className="mx-auto max-w-5xl text-center">
        {/* Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200/80 bg-white shadow-xs text-indigo-700 font-mono-code text-xs uppercase tracking-widest mb-4">
          <Command className="size-3.5 text-indigo-600" />
          <span>Hold Right ⌘ · Anywhere</span>
        </div>
        <h2 className="font-serif-title text-4xl sm:text-5xl md:text-6xl text-slate-900 font-normal tracking-tight mb-4">
          One more thing. Meet Sidekick.
        </h2>
        <p className="max-w-2xl mx-auto text-base text-slate-600 font-sans leading-relaxed mb-6">
          Anywhere on your Mac, click your notch (or use right ⌘: hold to speak, tap to type) and say:
          "finish this for me". The notch drops open glowing, transcribes you on-device, and computer use
          takes it from there in your own apps and your own logged-in browser.
        </p>

        {/* Mode Switcher */}
        <div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-200/70 border border-slate-300/60 shadow-inner mb-12">
          <button
            onClick={() => setSidekickMode("interactive")}
            className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              sidekickMode === "interactive"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Interactive Dynamic Notch
          </button>
          <button
            onClick={() => setSidekickMode("gif")}
            className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              sidekickMode === "gif"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Live macOS Notch Demo
          </button>
        </div>

        {sidekickMode === "gif" ? (
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-3 sm:p-5 shadow-2xl overflow-hidden">
            <img
              src="/sidekick.gif"
              alt="Sidekick Notch Action Demo"
              className="w-full h-auto rounded-2xl object-cover"
            />
          </div>
        ) : (
          /* MacBook Display Bezel with Dynamic Interactive Notch */
          <div className="relative mx-auto w-full max-w-3xl rounded-3xl border border-slate-200 bg-white shadow-2xl p-6 pt-0 overflow-hidden min-h-[440px] flex flex-col justify-between">

          {/* Top Notch Container */}
          <div className="relative w-full flex justify-center">
            <motion.div
              layout
              onClick={() => handleToggle()}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className={`relative z-40 bg-black cursor-pointer shadow-2xl transition-all ${
                isOpen
                  ? "w-full max-w-[540px] rounded-b-3xl p-5 shadow-[0_25px_50px_-12px_rgba(99,102,241,0.25)] border-b border-x border-indigo-500/40"
                  : "w-44 h-7 rounded-b-xl border-b border-x border-neutral-800 hover:border-neutral-600 flex items-center justify-center gap-2"
              }`}
            >
              {/* Glowing Rim Border Gradient */}
              <div
                className="absolute inset-0 rounded-b-2xl pointer-events-none opacity-80"
                style={{
                  background:
                    "linear-gradient(90deg, #fde2a3 0%, #e8388f 50%, #6c5ce5 100%)",
                  maskImage: "linear-gradient(to top, black 2px, transparent 2px)",
                  WebkitMaskImage: "linear-gradient(to top, black 2px, transparent 2px)",
                }}
              />

              {!isOpen ? (
                <div className="flex items-center gap-2 text-white/80 hover:text-white text-xs font-mono-code">
                  <div className="size-2 rounded-full bg-indigo-400 animate-pulse" />
                  <span>Click to drop notch</span>
                </div>
              ) : (
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col text-left gap-4"
                  >
                    {/* Header with audio wave pulses */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-0.5">
                          <span className="w-1 h-3.5 bg-fuchsia-400 rounded-full animate-bounce" />
                          <span className="w-1 h-5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                          <span className="w-1 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          "{currentPrompt}"
                        </span>
                      </div>
                      <span className="font-mono-code text-[10px] text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                        Live Computer Use
                      </span>
                    </div>

                    {/* Stepped progress */}
                    <div className="flex flex-col gap-2 font-mono-code text-xs">
                      <div className="flex items-center gap-2.5 text-white/90">
                        {activeStep >= 1 ? (
                          <Check className="size-3.5 text-emerald-400" />
                        ) : (
                          <div className="size-3.5 rounded-full border border-white/20" />
                        )}
                        <span>[1/3] Reading personal context &amp; ingredients from Notes...</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-white/90">
                        {activeStep >= 2 ? (
                          <Check className="size-3.5 text-emerald-400" />
                        ) : (
                          <div className="size-3.5 rounded-full border border-white/20 animate-spin border-t-fuchsia-400" />
                        )}
                        <span>[2/3] Opening Instacart session in background window...</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-white/90">
                        {activeStep >= 3 ? (
                          <Check className="size-3.5 text-emerald-400" />
                        ) : (
                          <div className="size-3.5 rounded-full border border-white/20" />
                        )}
                        <span>[3/3] 8 items placed in cart. Awaiting 1-tap checkout.</span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-[11px] font-mono-code text-white/40">
                      <span>Runs in background while you carry on</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpen(false);
                        }}
                        className="text-white/60 hover:text-white underline cursor-pointer"
                      >
                        Dismiss notch
                      </button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </motion.div>
          </div>

          {/* Interactive Trigger Suggestions */}
          <div className="mt-20 z-10">
            <p className="text-xs font-mono-code text-slate-500 uppercase tracking-widest mb-3">
              Try a sample trigger:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              {samplePrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleToggle(prompt)}
                  className="cursor-pointer rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-medium text-slate-700 transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-900 active:scale-95 shadow-xs"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center text-xs font-mono-code text-slate-500">
            Sidekick knows who the people in your life are, what "the usual" means, and what you promised whom.
          </div>
        </div>
        )}
      </div>

    </section>
  );
};
