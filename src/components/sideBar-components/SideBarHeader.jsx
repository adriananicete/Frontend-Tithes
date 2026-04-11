import { GoPlus } from "react-icons/go";
import { FiSidebar } from "react-icons/fi";
import Button from "../Buttons";
function SideBarHeader() {
    return ( 
        <div className="bg-[] flex flex-col justify-center items-center gap-8 py-2">
            <div className="w-full flex justify-between items-center">
                <div className="w-[43px] h-[45px] rounded-[8px] overflow-hidden">
                    <img className="w-full h-full" src="https://res.cloudinary.com/dks2psaem/image/upload/v1763347986/joscm-logo_jq0zlo.png" alt="" />
                </div>
                <div className="w-[60%] px-2">
                    <p className="">Adrian Anicete</p>
                    <p className="text-gray-500 text-sm">Admin</p>
                </div>
                <div className="w-[20%] flex justify-end item-center">
                    <p><FiSidebar size={20}/></p>
                </div>
            </div>

            <Button titleName='Create User' icon={GoPlus} />
        </div>
     );
}

export default SideBarHeader;