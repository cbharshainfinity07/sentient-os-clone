import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ArrowRight, Network, Folder } from "lucide-react";


interface NodeData {
  id: string;
  name: string;
  x: number;
  y: number;
  color: string;
  bgLight: string;
  notes: string[];
}

const NODES: NodeData[] = [
  {
    id: "projects",
    name: "Projects",
    x: 50,
    y: 20,
    color: "#D97706",
    bgLight: "rgba(217, 119, 6, 0.12)",
    notes: ["Sentient-OS Architecture.md", "Inference-Kernel.cpp", "Notch-Extension.swift"],
  },
  {
    id: "ideas",
    name: "Ideas",
    x: 82,
    y: 36,
    color: "#7C3AED",
    bgLight: "rgba(124, 58, 237, 0.12)",
    notes: ["Speculative Decoding on M3.md", "Zero-Knowledge PII Filter.md", "Autonomous File Cleaners"],
  },
  {
    id: "travel",
    name: "Travel",
    x: 18,
    y: 28,
    color: "#2563EB",
    bgLight: "rgba(37, 99, 235, 0.12)",
    notes: ["Flight SFO YC-Interview.md", "Tokyo Itinerary Dec 2026.md", "Marriott Reservation #4829"],
  },
  {
    id: "health",
    name: "Health",
    x: 26,
    y: 78,
    color: "#059669",
    bgLight: "rgba(5, 150, 105, 0.12)",
    notes: ["Sleep Cycles vs 3 AM Wake.md", "Quarterly Bloodwork Biomarkers", "Weekly Running Cadence"],
  },
  {
    id: "people",
    name: "People",
    x: 76,
    y: 74,
    color: "#DB2777",
    bgLight: "rgba(219, 39, 119, 0.12)",
    notes: ["Sarah (Coffee chat follow-up)", "Carl (Venue rental agreement)", "Jake (Hawaii villa split)"],
  },
];

const CONNECTIONS = [
  ["projects", "ideas"],
  ["projects", "travel"],
  ["ideas", "people"],
  ["travel", "health"],
  ["health", "people"],
  ["projects", "people"],
  ["ideas", "health"],
];

export const ConstellationView: React.FC = () => {
  const [activeNode, setActiveNode] = useState<NodeData>(NODES[0]);
  const [viewMode, setViewMode] = useState<"interactive" | "gif">("interactive");

  return (
    <section id="constellation" className="relative bg-gradient-to-b from-[#FBFBFD] via-slate-50 to-[#FBFBFD] py-28 px-6 border-t border-slate-200/80 select-none">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200/80 bg-white shadow-xs text-indigo-700 font-mono-code text-xs uppercase tracking-widest mb-4">
            <Network className="size-3.5 text-indigo-600" />
            <span>Constellation View · Your Life From Above</span>
          </div>
          <h2 className="font-serif-title text-4xl sm:text-5xl md:text-6xl text-slate-900 font-normal tracking-tight">
            Notes as stars, wikilinks as threads.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-base text-slate-600 font-sans leading-relaxed mb-6">
            The deepest memory of you any AI has ever had: an Obsidian-style folder of plain markdown,
            on your Mac, yours to read, edit, and delete note by note. It's not a black box; it's a folder.
          </p>

          {/* Mode Switcher */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-200/70 border border-slate-300/60 shadow-inner">
            <button
              onClick={() => setViewMode("interactive")}
              className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === "interactive"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Interactive Graph
            </button>
            <button
              onClick={() => setViewMode("gif")}
              className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                viewMode === "gif"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Live macOS Constellation
            </button>
          </div>
        </div>


        {/* Canvas & Inspector */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Constellation Display */}
          <div className="lg:col-span-8 relative aspect-[16/11] rounded-3xl border border-slate-200 bg-white p-6 overflow-hidden shadow-xl shadow-slate-100 flex items-center justify-center">
            {viewMode === "gif" ? (
              <div className="w-full h-full rounded-2xl overflow-hidden bg-[#0a0a0f] flex items-center justify-center">
                <img
                  src="/constellation.gif"
                  alt="Constellation Knowledge Window"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            ) : (
              <>
                {/* Subtle background grid pattern */}
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#000000 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />

                {/* Connecting SVG threads */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">

              {CONNECTIONS.map(([srcId, tgtId], idx) => {
                const src = NODES.find((n) => n.id === srcId)!;
                const tgt = NODES.find((n) => n.id === tgtId)!;
                const isSelected = activeNode.id === src.id || activeNode.id === tgt.id;

                return (
                  <line
                    key={idx}
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isSelected ? "#6366f1" : "rgba(148, 163, 184, 0.4)"}
                    strokeWidth={isSelected ? "1.2" : "0.75"}
                    strokeDasharray={isSelected ? "none" : "2 2"}
                    className="transition-all duration-300"
                  />
                );
              })}
            </svg>

            {/* Interactive Stars */}
            {NODES.map((node) => {
              const isSelected = activeNode.id === node.id;

              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none cursor-pointer"
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div
                    className={`size-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isSelected ? "scale-125" : "group-hover:scale-110"
                    }`}
                  >
                    <span
                      className="absolute size-6 rounded-full blur-md transition-opacity"
                      style={{
                        backgroundColor: node.color,
                        opacity: isSelected ? 0.7 : 0.25,
                      }}
                    />
                    <span
                      className="relative size-3.5 rounded-full border-2 border-white shadow-md transition-all"
                      style={{ backgroundColor: node.color }}
                    />
                  </div>

                  <span
                    className={`mt-1.5 block font-mono-code text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                      isSelected
                        ? "text-slate-900 font-bold"
                        : "text-slate-500 group-hover:text-slate-800 font-medium"
                    }`}
                  >
                    {node.name}
                  </span>
                </button>
              );
            })}

            <div className="absolute bottom-4 left-6 font-mono-code text-[11px] text-slate-400">
              Click any cluster to inspect connected markdown notes
            </div>
            </>
          )}
          </div>


          {/* Notes Inspector */}
          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: activeNode.color }}
                  />
                  <h3 className="font-sans text-lg font-bold text-slate-900">
                    {activeNode.name} Notes
                  </h3>
                </div>
                <span className="font-mono-code text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {activeNode.notes.length} files
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-4 leading-relaxed font-sans">
                Real markdown files residing on your disk. Interlinked via wikilinks:
              </p>

              <div className="flex flex-col gap-2.5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeNode.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-2.5"
                  >
                    {activeNode.notes.map((note, i) => (
                      <div
                        key={i}
                        className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition-all hover:bg-white hover:border-indigo-300 hover:shadow-md cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="size-4 text-indigo-600 group-hover:scale-110 transition-transform" />
                          <span className="font-mono-code text-xs text-slate-800 font-medium">
                            {note}
                          </span>
                        </div>
                        <ArrowRight className="size-3.5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono-code text-slate-500">
                <span className="flex items-center gap-1.5">
                  <Folder className="size-3 text-slate-400" />
                  <span>~/Sentient/Knowledge/</span>
                </span>
                <span className="text-emerald-600 font-semibold">100% Local</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
