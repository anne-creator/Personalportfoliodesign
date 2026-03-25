import { motion } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { PacManGame } from "./PacManGame";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] },
  },
};

export function HeroSection() {
  const { isDark } = useTheme();

  return (
    <section
      className={isDark ? "flex flex-col justify-center" : "pt-24 pb-20 md:pt-36 md:pb-28"}
      style={isDark ? { minHeight: "100vh", padding: "24px 0 16px" } : undefined}
    >
      <motion.div
        className="flex flex-col items-center text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Top label */}
        <motion.p
          variants={fadeUp}
          className={`tracking-[0.2em] uppercase ${isDark ? "mb-3" : "mb-8"}`}
          style={{
            color: "var(--t-accent)",
            fontSize: "12px",
            fontFamily: "var(--font-mono)",
          }}
        >
          {isDark ? "$ whoami" : "Anne Liu \u00B7 Portfolio"}
        </motion.p>

        {/* Big name */}
        <motion.h1
          variants={fadeUp}
          className={isDark ? "mb-2" : "mb-5"}
          style={{
            fontSize: isDark ? "clamp(36px, 7vw, 64px)" : "clamp(56px, 10vw, 96px)",
            lineHeight: 1.05,
            color: "var(--t-text)",
            letterSpacing: "-0.035em",
          }}
        >
          Anne Liu
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUp}
          className={isDark ? "mb-3" : "mb-6"}
          style={{
            fontSize: "clamp(15px, 2vw, 18px)",
            lineHeight: 1.5,
            color: "var(--t-text-muted)",
            fontFamily: isDark ? "var(--font-mono)" : "var(--font-sans)",
            letterSpacing: isDark ? "0.04em" : "0.02em",
          }}
        >
          {isDark
            ? "> developer \u00B7 systems thinker"
            : "Developer \u00D7 Designer"}
        </motion.p>

        {/* Mode label */}
        {!isDark && (
          <motion.p
            variants={fadeUp}
            className="flex items-center gap-2 mb-12"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--t-accent)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            <span
              className="inline-block rounded-full"
              style={{
                width: "6px",
                height: "6px",
                background: "var(--t-accent)",
              }}
            />
            {isDark ? "terminal" : "editorial"}
          </motion.p>
        )}

        {/* Heading */}
        <motion.h2
          variants={fadeUp}
          className={`${isDark ? "mb-4" : "mb-8"} max-w-[640px]`}
          style={{
            fontSize: isDark ? "clamp(18px, 2.5vw, 24px)" : "clamp(24px, 3.5vw, 36px)",
            lineHeight: 1.2,
            color: "var(--t-text)",
            letterSpacing: "-0.02em",
          }}
        >
          I build 0&#x2192;10 AI products with taste
        </motion.h2>

        {/* ── Pac-Man Game (dark mode only) ────────────────────────── */}
        {isDark && (
          <motion.div variants={fadeUp} className="w-full flex justify-center">
            <PacManGame />
          </motion.div>
        )}

        {/* Description - light mode only */}
        {!isDark && (
          <motion.p
            variants={fadeUp}
            className="mb-4 max-w-[540px]"
            style={{
              fontSize: "15px",
              lineHeight: 1.75,
              color: "var(--t-text-secondary)",
            }}
          >
            I&rsquo;m Anne Liu &mdash; I architect multi-agent systems, train models
            with reinforcement learning, and ship full-stack AI products end to end.
            My work spans LangGraph orchestration pipelines, GRPO-based reward
            modeling, and production APIs serving real users at scale. I think in
            systems, build with Python and TypeScript, and optimize until it works
            in the wild.
          </motion.p>
        )}

        {/* Right now line - light mode only */}
        {!isDark && (
          <motion.p
            variants={fadeUp}
            style={{
              fontSize: "14px",
              lineHeight: 1.6,
              color: "var(--t-text-muted)",
            }}
          >
            {isDark
              ? "right now: [ multi-agent orchestration ] agentic RL"
              : "Right now: [ multi-agent orchestration ] agentic RL"}
          </motion.p>
        )}

        {/* Deploy meta - light mode only */}
        {!isDark && (
          <motion.p
            variants={fadeUp}
            className="mt-3"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              lineHeight: 1.6,
              color: "var(--t-text-faint)",
            }}
          >
            {isDark
              ? "$ deploy --platform=vercel --db=postgres --status=shipping"
              : "Deploys: vercel \u00B7 db: postgres \u00B7 playground projects, not just mockups"}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}