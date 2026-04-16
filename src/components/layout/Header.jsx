import { CiSearch } from "react-icons/ci";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { LuShare2 } from "react-icons/lu";
import { FiMenu } from "react-icons/fi";

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
          <div className="border border-gray-300 p-2 rounded-[5px]">
            <IoNotificationsOutline size={18} />
          </div>
          <div className="hidden sm:block border border-gray-300 p-2 rounded-[5px]">
            <LuShare2 size={18} />
          </div>
          <div className="border border-gray-300 p-2 rounded-[5px]">
            <IoSettingsOutline size={18} />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
