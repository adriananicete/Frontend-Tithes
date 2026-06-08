import { NavLink } from "react-router";
import { FiMenu } from "react-icons/fi";
import { getNavItemsForRole } from "../../utils/rolePermissions.js";
import { useAuth } from "../../hooks/useAuth";

// Mobile-only fixed bottom navigation. Shows up to 4 destinations based on the
// user's role. Roles with 4 or fewer pages show all of them as tabs; roles with
// more show their first 3 pages plus a "More" tab that opens the full sidebar
// (hamburger) Sheet, where the rest of their pages live.
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

  // When the role has more pages than fit, reserve the last slot for "More".
  const hasMore = navItems.length > MAX_TABS;
  const tabs = hasMore ? navItems.slice(0, MAX_TABS - 1) : navItems;

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch
                 px-2 pt-1 border-t border-gray-200 bg-white dark:border-border dark:bg-card
                 pb-[env(safe-area-inset-bottom)]"
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

      {hasMore && (
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
      )}
    </nav>
  );
}

export default BottomNav;
