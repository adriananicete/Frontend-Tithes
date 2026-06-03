import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { RiLockPasswordLine } from "react-icons/ri";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { BiRightArrowAlt } from "react-icons/bi";
import { apiFetch } from "../services/api";
import LoginInput from "../components/login-components/LoginInput";

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Reset link is missing its token. Please request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setDone(true);
    } catch (err) {
      setError(err.message || "Reset link is invalid or has expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-muted w-full h-dvh flex justify-center items-center">
      <div className="bg-card w-[80%] max-w-[400px] h-[auto] p-8 flex flex-col justify-center items-center gap-4 rounded-[8px] shadow-md">
        {/* header */}
        <div className="w-full flex justify-start items-center gap-2">
          <div className="w-[48px] h-[48px]">
            <img
              src="https://res.cloudinary.com/dks2psaem/image/upload/v1763347986/joscm-logo_jq0zlo.png"
              alt="joscm logo"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              JOSCM <span className="text-[#2f6a7a]">Tithes App</span>
            </h1>
            <p className="text-sm text-muted-foreground">Financial Management System</p>
          </div>
        </div>

        <div className="w-full mt-5">
          <h2 className="text-xl font-bold">Reset Password</h2>
          <p className="text-muted-foreground text-xs">
            Choose a new password for your account.
          </p>
        </div>

        {done ? (
          <div className="w-full mt-2">
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 text-sm rounded-[5px] p-3">
              Your password has been reset. You can now sign in with your new
              password.
            </div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="bg-primary flex justify-center items-center gap-1 text-primary-foreground text-sm w-full rounded-[3px] py-2 mt-4 cursor-pointer"
            >
              Go to Login
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col justify-between items-center gap-2"
          >
            <LoginInput
              icon={RiLockPasswordLine}
              icon2={LuEye}
              icon3={LuEyeClosed}
              inputType="password"
              placeholder="New password"
              name="password"
              titleName="New Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <LoginInput
              icon={RiLockPasswordLine}
              icon2={LuEye}
              icon3={LuEyeClosed}
              inputType="password"
              placeholder="Confirm new password"
              name="confirm"
              titleName="Confirm Password"
              onChange={(e) => setConfirm(e.target.value)}
            />
            {error && (
              <p className="w-full text-xs text-red-600 mt-1">{error}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary flex justify-center items-center gap-1 text-primary-foreground text-sm w-full rounded-[3px] py-2 mt-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Resetting…" : (<>Reset Password <BiRightArrowAlt size={18} /></>)}
            </button>
            <p
              onClick={() => navigate("/login")}
              className="text-[12px] cursor-pointer text-indigo-400 hover:underline mt-2"
            >
              Back to Login
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
