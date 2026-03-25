import { motion } from "motion/react";

const cards = [
  {
    label: "Dev × Design, One Brain",
    line1: "I write code, but I think in flows, states, and systems",
    line2: "I care that the whole product feels coherent, not just that the feature ships",
  },
  {
    label: "Psychology × Illustration in UX",
    line1: "Years of illustration and a psychology background make me sensitive to how interfaces read and guide people",
    line2: "I notice when something feels \"off\" even before we have data",
  },
  {
    label: "0→10 Builder with AI in the Loop",
    line1: "I'm strongest at 0→10: shaping the idea, designing the experience, and shipping the first version across db, backend, and frontend",
    line2: "I use AI as a collaborator in design, writing, and dev, while keeping human taste in control",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] } },
};

export function HowIWork() {
  return (
    <motion.section
      className="py-20 md:py-28"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="px-6 py-14 md:px-10 md:py-16"
        style={{
          borderRadius: "var(--t-card-radius)",
          background: "var(--t-surface)",
        }}
      >
        <h2
          className="text-center mb-3 tracking-[0.12em] uppercase"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            color: "var(--t-text-muted)",
          }}
        >
          how i work
        </h2>
        <p
          className="text-center mb-4"
          style={{
            fontSize: "20px",
            color: "var(--t-text)",
            letterSpacing: "-0.01em",
          }}
        >
          Same brain for product, design, and code
        </p>
        <p
          className="text-center mb-12 mx-auto max-w-[420px]"
          style={{ fontSize: "14px", color: "var(--t-text-muted)" }}
        >
          Care about the hover state and the database index
        </p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {cards.map((card) => (
            <motion.div
              key={card.label}
              variants={cardVariant}
              className="p-5 md:p-6"
              style={{
                borderRadius: "var(--t-card-radius)",
                border: "1px solid var(--t-border)",
                background: "var(--t-card)",
              }}
              whileHover={{
                borderColor: "var(--t-card-hover-border)",
                boxShadow: "var(--t-card-hover-shadow)",
                y: -2,
              }}
              transition={{ duration: 0.25 }}
            >
              <p
                className="mb-4 tracking-[0.08em] uppercase"
                style={{
                  color: "var(--t-accent)",
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {card.label}
              </p>
              <p
                className="mb-3"
                style={{
                  fontSize: "14px",
                  lineHeight: 1.65,
                  color: "var(--t-text)",
                }}
              >
                {card.line1}
              </p>
              <p
                style={{
                  fontSize: "14px",
                  lineHeight: 1.65,
                  color: "var(--t-text-tertiary)",
                }}
              >
                {card.line2}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}