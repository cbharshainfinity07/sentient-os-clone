import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  animate,
  AnimatePresence,
} from "framer-motion";
import {
  Check,
  ChevronDown,
  Sparkles,
  RotateCcw,
  Send,
  Lock,
} from "lucide-react";

// Exact star coordinates extracted from sentient-os.ai
const STARS = [
  { x: 0.44, y: 0.12, r: 7, color: "#f5dfb0", glow: "#f5dfb066" },
  { x: 0.52, y: 0.20, r: 5, color: "#f5dfb0", glow: "#f5dfb066" },
  { x: 0.38, y: 0.26, r: 6, color: "#f5dfb0", glow: "#f5dfb066" },
  { x: 0.48, y: 0.34, r: 4, color: "#f5dfb0", glow: "#f5dfb066" },
  { x: 0.58, y: 0.10, r: 4, color: "#f5dfb0", glow: "#f5dfb066" },
  { x: 0.61, y: 0.28, r: 5, color: "#f5dfb0", glow: "#f5dfb066" },
  { x: 0.74, y: 0.14, r: 6, color: "#cbc3f5", glow: "#cbc3f566" },
  { x: 0.84, y: 0.10, r: 4, color: "#cbc3f5", glow: "#cbc3f566" },
  { x: 0.90, y: 0.22, r: 5, color: "#cbc3f5", glow: "#cbc3f566" },
  { x: 0.78, y: 0.30, r: 4, color: "#cbc3f5", glow: "#cbc3f566" },
  { x: 0.86, y: 0.34, r: 4, color: "#cbc3f5", glow: "#cbc3f566" },
  { x: 0.10, y: 0.30, r: 5, color: "#bcd6f7", glow: "#bcd6f766" },
  { x: 0.20, y: 0.24, r: 4, color: "#bcd6f7", glow: "#bcd6f766" },
  { x: 0.26, y: 0.38, r: 6, color: "#bcd6f7", glow: "#bcd6f766" },
  { x: 0.14, y: 0.48, r: 4, color: "#bcd6f7", glow: "#bcd6f766" },
  { x: 0.06, y: 0.40, r: 4, color: "#bcd6f7", glow: "#bcd6f766" },
  { x: 0.22, y: 0.66, r: 5, color: "#c9e8cd", glow: "#c9e8cd66" },
  { x: 0.32, y: 0.74, r: 4, color: "#c9e8cd", glow: "#c9e8cd66" },
  { x: 0.18, y: 0.82, r: 5, color: "#c9e8cd", glow: "#c9e8cd66" },
  { x: 0.36, y: 0.86, r: 4, color: "#c9e8cd", glow: "#c9e8cd66" },
  { x: 0.28, y: 0.94, r: 3, color: "#c9e8cd", glow: "#c9e8cd66" },
  { x: 0.64, y: 0.60, r: 6, color: "#f3c3d4", glow: "#f3c3d466" },
  { x: 0.74, y: 0.68, r: 5, color: "#f3c3d4", glow: "#f3c3d466" },
  { x: 0.84, y: 0.60, r: 4, color: "#f3c3d4", glow: "#f3c3d466" },
  { x: 0.68, y: 0.80, r: 5, color: "#f3c3d4", glow: "#f3c3d466" },
  { x: 0.80, y: 0.84, r: 4, color: "#f3c3d4", glow: "#f3c3d466" },
  { x: 0.90, y: 0.74, r: 4, color: "#f3c3d4", glow: "#f3c3d466" },
];

const CONSTELLATION_EDGES: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [0, 4], [3, 5],
  [6, 7], [7, 8], [8, 10], [6, 9],
  [11, 12], [12, 13], [13, 14], [14, 15],
  [16, 17], [17, 18], [18, 19],
  [21, 22], [22, 23], [21, 24], [24, 25],
  [3, 21], [13, 16], [5, 6], [23, 10],
];

const CONSTELLATION_LABELS = [
  { text: "Projects", x: "50%", y: "3%" },
  { text: "Ideas", x: "82%", y: "42%" },
  { text: "Travel", x: "15%", y: "16%" },
  { text: "Health", x: "26%", y: "100%" },
  { text: "People", x: "76%", y: "92%" },
];

interface MorningCardItem {
  id: string;
  badge: string;
  badgeColor: string;
  headline: string;
  body: string;
  actionText: string;
  doneText: string;
  actionColor: string;
  actionDraftText: string;
}

const INITIAL_MORNING_CARDS: MorningCardItem[] = [
  {
    id: "carl",
    badge: "OVERDUE · 3 DAYS · GMAIL",
    badgeColor: "text-amber-400 border-amber-500/30 bg-amber-500/10",
    headline: "You ghosted Carl.",
    body: "Carl asked to meet Wednesday at 1 about the event. You're free then, I checked.",
    actionText: "Reply & add meeting to cal?",
    doneText: "Replied to Carl",
    actionColor: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/20",
    actionDraftText: "read the draft >",
  },
  {
    id: "canva",
    badge: "RENEWS TOMORROW · $119 · COMPUTER USE",
    badgeColor: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    headline: "You signed up for Canva Pro",
    body: "It's going to renew tomorrow for $119 for the year. You only signed up for one invite.",
    actionText: "Shall I cancel it for you?",
    doneText: "Cancelled Canva Pro",
    actionColor: "bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-rose-500/20",
    actionDraftText: "read the plan >",
  },
  {
    id: "train",
    badge: "THIS WEEKEND · COMPUTER USE",
    badgeColor: "text-sky-400 border-sky-500/30 bg-sky-500/10",
    headline: "You still need to book your train",
    body: "Your trip to NYC is this weekend, but you haven't booked Amtrak. Best: $30, 2 hrs.",
    actionText: "Shall I book it for you?",
    doneText: "Booked Amtrak train",
    actionColor: "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sky-500/20",
    actionDraftText: "read the plan >",
  },
  {
    id: "denver",
    badge: "DUE FRIDAY · 11 RECEIPTS · GMAIL",
    badgeColor: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    headline: "Denver trip expenses are due",
    body: "2 flights, Marriott, 6 Ubers, and dinners. I can fill out everything for you.",
    actionText: "File my expenses",
    doneText: "Expenses submitted",
    actionColor: "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-purple-500/20",
    actionDraftText: "read the plan >",
  },
  {
    id: "hawaii",
    badge: "GROUP PLAN · RESEARCHED · WHATSAPP",
    badgeColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    headline: "Hawaii trip needs to leave chat",
    body: "You four have been circling July dates. Found 3 flights and 2 houses for $1,500.",
    actionText: "Send it to the group",
    doneText: "Sent to WhatsApp",
    actionColor: "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-emerald-500/20",
    actionDraftText: "read the message >",
  },
];

interface FilmExperienceProps {
  theme?: "white" | "dark";
}

export const FilmExperience: React.FC<FilmExperienceProps> = ({ theme = "white" }) => {
  const isWhite = theme === "white";
  const containerRef = useRef<HTMLElement>(null);

  // Responsive scale to eliminate horizontal overflows and vertical collisions
  const [viewportScale, setViewportScale] = useState(1);
  const viewportScaleMotion = useMotionValue(1);

  useEffect(() => {
    const updateViewportScale = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      let s = 1;
      if (w < 480) {
        // iPhone / Mobile (e.g. 390px):
        // Scale 770px down to fit comfortably with safe margins
        s = Math.min(0.46, (w - 36) / 770);
      } else if (w < 820) {
        // Tablet / iPad (e.g. 768px):
        s = Math.min(0.85, (w - 48) / 770);
      } else {
        // Desktop: fit comfortably within 50% viewport height and width
        const maxHScale = (h * 0.50) / 521;
        const maxWScale = (w - 64) / 770;
        s = Math.min(1.0, Math.min(maxHScale, maxWScale));
      }
      setViewportScale(s);
      viewportScaleMotion.set(s);
    };
    updateViewportScale();
    window.addEventListener("resize", updateViewportScale);
    return () => window.removeEventListener("resize", updateViewportScale);
  }, [viewportScaleMotion]);

  // Scroll tracking across 700vh timeline
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 26,
    restDelta: 0.001,
  });

  // Entrance animation: On mount, lid animates open from -78deg to 0deg (Image 1)
  const entranceLid = useMotionValue<number>(-78);
  const entranceScreen = useMotionValue<number>(0);

  useEffect(() => {
    const controlsLid = animate(entranceLid, 0, {
      duration: 1.6,
      delay: 0.2,
      ease: [0.16, 1, 0.3, 1],
    });
    const controlsScreen = animate(entranceScreen, 1, {
      duration: 1.2,
      delay: 0.4,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => {
      controlsLid.stop();
      controlsScreen.stop();
    };
  }, [entranceLid, entranceScreen]);

  // Scroll-based Lid Angle:
  // [0, 0.12] -> 0 (upright open for Hero / Scene 1)
  // [0.12, 0.25] -> rotates down to -90deg (closes flat for While you sleep / Scene 2)
  // [0.25, 0.50] -> stays at -90deg (stays closed for Constellation / Scene 3)
  // [0.50, 0.66] -> rotates back up to 0deg (opens upright for Morning / Scene 4)
  // [0.66, 1.00] -> stays at 0deg (stays upright open for Sidekick / Scene 5)
  const scrollLidAngle = useTransform(
    smoothProgress,
    [0, 0.12, 0.25, 0.50, 0.66, 1],
    [0, 0, -90, -90, 0, 0]
  );

  // Combined lid angle: initial entrance animation at top, scroll-controlled once scrolled
  const currentLidAngle = useTransform<number, number>(
    [entranceLid, scrollLidAngle, smoothProgress],
    ([ent, scr, prog]: number[]): number => {
      if (prog > 0.02) return scr;
      return ent;
    }
  );

  // Screen opacity: 1 when open, 0 when closed
  const scrollScreenOpacity = useTransform(
    currentLidAngle,
    [-90, -35, 0],
    [0, 0.3, 1]
  );

  // Seam glow when lid is closed:
  const seamGlow = useTransform(
    currentLidAngle,
    [-90, -70, -20, 0],
    [1, 0.9, 0.2, 0]
  );

  // Dynamic Perspective Origin: shifts from 80% (open) to 95% (closed)
  const perspectiveOriginY = useTransform(currentLidAngle, [-90, -50, 0], [95, 84, 80]);
  const dynamicPerspectiveOrigin = useMotionTemplate`50% ${perspectiveOriginY}%`;

  // Base Y translation adjusts to perfectly align base under lid edge when closed
  const baseTranslateY = useTransform(currentLidAngle, [0, -90], [0, 11]);
  const baseTransform = useMotionTemplate`translateZ(521px) translateY(${baseTranslateY}px)`;

  // MacBook zoom & Y
  const macScale = useTransform(
    smoothProgress,
    [0, 0.15, 0.45, 0.65, 0.85, 1],
    [1, 1, 0.96, 1.05, 1.05, 1]
  );
  const macY = useTransform(
    smoothProgress,
    [0, 0.2, 0.45, 0.65, 0.85, 1],
    [0, 8, 12, 0, -6, -3]
  );

  // Responsive combined scale: macScale * viewportScaleMotion
  const combinedScale = useTransform(
    [macScale, viewportScaleMotion],
    ([m, v]: number[]) => m * v
  );

  // ----------------------------------------------------
  // The 5 Narrative Scenes
  // ----------------------------------------------------
  const scene1Opacity = useTransform(smoothProgress, [0, 0.08, 0.14], [1, 1, 0]);
  const scene1Y = useTransform(smoothProgress, [0, 0.14], [0, -18]);

  const scene2Opacity = useTransform(
    smoothProgress,
    [0.13, 0.18, 0.28, 0.33],
    [0, 1, 1, 0]
  );
  const scene2Y = useTransform(smoothProgress, [0.13, 0.18, 0.33], [18, 0, -18]);

  const scene3Opacity = useTransform(
    smoothProgress,
    [0.32, 0.37, 0.48, 0.53],
    [0, 1, 1, 0]
  );
  const scene3Y = useTransform(smoothProgress, [0.32, 0.37, 0.53], [18, 0, -18]);

  const scene4Opacity = useTransform(
    smoothProgress,
    [0.52, 0.58, 0.72, 0.77],
    [0, 1, 1, 0]
  );
  const scene4Y = useTransform(smoothProgress, [0.52, 0.58, 0.77], [18, 0, -18]);

  const scene5Opacity = useTransform(
    smoothProgress,
    [0.76, 0.81, 0.93, 0.98],
    [0, 1, 1, 0]
  );
  const scene5Y = useTransform(smoothProgress, [0.76, 0.81, 0.98], [18, 0, -18]);

  // Active Screen Phase
  const [screenPhase, setScreenPhase] = useState<"triage" | "morning" | "sidekick">("triage");

  useEffect(() => {
    return smoothProgress.on("change", (v) => {
      if (v < 0.52) setScreenPhase("triage");
      else if (v < 0.77) setScreenPhase("morning");
      else setScreenPhase("sidekick");
    });
  }, [smoothProgress]);

  // Morning Cards Interactive State
  const [cardsDone, setCardsDone] = useState<Record<string, boolean>>({});
  const toggleCard = (id: string) => {
    setCardsDone((prev) => ({ ...prev, [id]: !prev[id] }));
  };
  const resetAllCards = () => {
    setCardsDone({});
  };

  // Rotating prompts
  const PROMPT_SUGGESTIONS = [
    "Tell me what you want me to DO...",
    "Order groceries for the risotto recipe",
    "Cancel unused subscriptions",
    "Plan next week's schedule",
  ];
  const [promptIdx, setPromptIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIdx((prev) => (prev + 1) % PROMPT_SUGGESTIONS.length);
    }, 4200);
    return () => clearInterval(interval);
  }, []);

  // Scene 5 / Sidekick loop: matches media_1788693209291.png
  const [cartCount, setCartCount] = useState(3);
  const [isOrdered, setIsOrdered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 520, y: 320 });

  useEffect(() => {
    if (screenPhase !== "sidekick") return;
    const timers: any[] = [];
    const schedule = (fn: () => void, ms: number) => {
      const id = setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    const runLoop = () => {
      setCartCount(1);
      setIsOrdered(false);
      setCursorPos({ x: 340, y: 150 });

      schedule(() => {
        setCartCount(2);
        setCursorPos({ x: 400, y: 200 });
      }, 1200);

      schedule(() => {
        setCartCount(3);
        setCursorPos({ x: 460, y: 250 });
      }, 2400);

      schedule(() => {
        setCartCount(4);
        setCursorPos({ x: 510, y: 290 });
      }, 3600);

      schedule(() => {
        setCartCount(5);
        setCursorPos({ x: 560, y: 340 });
      }, 4800);

      schedule(() => {
        setCursorPos({ x: 590, y: 400 });
      }, 5800);

      schedule(() => {
        setIsOrdered(true);
        schedule(runLoop, 6800);
      }, 6400);
    };

    runLoop();
    return () => timers.forEach(clearTimeout);
  }, [screenPhase]);

  return (
    <section
      ref={containerRef}
      id="film-experience"
      className={`relative transition-colors duration-500 ${
        isWhite ? "bg-[#fafafa] text-slate-900" : "bg-black text-white"
      }`}
      style={{ height: "700vh" }}
    >
      {/* Sticky Fullscreen Viewport */}
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden">
        {/* Ambient Chromatic Glow */}
        <div
          aria-hidden={true}
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 w-[1300px] h-[920px]"
          style={{
            background: isWhite
              ? "radial-gradient(closest-side, rgba(139,92,246,0.12), rgba(236,72,153,0.08) 35%, rgba(59,130,246,0.06) 65%, transparent 80%)"
              : "radial-gradient(closest-side, rgba(139,92,246,0.08), rgba(255,255,255,0.015) 55%, transparent 75%)",
          }}
        />

        {/* ============================================================ */}
        {/* NARRATION OVERLAYS (Responsive positioning to never overlap) */}
        {/* ============================================================ */}

        {/* Scene 1: Hero Narration */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-30 px-4 sm:px-6 text-center"
          style={{
            top: viewportScale < 0.6 ? "76px" : "clamp(84px, 10.5svh, 110px)",
            opacity: scene1Opacity,
            y: scene1Y,
          }}
        >
          <div className="mx-auto max-w-3xl flex flex-col items-center gap-1.5 sm:gap-2">
            <h1
              className={`font-instrument-serif text-balance text-2xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.06] tracking-tight ${
                isWhite ? "text-slate-900" : "text-white"
              }`}
            >
              Your Mac, <span className="italic font-normal">sentient</span>.
            </h1>
            <p
              className={`max-w-xl text-balance text-xs sm:text-sm md:text-[15px] leading-snug ${
                isWhite ? "text-slate-600" : "text-white/60"
              }`}
            >
              An{" "}
              <strong className={`font-semibold ${isWhite ? "text-slate-900" : "text-white/90"}`}>
                on-device LLM
              </strong>{" "}
              understands your entire life, then{" "}
              <strong className={`font-semibold ${isWhite ? "text-slate-900" : "text-white/90"}`}>
                proactively
              </strong>{" "}
              offers to get your work done through{" "}
              <strong className={`font-semibold ${isWhite ? "text-slate-900" : "text-white/90"}`}>
                computer use
              </strong>
              .
            </p>
          </div>
        </motion.div>

        {/* Scene 2: While you sleep */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-30 px-4 sm:px-6 text-center"
          style={{
            top: viewportScale < 0.6 ? "76px" : "clamp(84px, 10.5svh, 110px)",
            opacity: scene2Opacity,
            y: scene2Y,
          }}
        >
          <p
            className={`font-instrument-serif text-balance text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] leading-tight ${
              isWhite ? "text-slate-900" : "text-white"
            }`}
          >
            While you sleep,<br />your Mac understands your entire life.
          </p>
          <p
            className={`mt-2.5 font-mono text-[9.5px] sm:text-[11px] uppercase tracking-[0.3em] ${
              isWhite ? "text-slate-500 font-semibold" : "text-white/40"
            }`}
          >
            3:00 AM · YOUR FILES NEVER LEAVE YOUR DEVICE
          </p>
        </motion.div>

        {/* Scene 3: Knowledge Base & Constellation Narration */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-30 px-4 sm:px-6 text-center"
          style={{
            top: viewportScale < 0.6 ? "76px" : "clamp(84px, 10.5svh, 110px)",
            opacity: scene3Opacity,
            y: scene3Y,
          }}
        >
          <p
            className={`font-instrument-serif text-balance text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] leading-tight ${
              isWhite ? "text-slate-900" : "text-white"
            }`}
          >
            To create a knowledge base of everything.
          </p>
          <p
            className={`mt-2.5 font-mono text-[9.5px] sm:text-[11px] uppercase tracking-[0.3em] ${
              isWhite ? "text-slate-500 font-semibold" : "text-white/40"
            }`}
          >
            PLAIN MARKDOWN &amp; FOLDERS · ON YOUR MAC · YOURS
          </p>
        </motion.div>

        {/* Scene 4: Morning Proactive Narration */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-30 px-4 sm:px-6 text-center"
          style={{
            top: viewportScale < 0.6 ? "76px" : "clamp(84px, 10.5svh, 110px)",
            opacity: scene4Opacity,
            y: scene4Y,
          }}
        >
          <p
            className={`font-instrument-serif text-balance text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] leading-tight ${
              isWhite ? "text-slate-900" : "text-white"
            }`}
          >
            So you wake up to your work finished in one click.
          </p>
          <p
            className={`mt-2 font-mono text-[9.5px] sm:text-[11px] uppercase tracking-[0.3em] ${
              isWhite ? "text-slate-500 font-semibold" : "text-white/40"
            }`}
          >
            9:00 AM ·{" "}
            <strong className={`font-semibold ${isWhite ? "text-indigo-600" : "text-white/80"}`}>
              PROACTIVE INTELLIGENCE
            </strong>
          </p>
        </motion.div>

        {/* Scene 5: Sidekick Autonomous Narration */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 z-30 px-4 sm:px-6 text-center"
          style={{
            top: viewportScale < 0.6 ? "76px" : "clamp(84px, 10.5svh, 110px)",
            opacity: scene5Opacity,
            y: scene5Y,
          }}
        >
          <p
            className={`font-instrument-serif text-balance text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] leading-tight ${
              isWhite ? "text-slate-900" : "text-white"
            }`}
          >
            One more thing. Meet Sidekick.
          </p>
        </motion.div>

        {/* ============================================================ */}
        {/* CONSTELLATION OVERLAY (Scene 3 / Image 3) */}
        {/* ============================================================ */}
        <motion.div
          aria-hidden={true}
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 mx-auto max-w-[720px] px-4"
          style={{
            height: viewportScale < 0.6 ? "320px" : "440px",
            opacity: scene3Opacity,
          }}
        >
          <div className="relative size-full">
            <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              {CONSTELLATION_EDGES.map(([fromIdx, toIdx], i) => {
                const f = STARS[fromIdx];
                const t = STARS[toIdx];
                return (
                  <line
                    key={i}
                    x1={f.x * 100}
                    y1={f.y * 100}
                    x2={t.x * 100}
                    y2={t.y * 100}
                    stroke={isWhite ? "rgba(100, 116, 139, 0.4)" : "rgba(255, 255, 255, 0.14)"}
                    strokeWidth="0.8"
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>

            {STARS.map((star, idx) => (
              <span
                key={idx}
                className="absolute rounded-full -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${star.x * 100}%`,
                  top: `${star.y * 100}%`,
                  width: `${star.r}px`,
                  height: `${star.r}px`,
                  backgroundColor: star.color,
                  boxShadow: isWhite
                    ? `0 0 10px ${star.color}`
                    : `0 0 10px ${star.glow}`,
                }}
              />
            ))}

            {CONSTELLATION_LABELS.map((lbl) => (
              <span
                key={lbl.text}
                className={`absolute -translate-x-1/2 font-mono text-[9.5px] sm:text-[10px] uppercase tracking-[0.25em] ${
                  isWhite ? "text-slate-700 font-semibold" : "text-white/40"
                }`}
                style={{ left: lbl.x, top: lbl.y }}
              >
                {lbl.text}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ============================================================ */}
        {/* RESPONSIVE SCALED MACBOOK CONTAINER (Zero Overflows / Zero Collisions) */}
        {/* ============================================================ */}
        <div
          className="relative z-10 flex items-center justify-center pointer-events-none"
          style={{
            width: `${770 * viewportScale}px`,
            height: `${521 * viewportScale}px`,
            marginTop: viewportScale < 0.6 ? "56px" : "clamp(72px, 12svh, 110px)",
            maxWidth: "96vw",
          }}
        >
          <motion.div
            className="pointer-events-auto"
            style={{
              position: "relative",
              width: "770px",
              height: "521px",
              scale: combinedScale,
              y: macY,
              transformOrigin: "center center",
              flexShrink: 0,
            }}
          >
            <motion.div
              className="relative size-full"
              style={{
                perspective: "5000px",
                perspectiveOrigin: dynamicPerspectiveOrigin,
              }}
            >
              <div style={{ transformStyle: "preserve-3d" }} className="absolute inset-0">
                {/* MacBook Lid Hinged at Bottom */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "50% 100%",
                    rotateX: currentLidAngle,
                    willChange: "transform",
                  }}
                >
                  {/* Backplate / Screen Bezel */}
                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      borderRadius: "23px",
                      background: "#07080a",
                      boxShadow: isWhite
                        ? "0 35px 80px -15px rgba(0,0,0,0.32), 0 0 0 1px rgba(0,0,0,0.08)"
                        : "0 24px 80px rgba(0,0,0,0.8)",
                    }}
                    className="absolute inset-0 border border-white/10"
                  >
                    {/* Inside Display Area: 749px x 485px */}
                    <motion.div
                      className="absolute overflow-hidden bg-black text-white"
                      style={{
                        left: "10px",
                        top: "11px",
                        width: "749px",
                        height: "485px",
                        borderRadius: "6px",
                        isolation: "isolate",
                        opacity: scrollScreenOpacity,
                      }}
                    >
                      {/* Ambient Screen Background */}
                      <div
                        aria-hidden={true}
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.09)_0%,rgba(15,23,42,0.6)_60%,transparent_100%)]"
                      />

                      {/* macOS Menubar */}
                      <div className="absolute inset-x-0 top-0 z-30 flex h-[22px] items-center justify-between border-b border-white/[0.06] bg-white/[0.04] px-3 text-[10.5px]">
                        <div className="flex items-center gap-3.5">
                          <span className="font-semibold text-white/90">Sentient OS</span>
                          <span className="hidden sm:inline text-white/40">File</span>
                          <span className="hidden sm:inline text-white/40">Edit</span>
                          <span className="hidden sm:inline text-white/40">View</span>
                          <span className="hidden sm:inline text-white/40">Window</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-white/50">
                            {screenPhase === "triage" ? "Wed 3:00 AM" : "Wed 9:00 AM"}
                          </span>
                          <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-mono text-white/80">
                            Apple Silicon
                          </span>
                        </div>
                      </div>

                      {/* ======================================================== */}
                      {/* SCREEN CONTENT BY PHASE */}
                      {/* ======================================================== */}
                      <AnimatePresence mode="wait">
                        {/* 1. TRIAGE WINDOW (Scene 1 & 2) with Authentic Video and 4 Card Stacks */}
                        {screenPhase === "triage" && (
                          <motion.div
                            key="triage"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 pt-7 flex items-center justify-center overflow-hidden"
                          >
                            {/* 4 Floating Card Stacks matching original sentient-os */}
                            {/* Top-Left Stack */}
                            <motion.div
                              animate={{ y: [0, -6, 0], rotate: [-11, -9, -11] }}
                              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
                              className="pointer-events-none absolute select-none z-10"
                              style={{ left: "28px", top: "36px", width: "128px" }}
                            >
                              <img
                                src="/film/stack_tl_trans.png"
                                alt=""
                                className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                              />
                            </motion.div>

                            {/* Top-Right Stack */}
                            <motion.div
                              animate={{ y: [0, 7, 0], rotate: [11, 13, 11] }}
                              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
                              className="pointer-events-none absolute select-none z-10"
                              style={{ right: "28px", top: "36px", width: "128px" }}
                            >
                              <img
                                src="/film/stack_tr_trans.png"
                                alt=""
                                className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                              />
                            </motion.div>

                            {/* Bottom-Left Stack */}
                            <motion.div
                              animate={{ y: [0, -5, 0], rotate: [7, 5, 7] }}
                              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                              className="pointer-events-none absolute select-none z-10"
                              style={{ left: "28px", bottom: "28px", width: "128px" }}
                            >
                              <img
                                src="/film/stack_bl_trans.png"
                                alt=""
                                className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                              />
                            </motion.div>

                            {/* Bottom-Right Stack */}
                            <motion.div
                              animate={{ y: [0, 6, 0], rotate: [-8, -6, -8] }}
                              transition={{ duration: 5.0, repeat: Infinity, ease: "easeInOut" }}
                              className="pointer-events-none absolute select-none z-10"
                              style={{ right: "28px", bottom: "28px", width: "128px" }}
                            >
                              <img
                                src="/film/stack_br_trans.png"
                                alt=""
                                className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)]"
                              />
                            </motion.div>

                            {/* Center Triage Window with Authentic Video */}
                            <div
                              className="absolute z-20"
                              style={{
                                left: "50%",
                                top: "53%",
                                transform: "translate(-50%, -50%)",
                                width: "273px",
                              }}
                            >
                              {/* Authentic Purple/Indigo Radial Glow behind video */}
                              <div
                                aria-hidden={true}
                                className="pointer-events-none absolute"
                                style={{
                                  inset: "-136.5px",
                                  background:
                                    "radial-gradient(closest-side, rgba(139, 92, 246, 0.58), rgba(91, 33, 182, 0.26) 45%, transparent 78%)",
                                  filter: "blur(24px)",
                                  transform: "scale(1.015)",
                                }}
                              />
                              <div
                                className="relative"
                                style={{
                                  borderRadius: "9.7px 9.7px 27.8px 27.8px",
                                  boxShadow: "0 18px 60px rgba(0,0,0,0.65)",
                                }}
                              >
                                <div
                                  className="overflow-hidden"
                                  style={{
                                    borderRadius: "9.7px 9.7px 27.8px 27.8px",
                                    background: "#000",
                                    aspectRatio: "786 / 1006",
                                  }}
                                >
                                  <video
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="auto"
                                    aria-hidden="true"
                                    className="block"
                                    style={{
                                      width: "100.8%",
                                      marginLeft: "-0.4%",
                                      marginTop: "-0.3%",
                                      maxWidth: "none",
                                    }}
                                    src="/sentient-rec-h264.mp4"
                                  />
                                </div>
                                {/* Subtle glass reflection mask border */}
                                <div
                                  aria-hidden={true}
                                  className="pointer-events-none absolute inset-0"
                                  style={{
                                    borderRadius: "9.7px 9.7px 27.8px 27.8px",
                                    border: "1px solid rgba(255,255,255,0.12)",
                                    maskImage: "linear-gradient(to bottom, black 55%, transparent 80%)",
                                    WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 80%)",
                                  }}
                                />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* 2. MORNING PROACTIVE DASHBOARD (Scene 4) */}
                        {screenPhase === "morning" && (
                          <motion.div
                            key="morning"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 pt-7 p-3 flex flex-col justify-between overflow-hidden select-none"
                          >
                            <div>
                              {/* Header greeting */}
                              <div className="flex items-center justify-between px-1 mb-2">
                                <div>
                                  <h2 className="font-instrument-serif text-[18px] text-white">Good morning, Jesai.</h2>
                                  <p className="font-mono text-[8.5px] uppercase tracking-widest text-white/40">
                                    I'VE READ 197 THINGS SO FAR
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-mono text-emerald-300">
                                    ● Analysis
                                  </span>
                                  <span className="text-[9px] font-mono text-white/40">Knowledge</span>
                                  <span className="text-[9px] font-mono text-white/40">Give AIs Knowledge</span>
                                  <button
                                    onClick={resetAllCards}
                                    title="Reset cards"
                                    className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-mono text-white/60 hover:bg-white/10 transition-colors"
                                  >
                                    <RotateCcw className="size-2.5" />
                                    <span>Reset</span>
                                  </button>
                                </div>
                              </div>

                              {/* 6 Proactive Cards Grid */}
                              <div className="grid grid-cols-3 gap-2">
                                {INITIAL_MORNING_CARDS.map((card) => {
                                  const isDone = !!cardsDone[card.id];
                                  return (
                                    <div
                                      key={card.id}
                                      className="group relative rounded-xl border border-white/10 bg-neutral-950/80 p-2.5 flex flex-col justify-between hover:border-white/20 transition-all shadow-md"
                                      style={{ height: "135px" }}
                                    >
                                      <div>
                                        <span className={`inline-block font-mono text-[7.5px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${card.badgeColor}`}>
                                          {card.badge}
                                        </span>
                                        <h4 className="font-serif text-[12px] font-medium leading-tight text-white mt-1">
                                          {card.headline}
                                        </h4>
                                        <p className="text-[9px] text-white/60 leading-snug line-clamp-2 mt-1">
                                          {card.body}
                                        </p>
                                      </div>

                                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                                        <button
                                          onClick={() => toggleCard(card.id)}
                                          className={`cursor-pointer rounded-full px-2.5 py-1 text-[9px] font-semibold transition-all active:scale-95 flex items-center gap-1 ${
                                            isDone ? "bg-emerald-500 text-black shadow-emerald-500/20" : card.actionColor
                                          }`}
                                        >
                                          {isDone && <Check className="size-2.5" />}
                                          <span>{isDone ? card.doneText : card.actionText}</span>
                                        </button>
                                        <span className="text-[8px] font-mono text-white/30 truncate">
                                          {card.actionDraftText}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}

                                {/* 6th Special Card: Gift */}
                                <div
                                  className="relative rounded-xl border border-white/10 bg-neutral-950/80 p-2.5 flex flex-col items-center justify-center text-center shadow-md"
                                  style={{ height: "135px" }}
                                >
                                  <div className="size-8 rounded-full border border-purple-500/30 bg-purple-950/40 flex items-center justify-center text-purple-400 mb-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                    <span className="size-2 rounded-full bg-purple-400 animate-ping" />
                                  </div>
                                  <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/40">
                                    A GIFT FROM YOUR SENTIENT
                                  </p>
                                  <p className="font-instrument-serif text-[15px] italic text-white/90 mt-0.5">
                                    For You
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Rainbow Glow Prompt Bar */}
                            <div className="relative mt-2">
                              <div className="ms-glow relative flex h-10 items-center justify-between rounded-xl bg-neutral-950/90 px-3 border border-white/10 shadow-lg">
                                <div className="flex items-center gap-2 text-[11px] text-white/70">
                                  <span className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[9px] text-white/80">
                                    <Sparkles className="size-2.5 text-indigo-400" />
                                    <span>Computer use</span>
                                  </span>
                                  <span className="text-white/40 font-mono text-[10px]">
                                    {PROMPT_SUGGESTIONS[promptIdx]}
                                  </span>
                                </div>
                                <Send className="size-3.5 text-white/40" />
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {/* 3. SIDEKICK DUAL WINDOW CART & DYNAMIC NOTCH (Scene 5 matching media_1788693209291.png) */}
                        {screenPhase === "sidekick" && (
                          <motion.div
                            key="sidekick"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 pt-7 p-3 flex gap-3 overflow-hidden select-none"
                          >
                            {/* ======================================================= */}
                            {/* Left Window: The Weeknight Table Recipe (media_1788693209291) */}
                            {/* ======================================================= */}
                            <div className="relative flex-1 flex flex-col rounded-xl border border-white/15 bg-[#141518] overflow-hidden shadow-2xl">
                              {/* macOS Window Titlebar */}
                              <div className="flex h-7 items-center justify-between border-b border-white/10 bg-white/5 px-3 text-[10.5px]">
                                <div className="flex items-center gap-1.5">
                                  <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                                  <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                                  <span className="size-2.5 rounded-full bg-[#27c93f]" />
                                </div>
                                <div className="flex items-center gap-1 text-white/80 text-[10px]">
                                  <span className="text-amber-400 text-[11px]">🍲</span>
                                  <span className="font-medium truncate max-w-[180px]">Seared Scallops with Saffron Risotto</span>
                                </div>
                                <div className="w-8" />
                              </div>

                              {/* URL Bar */}
                              <div className="mx-2.5 mt-2 flex h-6 items-center gap-1.5 rounded-md border border-white/10 bg-black/40 px-2 text-[9px] text-white/50 font-mono">
                                <Lock className="size-2.5 text-white/40" />
                                <span className="truncate">theweeknighttable.com/seared-scallops-saffron-risotto</span>
                              </div>

                              {/* Recipe Body: 2 Columns */}
                              <div className="p-3 flex-1 flex gap-3 overflow-hidden text-white">
                                {/* Left: Ingredients list */}
                                <div className="w-1/2 flex flex-col justify-between">
                                  <div>
                                    <p className="font-mono text-[8px] uppercase tracking-wider text-white/40 font-bold mb-2">
                                      INGREDIENTS
                                    </p>
                                    <div className="space-y-1 text-[9px] text-neutral-300">
                                      {[
                                        "1 lb sea scallops",
                                        "A generous pinch of saffron threads",
                                        "1 1/2 cups arborio rice",
                                        "3 shallots, finely chopped",
                                        "2 oz Parmigiano-Reggiano, grated",
                                        "4 tbsp unsalted butter",
                                        "1 lemon, zested",
                                        "4 cups chicken stock, warmed",
                                      ].map((ing) => (
                                        <div key={ing} className="flex items-center gap-1.5">
                                          <span className="size-2 rounded-full border border-white/30 shrink-0" />
                                          <span className="truncate">{ing}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>

                                {/* Right: Photo & Preparation */}
                                <div className="w-1/2 flex flex-col justify-between">
                                  <img
                                    src="/film/shop/risotto.jpg"
                                    alt="Seared Scallops with Saffron Risotto"
                                    className="w-full h-24 rounded-lg object-cover border border-white/10 shrink-0 shadow-md"
                                  />
                                  <div className="mt-2 text-[8px] text-white/50 leading-relaxed overflow-hidden">
                                    <p className="font-mono uppercase tracking-wider text-white/40 font-bold mb-1">
                                      PREPARATION
                                    </p>
                                    <p>1. Warm the stock over low heat and steep saffron until color blooms.</p>
                                    <p>2. Sweat shallots in butter until translucent.</p>
                                    <p>3. Toast rice with shallots until glassy.</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* ======================================================= */}
                            {/* Right Window: Amazon.com Shopping Cart (media_1788693209291) */}
                            {/* ======================================================= */}
                            <div className="relative flex-1 flex flex-col rounded-xl border border-white/15 bg-white text-neutral-900 overflow-hidden shadow-2xl">
                              {/* macOS Window Titlebar */}
                              <div className="flex h-7 items-center justify-between border-b border-neutral-200 bg-[#f6f6f6] px-3 text-[10.5px]">
                                <div className="flex items-center gap-1.5">
                                  <span className="size-2.5 rounded-full bg-[#ff5f56]" />
                                  <span className="size-2.5 rounded-full bg-[#ffbd2e]" />
                                  <span className="size-2.5 rounded-full bg-[#27c93f]" />
                                </div>
                                <div className="flex items-center gap-1 text-neutral-700 text-[10px]">
                                  <span className="size-3 rounded bg-amber-500 text-white font-bold text-[8px] flex items-center justify-center font-sans">
                                    a
                                  </span>
                                  <span className="font-medium truncate max-w-[180px]">Amazon.com Shopping Cart</span>
                                </div>
                                <div className="w-8" />
                              </div>

                              {/* URL Bar */}
                              <div className="mx-2.5 mt-1.5 flex h-5 items-center gap-1.5 rounded-md border border-neutral-200 bg-neutral-100 px-2 text-[8.5px] text-neutral-600 font-mono">
                                <Lock className="size-2 text-neutral-400" />
                                <span className="truncate">amazon.com/gp/cart/view.html</span>
                              </div>

                              {/* Amazon Navy Header */}
                              <div className="mt-1.5 bg-[#131921] px-3 py-1.5 flex items-center justify-between text-white text-[9px]">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-[11px] tracking-tight">amazon</span>
                                  <span className="text-white/60 text-[8px]">Deliver to San Francisco 94110</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center rounded bg-white px-1.5 py-0.5 text-neutral-900">
                                    <span className="text-[8.5px]">sea scallops</span>
                                    <span className="ml-1 text-[8px] text-amber-500 font-bold">🔍</span>
                                  </div>
                                  <span className="text-white/80 text-[8.5px]">Returns &amp; Orders</span>
                                  <span className="font-bold text-amber-400 text-[9.5px]">🛒 {cartCount}</span>
                                </div>
                              </div>

                              {/* Amazon Subnav */}
                              <div className="bg-[#232f3e] px-3 py-1 text-white/80 text-[8px] flex items-center gap-3">
                                <span>Today's Deals</span>
                                <span>Buy Again</span>
                                <span>Customer Service</span>
                                <span>Registry</span>
                              </div>

                              {/* Cart Body */}
                              <div className="p-3 flex-1 flex flex-col justify-between overflow-hidden bg-white">
                                <div>
                                  <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-1">
                                    Shopping Cart
                                  </h3>

                                  <div className="mt-1.5 space-y-1 text-[8.5px]">
                                    {/* Item 1 */}
                                    <div className="flex items-center gap-2 border-b border-neutral-100 pb-1">
                                      <img
                                        src="/film/shop/scallops-dry.jpg"
                                        alt="Scallops"
                                        className="size-7 rounded object-cover border border-neutral-200 shrink-0"
                                      />
                                      <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-neutral-900 truncate">Wild-Caught Sea Scallops, 1 lb</p>
                                        <p className="text-[7px] text-emerald-700">In Stock · Qty: 1 · <span className="text-blue-600 underline">Delete</span></p>
                                      </div>
                                      <span className="font-bold text-neutral-900 text-[9px] shrink-0">$24.99</span>
                                    </div>

                                    {/* Item 2 */}
                                    {cartCount >= 2 && (
                                      <div className="flex items-center gap-2 border-b border-neutral-100 pb-1">
                                        <img
                                          src="/film/shop/saffron.jpg"
                                          alt="Saffron"
                                          className="size-7 rounded object-cover border border-neutral-200 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-neutral-900 truncate">Saffron Threads, Grade A, 1 g</p>
                                          <p className="text-[7px] text-emerald-700">In Stock · Qty: 1 · <span className="text-blue-600 underline">Delete</span></p>
                                        </div>
                                        <span className="font-bold text-neutral-900 text-[9px] shrink-0">$12.99</span>
                                      </div>
                                    )}

                                    {/* Item 3 */}
                                    {cartCount >= 3 && (
                                      <div className="flex items-center gap-2 border-b border-neutral-100 pb-1">
                                        <img
                                          src="/film/shop/shallot.jpg"
                                          alt="Shallots"
                                          className="size-7 rounded object-cover border border-neutral-200 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-neutral-900 truncate">Organic Shallots, 3 ct</p>
                                          <p className="text-[7px] text-emerald-700">In Stock · Qty: 1 · <span className="text-blue-600 underline">Delete</span></p>
                                        </div>
                                        <span className="font-bold text-neutral-900 text-[9px] shrink-0">$2.49</span>
                                      </div>
                                    )}

                                    {/* Item 4 */}
                                    {cartCount >= 4 && (
                                      <div className="flex items-center gap-2 border-b border-neutral-100 pb-1">
                                        <img
                                          src="/film/shop/parmigiano.jpg"
                                          alt="Parmigiano"
                                          className="size-7 rounded object-cover border border-neutral-200 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-neutral-900 truncate">Parmigiano-Reggiano Wedge, 8 oz</p>
                                          <p className="text-[7px] text-emerald-700">In Stock · Qty: 1 · <span className="text-blue-600 underline">Delete</span></p>
                                        </div>
                                        <span className="font-bold text-neutral-900 text-[9px] shrink-0">$9.99</span>
                                      </div>
                                    )}

                                    {/* Item 5 */}
                                    {cartCount >= 5 && (
                                      <div className="flex items-center gap-2 border-b border-neutral-100 pb-1">
                                        <img
                                          src="/film/shop/broth.jpg"
                                          alt="Chicken Broth"
                                          className="size-7 rounded object-cover border border-neutral-200 shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                          <p className="font-semibold text-neutral-900 truncate">Organic Chicken Broth, 32 oz</p>
                                          <p className="text-[7px] text-emerald-700">In Stock · Qty: 1 · <span className="text-blue-600 underline">Delete</span></p>
                                        </div>
                                        <span className="font-bold text-neutral-900 text-[9px] shrink-0">$3.79</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Checkout Button / Subtotal */}
                                <div className="border-t border-neutral-200 pt-1.5 flex items-center justify-between">
                                  <div className="text-[9.5px] font-semibold text-neutral-800">
                                    Subtotal ({cartCount} items):{" "}
                                    <span className="text-neutral-950 font-bold">
                                      $
                                      {(
                                        24.99 +
                                        (cartCount >= 2 ? 12.99 : 0) +
                                        (cartCount >= 3 ? 2.49 : 0) +
                                        (cartCount >= 4 ? 9.99 : 0) +
                                        (cartCount >= 5 ? 3.79 : 0)
                                      ).toFixed(2)}
                                    </span>
                                  </div>
                                  <button
                                    className={`px-3 py-1 rounded-md text-[9px] font-bold shadow-sm transition-all ${
                                      isOrdered
                                        ? "bg-emerald-500 text-white"
                                        : "bg-[#ffd814] hover:bg-[#f7ca00] text-neutral-900"
                                    }`}
                                  >
                                    {isOrdered ? "✓ Order Placed" : "Proceed to Checkout"}
                                  </button>
                                </div>
                              </div>

                              {/* Mouse Pointer with Rainbow Glowing Aura */}
                              <motion.div
                                animate={{ x: cursorPos.x, y: cursorPos.y }}
                                transition={{ duration: 1.4, ease: "easeInOut" }}
                                className="pointer-events-none absolute left-0 top-0 z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
                              >
                                <div
                                  className="size-16 rounded-full blur-md"
                                  style={{
                                    background: "radial-gradient(circle, rgba(253,226,163,0.6), rgba(232,56,143,0.5), rgba(108,92,229,0.4), transparent 75%)",
                                  }}
                                />
                                <svg
                                  className="absolute size-4 text-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
                                  viewBox="0 0 24 24"
                                  fill="white"
                                  stroke="black"
                                  strokeWidth="1.5"
                                >
                                  <path d="M3 3l7 18 3-7 7-3L3 3z" />
                                </svg>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                    </motion.div>

                    {/* Glass Reflection Glare across the display */}
                    <div
                      aria-hidden={true}
                      style={{
                        zIndex: 15,
                        background:
                          "linear-gradient(115deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 28%, transparent 46%)",
                      }}
                      className="pointer-events-none absolute inset-0"
                    />

                    {/* Photorealistic MacBook Screen Bezel & Notch Hardware Overlay */}
                    <img
                      alt=""
                      draggable={false}
                      src="/film/lid-front.png"
                      className="pointer-events-none select-none absolute inset-0 size-full"
                      style={{ zIndex: 20 }}
                    />

                    {/* DYNAMIC ISLAND (Scene 5 Sidekick) - Elevated to zIndex: 40 to seamlessly expand out from the camera notch */}
                    {screenPhase === "sidekick" && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.96 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 flex flex-col items-center"
                        style={{ zIndex: 40 }}
                      >
                        <div className="relative flex h-[30px] items-center gap-2.5 rounded-b-xl bg-black px-4 shadow-[0_8px_30px_rgba(0,0,0,0.95)] border-x border-b border-white/20">
                          {/* Radial Glow underneath Dynamic Island */}
                          <div
                            aria-hidden={true}
                            className="pointer-events-none absolute -inset-x-8 top-full h-14 blur-md"
                            style={{
                              background:
                                "radial-gradient(ellipse at 50% 0%, rgba(253,226,163,0.6), rgba(232,56,143,0.5) 40%, rgba(108,92,229,0.4) 70%, transparent 95%)",
                            }}
                          />
                          <span className="relative flex size-3 items-center justify-center">
                            <span className="absolute inset-0 rounded-full border border-indigo-400 animate-ping" />
                            <span className="size-1.5 rounded-full bg-indigo-400" />
                          </span>
                          <span className="font-mono text-[9.5px] text-white/95 font-medium tracking-wide">
                            Adding 5 ingredients to the cart
                          </span>
                          <span className="size-2.5 rounded bg-white/20 flex items-center justify-center">
                            <span className="size-1 rounded-sm bg-white" />
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* 2. BACK OF LID (Faces upward when lid closes to -90deg) */}
                  <div
                    style={{
                      transform: "translateZ(-9px) rotateX(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      borderRadius: "23px",
                      background: "linear-gradient(180deg, #131417 0%, #101114 55%, #1d1f23 100%)",
                      border: "1px solid rgba(255,255,255,0.09)",
                      boxShadow: isWhite
                        ? "0 35px 80px -15px rgba(0,0,0,0.32), 0 0 0 1px rgba(0,0,0,0.08)"
                        : "0 24px 80px rgba(0,0,0,0.8)",
                    }}
                    className="absolute inset-0"
                  />

                  {/* 3. TOP EDGE OF LID (Rotates to face camera at Z=521px when lid closes to -90deg) */}
                  <div
                    aria-hidden={true}
                    className="pointer-events-none select-none absolute"
                    style={{
                      left: 0,
                      right: 0,
                      top: -9,
                      height: 9,
                      transformOrigin: "50% 100%",
                      transform: "rotateX(90deg)",
                    }}
                  >
                    <img
                      src="/film/lid-edge.png"
                      alt=""
                      draggable={false}
                      className="size-full object-cover select-none"
                    />
                    {/* Breathing Neon Seam Glow */}
                    <motion.div
                      className="pointer-events-none absolute inset-x-0 bottom-0"
                      style={{ opacity: seamGlow }}
                    >
                      <div
                        className="absolute"
                        style={{
                          left: "1%",
                          right: "1%",
                          bottom: -7,
                          height: 14,
                          background:
                            "linear-gradient(90deg, #4a90e2, #6c5ce5, #9b48d4, #e8388f, #ff4646, #ff8e3c, #fde2a3)",
                          filter: "blur(9px)",
                          opacity: 0.32,
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          left: "0.8%",
                          right: "0.8%",
                          bottom: -2,
                          height: 4,
                          background:
                            "linear-gradient(90deg, #4a90e2, #6c5ce5, #9b48d4, #e8388f, #ff4646, #ff8e3c, #fde2a3)",
                          filter: "blur(2.5px)",
                          opacity: 0.5,
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          left: "0.4%",
                          right: "0.4%",
                          bottom: -0.5,
                          height: 1,
                          borderRadius: 999,
                          background:
                            "linear-gradient(90deg, #6ba6ff, #8b7cff, #c06af0, #ff5aa8, #ff6b5e, #ffab5e, #ffe9b8)",
                        }}
                      />
                      <div
                        className="absolute"
                        style={{
                          left: "8%",
                          right: "8%",
                          bottom: -0.35,
                          height: 0.7,
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.85)",
                          filter: "blur(0.6px)",
                          opacity: 0.45,
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>

                {/* 4. MACBOOK BASE (Keyboard Deck Chassis) */}
                <motion.div
                  aria-hidden={true}
                  className="pointer-events-none select-none absolute left-0 w-[770px] h-[32px]"
                  style={{
                    top: "510px",
                    transform: baseTransform,
                  }}
                >
                  <img
                    src="/film/base.png"
                    alt=""
                    draggable={false}
                    className="size-full object-cover pointer-events-none select-none"
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Sub-headline Underneath MacBook for Scene 5 */}
        <motion.div
          className="pointer-events-none absolute bottom-6 sm:bottom-10 inset-x-0 z-30 px-6 text-center"
          style={{ opacity: scene5Opacity }}
        >
          <p
            className={`font-instrument-serif text-balance text-lg sm:text-2xl md:text-3xl ${
              isWhite ? "text-slate-900" : "text-white"
            }`}
          >
            Sidekick can use your apps in the background
          </p>
          <p
            className={`mt-1 font-mono text-[8.5px] sm:text-[10px] uppercase tracking-[0.3em] ${
              isWhite ? "text-slate-500 font-semibold" : "text-white/40"
            }`}
          >
            LEAVE YOUR GRUNT WORK TO IT
          </p>
        </motion.div>

        {/* Scroll Indicator Chevron */}
        <motion.div
          className="pointer-events-none absolute bottom-4 sm:bottom-5 left-1/2 z-30 -translate-x-1/2"
          style={{ opacity: scene1Opacity }}
        >
          <span
            className={`flex size-7 sm:size-8 items-center justify-center rounded-full shadow-lg ${
              isWhite ? "bg-slate-900 text-white" : "bg-white text-black"
            }`}
          >
            <ChevronDown className="size-3.5 sm:size-4 stroke-[2.5]" />
          </span>
        </motion.div>
      </div>
    </section>
  );
};
