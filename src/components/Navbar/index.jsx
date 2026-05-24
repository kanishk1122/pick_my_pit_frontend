import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/Logo.png";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUser } from "../../utils/Usercontext";
import { useSwal } from "../../utils/Customswal";
import Cookies from "js-cookie";

// --- Custom Icons (Stroke Style) ---
const NavIcons = {
  Post: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Services: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Logout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  Lock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  Menu: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Home: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Messenger: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
};

const Navbar = () => {
  const navRef = useRef(null);
  const { user } = useUser();
  const [userdete, setuserdete] = useState(undefined);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  useEffect(() => {
    if (Cookies.get("Userdata")) {
      setuserdete(Cookies.get("Userdata"));
    } else {
      setuserdete();
    }
  }, [Cookies.get("Userdata") || user]);

  // Scroll Animation (Shrink Padding)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scrollTriggerInstance = ScrollTrigger.create({
      trigger: document.body,
      start: "top -10",
      end: 99999,
      onUpdate: (self) => {
        if (self.progress > 0 && navRef.current) {
           gsap.to(navRef.current, {
             padding: "8px 24px",
             duration: 0.3,
             ease: "power2.out"
           });
        } else if (navRef.current) {
           gsap.to(navRef.current, {
             padding: "12px 32px", 
             duration: 0.3,
             ease: "power2.out"
           });
        }
      }
    });

    return () => {
      scrollTriggerInstance.kill();
    };
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (showMobileSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showMobileSidebar]);

  // Define Desktop Links Dynamically
  const desktopLinks = [
    {
      route: "pets",
      name: "Pets",
      Icon: NavIcons.Services,
    },
  ];

  // Only show "Post" and "Messages" if user is logged in
  if (user) {
    desktopLinks.push({
      route: "create-post",
      name: "Post",
      Icon: NavIcons.Post,
    });
    desktopLinks.push({
      route: "messenger",
      name: "Messages",
      Icon: NavIcons.Messenger,
    });
  }

  return (
    <>
      <div className="w-full flex justify-center px-4">
        {/* Navbar Container */}
        {/* Removed 'overflow-hidden' so the dropdown isn't clipped */}
        <nav 
          ref={navRef}
          className="bg-white border-2 border-black rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center w-full max-w-7xl transition-all duration-300 py-3 px-8 z-50 relative"
        >
            <Link
              to="/"
              className="flex items-center space-x-3 group relative z-10"
            >
              <img
                src={Logo}
                alt="Logo"
                className="w-10 h-10 object-contain group-hover:-rotate-12 transition-transform duration-300"
              />
              <h1 className="text-xl font-bold text-stone-800 font-serif tracking-tight hidden sm:block whitespace-nowrap">
                Pick My Pet
              </h1>
            </Link>

            <div className="flex items-center gap-4 md:gap-6">
              {/* Desktop Links */}
              <ul className="hidden md:flex items-center gap-2">
                {desktopLinks.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={`/${item.route}`}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-stone-600 font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 border border-transparent hover:border-emerald-200"
                    >
                      <item.Icon />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Desktop Menu */}
              <div className="hidden md:block relative z-50">
                <Menu />
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-[#FCD34D] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-stone-900"
              >
                <NavIcons.Menu />
              </button>
            </div>
        </nav>
      </div>

      <MobileSidebar
        isOpen={showMobileSidebar}
        onClose={() => setShowMobileSidebar(false)}
      />
    </>
  );
};

// --- Mobile Sidebar ---
const MobileSidebar = ({ isOpen, onClose }) => {
  const Swal = useSwal();
  const { user, logout } = useUser();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const handleLogout = () => {
    Swal.fire({
      title: "Ready to leave?",
      text: "You will be logged out",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#78716c",
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        onClose();
        Swal.fire("Logged out!", "Come back soon!", "success");
      }
    });
  };

  // Define Mobile Links Dynamically
  const navigationItems = [
    { route: "/", name: "Home", Icon: NavIcons.Home },
    { route: "/pets", name: "Browse Pets", Icon: NavIcons.Services },
  ];

  if (user) {
    navigationItems.push({ route: "/create-post", name: "Create Post", Icon: NavIcons.Post });
    navigationItems.push({ route: "/messenger", name: "Messages", Icon: NavIcons.Messenger });
  }

  const userMenuItems = user
    ? [
        { route: "/user", name: "Profile", Icon: NavIcons.User },
        { route: "/settings", name: "Settings", Icon: NavIcons.Settings },
      ]
    : [];

  return (
    <>
      <div
        className={`fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />
      <div
        ref={sidebarRef}
        className={`fixed top-0 right-0 h-full w-80 bg-[#FDFCF8] border-l-2 border-black z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b-2 border-stone-200">
            <h2 className="text-xl font-bold text-stone-800 font-serif">Menu</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 transition-colors text-stone-700">
              <NavIcons.Close />
            </button>
          </div>
          
          {user ? (
             <div className="p-6 bg-emerald-100 border-b-2 border-stone-200">
               <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-full bg-white border-2 border-emerald-400 flex items-center justify-center overflow-hidden shadow-sm">
                    {user?.userpic ? (
                       <img src={user.userpic} className="w-full h-full object-cover" alt="User" referrerPolicy="no-referrer" />
                    ) : (
                       <span className="text-2xl font-bold text-emerald-600">{user?.firstname?.[0]?.toUpperCase()}</span>
                    )}
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-stone-800 font-serif">{user?.firstname || "User"}</h3>
                   <p className="text-xs text-stone-500 truncate max-w-[150px]">{user?.email}</p>
                 </div>
               </div>
             </div>
          ) : (
             <div className="p-6">
                <Link to="/auth" onClick={onClose} className="w-full flex items-center justify-center gap-2 bg-[#FCD34D] border-2 border-black text-stone-900 font-bold py-3 px-6 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all">
                   <NavIcons.Lock />
                   <span>Login / Sign Up</span>
                </Link>
             </div>
          )}
          
          <div className="flex-1 overflow-y-auto bg-white p-4">
              <div className="mb-6">
                <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 px-2">Navigation</h3>
                {navigationItems.map((item, index) => (
                  <Link key={index} to={item.route} onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all font-bold text-stone-600 group">
                    <div className="group-hover:scale-110 transition-transform"><item.Icon /></div>
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>

              {user && (
                 <div className="mb-6">
                   <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 px-2">Account</h3>
                   {userMenuItems.map((item, index) => (
                     <Link key={index} to={item.route} onClick={onClose} className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-emerald-50 hover:text-emerald-700 transition-all font-medium text-stone-600 group">
                       <div className="group-hover:scale-110 transition-transform"><item.Icon /></div>
                       <span>{item.name}</span>
                     </Link>
                   ))}
                 </div>
              )}

              {user && (
                 <div className="border-t-2 border-stone-100 pt-4">
                    <button onClick={handleLogout} className="flex items-center gap-4 w-full px-4 py-3 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 font-bold group">
                       <div className="group-hover:scale-110 transition-transform"><NavIcons.Logout /></div>
                       <span>Logout</span>
                    </button>
                 </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
};

// --- Desktop Menu ---
const Menu = () => {
  const Swal = useSwal();
  const { user, logout } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { title: "Profile", icon: NavIcons.User, link: "/user" },
    { title: "Settings", icon: NavIcons.Settings, link: "/settings" },
  ];

  return user ? (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-3 bg-stone-100 border border-stone-200 hover:border-emerald-300 rounded-full pl-1 pr-4 py-1 transition-all duration-300"
      >
        <div className="w-8 h-8 rounded-full bg-emerald-200 border border-emerald-400 flex items-center justify-center overflow-hidden">
          {user?.userpic ? (
             <img src={user?.userpic} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
          ) : (
             <span className="font-bold text-emerald-800">{user?.firstname?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <span className="text-stone-700 font-bold text-sm truncate max-w-[100px]">{user?.firstname || "User"}</span>
        <svg className={`w-4 h-4 transition-transform text-stone-400 ${showMenu ? "rotate-180" : ""}`} viewBox="0 0 24 24"><path fill="currentColor" d="M7 10l5 5 5-5H7z" /></svg>
      </button>

      {/* Desktop Dropdown */}
      {showMenu && (
        <div className="absolute right-0 top-14 w-56 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden z-50">
          <div className="py-2">
            {menuItems.map((item, index) => (
              <Link key={index} to={item.link} className="flex items-center gap-3 px-4 py-3 text-stone-700 hover:bg-emerald-50 hover:text-emerald-700 font-medium transition-colors" onClick={() => setShowMenu(false)}>
                <item.icon className="w-5 h-5" /> <span>{item.title}</span>
              </Link>
            ))}
            <hr className="my-2 border-stone-100" />
            <button onClick={() => {
                Swal.fire({
                  title: "Ready to leave?",
                  text: "You will be logged out",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Yes, logout",
                  cancelButtonText: "Cancel",
                  confirmButtonColor: "#10B981",
                  cancelButtonColor: "#78716c",
                }).then((result) => {
                  if (result.isConfirmed) {
                    logout();
                    setShowMenu(false);
                    Swal.fire("Logged out!", "Come back soon!", "success");
                  }
                });
              }} className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 w-full text-left font-bold transition-colors">
              <NavIcons.Logout className="w-5 h-5" /> <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  ) : (
    <Link to="/auth" className="flex items-center gap-2 bg-stone-900 text-white font-bold py-2.5 px-6 rounded-full hover:bg-stone-700 transition-all shadow-md">
      <NavIcons.Lock /> <span className="text-sm">Login</span>
    </Link>
  );
};

export default Navbar;