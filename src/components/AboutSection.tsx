import { motion } from "motion/react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
};

export function AboutSection() {
  return (
    <motion.section
      className="py-20 md:py-24"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.08 }}
    >
      <motion.h2
        variants={fadeUp}
        className="mb-8 tracking-[0.12em] uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--t-text-muted)",
        }}
      >
        about
      </motion.h2>

      {/* Editorial-style prose */}
      <div
        className="max-w-[780px]"
        style={{
          fontSize: "15px",
          lineHeight: 1.8,
          color: "var(--t-text-secondary)",
        }}
      >
        <motion.p variants={fadeUp} className="mb-6">
          I&rsquo;m a developer and designer who came to tech through psychology and
          illustration. I spent seven years drawing &mdash; learning how line weight
          guides the eye, how negative space creates breathing room, how a
          composition can feel right before you can explain why. That training
          still shapes how I think about interfaces.
        </motion.p>

        <motion.p variants={fadeUp} className="mb-6">
          My psychology background taught me to care about the gap between what
          people say they want and what actually helps them. I bring that
          sensitivity to product work: noticing friction, questioning
          assumptions, designing for real behavior rather than ideal behavior.
        </motion.p>

        <motion.p variants={fadeUp} className="mb-6">
          Right now I&rsquo;m focused on the 0&rarr;10 space &mdash; taking ideas from nothing to
          a deployed, usable product. I work across the full stack: schema and
          database design, backend APIs in Python, frontend UI in TypeScript /
          React, and the design decisions that tie them together. I use AI tools
          as collaborators throughout, but the architecture and taste are mine.
        </motion.p>

        <motion.p variants={fadeUp} style={{ color: "var(--t-text-muted)" }}>
          If you&rsquo;re building something new and need someone who can think about
          the whole picture &mdash; from the system architecture to the hover state &mdash;
          I&rsquo;d love to talk.
        </motion.p>
      </div>

      {/* Contact links */}
      <motion.div variants={fadeUp} className="mt-10 flex flex-wrap gap-6">
        {[
          { label: "email", href: "mailto:anne@example.com" },
          { label: "github", href: "https://github.com" },
          { label: "linkedin", href: "https://linkedin.com" },
        ].map((link) => (
          <motion.a
            key={link.label}
            href={link.href}
            className="border-b"
            style={{
              color: "var(--t-accent)",
              fontSize: "13px",
              borderColor: "var(--t-accent-dim)",
              fontFamily: "var(--font-mono)",
            }}
            whileHover={{ x: 3 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--t-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--t-accent-dim)";
            }}
          >
            {link.label}
          </motion.a>
        ))}
      </motion.div>
    </motion.section>
  );
}