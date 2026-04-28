import { Moon, Sun } from "lucide-react";
import SideBarHeader from "../sideBar-components/SideBarHeader";
import { getNavItemsForRole } from "../../utils/rolePermissions.js";
import { NavLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";

function SidebarFooter() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? Moon : Sun;
  const label = isDark ? "You're in Dark Mode" : "You're in Light Mode";

  return (
    <div className="mt-auto flex flex-col gap-2 border-t border-gray-300 pt-3">
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle dark mode"
        className="flex items-center gap-2 rounded-md p-2 text-sm text-gray-700 hover:bg-gray-200 transition-colors"
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </button>
      <p className="px-2 text-[10px] leading-tight text-gray-500">
        Design &amp; Built by ianDev 2026, All rights reserved.
      </p>
    </div>
  );
}

function SidebarBody({ onNavigate }) {
  const { user } = useAuth();
  const navItems = user ? getNavItemsForRole(user.role) : [];

  return (
    <>
      <SideBarHeader />
      <div className="w-full flex flex-col p-1 border-t border-gray-300 gap-2 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              isActive ? "bg-[#e6e6e6] text-black rounded-[3px]" : "text-gray-700"
            }
          >
            <div className=" w-full flex justify-start items-center gap-2 p-2 text-sm">
                {<item.icon size={20} />}{item.label}
            </div>
          </NavLink>
        ))}
      </div>
      <SidebarFooter />
    </>
  );
}

function Sidebar() {
  return (
    <div className="hidden md:flex bg-[#f6f6f6] w-96 h-full py-5 px-7 flex-col gap-4">
      <SidebarBody />
    </div>
  );
}

export function MobileSidebar({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="bg-[#f6f6f6] py-5 px-7 gap-4 flex flex-col"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarBody onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
