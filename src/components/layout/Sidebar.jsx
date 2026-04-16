import SideBarHeader from "../sideBar-components/SideBarHeader";
import { getNavItemsForRole } from "../../utils/rolePermissions.js";
import { NavLink } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { Sheet, SheetContent, SheetTitle } from "../ui/sheet";

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
        className="bg-[#f6f6f6] py-5 px-7 gap-4"
      >
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <SidebarBody onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}

export default Sidebar;
