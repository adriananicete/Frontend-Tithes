import { NavLink } from "react-router";
import { FiMenu } from "react-icons/fi";
import { getNavItemsForRole } from "../../utils/rolePermissions.js";
import { useAuth } from "../../hooks/useAuth";

// Mobile-only floating bottom navigation. Shows the user's first 3 role pages as
// tabs plus a "More" tab (always present, for every role) that opens the full
// sidebar (hamburger) Sheet — where the rest of their pages, dark-mode toggle,
// and account info live. "More" is shown to all roles so even members/pastor
// (who have ≤4 pages) can still reach dark mode from the bar.
// Styled as a floating frosted-glass card: translucent + backdrop-blur so page
// content scrolling underneath shows through (iOS "liquid glass" feel).
const MAX_TABS = 4;

const itemClass = ({ isActive }) =>
  [
    "flex flex-1 flex-col items-center justify-center gap-1 py-3 min-w-0",
    isActive
      ? "text-[#2f6a7a] dark:text-sidebar-accent-foreground"
      : "text-gray-500 dark:text-muted-foreground",
  ].join(" ");

function BottomNav({ onOpenMore }) {
  const { user } = useAuth();
  const navItems = user ? getNavItemsForRole(user.role) : [];

  if (navItems.length === 0) return null;

  // The last slot is always "More", so the bar shows at most the first 3 pages.
  const tabs = navItems.slice(0, MAX_TABS - 1);

  return (
    <nav
      className="md:hidden fixed left-3 right-3 z-40 flex items-stretch overflow-hidden
                 bottom-[calc(0.75rem+env(safe-area-inset-bottom))]
                 px-2 rounded-2xl
                 border border-gray-200 dark:border-white/10
                 bg-white/60 dark:bg-card/50 backdrop-blur-xl backdrop-saturate-150
                 shadow-lg shadow-black/10"
      aria-label="Primary"
    >
      {tabs.map((item) => (
        <NavLink key={item.path} to={item.path} className={itemClass}>
          <item.icon size={22} />
          <span className="text-[11px] leading-tight truncate max-w-full px-1">
            {item.label}
          </span>
        </NavLink>
      ))}

      <button
        type="button"
        onClick={onOpenMore}
        aria-label="More"
        className="flex flex-1 flex-col items-center justify-center gap-1 py-3
                   min-w-0 text-gray-500 dark:text-muted-foreground"
      >
        <FiMenu size={22} />
        <span className="text-[11px] leading-tight">More</span>
      </button>
    </nav>
  );
}

export default BottomNav;
