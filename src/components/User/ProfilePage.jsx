import React from "react";
import { motion } from "framer-motion";
import AddressActions from "./AddressActions";

const ProfilePage = ({ user }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-12"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center gap-8 border-b-2 border-stone-100 pb-12">
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute inset-0 bg-emerald-500 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
          {user?.userpic ? (
            <img
              src={user.userpic}
              className="size-32 md:size-40 rounded-[2.5rem] border-4 border-black object-cover relative z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-1 group-hover:translate-y-1 group-hover:shadow-none transition-all duration-300"
              alt="User profile"
            />
          ) : (
            <div className="size-32 md:size-40 rounded-[2.5rem] border-4 border-black bg-stone-100 flex items-center justify-center relative z-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <UserIcon className="size-16 text-stone-300" />
            </div>
          )}
        </motion.div>

        <div className="text-center md:text-left">
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-serif font-black text-stone-900 mb-2">
            Hey, {user?.firstname || "Friend"}! 👋
          </motion.h1>
          <motion.p variants={itemVariants} className="text-stone-500 font-bold tracking-widest uppercase text-sm">
            Manage your pawsome profile and pets
          </motion.p>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* About Card */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-[#FFFDF5] rounded-[2.5rem] border-2 border-black p-8 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
          <h2 className="text-2xl font-serif font-black mb-6 flex items-center gap-3">
            <span className="p-2 bg-emerald-100 rounded-xl"><UserIcon /></span>
            About Me
          </h2>
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-stone-100 h-48 overflow-y-auto">
            <p className="text-stone-600 font-medium leading-relaxed italic">
              {user?.about?.replace(/\*\*(.*?)\*\*/g, '$1') || "No bio yet. Tell the community about your love for pets!"}
            </p>
          </div>
        </motion.div>

        {/* Quick Stats/Info */}
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="bg-white rounded-[2rem] border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1 block">Full Name</span>
            <p className="text-xl font-serif font-black text-stone-900">{user?.firstname} {user?.lastname}</p>
          </div>
          <div className="bg-white rounded-[2rem] border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1 block">Email Address</span>
            <p className="text-xl font-serif font-black text-stone-900 break-all">{user?.email}</p>
          </div>
          <div className="bg-white rounded-[2rem] border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black text-stone-400 uppercase tracking-widest mb-1 block">Phone Number</span>
            <p className="text-xl font-serif font-black text-stone-900">{user?.phone || "Not Verified"}</p>
          </div>
        </motion.div>
      </div>

      {/* Address Section */}
      <motion.div variants={itemVariants} className="pt-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-stone-200" />
          <h2 className="text-2xl font-serif font-black px-6 py-3 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Saved Addresses
          </h2>
          <div className="h-px flex-1 bg-stone-200" />
        </div>
        <div className="bg-emerald-50 rounded-[3rem] border-2 border-black p-8 md:p-12 relative overflow-hidden flex flex-col items-center justify-center min-h-[150px]">
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-32 -mb-32 blur-3xl" />
          {user?.addresses?.length > 0 ? (
            <AddressActions />
          ) : (
            <div className="relative z-10 text-center">
              <p className="text-emerald-900 font-black text-lg mb-2">No Saved Addresses</p>
              <p className="text-emerald-700/60 font-medium text-sm">Add your first address in settings to see it here!</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Simple Icon for the Profile Card
// Simple Icon for the Profile Card
const UserIcon = ({ className }) => (
  <svg className={className || "w-6 h-6 text-emerald-600"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default ProfilePage;