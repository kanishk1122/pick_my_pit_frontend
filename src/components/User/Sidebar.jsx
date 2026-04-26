import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../../utils/Usercontext";

// Premium Icon Components
const UserIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M11 4H4a2 2 0 0 0-2 2v200a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const AddressIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const PostsIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="21" x2="9" y2="9" />
  </svg>
);

const ReferIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const menuItems = [
  { title: "Dashboard", link: "/user/", icon: <UserIcon /> },
  { title: "Settings", link: "setting", icon: <EditIcon /> },
  { title: "Addresses", link: "address", icon: <AddressIcon /> },
  { title: "My Posts", link: "posts", icon: <PostsIcon /> },
  { title: "Refers", link: "refer", icon: <ReferIcon /> },
];

const Sidebar = ({ isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const isActive = (link) => {
    const currentPath = location.pathname;
    const fullLink = link.startsWith('/') ? link : `/user/${link}`;
    if (fullLink === '/user/' && currentPath === '/user/') return true;
    return currentPath.includes(link) && fullLink !== '/user/';
  };

  if (isMobile) {
    return (
      <nav className="flex items-center justify-around w-full">
        {menuItems.map((item) => {
          const active = isActive(item.link);
          return (
            <button
              key={item.title}
              onClick={() => navigate(`${item.link}`)}
              className="relative p-3 flex flex-col items-center gap-1 group"
            >
              <div className={`
                p-2 rounded-2xl transition-all duration-300
                ${active
                  ? "bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110"
                  : "text-white/60 hover:text-white hover:bg-white/10"
                }
              `}>
                {item.icon}
              </div>
              {active && (
                <motion.div
                  layoutId="mobile-indicator"
                  className="absolute -bottom-1 w-1 h-1 bg-emerald-400 rounded-full"
                />
              )}
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Profile Card */}
      <div className="bg-white rounded-[2rem] border-2 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
        <div className="relative">
          <img
            src={user?.userpic || "https://premium-placeholder.com/user"}
            className="w-16 h-16 rounded-2xl border-2 border-black object-cover"
            alt="User"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
        </div>
        <div>
          <h3 className="font-serif font-black text-xl text-stone-900 leading-tight">
            {user?.firstname || "Grizzly"} <br /> {user?.lastname || "User"}
          </h3>
          <span className="text-xs font-bold text-emerald-600 tracking-widest uppercase">Member Since 2024</span>
        </div>
      </div>

      {/* Desktop Menu */}
      <nav className="bg-white rounded-[2.5rem] border-2 border-black p-4 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
        <div className="space-y-3">
          {menuItems.map((item) => {
            const active = isActive(item.link);
            return (
              <button
                key={item.title}
                onClick={() => navigate(`${item.link}`)}
                className={`
                  w-full flex items-center gap-4 px-5 py-4 rounded-3xl font-black transition-all duration-300 group
                  ${active
                    ? "bg-emerald-500 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                    : "text-stone-500 hover:bg-emerald-50 hover:text-emerald-600 hover:translate-x-2"
                  }
                `}
              >
                <span className={`
                  transition-transform duration-300
                  ${active ? "scale-110" : "group-hover:rotate-12"}
                `}>
                  {item.icon}
                </span>
                <span className="text-sm uppercase tracking-widest">{item.title}</span>
                {active && (
                  <motion.div
                    layoutId="desktop-active"
                    className="ml-auto w-2 h-2 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Support Card */}
      <div className="bg-stone-900 rounded-[2rem] p-6 text-white border-2 border-black relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-2xl group-hover:scale-150 transition-transform duration-500" />
        <h4 className="font-serif font-black text-lg mb-2 relative z-10">Need Help?</h4>
        <p className="text-xs text-white/60 mb-4 font-medium relative z-10">Our pet support team is here 24/7 for your furry friends.</p>
        <button className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

// Add this to your global CSS file to hide scrollbar
// .scrollbar-hide::-webkit-scrollbar {
//   display: none;
// }
// .scrollbar-hide {
//   -ms-overflow-style: none;
//   scrollbar-width: none;
// }