import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { CiSearch } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { LuShare2, LuKeyRound, LuUser } from "react-icons/lu";
import { FiLogOut } from "react-icons/fi";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationsBell } from "@/components/notifications-components/NotificationsBell";
import { OnlinePresence } from "@/components/layout/OnlinePresence";
import { SearchResultsDropdown } from "@/components/layout/SearchResultsDropdown";
import { PushToggle } from "@/components/layout/PushToggle";
import { ChangePasswordDialog } from "@/components/sideBar-components/ChangePasswordDialog";
import { useAuth } from "@/hooks/useAuth";
import { useGlobalSearch } from "@/hooks/useGlobalSearch";
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

  // Global search (RF + Voucher). Dropdown shows the top matches; "View all"
  // and the mobile icon go to the full /search page.
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const { results, counts, loading: searchLoading, error: searchError } =
    useGlobalSearch(searchQuery, { limit: 8 });

  // Close the dropdown when clicking outside the search box.
  useEffect(() => {
    const onPointerDown = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const handleSelectResult = (r) => {
    setSearchOpen(false);
    setSearchQuery("");
    navigate(`${r.route}?focus=${r.focusId}`);
  };

  const handleViewAll = () => {
    const q = searchQuery.trim();
    setSearchOpen(false);
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

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
    <header className="w-full flex items-center justify-between gap-3 md:gap-5 border-b border-gray-200 dark:border-border pb-3">
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open menu"
          className="md:hidden w-9 h-9 rounded-[8px] overflow-hidden shrink-0"
        >
          <img
            className="w-full h-full object-cover"
            src="https://res.cloudinary.com/dks2psaem/image/upload/v1763347986/joscm-logo_jq0zlo.png"
            alt="JOSCM logo — open menu"
          />
        </button>
        <p className="text-base md:text-[20px] font-bold truncate">
          <span className="text-[#2f6a7a]">JOSCM</span>
          <span className="hidden sm:inline"> Tithes Management System</span>
          <span className="sm:hidden"> Tithes</span>
        </p>
      </div>

      <div className="flex items-center gap-2 md:gap-5 shrink-0">
        <OnlinePresence />
        <p className="hidden lg:block text-sm text-gray-600 dark:text-muted-foreground whitespace-nowrap">{dateLabel}</p>
        <div ref={searchRef} className="hidden sm:block relative w-48 lg:w-70">
          <div className="flex border border-gray-300 dark:border-border w-full p-2 justify-between items-center rounded-[5px]">
            <CiSearch size={18} />
            <input
              className="w-[92%] px-2 rounded-[3px] bg-transparent outline-none text-sm"
              type="text"
              placeholder="Search RF / PCF / particulars…"
              autoComplete="off"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              onFocus={() => setSearchOpen(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchQuery.trim().length >= 2) handleViewAll();
                if (e.key === "Escape") setSearchOpen(false);
              }}
            />
          </div>
          {searchOpen && searchQuery.trim().length >= 2 && (
            <SearchResultsDropdown
              results={results}
              counts={counts}
              loading={searchLoading}
              error={searchError}
              query={searchQuery}
              onSelect={handleSelectResult}
              onViewAll={handleViewAll}
            />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            onClick={() => navigate("/search")}
            className="sm:hidden border border-gray-300 dark:border-border p-2 rounded-[5px] text-gray-700 dark:text-foreground"
          >
            <CiSearch size={18} />
          </button>
          <NotificationsBell />
          <div className="hidden sm:block border border-gray-300 dark:border-border p-2 rounded-[5px]">
            <LuShare2 size={18} />
          </div>

          <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
            <PopoverTrigger
              type="button"
              aria-label="Settings"
              className="border border-gray-300 dark:border-border p-2 rounded-[5px] text-gray-700 dark:text-foreground hover:bg-gray-50 dark:hover:bg-accent"
            >
              <IoSettingsOutline size={18} />
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-0" sideOffset={8}>
              <div className="px-4 py-3 border-b flex items-center gap-3">
                <UserAvatar name={user?.name} src={user?.avatarUrl} userId={user?._id ?? user?.id} size="md" />
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.name ?? "—"}</p>
                  <p className="text-xs text-muted-foreground">
                    {user ? ROLE_LABELS[user.role] : ""}
                  </p>
                </div>
              </div>
              <div className="py-1">
                <PushToggle />
                <button
                  type="button"
                  onClick={() => {
                    setSettingsOpen(false);
                    navigate("/profile");
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-accent text-gray-700 dark:text-foreground"
                >
                  <LuUser size={16} />
                  My profile
                </button>
                <button
                  type="button"
                  onClick={handleChangePassword}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-accent text-gray-700 dark:text-foreground"
                >
                  <LuKeyRound size={16} />
                  Change password
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-500/10 text-red-600 dark:text-red-400"
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
