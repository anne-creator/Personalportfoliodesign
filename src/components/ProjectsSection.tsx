import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ProjectDetail {
  label: string;
  text: string;
}

interface Project {
  title: string;
  tag: string;
  stack: string;
  image: string;
  details: ProjectDetail[];
  github?: string;
}

const projects: Project[] = [
  {
    title: "virtual illustrator – guided image generator",
    tag: "full-stack · in progress",
    stack: "next.js · python · openai api · postgres · vercel",
    image:
      "https://images.unsplash.com/photo-1699040309386-11c615ed64d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsJTIwYWklMjBpbnRlcmZhY2UlMjBkZXNpZ24lMjBtb2NrdXB8ZW58MXx8fHwxNzcwMzQ4Nzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    details: [
      { label: "problem", text: "most image generators expect users to be prompt engineers, not people who just know what they want to see" },
      { label: "idea", text: 'a "virtual illustrator" that takes one simple sentence and guides you into a structured, six‑factor prompt with smart defaults and examples' },
      { label: "role", text: "system architecture, prompt pipeline design, next.js frontend, api routes, postgres schema, ux flow" },
      { label: "why it's interesting", text: "instead of just wrapping an image model, it tries to mimic how a senior illustrator asks questions and teaches users how to get better results over time" },
    ],
    github: "https://github.com",
  },
  {
    title: "next.js design system – component library",
    tag: "full-stack · personal",
    stack: "react · tailwind v4 · typescript · storybook",
    image:
      "https://images.unsplash.com/photo-1652715564391-38cc4475b7f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjBzeXN0ZW0lMjBjb21wb25lbnRzJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc3MDM0ODc5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    details: [
      { label: "problem", text: "most component libraries feel generic – they optimize for coverage but not for coherence or feel" },
      { label: "idea", text: "a focused design system that encodes opinion: spacing rhythm, type scale, motion principles, and defaults that feel considered" },
      { label: "role", text: "design tokens architecture, typescript component api, composable patterns, documentation system" },
      { label: "why it's interesting", text: "it's less about having every component and more about every component feeling like it belongs together — enforced through code, not just figma" },
    ],
    github: "https://github.com",
  },
  {
    title: "ai writing pipeline – structured content tool",
    tag: "full-stack · in progress",
    stack: "next.js · langchain · postgres · vercel ai sdk",
    image:
      "https://images.unsplash.com/photo-1735399976112-17508533c97a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMHdyaXRpbmclMjBhcHAlMjBpbnRlcmZhY2UlMjBkYXJrfGVufDF8fHx8MTc3MDM0ODc5NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    details: [
      { label: "problem", text: "writing with ai feels either too automated (loses voice) or too manual (just a chatbox with no structure)" },
      { label: "idea", text: "a pipeline that separates thinking, drafting, and editing into distinct steps — each with different llm behaviors, temperature settings, and human controls" },
      { label: "role", text: "system design, prompt architecture, streaming ui, state management, full‑stack implementation" },
      { label: "why it's interesting", text: "it treats writing as a stateful process with stages rather than a single generate‑and‑edit loop, which matches how real writers actually work" },
    ],
    github: "https://github.com",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] } },
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
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
      {/* Tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span
          className="inline-flex rounded-full px-3 py-1"
          style={{
            fontSize: "11px",
            color: "var(--t-accent)",
            background: "var(--t-tag-bg)",
            border: "1px solid var(--t-tag-border)",
            fontFamily: "var(--font-mono)",
          }}
        >
          {project.tag}
        </span>
      </div>

      {/* Title */}
      <h3
        className="mb-1"
        style={{
          fontSize: "17px",
          lineHeight: 1.4,
          color: "var(--t-text)",
        }}
      >
        {project.title}
      </h3>

      {/* Stack line */}
      <p
        className="mb-6"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--t-text-faint)",
        }}
      >
        {project.stack}
      </p>

      {/* Image */}
      <div
        className="rounded-lg overflow-hidden mb-6"
        style={{ border: "1px solid var(--t-image-border)" }}
      >
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-auto object-cover aspect-[16/9]"
        />
      </div>

      {/* Details */}
      <div className="flex flex-col gap-4">
        {project.details.map((detail) => (
          <div key={detail.label} className="flex gap-4">
            <span
              className="flex-shrink-0 w-[100px] pt-[2px] tracking-[0.06em] uppercase"
              style={{
                fontSize: "11px",
                color: "var(--t-text-faint)",
                fontFamily: "var(--font-mono)",
              }}
            >
              {detail.label}
            </span>
            <p
              style={{
                fontSize: "14px",
                lineHeight: 1.65,
                color: "var(--t-text-secondary)",
              }}
            >
              {detail.text}
            </p>
          </div>
        ))}
      </div>

      {/* View code link */}
      {project.github && (
        <div
          className="mt-5 pt-4"
          style={{ borderTop: "1px solid var(--t-divider)" }}
        >
          <motion.a
            href={project.github}
            className="border-b"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              color: "var(--t-accent)",
              borderColor: "var(--t-accent-dim)",
            }}
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--t-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--t-accent-dim)";
            }}
          >
            view code →
          </motion.a>
        </div>
      )}
    </motion.div>
  );
}

export function ProjectsSection() {
  return (
    <section id="projects" className="py-10">
      <h2
        className="mb-2 tracking-[0.12em] uppercase"
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--t-text-muted)",
        }}
      >
        projects
      </h2>
      <p
        className="mb-10"
        style={{
          fontSize: "20px",
          color: "var(--t-text)",
          letterSpacing: "-0.01em",
        }}
      >
        A few things that show how I think about AI, UX, and systems
      </p>

      <motion.div
        className="grid grid-cols-1 lg:grid-cols-2 gap-5"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        transition={{ staggerChildren: 0.1 }}
      >
        {projects.map((project) => (
          <ProjectCard key={project.title} project={project} />
        ))}
      </motion.div>
    </section>
  );
}