import { useTheme } from "./ThemeProvider";
import { DoodleDivider } from "./Illustrations";

export function SectionDivider() {
  const { isDark } = useTheme();

  if (isDark) {
    return (
      <div className="py-6 flex justify-center">
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--t-text-faint)",
            letterSpacing: "0.1em",
          }}
        >
          // ————————————————
        </p>
      </div>
    );
  }

  return (
    <div className="py-4">
      <DoodleDivider />
    </div>
  );
}
