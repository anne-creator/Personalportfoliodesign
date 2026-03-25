import { motion } from "motion/react";

const rows = [
  {
    label: "stack",
    value: "Next.js · TypeScript · Python · FastAPI · Postgres · AWS / GCP / Firebase",
  },
  {
    label: "scope",
    value: "0→10 SaaS: DB design, backend APIs, frontend, basic infra",
  },
  {
    label: "recent",
    value: "Multi-agent orchestration · Agentic RL pipeline",
  },
];

const rowVariant = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.4, 0.25, 1] } },
};

export function WhatIShip() {
  return (
    <motion.section
      className="pb-16"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
    >
      <h2
        className="mb-8 tracking-[0.12em] uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--t-text-muted)",
        }}
      >
        what i actually ship
      </h2>

      <div
        className="p-6 md:p-8"
        style={{
          borderRadius: "var(--t-card-radius)",
          border: "1px solid var(--t-border)",
          background: "var(--t-elevated)",
        }}
      >
        <motion.div
          className="flex flex-col gap-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.08 }}
        >
          {rows.map((row) => (
            <motion.div
              key={row.label}
              variants={rowVariant}
              className="flex flex-col sm:flex-row sm:gap-6 gap-1"
            >
              <span
                className="flex-shrink-0 sm:w-[72px] tracking-[0.02em]"
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  color: "var(--t-accent)",
                  paddingTop: "2px",
                }}
              >
                {row.label}
              </span>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.65,
                  color: "var(--t-text-secondary)",
                }}
              >
                {row.value}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}