import { Sun, Leaf } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="pill relative inline-flex h-10 w-[72px] items-center px-1.5 transition-colors"
    >
      <span
        className="absolute top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-gradient-to-br from-[var(--leaf)] to-[var(--lens)] text-[oklch(0.15_0.03_160)] shadow-md transition-all duration-300"
        style={{ left: isDark ? "calc(100% - 2.25rem)" : "0.25rem" }}
      >
        {isDark ? <Leaf className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  );
}
