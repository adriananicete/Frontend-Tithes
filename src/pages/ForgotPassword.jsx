import { useState } from "react";
import { useNavigate } from "react-router";
import { FiUser } from "react-icons/fi";
import { BiRightArrowAlt } from "react-icons/bi";
import { apiFetch } from "../services/api";
import LoginInput from "../components/login-components/LoginInput";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await apiFetch("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      // Backend always responds 200 (no email enumeration) — show the same
      // confirmation regardless of whether the address exists.
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
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
          <h2 className="text-xl font-bold">Forgot Password</h2>
          <p className="text-muted-foreground text-xs">
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {submitted ? (
          <div className="w-full mt-2">
            <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/30 text-green-700 dark:text-green-400 text-sm rounded-[5px] p-3">
              If that email is registered, a reset link has been sent. Please
              check your inbox (and spam folder). The link expires in 1 hour.
            </div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="bg-primary flex justify-center items-center gap-1 text-primary-foreground text-sm w-full rounded-[3px] py-2 mt-4 cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col justify-between items-center gap-2"
          >
            <LoginInput
              icon={FiUser}
              inputType="email"
              placeholder="Enter your email"
              name="email"
              titleName="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            {error && (
              <p className="w-full text-xs text-red-600 mt-1">{error}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary flex justify-center items-center gap-1 text-primary-foreground text-sm w-full rounded-[3px] py-2 mt-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending…" : (<>Send Reset Link <BiRightArrowAlt size={18} /></>)}
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

export default ForgotPassword;
