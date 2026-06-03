import SideBarHeader from "../sideBar-components/SideBarHeader";
import { getNavItemsForRole } from "../../utils/rolePermissions.js";
import { NavLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";
import DarkModeToggle from "./DarkModeToggle";

function SidebarFooter() {
  return (
    <div className="mt-auto border-t border-gray-300 dark:border-border pt-3 px-2">
      <DarkModeToggle />
      <p className="text-[10px] leading-tight text-gray-500 dark:text-muted-foreground mt-2 md:hidden xl:block">
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
      <SidebarFooter />
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
