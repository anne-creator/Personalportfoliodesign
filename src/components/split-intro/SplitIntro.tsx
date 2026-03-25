import { useState, useRef, useEffect, useCallback, type CSSProperties } from "react";
import { motion } from "motion/react";
import { useTheme, ThemeScope } from "../ThemeProvider";
import { PortfolioContent } from "../PortfolioContent";

/**
 * Split Fiction–inspired intro + persistent theme-split overlay.
 *
 * Architecture: there is NO separate "real site" underneath. The overlay
 * renders TWO themed copies of the page. After expansion settles, the
 * dominant half *becomes* the live interactive site (scrollable, clickable)
 * while the thin sliver of the other theme stays fixed at the screen edge.
 *
 * This eliminates the flash caused by switching between an overlay copy and
 * a hidden page, because there is only ever one visible copy per theme.
 */

// ── Theme variable overrides ─────────────────────────────────────────────
const DARK_VARS: CSSProperties = {
  "--t-bg": "#08080d",
  "--t-card": "#101018",
  "--t-surface": "#0c0c14",
  "--t-elevated": "#141420",
  "--t-text": "#e0e0ea",
  "--t-text-secondary": "#b0b0c0",
  "--t-text-tertiary": "#8888a0",
  "--t-text-muted": "#5e5e78",
  "--t-text-faint": "#3e3e54",
  "--t-accent": "#00e89a",
  "--t-accent-dim": "rgba(0, 232, 154, 0.25)",
  "--t-border": "rgba(255, 255, 255, 0.06)",
  "--t-divider": "rgba(255, 255, 255, 0.04)",
  "--t-tag-bg": "rgba(0, 232, 154, 0.08)",
  "--t-tag-border": "rgba(0, 232, 154, 0.2)",
  "--t-card-hover-border": "rgba(0, 232, 154, 0.35)",
  "--t-card-hover-shadow":
    "0 0 20px rgba(0, 232, 154, 0.06), 0 0 2px rgba(0, 232, 154, 0.15)",
  "--t-card-radius": "8px",
  "--t-image-border": "rgba(255, 255, 255, 0.06)",
} as CSSProperties;

const LIGHT_VARS: CSSProperties = {
  "--t-bg": "#f7f5f2",
  "--t-card": "#f7f5f2",
  "--t-surface": "#f2efeb",
  "--t-elevated": "#faf8f5",
  "--t-text": "#1a1a1a",
  "--t-text-secondary": "#333333",
  "--t-text-tertiary": "#4a4540",
  "--t-text-muted": "#6b6560",
  "--t-text-faint": "#9a9590",
  "--t-accent": "#179e90",
  "--t-accent-dim": "rgba(23, 158, 144, 0.3)",
  "--t-border": "rgba(0, 0, 0, 0.08)",
  "--t-divider": "rgba(0, 0, 0, 0.06)",
  "--t-tag-bg": "rgba(23, 158, 144, 0.08)",
  "--t-tag-border": "rgba(23, 158, 144, 0.15)",
  "--t-card-hover-border": "rgba(23, 158, 144, 0.3)",
  "--t-card-hover-shadow": "0 2px 8px rgba(0, 0, 0, 0.04)",
  "--t-card-radius": "12px",
  "--t-image-border": "rgba(0, 0, 0, 0.06)",
} as CSSProperties;

// ── Component ──────────────────────────────────────────────────────────────
export function SplitIntro() {
  const { setTheme } = useTheme();

  /* ---- state ---------------------------------------------------------- */
  const [phase, setPhase] = useState<
    "intro" | "active" | "expanding" | "settled"
  >("intro");
  const [displaySide, setDisplaySide] = useState<"dark" | "light" | null>(
    null,
  );
  const [timerKey, setTimerKey] = useState(0);
  const [chosenSide, setChosenSide] = useState<"dark" | "light" | null>(null);

  /* ---- stable refs ---------------------------------------------------- */
  const setThemeRef = useRef(setTheme);
  setThemeRef.current = setTheme;

  /* ---- DOM refs ------------------------------------------------------- */
  const darkRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const darkContentRef = useRef<HTMLDivElement>(null);
  const lightContentRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);

  /* ---- mutable animation state ---------------------------------------- */
  const splitX = useRef(50);
  const tilt = useRef(12);
  const hovered = useRef<"dark" | "light" | null>(null);
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const chosenSideRef = useRef(chosenSide);
  chosenSideRef.current = chosenSide;

  const timerIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animRaf = useRef<number | null>(null);
  const expandingSide = useRef<"dark" | "light" | null>(null);

  const sliverHovered = useRef(false);
  const sliverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isReExpansion = useRef(false);

  /* ---- helpers -------------------------------------------------------- */

  /** Flash-free theme application: disable CSS transitions → set class → reflow → re-enable */
  const applyThemeInstant = useCallback((dark: boolean) => {
    const root = document.documentElement;
    root.classList.add("no-transition");
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
    // force reflow so paint happens with no-transition active
    void root.offsetHeight;
    setThemeRef.current(dark);
    requestAnimationFrame(() => {
      root.classList.remove("no-transition");
    });
  }, []);

  /* ---- intro → active ------------------------------------------------- */
  useEffect(() => {
    const id = setTimeout(() => setPhase("active"), 1400);
    return () => clearTimeout(id);
  }, []);

  // Fade-in on mount (CSS transition, no motion transforms)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(id);
  }, []);

  /* ---- scroll lock: block during everything except settled ------------ */
  useEffect(() => {
    if (phase === "settled") {
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [phase]);

  /* ---- core animation & event logic ----------------------------------- */
  useEffect(() => {
    /* ── DOM helpers ──────────────────────────────────────────────── */

    function updateDOM() {
      const topX = splitX.current + tilt.current;
      const botX = splitX.current - tilt.current;
      const dClip = `polygon(0 0, ${topX}% 0, ${botX}% 100%, 0 100%)`;
      const lClip = `polygon(${topX}% 0, 100% 0, 100% 100%, ${botX}% 100%)`;
      if (darkRef.current) darkRef.current.style.clipPath = dClip;
      if (lightRef.current) lightRef.current.style.clipPath = lClip;
      linesRef.current.forEach((ln) => {
        if (ln) {
          ln.setAttribute("x1", `${topX}%`);
          ln.setAttribute("x2", `${botX}%`);
        }
      });
    }

    function getSide(cx: number, cy: number): "dark" | "light" {
      const topX = splitX.current + tilt.current;
      const botX = splitX.current - tilt.current;
      const ny = cy / window.innerHeight;
      const lineXPct = topX + (botX - topX) * ny;
      return (cx / window.innerWidth) * 100 < lineXPct ? "dark" : "light";
    }

    function cancelAnim() {
      expandingSide.current = null;
      if (animRaf.current) {
        cancelAnimationFrame(animRaf.current);
        animRaf.current = null;
      }
    }

    function returnToCenter() {
      cancelAnim();
      const start = splitX.current;
      if (Math.abs(start - 50) < 1) return;
      const t0 = performance.now();
      const dur = 600;
      (function step(now: number) {
        const t = Math.min((now - t0) / dur, 1);
        const e = 1 - Math.pow(1 - t, 3);
        splitX.current = start + (50 - start) * e;
        updateDOM();
        if (t < 1) animRaf.current = requestAnimationFrame(step);
      })(performance.now());
    }

    /* ── expansion ─────────────────────────────────────────────────── */

    function startExpansion(side: "dark" | "light") {
      cancelAnim();

      if (sliverTimerRef.current) {
        clearTimeout(sliverTimerRef.current);
        sliverTimerRef.current = null;
      }
      sliverHovered.current = false;
      isReExpansion.current = chosenSideRef.current !== null;

      // Prepare for expansion: make both halves visible & non-scrollable
      [darkContentRef, lightContentRef].forEach((ref) => {
        if (ref.current) {
          ref.current.style.overflowY = "hidden";
          ref.current.style.pointerEvents = "none";
        }
      });

      // Re-apply clip-paths if coming from settled (dominant half had clip removed)
      if (isReExpansion.current) {
        // Scroll dominant content to top
        const domRef =
          chosenSideRef.current === "dark" ? darkContentRef : lightContentRef;
        if (domRef.current) domRef.current.scrollTop = 0;
        // Restore clip on the dominant half
        updateDOM();
      }

      expandingSide.current = side;
      setPhase("expanding");
      setChosenSide(null);

      const target = side === "dark" ? 95 : 5;
      const start = splitX.current;
      const t0 = performance.now();
      const dur = 6120;

      (function step(now: number) {
        if (expandingSide.current !== side) return;
        const t = Math.min((now - t0) / dur, 1);
        const e = -(Math.cos(Math.PI * t) - 1) / 2; // sine ease-in-out
        splitX.current = start + (target - start) * e;
        updateDOM();

        if (t >= 0.96) {
          splitX.current = target;
          updateDOM();
          expandingSide.current = null;

          // Flash-free theme set
          applyThemeInstant(side === "dark");
          setChosenSide(side);
          setPhase("settled");
          setDisplaySide(null);

          // After React renders, make the dominant half the live page
          requestAnimationFrame(() => {
            const domHalf =
              side === "dark" ? darkRef.current : lightRef.current;
            const domContent =
              side === "dark" ? darkContentRef.current : lightContentRef.current;
            if (domHalf) {
              // Remove clip-path so scrollbar & hit-testing work across full viewport
              domHalf.style.clipPath = "none";
            }
            if (domContent) {
              domContent.style.overflowY = "auto";
              domContent.style.pointerEvents = "auto";
              domContent.style.height = "100vh";
            }
          });
          return;
        }
        animRaf.current = requestAnimationFrame(step);
      })(performance.now());
    }

    /* ── event handlers ─────────────────────────────────────────────── */

    function handleMove(e: MouseEvent) {
      const p = phaseRef.current;

      if (p === "active") {
        const nx = e.clientX / window.innerWidth;
        const ny = e.clientY / window.innerHeight;
        tilt.current = 12 + (nx - 0.5) * 4 + (ny - 0.5) * 2;
        updateDOM();

        const side = getSide(e.clientX, e.clientY);
        if (side !== hovered.current) {
          hovered.current = side;
          setDisplaySide(side);
          setTimerKey((k) => k + 1);
          if (timerIdRef.current) {
            clearTimeout(timerIdRef.current);
            timerIdRef.current = null;
          }
          timerIdRef.current = setTimeout(
            () => startExpansion(side),
            3000,
          );
        }
        return;
      }

      if (p === "expanding" && !isReExpansion.current) {
        const side = getSide(e.clientX, e.clientY);
        if (side !== hovered.current) {
          hovered.current = side;
          setDisplaySide(side);
          setTimerKey((k) => k + 1);
          if (timerIdRef.current) {
            clearTimeout(timerIdRef.current);
            timerIdRef.current = null;
          }
          returnToCenter();
          setPhase("active");
          timerIdRef.current = setTimeout(
            () => startExpansion(side),
            3000,
          );
        }
        return;
      }

      if (p === "settled") {
        const side = getSide(e.clientX, e.clientY);
        const sliver =
          chosenSideRef.current === "dark" ? "light" : "dark";

        if (side === sliver) {
          if (!sliverHovered.current) {
            sliverHovered.current = true;
            setDisplaySide(sliver);
            setTimerKey((k) => k + 1);
            sliverTimerRef.current = setTimeout(() => {
              startExpansion(sliver);
            }, 3000);
          }
        } else {
          if (sliverHovered.current) {
            sliverHovered.current = false;
            setDisplaySide(null);
            if (sliverTimerRef.current) {
              clearTimeout(sliverTimerRef.current);
              sliverTimerRef.current = null;
            }
          }
        }
      }
    }

    function handleClick(e: MouseEvent) {
      const p = phaseRef.current;

      if (
        p === "active" ||
        (p === "expanding" && !isReExpansion.current)
      ) {
        const side = getSide(e.clientX, e.clientY);
        if (timerIdRef.current) clearTimeout(timerIdRef.current);
        cancelAnim();
        startExpansion(side);
        return;
      }

      if (p === "settled") {
        const side = getSide(e.clientX, e.clientY);
        const sliver =
          chosenSideRef.current === "dark" ? "light" : "dark";
        if (side === sliver) {
          if (sliverTimerRef.current) clearTimeout(sliverTimerRef.current);
          sliverHovered.current = false;
          startExpansion(sliver);
        }
      }
    }

    updateDOM();
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("click", handleClick);
      if (timerIdRef.current) clearTimeout(timerIdRef.current);
      if (sliverTimerRef.current) clearTimeout(sliverTimerRef.current);
      if (animRaf.current) cancelAnimationFrame(animRaf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyThemeInstant]);

  /* ---- derived --------------------------------------------------------- */
  const isSettled = phase === "settled";
  const sliverSide =
    chosenSide === "dark" ? "light" : chosenSide === "light" ? "dark" : null;
  const showTimerBar =
    displaySide !== null && (phase === "active" || phase === "settled");

  /* ---- render ---------------------------------------------------------- */
  return (
    <div
      className="fixed inset-0 z-[200] select-none"
      style={{
        cursor:
          isSettled ? "default" : "crosshair",
        // During intro / active / expanding the wrapper blocks all events.
        // During settled, pointer-events: none lets events fall through to
        // the dominant half (which has pointer-events: auto).
        pointerEvents: isSettled ? "none" : "auto",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.7s ease",
      }}
    >
      {/* ─── Dark half ──────────────────────────────────────────── */}
      <div
        ref={darkRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: "polygon(0 0, 62% 0, 38% 100%, 0 100%)",
          // Sliver needs pointer-events for hover/click detection
          pointerEvents:
            isSettled && sliverSide === "dark" ? "auto" : undefined,
          cursor:
            isSettled && sliverSide === "dark" ? "pointer" : undefined,
          zIndex: isSettled && sliverSide === "dark" ? 5 : undefined,
          ...DARK_VARS,
        }}
      >
        {/* Grid bg (dark only) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "#08080d",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px)," +
              "linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          ref={darkContentRef}
          className="relative h-screen overflow-hidden"
          style={{ pointerEvents: "none" }}
        >
          <ThemeScope isDark={true}>
            <PortfolioContent showToggle={false} />
          </ThemeScope>
        </div>
      </div>

      {/* ─── Light half ─────────────────────────────────────────── */}
      <div
        ref={lightRef}
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: "polygon(62% 0, 100% 0, 100% 100%, 38% 100%)",
          pointerEvents:
            isSettled && sliverSide === "light" ? "auto" : undefined,
          cursor:
            isSettled && sliverSide === "light" ? "pointer" : undefined,
          zIndex: isSettled && sliverSide === "light" ? 5 : undefined,
          ...LIGHT_VARS,
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "#f7f5f2" }}
        />
        <div
          ref={lightContentRef}
          className="relative h-screen overflow-hidden"
          style={{ pointerEvents: "none" }}
        >
          <ThemeScope isDark={false}>
            <PortfolioContent showToggle={false} />
          </ThemeScope>
        </div>
      </div>

      {/* ─── Glow line ──────────────────────────────────────────── */}
      

      {/* ─── Bottom prompt (initial only) ───────────────────────── */}
      {chosenSide === null && (
        <motion.div
          className="absolute left-1/2 bottom-8 -translate-x-1/2 pointer-events-none"
          style={{ zIndex: 20 }}
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity:
              phase === "active" && !displaySide
                ? 0.85
                : phase === "active"
                  ? 0.5
                  : 0,
            y: 0,
          }}
          transition={{
            delay: phase === "active" && !displaySide ? 0.6 : 0,
            duration: 0.35,
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "rgba(255,255,255,0.55)",
              background: "rgba(0,0,0,0.35)",
              backdropFilter: "blur(10px)",
              padding: "8px 18px",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.08)",
              whiteSpace: "nowrap",
            }}
          >
            hover 3 s to choose &middot; click to skip
          </p>
        </motion.div>
      )}

      {/* ─── Timer progress bar ─────────────────────────────────── */}
      {showTimerBar && (
        <motion.div
          key={`sf-timer-${timerKey}`}
          className="absolute bottom-0 left-0 pointer-events-none"
          style={{
            zIndex: 20,
            height: "2px",
            width: "100%",
            transformOrigin:
              displaySide === "dark" ? "left" : "right",
            background:
              displaySide === "dark"
                ? "linear-gradient(90deg, #00e89a, rgba(0,232,154,0.15))"
                : "linear-gradient(270deg, #179e90, rgba(23,158,144,0.15))",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 3, ease: "linear" }}
        />
      )}
    </div>
  );
}