import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for joining our pack! 🐾');
    setEmail('');
  };

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-50 rounded-full -ml-32 -mt-32 blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-50 rounded-full -mr-48 -mb-48 blur-3xl opacity-50" />

      <div className="container mx-auto px-5 relative z-10">
        <motion.div
          className="max-w-5xl mx-auto bg-stone-900 rounded-[3rem] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] p-8 md:p-16 text-center"
          initial={{ opacity: 0, y: 60, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.3
                }
              }
            }}
          >
            <motion.div
              className="w-20 h-20 bg-[#FCD34D] border-2 border-black rounded-2xl flex items-center justify-center mb-8 rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              variants={{
                hidden: { opacity: 0, scale: 0, rotate: 0 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  rotate: 3,
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }
                }
              }}
            >
              <svg className="w-10 h-10 text-stone-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </motion.div>

            <motion.h2
              className="text-4xl md:text-6xl font-black text-white font-serif mb-6 leading-tight"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut"
                  }
                }
              }}
            >
              Join Our <span className="text-[#34D399]">Pet-loving</span> Pack!
            </motion.h2>

            <motion.p
              className="text-xl text-stone-300 max-w-2xl mb-12 font-medium"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut"
                  }
                }
              }}
            >
              Get weekly doses of cute pets, expert care tips, and exclusive adoption updates right in your inbox.
            </motion.p>

            <motion.form
              onSubmit={handleSubmit}
              className="w-full max-w-2xl flex flex-col md:flex-row gap-4"
              variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut"
                  }
                }
              }}
            >
              <input
                type="email"
                required
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white border-2 border-black rounded-2xl px-6 py-5 text-lg font-bold text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] md:shadow-none"
              />
              <button
                type="submit"
                className="bg-emerald-500 text-white border-2 border-black font-black py-5 px-10 rounded-2xl text-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all whitespace-nowrap"
              >
                Sign Me Up! 🚀
              </button>
            </motion.form>

            <motion.p
              className="mt-8 text-stone-500 text-sm font-bold uppercase tracking-widest"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    duration: 0.6,
                    delay: 0.2
                  }
                }
              }}
            >
              We promise, no spam. Just pawsome content.
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;