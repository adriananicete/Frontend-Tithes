import { CiSearch } from "react-icons/ci";
import { IoNotificationsOutline } from "react-icons/io5";
import { LuShare2 } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import Button from "../Buttons";
import { GoPlus } from "react-icons/go";

function Header() {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <header className="w-full bg-[] flex flex-col justify-center items-center gap-7 border-b border-gray-200 pb-3">
      <div className="w-full flex justify-center items-start gap-5">
        <div className="bg-[] w-full flex justify-start items-center gap-2">
            {/* <div className="w-[48px] h-[48px]">
            <img
              src=""
              alt="joscm logo"
            />
          </div> */}
          <p className="text-[20px] font-bold"> <span className="text-[#2f6a7a]">JOSCM</span> Dashboard</p>
        </div>
        <div className="w-full bg-[] flex justify-end items-center gap-5 ">
          <div className="border border-gray-300 w-70 p-2 flex justify-between items-center rounded-[5px]">
            <CiSearch size={18} />
            <input
              className="bg-[] w-[92%] px-2 rounded-[3px] bg-[transparent] outline-none text-sm"
              type="text"
              placeholder="Search for ....."
              autoComplete=""
            />
          </div>

          <div className="flex justify-center items-center gap-2">
            <div className="border border-gray-300 w-auto p-2 rounded-[5px]">
              <IoNotificationsOutline size={18} />
            </div>

            <div className="border border-gray-300 w-auto p-2 rounded-[5px]">
              <LuShare2 size={18} />
            </div>

            <div className="border border-gray-300 w-auto p-2 rounded-[5px]">
              <IoSettingsOutline size={18} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[] w-full flex justify-between items-end">
        <div className="">
          <p className="text-[25px] font-[600]">Welcome, Admin 👋</p>
          <p className="text-gray-600 text-sm">
            Let's Rock today. We have 2 Pending Tasks and 5 New Records.
          </p>
        </div>

        <div className=" w-100 flex justify-end items-center gap-5">
            <p className="text-md">
            {daysOfWeek[new Date().getDay()]}, {months[new Date().getMonth()]}{" "}
            {new Date().getDate()}, {new Date().getFullYear()}
          </p>
            <div className="w-33">
                <Button titleName='Add Category' icon={GoPlus}/>
            </div>
      </div>
      </div>

      
    </header>
  );
}

export default Header;
