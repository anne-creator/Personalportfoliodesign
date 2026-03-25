import { motion } from "motion/react";

const posts = [
  {
    date: "jan 2026",
    title: "why 0→10 is harder (and more interesting) than 10→100",
    excerpt:
      "most writing about startups focuses on scaling. but the first ten users require a completely different kind of thinking — one where design, dev, and product blur together in every commit.",
  },
  {
    date: "dec 2025",
    title: "using ai without losing your architecture",
    excerpt:
      "i've been shipping with llm apis for a year. here's what i've learned about keeping clean abstractions when your core logic depends on probabilistic outputs.",
  },
  {
    date: "nov 2025",
    title: "what illustration taught me about component design",
    excerpt:
      "seven years of drawing taught me things about visual hierarchy, compositional rhythm, and negative space that directly translate to building better react component trees.",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.4, 0.25, 1] } },
};

export function WritingSection() {
  return (
    <section className="py-16 md:py-20">
      <h2
        className="mb-2 tracking-[0.12em] uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--t-text-muted)",
        }}
      >
        writing
      </h2>
      <p
        className="mb-10"
        style={{
          fontSize: "20px",
          color: "var(--t-text)",
          letterSpacing: "-0.01em",
        }}
      >
        Thinking out loud about building, designing, and the space between
      </p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ staggerChildren: 0.08 }}
      >
        {posts.map((post) => (
          <motion.article
            key={post.title}
            variants={cardVariant}
            className="group cursor-pointer p-5 md:p-6"
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
              className="mb-3 tracking-[0.06em] uppercase"
              style={{
                fontSize: "11px",
                color: "var(--t-text-faint)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {post.date}
            </p>
            <h3
              className="mb-2 group-hover:opacity-80 transition-opacity duration-200"
              style={{
                fontSize: "16px",
                lineHeight: 1.4,
                color: "var(--t-text)",
              }}
            >
              {post.title}
            </h3>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.65,
                color: "var(--t-text-tertiary)",
              }}
            >
              {post.excerpt}
            </p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}