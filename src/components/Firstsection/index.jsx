import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import nd1 from '../../assets/images/normat_dog.png';
import nd2 from '../../assets/images/normal_dog_2.png';

// --- Icons ---
const PawIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 2.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 5.5c-2.5 0-4.5 2-4.5 4.5v2.5h9v-2.5c0-2.5-2-4.5-4.5-4.5z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const HeartIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ArrowIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
  </svg>
);

const StarIcon = () => (
  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const Index = () => {
  return (
    <div className="relative overflow-hidden py-24 md:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }}>
      </div>

      <div className="container mx-auto px-5 relative z-10 font-sans">
        
        {/* Header Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="text-center mb-16 md:mb-24"
        >
          <motion.span variants={itemVariants} className="bg-emerald-50 text-emerald-800 text-sm font-black px-6 py-3 rounded-full inline-flex items-center gap-2 border-2 border-emerald-100 mb-6 shadow-[4px_4px_0px_0px_rgba(16,185,129,0.2)]">
            <PawIcon /> FIND YOUR PERFECT MATCH
          </motion.span>
          
          <motion.h1 variants={itemVariants} className="text-5xl md:text-8xl font-black mt-4 mb-8 text-stone-900 leading-[1.1] font-serif tracking-tight">
            Where Pet Love Stories <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 relative inline-block">
              Begin.
              <svg className="absolute w-full h-4 -bottom-2 left-0 text-emerald-400" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" opacity="0.4" />
              </svg>
            </span>
          </motion.h1>
          
          <motion.p variants={itemVariants} className="text-xl md:text-2xl text-stone-500 max-w-3xl mx-auto leading-relaxed font-medium">
            Join thousands of happy families who&apos;ve found their perfect companions through our cozy platform.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 max-w-6xl mx-auto"
        >
          {[
            { number: "5000+", label: "Pets Adopted", icon: <PawIcon />, color: "emerald" },
            { number: "10k+", label: "Happy Families", icon: <HeartIcon />, color: "rose" },
            { number: "98%", label: "Success Rate", icon: <StarIcon />, color: "amber" }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="bg-white p-10 rounded-[2.5rem] border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all duration-300 text-center group relative overflow-hidden"
            >
              <div className={`text-${stat.color}-600 mb-6 inline-flex justify-center p-4 bg-${stat.color}-50 rounded-2xl border-2 border-${stat.color}-100 group-hover:rotate-12 transition-transform duration-300`}>
                {stat.icon}
              </div>
              <div className="text-5xl font-black text-stone-900 mb-2 font-serif tracking-tight">{stat.number}</div>
              <div className="text-stone-500 font-black uppercase tracking-widest text-xs">{stat.label}</div>
              
              {/* Decorative circle */}
              <div className={`absolute -bottom-6 -right-6 w-24 h-24 bg-${stat.color}-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500 -z-10`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-7xl mx-auto">
          
          {/* Adopt Section */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-emerald-600 rounded-[3rem] border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 flex flex-col items-center text-center relative overflow-hidden group min-h-[700px]"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-white/20 transition-colors duration-500" />
            
            <div className="bg-white/20 p-6 rounded-2xl mb-8 text-white border-2 border-white/30 backdrop-blur-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
              <HomeIcon />
            </div>
            
            <span className="bg-emerald-900/40 text-emerald-50 border border-emerald-400/50 text-xs font-black px-6 py-2.5 rounded-full mb-8 inline-flex items-center gap-2 tracking-widest">
              <PawIcon /> GIVE A HOME
            </span>
            
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 font-serif leading-tight">Adopt a <br/>New Friend</h2>
            
            <p className="text-lg text-emerald-50 mb-12 leading-relaxed max-w-md font-medium">
              Every adoption saves two lives - the pet you adopt and the one who takes their place. Join our mission today.
            </p>
            
            <Link 
              to={`/pets?species=&breed=&type=free&minPrice=0&maxPrice=100000&page=1`} 
              className="mt-auto bg-white text-emerald-900 border-2 border-black font-black py-5 px-12 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 w-full max-w-sm flex items-center justify-center gap-3 text-xl"
            >
              Find Your Match
              <ArrowIcon />
            </Link>
            
            <div className="mt-12 relative group-hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-emerald-400/30 rounded-full blur-2xl transform scale-110 animate-pulse"></div>
              <img 
                src={nd1} 
                className="relative w-64 h-64 object-cover rounded-full border-8 border-white shadow-2xl rotate-3 group-hover:rotate-6 transition-transform duration-500" 
                alt="Adoption dog" 
              />
            </div>
          </motion.div>

          {/* Buy/Sell Section */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-[#FFFDF5] rounded-[3rem] border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 flex flex-col items-center text-center relative overflow-hidden group min-h-[700px]"
          >
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-200/20 rounded-full -ml-24 -mb-24 blur-3xl group-hover:bg-yellow-200/30 transition-colors duration-500" />
            
            <div className="bg-white p-6 rounded-2xl mb-8 text-stone-900 border-2 border-stone-100 shadow-sm group-hover:scale-110 group-hover:-rotate-3 transition-all duration-500">
              <HeartIcon />
            </div>
            
            <span className="bg-stone-100 text-stone-600 border border-stone-200 text-xs font-black px-6 py-2.5 rounded-full mb-8 inline-flex items-center gap-2 tracking-widest">
              <PawIcon /> CONNECT HEARTS
            </span>
            
            <h2 className="text-5xl md:text-6xl font-black text-stone-900 mb-6 font-serif leading-tight">Buy or <br/>Rehome Pets</h2>
            
            <p className="text-lg text-stone-600 mb-12 leading-relaxed max-w-md font-medium">
              Find ethical breeders or help a pet find their next chapter. We ensure safe and happy transitions for everyone.
            </p>
            
            <Link 
              to='/pets?species=&breed=&type=paid&minPrice=0&maxPrice=100000&page=1' 
              className="mt-auto bg-[#FCD34D] text-stone-900 border-2 border-black font-black py-5 px-12 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 w-full max-w-sm flex items-center justify-center gap-3 text-xl"
            >
              Explore Options
              <ArrowIcon />
            </Link>
            
            <div className="mt-12 relative group-hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-yellow-200/50 rounded-full blur-2xl transform scale-110 animate-pulse"></div>
              <img 
                src={nd2} 
                className="relative w-64 h-64 object-cover rounded-full border-8 border-white shadow-2xl -rotate-3 group-hover:-rotate-6 transition-transform duration-500" 
                alt="Sale dog" 
              />
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default Index;