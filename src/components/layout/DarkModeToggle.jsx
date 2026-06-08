import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

// Sidebar-footer theme switch rendered as an on/off toggle. The "You're in …"
// label and the pill collapse to an icon-only switch on the narrow desktop rail
// (md), expanding again on the wide sidebar (xl) and the mobile sheet — mirroring
// the nav items' `md:hidden xl:inline` label pattern.
export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="w-full flex items-center justify-between gap-2 p-2 md:justify-center xl:justify-between">
      <span className="text-sm text-sidebar-foreground md:hidden xl:inline">
        You're in {isDark ? "dark" : "light"} mode
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isDark}
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        title={isDark ? "Light mode" : "Dark mode"}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
          isDark ? "bg-[#2f6a7a]" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-gray-700 shadow transform transition-transform ${
            isDark ? "translate-x-5" : "translate-x-0.5"
          }`}
        >
          {isDark ? <Moon size={12} /> : <Sun size={12} />}
        </span>
      </button>
    </div>
  );
}
