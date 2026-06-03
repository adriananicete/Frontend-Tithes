import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

// Sidebar-footer theme switch. Icon-only on the collapsed desktop rail (md),
// icon + label on the expanded sidebar (xl) and the mobile sheet — mirroring
// the nav items' `md:hidden xl:inline` label pattern.
export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
      className="w-full flex justify-center md:justify-center xl:justify-start items-center gap-2 p-2 rounded-[3px] text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors cursor-pointer"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
      <span className="md:hidden xl:inline">{isDark ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
