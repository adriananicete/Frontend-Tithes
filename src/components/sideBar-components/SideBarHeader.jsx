import { FiSidebar } from "react-icons/fi";

function SideBarHeader() {
    return (
        <div className="bg-[] flex flex-col justify-center items-center gap-4 py-2">
            <div className="w-full flex justify-between md:justify-center xl:justify-between items-center">
                <div className="flex items-center gap-2 min-w-0">
                    <div className="w-[43px] h-[45px] rounded-[8px] overflow-hidden shrink-0">
                        <img className="w-full h-full" src="https://res.cloudinary.com/dks2psaem/image/upload/v1763347986/joscm-logo_jq0zlo.png" alt="" />
                    </div>
                    <div className="min-w-0 md:hidden xl:block">
                        <p className="font-bold text-lg leading-tight truncate">
                            <span className="text-[#2f6a7a]">JOSCM</span>
                        </p>
                        <p className="text-gray-500 dark:text-muted-foreground text-xs leading-tight truncate">
                            Tithes Management
                        </p>
                    </div>
                </div>
                <div className="shrink-0 flex items-center gap-2 md:hidden xl:flex">
                    <FiSidebar size={20} className="text-gray-700 dark:text-muted-foreground" />
                </div>
            </div>
        </div>
     );
}

export default SideBarHeader;
