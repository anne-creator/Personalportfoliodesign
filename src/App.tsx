import { ThemeProvider } from "./components/ThemeProvider";
import { SplitIntro } from "./components/split-intro";

export default function App() {
  return (
    <ThemeProvider>
      {/*
        The SplitIntro renders two themed copies of the full portfolio.
        After the user picks a side, the dominant half becomes the live
        interactive site (scrollable, clickable) and the thin sliver of
        the other theme stays fixed at the screen edge.
        No separate "real site" layer — the overlay IS the site.
      */}
      <SplitIntro />
    </ThemeProvider>
  );
}
