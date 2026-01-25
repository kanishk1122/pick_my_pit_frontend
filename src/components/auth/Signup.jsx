import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSwal } from "@utils/Customswal.jsx";
import { USER } from "../../Consts/apikeys";
import axios from "axios";
import { encrypter } from "../../Consts/Functions";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

// --- Icons ---
const UserIcon = () => (
  <svg className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
);
const MailIcon = () => (
  <svg className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
);
const LockIcon = () => (
  <svg className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
);
const TagIcon = () => (
  <svg className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>
);

const Signup = ({ email, setEmail, password, setPassword }) => {
  const [confirmepassword, setConfirmepassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [referralCode, setReferralCode] = useState("");
  
  const [stage, setStage] = useState(1);
  const lastStage = 3;
  const Swal = useSwal();
  const navigate = useNavigate();
  const [passwordMatch, setPasswordMatch] = useState(true);

  // Check passwords match
  useEffect(() => {
    if (confirmepassword) {
      setPasswordMatch(password === confirmepassword);
    } else {
      setPasswordMatch(true); // Don't show error if empty
    }
  }, [password, confirmepassword]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (stage === 1 && !email) {
      return Swal.fire({ icon: "info", title: "Missing Email", text: "Please enter your email address." });
    }
    if (stage === 2) {
      if (!password || !confirmepassword) {
        return Swal.fire({ icon: "info", title: "Missing Password", text: "Please fill in both password fields." });
      }
      if (!passwordMatch) {
        return Swal.fire({ icon: "error", title: "Mismatch", text: "Passwords do not match." });
      }
    }
    if (stage === 3 && (!firstname || !lastname)) {
      return Swal.fire({ icon: "info", title: "Missing Name", text: "Please enter your full name." });
    }

    // Move to next stage
    if (stage < lastStage) {
      setStage(stage + 1);
      return;
    }

    // Final Submit
    try {
      const response = await axios.post(`${USER.Register}`, {
        email,
        password: password,
        firstname,
        lastname,
        referralCode,
      });

      Swal.fire({
        icon: "success",
        title: "Welcome Aboard! 🎉",
        text: "Account created successfully.",
        confirmButtonColor: "#10B981"
      });

      // Save session
      const userdata = encrypter(JSON.stringify(response.data.userdata));
      Cookies.set("Userdata", userdata, { expires: 150 });
      
      window.location.href = "/";

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error?.response?.data?.msg || "Something went wrong. Please try again.",
        confirmButtonColor: "#EF4444"
      });
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="w-full flex flex-col items-center justify-center min-h-[300px]">
      
      {/* Progress Dots */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`h-2 rounded-full transition-all duration-300 ${
              stage >= s ? "w-8 bg-emerald-500" : "w-2 bg-stone-200"
            }`}
          ></div>
        ))}
      </div>

      {/* --- STAGE 1: Email --- */}
      {stage === 1 && (
        <div className="w-full space-y-4 animate-fade-in-up">
          <label className="block text-sm font-bold text-stone-600 mb-1 ml-1 uppercase tracking-wide">
            Email Address
          </label>
          <div className="relative">
            <MailIcon />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-stone-800 placeholder-stone-400"
              autoFocus
            />
          </div>
        </div>
      )}

      {/* --- STAGE 2: Password --- */}
      {stage === 2 && (
        <div className="w-full space-y-4 animate-fade-in-up">
          <div>
            <label className="block text-sm font-bold text-stone-600 mb-1 ml-1 uppercase tracking-wide">
              Password
            </label>
            <div className="relative">
              <LockIcon />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-stone-800"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-600 mb-1 ml-1 uppercase tracking-wide">
              Confirm Password
            </label>
            <div className="relative">
              <LockIcon />
              <input
                type="password"
                value={confirmepassword}
                onChange={(e) => setConfirmepassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-3 bg-stone-50 border-2 rounded-xl focus:bg-white focus:outline-none transition-all font-bold text-stone-800 
                  ${!passwordMatch ? "border-red-400 focus:border-red-500" : "border-stone-200 focus:border-emerald-500"}`}
              />
            </div>
            {!passwordMatch && (
              <p className="text-xs text-red-500 font-bold mt-1 ml-1">Passwords do not match</p>
            )}
          </div>
        </div>
      )}

      {/* --- STAGE 3: Details --- */}
      {stage === 3 && (
        <div className="w-full space-y-4 animate-fade-in-up">
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-bold text-stone-600 mb-1 ml-1 uppercase tracking-wide">First Name</label>
              <div className="relative">
                <UserIcon />
                <input
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  placeholder="John"
                  className="w-full pl-12 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-stone-800"
                  autoFocus
                />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-bold text-stone-600 mb-1 ml-1 uppercase tracking-wide">Last Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  placeholder="Doe"
                  className="w-full pl-4 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-stone-800"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-stone-600 mb-1 ml-1 uppercase tracking-wide">
              Referral Code <span className="text-stone-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <TagIcon />
              <input
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="FRIEND123"
                className="w-full pl-12 pr-4 py-3 bg-stone-50 border-2 border-stone-200 rounded-xl focus:border-emerald-500 focus:bg-white focus:outline-none transition-all font-bold text-stone-800 uppercase"
              />
            </div>
          </div>
        </div>
      )}

      {/* --- Buttons --- */}
      <div className="flex gap-4 w-full mt-8">
        {stage > 1 && (
          <button
            type="button"
            onClick={() => setStage(stage - 1)}
            className="flex-1 py-3 rounded-xl border-2 border-stone-300 text-stone-500 font-bold hover:bg-stone-100 transition-all"
          >
            Back
          </button>
        )}
        
        <button
          type="submit"
          className={`flex-1 py-3 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all
            ${stage === lastStage ? "bg-[#34D399] text-white" : "bg-[#FCD34D] text-stone-900"}`}
        >
          {stage === lastStage ? "Create Account" : "Next"}
        </button>
      </div>

    </form>
  );
};

Signup.propTypes = {
  email: PropTypes.string,
  setEmail: PropTypes.func,
  password: PropTypes.string,
  setPassword: PropTypes.func,
};

export default Signup;