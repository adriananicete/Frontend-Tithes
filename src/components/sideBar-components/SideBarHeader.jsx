import { FiSidebar, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_LABELS } from "../../utils/rolePermissions";

function SideBarHeader() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="bg-[] flex flex-col justify-center items-center gap-4 py-2">
            <div className="w-full flex justify-between items-center">
                <div className="w-[43px] h-[45px] rounded-[8px] overflow-hidden shrink-0">
                    <img className="w-full h-full" src="https://res.cloudinary.com/dks2psaem/image/upload/v1763347986/joscm-logo_jq0zlo.png" alt="" />
                </div>
                <div className="flex-1 px-2 min-w-0">
                    <p className="truncate">{user?.name ?? "—"}</p>
                    <p className="text-gray-500 text-sm">{user ? ROLE_LABELS[user.role] : ""}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2">
                    <button
                        type="button"
                        onClick={handleLogout}
                        title="Log out"
                        className="p-1 text-gray-600 hover:text-red-600 cursor-pointer"
                    >
                        <FiLogOut size={18} />
                    </button>
                    <FiSidebar size={20} className="text-gray-700" />
                </div>
            </div>
        </div>
     );
}

export default SideBarHeader;
