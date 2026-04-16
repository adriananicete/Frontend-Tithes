import { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { BiRightArrowAlt } from "react-icons/bi";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "../hooks/useAuth";
import { MOCK_USERS, ROLE_LABELS } from "../utils/rolePermissions";

function DevRolePicker() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handlePickRole = (mockUser) => {
    const mockToken = `mock-${mockUser.role}-token`;
    login(mockUser, mockToken);
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="bg-gray-200 w-full h-dvh flex justify-center items-center">
      <div className="bg-white w-[90%] max-w-[440px] p-8 flex flex-col gap-5 rounded-[8px] shadow-md">
        <div className="w-full flex justify-between items-start gap-2">
          <div className="flex items-center gap-2">
            <div className="w-[48px] h-[48px]">
              <img
                src="https://res.cloudinary.com/dks2psaem/image/upload/v1763347986/joscm-logo_jq0zlo.png"
                alt="joscm logo"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-700">
                JOSCM <span className="text-[#2f6a7a]">Tithes App</span>
              </h1>
              <p className="text-sm text-gray-500">Dev Role Picker</p>
            </div>
          </div>
        </div>

        <div className="w-full flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Select a test user</h2>
            <p className="text-gray-400 text-xs">
              Mock auth — bypasses the real login for RBAC preview.
            </p>
          </div>
          <Link
            to="/login"
            className="text-xs text-gray-500 hover:text-[#2f6a7a] flex items-center gap-1"
          >
            <FiArrowLeft size={14} /> Back
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {MOCK_USERS.map((u) => (
            <button
              key={u._id}
              type="button"
              onClick={() => handlePickRole(u)}
              className="group flex justify-between items-center gap-3 border border-gray-200 hover:border-[#2f6a7a] hover:bg-[#f6f6f6] rounded-[5px] px-4 py-3 text-left transition cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{u.name}</p>
                <p className="text-xs text-gray-500">
                  {ROLE_LABELS[u.role]} · {u.email}
                </p>
              </div>
              <BiRightArrowAlt
                size={20}
                className="text-gray-400 group-hover:text-[#2f6a7a] transition"
              />
            </button>
          ))}
        </div>

        <div className="w-full">
          <p className="text-[10px] text-gray-400 text-center">
            Dev-only — remove before production
          </p>
        </div>
      </div>
    </div>
  );
}

export default DevRolePicker;
