import React from "react";
import { Sparkles, Shield, Cpu, Zap, Database, Lock } from "lucide-react";

interface TechnicalMoatProps {
  theme?: "white" | "dark";
}

export const TechnicalMoat: React.FC<TechnicalMoatProps> = ({ theme = "white" }) => {
  const isWhite = theme === "white";

  const layers = [
    {
      id: "engine",
      title: "The Inference Engine",
      sub: "a custom LiteRT-LM fork, running Gemma 4 E4B",
      icon: Cpu,
      items: ["mlx k-quants", "the vision transplant", "llama.cpp", "MediaPipe", "mlc-llm", "TFLite"],
      speed: "34s",
    },
    {
      id: "optimization",
      title: "Inference Optimization",
      sub: "kv cache reuse + flash attention + speculative decoding",
      icon: Zap,
      items: ["multi-token prediction", "audio weight unloading", "near-deterministic sampling", "self-healing gpu runs", "8 gb macs, welcome"],
      speed: "28s",
    },
    {
      id: "privacy",
      title: "Privacy Engineering",
      sub: "no accounts; raw data never leaves",
      icon: Shield,
      items: ["zero-trace triage", "fail-closed parsing", "a pii regex backstop", "aes-256-gcm before anything leaves", "a 30-day dead-man lease", "attribution hardening"],
      speed: "40s",
    },
    {
      id: "sources",
      title: "Reading Your Real Life",
      sub: "whatsapp, imessage & apple notes, decoded",
      icon: Database,
      items: ["typedstream decoding", "protobuf walks", "wal-safe copy-reads", "date-added, not mtime", "never spotlight"],
      speed: "31s",
    },
    {
      id: "overnight",
      title: "The 3 AM Machine",
      sub: "wakes your Mac overnight, lid shut",
      icon: Lock,
      items: ["a codesign-verified root helper", "a deadman timer", "ac + thermal gates", "crash-safe resume", "xpc heartbeat health"],
      speed: "37s",
    },
  ];

  return (
    <section
      id="moat"
      className={`scroll-mt-24 sm:scroll-mt-28 relative py-28 sm:py-36 px-6 border-t overflow-hidden select-none transition-colors duration-300 ${
        isWhite
          ? "bg-[#f8fafc] text-slate-900 border-slate-200"
          : "bg-black text-white border-white/10"
      }`}
    >
      <div className="mx-auto max-w-5xl">
        {/* Thesis Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-500 font-mono text-xs uppercase tracking-widest mb-4">
            <Sparkles className="size-3.5 text-indigo-500" />
            <span>Foundational Thesis</span>
          </div>
          <h2
            className={`font-instrument-serif text-4xl sm:text-5xl md:text-6xl font-normal tracking-tight ${
              isWhite ? "text-slate-900" : "text-white"
            }`}
          >
            Our thesis.
          </h2>
          <div
            className={`mt-8 text-left space-y-4 text-sm sm:text-base font-sans leading-relaxed max-w-2xl mx-auto ${
              isWhite ? "text-slate-600" : "text-white/65"
            }`}
          >
            <p>
              All the AI you use today only works when you type in a prompt. Truly proactive AI is different:
              it has to continually go through your entire life. That takes immense compute, only possible
              at the frontier of local, on-device inference.
            </p>
            <p>
              And it takes your entire life, not the slice living inside Google's or Apple's walled gardens.
            </p>
            <p className={`font-medium ${isWhite ? "text-slate-900" : "text-white"}`}>
              Sentient was born to push this frontier and break those walls. And we're just getting started.
            </p>
          </div>
        </div>

        {/* 5 Architecture Layer Rows */}
        <div className="space-y-4">
          {layers.map((layer) => {
            const Icon = layer.icon;
            return (
              <div
                key={layer.id}
                className={`rounded-2xl border p-5 sm:p-6 backdrop-blur-md shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                  isWhite
                    ? "border-slate-200/90 bg-white/95 text-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                    : "border-white/10 bg-neutral-900/60 text-white shadow-lg"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`size-10 rounded-xl border flex items-center justify-center shrink-0 ${
                      isWhite
                        ? "bg-indigo-50 border-indigo-200 text-indigo-600"
                        : "bg-indigo-950/80 border-indigo-500/40 text-indigo-400"
                    }`}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <h3
                      className={`text-sm sm:text-base font-bold tracking-tight ${
                        isWhite ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {layer.title}
                    </h3>
                    <p
                      className={`font-mono text-xs mt-0.5 ${
                        isWhite ? "text-indigo-600 font-semibold" : "text-indigo-300"
                      }`}
                    >
                      {layer.sub}
                    </p>
                  </div>
                </div>

                {/* Marquee Pill Tags */}
                <div className="flex flex-wrap gap-1.5 md:justify-end max-w-md">
                  {layer.items.map((item, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-full font-mono text-[11px] border ${
                        isWhite
                          ? "bg-slate-100/80 border-slate-200 text-slate-700 font-medium"
                          : "bg-white/5 border-white/10 text-white/70"
                      }`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Moat Statement */}
        <div className="mt-16 text-center">
          <p
            className={`font-instrument-serif text-2xl sm:text-3xl ${
              isWhite ? "text-slate-900" : "text-white/90"
            }`}
          >
            "This is the intelligence layer for your entire digital life."
          </p>
        </div>
      </div>
    </section>
  );
};
