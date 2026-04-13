import SideBarHeader from "../sideBar-components/SideBarHeader";
import { NAV_ITEMS } from "../../utils/rolePermissions.js";
import { NavLink } from "react-router";


function Sidebar() {
  return (
    <div className="bg-[#f6f6f6] w-96 h-full py-5 px-7 flex flex-col gap-4">
      <SideBarHeader />
      <div className="w-full flex flex-col p-1 border-t border-gray-300 gap-2 py-3">
        {NAV_ITEMS.map((item, index) => (
          <NavLink className={({ isActive }) => isActive ? "bg-[#e6e6e6] text-black rounded-[3px]" :
  "text-gray-700"} key={item.path} to={item.path}>
            <div className=" w-full flex justify-start items-center gap-2 p-2 text-sm">
                {<item.icon size={20} />}{item.label}
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
