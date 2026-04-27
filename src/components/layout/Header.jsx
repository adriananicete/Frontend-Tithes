import { useState } from "react";
import { useNavigate } from "react-router";
import { CiSearch } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { LuShare2, LuKeyRound } from "react-icons/lu";
import { FiMenu, FiLogOut } from "react-icons/fi";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationsBell } from "@/components/notifications-components/NotificationsBell";
import { ChangePasswordDialog } from "@/components/sideBar-components/ChangePasswordDialog";
import { useAuth } from "@/hooks/useAuth";
import { ROLE_LABELS } from "@/utils/rolePermissions";

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function Header({ onOpenSidebar }) {
  const now = new Date();
  const dateLabel = `${daysOfWeek[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pwdOpen, setPwdOpen] = useState(false);

  const handleChangePassword = () => {
    setSettingsOpen(false);
    setPwdOpen(true);
  };

  const handleLogout = () => {
    setSettingsOpen(false);
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="w-full flex items-center justify-between gap-3 md:gap-5 border-b border-gray-200 pb-3">
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open menu"
          className="md:hidden p-1 text-gray-700 shrink-0"
        >
          <FiMenu size={22} />
        </button>
        <p className="text-base md:text-[20px] font-bold truncate">
          <span className="text-[#2f6a7a]">JOSCM</span>
          <span className="hidden sm:inline"> Tithes Management System</span>
          <span className="sm:hidden"> Tithes</span>
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-5 shrink-0">
        <p className="hidden lg:block text-sm text-gray-600 whitespace-nowrap">{dateLabel}</p>
        <div className="hidden sm:flex border border-gray-300 w-48 lg:w-70 p-2 justify-between items-center rounded-[5px]">
          <CiSearch size={18} />
          <input
            className="w-[92%] px-2 rounded-[3px] bg-transparent outline-none text-sm"
            type="text"
            placeholder="Search for ....."
            autoComplete=""
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className="sm:hidden border border-gray-300 p-2 rounded-[5px] text-gray-700"
          >
            <CiSearch size={18} />
          </button>
          <NotificationsBell />
          <div className="hidden sm:block border border-gray-300 p-2 rounded-[5px]">
            <LuShare2 size={18} />
          </div>

          <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
            <PopoverTrigger
              type="button"
              aria-label="Settings"
              className="border border-gray-300 p-2 rounded-[5px] text-gray-700 hover:bg-gray-50"
            >
              <IoSettingsOutline size={18} />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-0" sideOffset={8}>
              <div className="px-4 py-3 border-b">
                <p className="text-sm font-semibold truncate">{user?.name ?? "—"}</p>
                <p className="text-xs text-muted-foreground">
                  {user ? ROLE_LABELS[user.role] : ""}
                </p>
              </div>
              <div className="py-1">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 text-gray-700"
                >
                  <LuKeyRound size={16} />
                  Change password
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 text-red-600"
                >
                  <FiLogOut size={16} />
                  Log out
                </button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <ChangePasswordDialog open={pwdOpen} onOpenChange={setPwdOpen} />
    </header>
  );
}

export default Header;
