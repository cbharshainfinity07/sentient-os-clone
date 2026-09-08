import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";


interface CardItem {
  id: string;
  badge: string;
  badgeColor: string;
  time: string;
  source: string;
  title: string;
  body: string;
  actionText: string;
  secondaryText: string;
}

const CARDS: CardItem[] = [
  {
    id: "carl",
    badge: "Overdue · 2 days",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    time: "9:00 AM",
    source: "Gmail",
    title: "You ghosted Carl.",
    body: "Carl asked to finalize the venue contract. You're free Thursday, so I've drafted your reply with the quote that arrived yesterday.",
    actionText: "Reply & add meeting to cal",
    secondaryText: "read the draft",
  },
  {
    id: "canva",
    badge: "Renews tomorrow · $119",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    time: "9:00 AM",
    source: "Computer Use",
    title: "You signed up for Canva Pro to make one birthday invite.",
    body: "Going to renew tomorrow for $119 for the year. You only signed up to make that one invite you sent out last month.",
    actionText: "Shall I cancel it for you?",
    secondaryText: "read the plan",
  },
  {
    id: "amtrak",
    badge: "This Weekend · $30",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    time: "9:00 AM",
    source: "Computer Use",
    title: "You still need to book your train to New York.",
    body: "Trip to NY is this weekend. Best option found: $30 Amtrak express, 2 hours, arrives 11 AM right as hotel check-in opens.",
    actionText: "Shall I book it for you?",
    secondaryText: "view itinerary",
  },
  {
    id: "denver",
    badge: "Due Friday · $1,240",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    time: "9:00 AM",
    source: "Expensify",
    title: "Your Denver trip expenses are due Friday.",
    body: "Two flights, the Marriott, six Ubers and a conference dinner gathered across your inbox. All receipts parsed and pre-filled.",
    actionText: "File my expenses",
    secondaryText: "review receipts",
  },
  {
    id: "hawaii",
    badge: "Group Plan · Researched",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    time: "9:00 AM",
    source: "WhatsApp",
    title: "The Hawaii trip needs to leave the group chat.",
    body: "Found 3 flight options and 2 villas fitting everyone's calendar and Jake's $1,500 target budget. Formatted breakdown ready.",
    actionText: "Send to group chat",
    secondaryText: "read message",
  },
];

export const MorningCards: React.FC = () => {
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [morningMode, setMorningMode] = useState<"interactive" | "window">("interactive");

  const handleAction = (id: string) => {
    setCompletedActions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="morning" className="relative bg-[#FBFBFD] py-28 sm:py-36 px-6 border-t border-slate-200/80 overflow-hidden select-none">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200/80 bg-white shadow-xs text-indigo-700 font-mono-code text-xs uppercase tracking-widest mb-4">
            <Clock className="size-3.5 text-indigo-600" />
            <span>9:00 AM · Proactive Intelligence</span>
          </div>
          <h2 className="font-serif-title text-4xl sm:text-5xl md:text-6xl text-slate-900 font-normal tracking-tight">
            So you wake up to your work finished in one click.
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-slate-600 font-sans leading-relaxed mb-6">
            Overnight, a frontier model reads the night's findings against everything it knows about your life
            and prepares the few things really worth doing. You get a small handful of cards drafted in the morning.
            That click is the only thing that ever fires an action.
          </p>

          {/* Mode Switcher */}
          <div className="inline-flex items-center gap-1 p-1 rounded-full bg-slate-200/70 border border-slate-300/60 shadow-inner">
            <button
              onClick={() => setMorningMode("interactive")}
              className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                morningMode === "interactive"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Interactive Action Cards
            </button>
            <button
              onClick={() => setMorningMode("window")}
              className={`cursor-pointer px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                morningMode === "window"
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              macOS Morning Window
            </button>
          </div>
        </div>

        {/* View Content */}
        {morningMode === "window" ? (
          <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-3 sm:p-5 shadow-2xl overflow-hidden">
            <img
              src="/morning.jpg"
              alt="Sentient OS Morning Cards on macOS"
              className="w-full h-auto rounded-2xl object-cover shadow-sm"
            />
          </div>
        ) : (
          /* Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {CARDS.map((card, idx) => {
            const isDone = completedActions[card.id];

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className={`relative rounded-3xl border transition-all duration-300 flex flex-col justify-between p-6 sm:p-7 ${
                  isDone
                    ? "border-emerald-300 bg-emerald-50/40 shadow-lg shadow-emerald-500/5"
                    : "border-slate-200 bg-white hover:border-indigo-300 hover:shadow-xl shadow-xs"
                }`}
              >
                <div>
                  {/* Metadata tags */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className={`font-mono-code text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                    <span className="font-mono-code text-[11px] text-slate-400">
                      {card.source}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2.5 leading-snug">
                    {card.title}
                  </h3>

                  {/* Body description */}
                  <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans mb-6">
                    {card.body}
                  </p>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                  <button
                    onClick={() => handleAction(card.id)}
                    className={`cursor-pointer w-full py-2.5 px-4 rounded-xl font-sans text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                      isDone
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                        : "bg-slate-900 hover:bg-slate-800 text-white shadow-sm active:scale-[0.98]"
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="size-4" />
                        <span>Fired via Computer Use!</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="size-3.5 text-indigo-300" />
                        <span>{card.actionText}</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 font-mono-code">
                    <span className="hover:text-slate-800 transition-colors cursor-pointer flex items-center gap-0.5 font-medium">
                      {card.secondaryText}
                      <ArrowUpRight className="size-3" />
                    </span>
                    <span className="text-slate-400">1-click confirm</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
        )}
      </div>

    </section>
  );
};
