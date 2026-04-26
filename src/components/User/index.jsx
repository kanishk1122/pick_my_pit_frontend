import React from "react";
import Sidebar from "./Sidebar.jsx";
import Profileroutes from "./Profileroutes.jsx"; // Nested routes
import ReferralLink from "./ReferralLink.jsx";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#FFFDF5] pt-24 pb-12 px-4 md:px-6">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row gap-8 relative">

        {/* Sidebar Holder - Sticky on Desktop */}
        <aside className="w-full md:w-80 md:flex-shrink-0">
          <div className="sticky top-28">
            <Sidebar />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-[2.5rem] border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-h-[70vh]">
          <div className="p-6 md:p-10 h-full">
            <Profileroutes />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation (Hidden on Desktop) */}
      <div className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
        <div className="bg-black/95 backdrop-blur-xl border-2 border-white/20 rounded-3xl p-2 shadow-2xl">
          <Sidebar isMobile />
        </div>
      </div>
    </div>
  );
};

export default Index;
