import SideBarHeader from "../sideBar-components/SideBarHeader";
import { getNavItemsForRole } from "../../utils/rolePermissions.js";
import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import { UserAvatar } from "../shared/UserAvatar";
import { IoSettingsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import DarkModeToggle from "./DarkModeToggle";

function SidebarFooter({ onNavigate }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSettings = () => {
    onNavigate?.();
    navigate("/profile");
  };

  const handleLogout = () => {
    onNavigate?.();
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="mt-auto">
      {/* Profile avatar + Settings (icon + label) + logout, above the theme row. */}
      <div className="flex items-center gap-2 px-2 pb-3 md:justify-center xl:justify-start">
        <UserAvatar name={user?.name} src={user?.avatarUrl} userId={user?._id ?? user?.id} size="sm" />
        <button
          type="button"
          onClick={handleSettings}
          aria-label="Settings"
          title="Settings"
          className="min-w-0 flex-1 flex items-center gap-2 p-1.5 rounded-[5px] text-gray-700 dark:text-muted-foreground hover:bg-gray-200 dark:hover:bg-sidebar-accent hover:text-black dark:hover:text-sidebar-accent-foreground transition-colors cursor-pointer md:hidden xl:flex"
        >
          <IoSettingsOutline size={18} className="shrink-0" />
          <span className="text-sm truncate">Settings</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Log out"
          title="Log out"
          className="shrink-0 p-1.5 rounded-[5px] text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors cursor-pointer md:hidden xl:flex"
        >
          <FiLogOut size={18} />
        </button>
      </div>

      <div className="border-t border-gray-300 dark:border-border pt-3 px-2">
        <DarkModeToggle />
        <p className="text-[10px] leading-tight text-gray-500 dark:text-muted-foreground mt-2 md:hidden xl:block">
          Design &amp; Built by ianDev 2026, All rights reserved.
        </p>
      </div>
    </div>
  );
}

function SidebarBody({ onNavigate }) {
  const { user } = useAuth();
  const navItems = user ? getNavItemsForRole(user.role) : [];

  return (
    <>
      <SideBarHeader />
      <div className="w-full flex flex-col p-1 border-t border-gray-300 dark:border-border gap-2 py-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onNavigate}
            className={({ isActive }) =>
              isActive
                ? "bg-[#e6e6e6] text-black dark:bg-sidebar-accent dark:text-sidebar-accent-foreground rounded-[3px]"
                : "text-gray-700 dark:text-muted-foreground"
            }
          >
            <div className="w-full flex justify-start md:justify-center xl:justify-start items-center gap-2 p-2 text-sm">
                {<item.icon size={20} />}
                <span className="md:hidden xl:inline">{item.label}</span>
            </div>
          </NavLink>
        ))}
      </div>
      <SidebarFooter onNavigate={onNavigate} />
    </>
  );
}

function Sidebar() {
  return (
    <div className="hidden md:flex bg-[#f6f6f6] dark:bg-sidebar dark:text-sidebar-foreground w-16 xl:w-96 h-full py-5 px-2 xl:px-7 flex-col gap-4">
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
        className="bg-[#f6f6f6] dark:bg-sidebar dark:text-sidebar-foreground py-5 px-7 gap-4 flex flex-col"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarBody onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
