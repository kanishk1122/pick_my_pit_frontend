import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import herosectionvideo from '../../assets/video/herosectionvideo.mp4'; // Make sure path is correct
import img1 from '../../assets/images/herosectionvideo.jpg'; // Make sure path is correct

// Icons
const PawIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 2.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 5.5c-2.5 0-4.5 2-4.5 4.5v2.5h9v-2.5c0-2.5-2-4.5-4.5-4.5z" />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ScrollIndicator = () => (
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
    <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
      <motion.div 
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="w-1.5 h-1.5 bg-[#FCD34D] rounded-full"
      />
    </div>
  </div>
);

const FloatingPaws = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-20">
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ y: "110%", x: `${Math.random() * 100}%`, rotate: Math.random() * 360 }}
        animate={{ y: "-10%", x: `${Math.random() * 100}%`, rotate: Math.random() * 360 }}
        transition={{ 
          duration: 15 + Math.random() * 10, 
          repeat: Infinity, 
          delay: i * 2,
          ease: "linear" 
        }}
        className="absolute text-white"
      >
        <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 5.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 2.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 5.5c-2.5 0-4.5 2-4.5 4.5v2.5h9v-2.5c0-2.5-2-4.5-4.5-4.5z" />
        </svg>
      </motion.div>
    ))}
  </div>
);

const HeroSection = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    // Container set to h-[80vh] for a nice large banner
    <div className="w-[85vw] mx-auto h-[85vh] min-h-[600px] relative">
      
      {/* Neubrutalist Card Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full h-full rounded-[2.5rem] border-2 border-black overflow-hidden shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-stone-900 group"
      >
        
        {/* --- Video Background --- */}
        <div className="absolute inset-0 w-full h-full">
          {/* Dark Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          
          <FloatingPaws />
          
          <video
            src={herosectionvideo}
            autoPlay
            loop
            muted
            playsInline
            className={`object-cover h-full w-full transition-opacity duration-1000 ${
              isVideoLoaded ? 'opacity-80' : 'opacity-0'
            }`}
            onLoadedData={() => setIsVideoLoaded(true)}
            onError={() => setIsVideoLoaded(false)}
          />
          
          {/* Fallback Image */}
          {!isVideoLoaded && (
            <img
              src={img1}
              alt="Hero Background"
              className="absolute inset-0 object-cover h-full w-full opacity-60"
            />
          )}
        </div>

        {/* --- Content Overlay --- */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center px-8 md:px-16 lg:px-24">
          <div className="max-w-2xl">
            
            {/* Badge */}
            <motion.div 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="inline-flex items-center px-4 py-1.5 bg-[#34D399] text-white text-xs font-bold uppercase tracking-wider rounded-full border-2 border-black mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <PawIcon />
              The Pawsome Life
            </motion.div>

            {/* Headline */}
            <motion.h1 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-6xl md:text-8xl font-serif font-black text-white mb-6 leading-[1.1] drop-shadow-lg"
            >
              Unconditional <br />
              <span className="text-[#FCD34D] italic">Love Awaits.</span>
            </motion.h1>

            {/* Description Glass Card */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-white/10 backdrop-blur-xl border-2 border-white/20 p-8 rounded-[2rem] mb-10 max-w-lg shadow-2xl"
            >
              <p className="text-xl text-white/95 font-medium leading-relaxed">
                Connect with furry friends looking for a forever home. Start your journey with trust, joy, and a whole lot of tail wags.
              </p>
            </motion.div>

            {/* CTA Buttons using brand-button class */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-6"
            >
              <Link to="/pets">
                <button className="brand-button-primary w-full sm:w-auto text-xl px-10 py-5">
                  Find a Pet
                  <PlayIcon />
                </button>
              </Link>
              
              <button className="brand-button w-full sm:w-auto text-xl px-10 py-5 bg-white/10 text-white border-white/40 hover:bg-white hover:text-stone-900 transition-colors">
                How it Works
              </button>
            </motion.div>
          </div>
        </div>
        
        <ScrollIndicator />

      </motion.div>
    </div>
  );
};

export default HeroSection;