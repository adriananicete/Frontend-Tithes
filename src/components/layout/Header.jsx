import { CiSearch } from "react-icons/ci";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { LuShare2 } from "react-icons/lu";

const daysOfWeek = [
  "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Saturday",
];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function Header() {
  const now = new Date();
  const dateLabel = `${daysOfWeek[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

  return (
    <header className="w-full flex items-center justify-between gap-5 border-b border-gray-200 pb-3">
      <div className="flex items-center gap-4">
        <p className="text-[20px] font-bold">
          <span className="text-[#2f6a7a]">JOSCM</span> Tithes Management System
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="border border-gray-300 w-70 p-2 flex justify-between items-center rounded-[5px]">
          <CiSearch size={18} />
          <input
            className="w-[92%] px-2 rounded-[3px] bg-transparent outline-none text-sm"
            type="text"
            placeholder="Search for ....."
            autoComplete=""
          />
        </div>

        <p className="text-sm text-gray-600 whitespace-nowrap">{dateLabel}</p>

        <div className="flex items-center gap-2">
          <div className="border border-gray-300 p-2 rounded-[5px]">
            <IoNotificationsOutline size={18} />
          </div>
          <div className="border border-gray-300 p-2 rounded-[5px]">
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
