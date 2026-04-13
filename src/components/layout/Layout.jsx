import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout() {
    return ( 
        <div className="w-full h-dvh bg-gray-200 flex justify-center items-center">
            <div className="w-[95%] h-[95%] flex justify-center items-center shadow-md">
            
                <Sidebar />
            <div className="w-full h-full bg-white flex flex-col justify-start items-center gap-8 p-5">
                <Header />
                <Outlet />
            </div>
        </div>
        </div>
     );
}

export default Layout;