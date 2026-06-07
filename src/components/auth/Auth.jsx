import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/Usercontext";
import Login from "./Login.jsx";
import Signup from "./Signup.jsx";
import Googlebutton from "./Googlebutton.jsx";
import v1 from "../../assets/video/hsv2.mp4"; // Ensure path is correct
import image from "../../assets/images/pikaso_texttoimage_A-handdrawn-vibrant-outdoor-scene-in-a-peaceful-vi.jpeg"; // Ensure path is correct

// --- Icons ---
const PawIcon = () => (
  <svg className="w-6 h-6 text-stone-900" fill="currentColor" viewBox="0 0 24 24">
    <circle cx="11" cy="4" r="2" />
    <circle cx="18" cy="8" r="2" />
    <circle cx="20" cy="16" r="2" />
    <circle cx="4" cy="14" r="2" />
    <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authtype, setAuthtype] = useState("login");
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useUser();

  // Redirect if authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Loading State
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFCF8]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (isAuthenticated) return null;

  return (
    <div className="min-h-screen w-full bg-[#FDFCF8] flex items-center justify-center p-4 md:p-8 font-sans overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-100 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 opacity-50 pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="w-full max-w-6xl bg-white rounded-[3rem] border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row min-h-[600px] md:h-[750px] relative z-10">
        
        {/* --- Left Side: Visuals & Messaging (Desktop) / Header (Mobile) --- */}
        <div className={`
          relative w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between transition-all duration-500 ease-in-out order-1
          ${authtype === 'login' ? 'bg-[#FCD34D]' : 'bg-emerald-500 text-white'}
        `}>
          {/* Logo / Badge */}
          <div className="flex items-center gap-2 mb-8 md:mb-0">
            <div className="p-2 bg-white border-2 border-black rounded-full shadow-sm">
              <PawIcon />
            </div>
            <span className={`font-bold font-serif text-xl ${authtype === 'signup' ? 'text-white' : 'text-stone-900'}`}>
              Pick My Pet
            </span>
          </div>

          {/* Dynamic Content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center space-y-8">
            <h1 className={`text-4xl md:text-6xl font-bold font-serif leading-tight ${authtype === 'signup' ? 'text-white' : 'text-stone-900'}`}>
              {authtype === 'login' ? (
                <>Welcome back, <br/> Friend!</>
              ) : (
                <>Join the <br/> Pawsome Family!</>
              )}
            </h1>
            
            <p className={`text-lg md:text-xl font-medium max-w-sm ${authtype === 'signup' ? 'text-emerald-100' : 'text-stone-700'}`}>
              {authtype === 'login' 
                ? "Your furry friends missed you. Log in to continue your journey."
                : "Create an account to find, adopt, or rehome pets with ease."
              }
            </p>

            {/* Visual Media */}
            <div className="relative w-full max-w-xs aspect-square mt-4 hidden md:block group">
              <div className="absolute inset-0 bg-black rounded-[2rem] translate-x-2 translate-y-2"></div>
              <div className="absolute inset-0 bg-white border-2 border-black rounded-[2rem] overflow-hidden">
                {authtype === 'login' ? (
                  <video 
                    src={v1} 
                    autoPlay loop muted className="w-full h-full object-cover" 
                  />
                ) : (
                  <img 
                    src={image} 
                    alt="Happy pets" 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>
              {/* Sticker */}
              <div className="absolute -bottom-4 -right-4 bg-white px-4 py-2 border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-6 group-hover:rotate-12 transition-transform">
                <span className="font-bold text-stone-800 text-sm">
                  {authtype === 'login' ? "👋 Hello!" : "🚀 Let's Go!"}
                </span>
              </div>
            </div>
          </div>

          {/* Toggle Button (Mobile Only - simplified) */}
          <div className="md:hidden mt-8 text-center">
             <button 
               onClick={() => setAuthtype(authtype === 'login' ? 'signup' : 'login')}
               className="underline font-bold text-sm"
             >
               {authtype === 'login' ? "New here? Create Account" : "Already have an account? Login"}
             </button>
          </div>
        </div>

        {/* --- Right Side: Forms --- */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-16 flex flex-col justify-center order-2">
          
          {/* Form Container */}
          <div className="max-w-md mx-auto w-full space-y-8">
            
            <div className="text-center md:text-left mb-8">
              <h2 className="text-3xl font-bold text-stone-800 font-serif mb-2">
                {authtype === 'login' ? 'Log In' : 'Sign Up'}
              </h2>
              <p className="text-stone-500 font-medium">
                {authtype === 'login' ? 'Please enter your details.' : 'Get started in seconds.'}
              </p>
            </div>

            {/* Google Button Wrapper */}
            <div className="w-full flex justify-center items-center">
              <Googlebutton />
            </div>

            <div className="relative flex items-center justify-center my-6">
              <div className="border-t-2 border-stone-100 w-full absolute"></div>
              <span className="bg-white px-3 text-stone-400 text-sm font-bold relative z-10">OR</span>
            </div>

            {/* Form Inputs */}
            {authtype === 'login' ? (
              <Login 
                email={email} setEmail={setEmail} 
                password={password} setPassword={setPassword} 
                authtype={authtype} setauthtype={setAuthtype} 
              />
            ) : (
              <Signup 
                email={email} setEmail={setEmail} 
                password={password} setPassword={setPassword} 
                authtype={authtype} 
              />
            )}

            {/* Desktop Toggle Switch */}
            <div className="hidden md:flex items-center justify-center gap-2 mt-8 pt-8 border-t-2 border-stone-100">
              <span className="text-stone-500 font-medium">
                {authtype === 'login' ? "Don't have an account?" : "Already have an account?"}
              </span>
              <button
                onClick={() => setAuthtype(authtype === 'login' ? 'signup' : 'login')}
                className="font-bold text-stone-900 hover:text-emerald-600 underline decoration-2 underline-offset-4 transition-colors flex items-center gap-1 group"
              >
                {authtype === 'login' ? 'Sign up for free' : 'Log in here'}
                <ArrowRightIcon />
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Auth;