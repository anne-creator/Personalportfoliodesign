import { ThemeToggle } from "./ThemeToggle";
import { HeroSection } from "./HeroSection";
import { HowIWork } from "./HowIWork";
import { WhatIShip } from "./WhatIShip";
import { WritingSection } from "./WritingSection";
import { SectionDivider } from "./SectionDivider";

interface Props {
  /** Show the floating theme toggle button. Defaults to true. */
  showToggle?: boolean;
}

export function PortfolioContent({ showToggle = true }: Props) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--t-bg)",
        color: "var(--t-text)",
      }}
    >
      {showToggle && <ThemeToggle />}

      {/* Under Construction Tag */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div
          className="px-4 py-2 rounded-full"
          style={{
            background: "var(--t-accent)",
            color: "#fff",
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            letterSpacing: "0.05em",
            boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
          }}
        >
          🚧 UNDER CONSTRUCTION 🚧
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 md:px-10 lg:px-16">
        <HeroSection />

        <HowIWork />

        <WhatIShip />

        <SectionDivider />

        {/* Thin divider */}
        <div
          className="my-4"
          style={{ borderTop: "1px solid var(--t-divider)" }}
        />

        <WritingSection />

        <SectionDivider />

        {/* Footer */}
        <footer
          className="py-12 text-center"
          style={{
            fontSize: "12px",
            color: "var(--t-text-faint)",
            borderTop: "1px solid var(--t-divider)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <p>
            &copy; 2026 Anne Liu &middot; Built with Next.js +
            LOVE ❤️
          </p>
        </footer>
      </div>
    </div>
  );
}