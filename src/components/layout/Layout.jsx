import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar, { MobileSidebar } from "./Sidebar";
import Header from "./Header";
import { NotificationsProvider } from "@/context/NotificationsContext";
import { ThemeProvider } from "@/context/ThemeContext";

function Layout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <ThemeProvider>
            <NotificationsProvider>
                <div className="w-full h-dvh bg-gray-200 flex justify-center items-center">
                    <div className="w-full h-full md:w-[95%] md:h-[95%] flex justify-center items-center md:shadow-md">
                        <Sidebar />
                        <MobileSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
                        <div className="w-full h-full bg-white flex flex-col justify-start items-center gap-4 md:gap-8 p-3 md:p-5">
                            <Header onOpenSidebar={() => setSidebarOpen(true)} />
                            <Outlet />
                        </div>
                    </div>
                </div>
            </NotificationsProvider>
        </ThemeProvider>
     );
}

export default Layout;
