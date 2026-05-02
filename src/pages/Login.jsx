import LoginInput from "../components/login-components/LoginInput";
import { FiUser } from "react-icons/fi";
import { RiLockPasswordLine } from "react-icons/ri";
import { BiRightArrowAlt } from "react-icons/bi";
import { LuEyeClosed } from "react-icons/lu";
import OauthButton from "../components/login-components/OauthButton";
import { LuEye } from "react-icons/lu";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../services/api";
import { useAuth } from "../hooks/useAuth";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');
    const [ error, setError ] = useState('');
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    // Pre-warm the backend while the user is filling out the form.
    // Backend lives on Render free tier and sleeps after ~15min idle — a
    // cold boot takes 30-60s. Firing this on mount overlaps that wake-up
    // with typing time, so by the time Login is clicked the backend is
    // already up (or close to it). Fire-and-forget; errors ignored on
    // purpose since the real login call surfaces any actual problem.
    useEffect(() => {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7001/api';
        const root = apiUrl.replace(/\/api\/?$/, '');
        const controller = new AbortController();
        fetch(root, { method: 'GET', signal: controller.signal }).catch(() => {});
        return () => controller.abort();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);
        try {
            const res = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });
            login(res.data, res.token);
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleChange = (e) => {
        if(e.target.name === 'email') {
            setEmail(e.target.value)
        }

        if(e.target.name === 'password') {
            setPassword(e.target.value)
        }
    }

  return (
    <div className="bg-gray-200 w-full h-dvh flex justify-center items-center ">
      <div className="bg-[#ffffff] w-[80%] max-w-[400px] h-[auto] p-8 flex flex-col justify-center items-center gap-4 rounded-[8px] shadow-md">
        {/* header */}
        <div className="w-full flex justify-start items-center gap-2">
          <div className="w-[48px] h-[48px]">
            <img
              src="https://res.cloudinary.com/dks2psaem/image/upload/v1763347986/joscm-logo_jq0zlo.png"
              alt="joscm logo"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-700">JOSCM <span className="text-[#2f6a7a] ">Tithes App</span></h1>
            <p className="text-sm text-gray-500">Financial Management System</p>
          </div>
        </div>

        {/* body */}
        <div className="w-full mt-5">
          <h2 className="text-xl font-bold ">Sign In</h2>
          <p className="text-gray-400 text-xs">
            Please sign-in to continue your account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col justify-between items-center gap-2">
          <LoginInput
            icon={FiUser}
            inputType="email"
            placeholder="Enter your email"
            name="email"
            titleName='Email'
            onChange={handleChange}
          />
          <LoginInput
            icon={RiLockPasswordLine}
            icon2={LuEye}
            icon3={LuEyeClosed}
            inputType="password"
            placeholder="Enter your password"
            name="password"
            titleName='Password'
            secondName="Foget Password?"
            onChange={handleChange}
          />
          {error && (
            <p className="w-full text-xs text-red-600 mt-1">{error}</p>
          )}
          {/* Login button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black flex justify-center items-center gap-1 text-white text-sm w-full rounded-[3px] py-2 mt-3 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Signing in…' : (<>Login <BiRightArrowAlt size={18} /></>)}
          </button>
        </form>

        {/* Oauth button */}
        <div className="bg-[] w-full h-auto flex flex-col justify-center items-center mt-5">
            <div className="w-full flex justify-center items-center gap-2">
                <div className="flex-[1] border border-gray-500"></div>
                <h3 className="flex-[1] text-sm text-center">Or Sign in with</h3>
                <div className="flex-[1] border border-gray-500"></div>
            </div>

            <div className="w-full flex justify-center items-center p-5 gap-5">
                <OauthButton img={'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg'} name={'Google'}/>
                <OauthButton img={'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/facebook/facebook-original.svg'} name={'Facebook'}/>
            </div>
        </div>

        <div className="bg-[]">
            <p className="text-[9px] text-gray-400"> &copy; {new Date().getFullYear()} - Design & Built by ianDev</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
