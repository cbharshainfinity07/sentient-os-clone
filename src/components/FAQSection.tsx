import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FAQSectionProps {
  theme?: "white" | "dark";
}

export const FAQSection: React.FC<FAQSectionProps> = ({ theme = "white" }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const isWhite = theme === "white";

  const faqs = [
    {
      q: "Does my data ever leave my Mac?",
      a: "No. All raw file indexing, screenshot scanning, message parsing, and conversation triaging happen 100% locally on your Apple Silicon chip using Gemma 4 E4B. Only anonymized, non-sensitive task instructions ever reach your selected cloud model.",
    },
    {
      q: "Does this require my Mac to be awake all night?",
      a: "No. Sentient registers a secure root helper with macOS power management that schedules a 3:00 AM wake cycle while plugged into power. Your lid can stay shut. When completed, your Mac goes right back to sleep.",
    },
    {
      q: "Which Mac models are supported?",
      a: "Any Apple Silicon Mac (M1, M2, M3, M4) running macOS Sequoia 15.0 or later. Sentient is engineered specifically for 8 GB Unified Memory Macs and up, using custom quantizations and KV cache optimizations.",
    },
    {
      q: "How does Sidekick Computer Use work?",
      a: "When you invoke Sidekick (or click an action from your morning cards), Sentient uses standard macOS Accessibility and terminal interfaces to orchestrate actions across your apps in the background, like filling carts or drafting replies.",
    },
    {
      q: "Can I use my existing OpenAI or Claude subscription?",
      a: "Yes! Sentient lets you bring your own subscription or API key from ChatGPT Plus, Claude Pro, OpenRouter, or run 100% offline using LM Studio. We do not intermediate your billing.",
    },
    {
      q: "Is Sentient open source?",
      a: "Yes. The core application, LiteRT-LM inference kernel, and data connectors are open source under the Apache 2.0 license. You can inspect every line of code on our GitHub repository.",
    },
  ];

  return (
    <section
      id="faq"
      className={`scroll-mt-24 sm:scroll-mt-28 relative py-28 sm:py-36 px-6 border-t select-none transition-colors duration-300 ${
        isWhite
          ? "bg-white text-slate-900 border-slate-200"
          : "bg-black text-white border-white/10"
      }`}
    >
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-500 font-mono text-xs uppercase tracking-widest mb-4">
            <HelpCircle className="size-3.5 text-indigo-500" />
            <span>Got Questions?</span>
          </div>
          <h2
            className={`font-instrument-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight ${
              isWhite ? "text-slate-900" : "text-white"
            }`}
          >
            Frequently asked questions.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border backdrop-blur-md overflow-hidden transition-all ${
                  isWhite
                    ? "border-slate-200/90 bg-slate-50/80 hover:border-slate-300 shadow-sm"
                    : "border-white/10 bg-neutral-900/50 hover:border-white/20"
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="cursor-pointer w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                >
                  <span
                    className={`font-sans text-sm sm:text-base font-semibold ${
                      isWhite ? "text-slate-900" : "text-white"
                    }`}
                  >
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`size-4 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    } ${isWhite ? "text-slate-500" : "text-white/50"}`}
                  />
                </button>
                {isOpen && (
                  <div
                    className={`px-6 pb-5 pt-1 text-xs sm:text-sm font-sans leading-relaxed border-t ${
                      isWhite
                        ? "text-slate-600 border-slate-200/60"
                        : "text-white/65 border-white/5"
                    }`}
                  >
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
