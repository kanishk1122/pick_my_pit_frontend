import { useNavigate } from "react-router-dom";

const AuthGate = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#FDFCF8] px-4 py-12 md:py-20 flex items-center justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-[3rem] border-4 border-black p-10 md:p-16 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          {/* Lock Icon */}
          <div className="mb-8 flex justify-center">
            <svg
              className="w-20 h-20 text-emerald-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm6-10V7a3 3 0 00-3-3H9a3 3 0 00-3 3v2m6-2V7a3 3 0 00-3-3H9a3 3 0 00-3 3v2m6-2h.01M6 20h.01"
              />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-stone-900 font-serif mb-4">
            Article Locked
          </h1>

          <p className="text-lg text-stone-600 mb-8 font-medium">
            You need to be logged in to read the full article. Sign in to access
            this content and unlock your reading experience.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/auth?tab=login")}
              className="bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth?tab=register")}
              className="bg-white text-stone-900 px-8 py-4 rounded-xl font-bold text-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Create Account
            </button>
          </div>

          {/* Back Link */}
          <button
            onClick={() => navigate("/blog")}
            className="mt-8 inline-flex items-center text-emerald-600 hover:text-emerald-700 font-bold transition"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Articles
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthGate;
