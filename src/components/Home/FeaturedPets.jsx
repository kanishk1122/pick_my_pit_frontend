import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchPosts } from '../../store/slices/postSlice';

const LocationIcon = () => (
  <svg className="w-4 h-4 mr-1 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PawIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 2.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 5.5c-2.5 0-4.5 2-4.5 4.5v2.5h9v-2.5c0-2.5-2-4.5-4.5-4.5z" />
  </svg>
);

const FeaturedPets = () => {
  const dispatch = useAppDispatch();
  const { posts, loading } = useAppSelector((state) => state.posts);

  useEffect(() => {
    // Try to get location for local arrivals
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(fetchPosts({ 
            limit: 3, 
            page: 1, 
            sortBy: 'newest',
            nearMe: 'true',
            latitude,
            longitude,
            maxDistance: 100 // Slightly wider for home page
          }));
        },
        () => {
          // Fallback if location denied/error
          dispatch(fetchPosts({ limit: 3, page: 1, sortBy: 'newest' }));
        }
      );
    } else {
      dispatch(fetchPosts({ limit: 3, page: 1, sortBy: 'newest' }));
    }
  }, [dispatch]);

  const featuredPosts = posts.slice(0, 3);

  // Don't hide the entire section if there are no posts - show loading or empty state instead

  return (
    <section className="py-24 bg-[#FDFCF8]">
      <div className="container mx-auto px-5">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.span
              className="bg-amber-100 text-amber-800 text-xs font-black px-4 py-2 rounded-full border-2 border-amber-200 mb-4 inline-block tracking-widest uppercase"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              New arrivals
            </motion.span>
            <motion.h2
              className="text-5xl md:text-7xl font-black text-stone-900 font-serif leading-tight"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              Latest <span className="text-emerald-600">Furry Friends</span>
            </motion.h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.5 }}
          >
            <Link
              to="/pets"
              className="group flex items-center gap-3 font-black text-xl text-stone-900 hover:text-emerald-600 transition-colors"
            >
              View All Pets
              <div className="p-3 rounded-full border-2 border-black group-hover:bg-black group-hover:text-white transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
              }
            }
          }}
        >
          {loading ? (
            [...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="h-[500px] bg-stone-100 rounded-[2.5rem] animate-pulse border-2 border-stone-200"
              />
            ))
          ) : featuredPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="col-span-full text-center py-20"
            >
              <p className="text-2xl font-bold text-stone-400">
                No pets available right now. Check back soon! 🐾
              </p>
            </motion.div>
          ) : (
            featuredPosts.map((pet, index) => (
              <motion.div
                key={pet._id}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 50,
                    scale: 0.95
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94]
                    }
                  }
                }}
              >
                <Link to={`/pet/${pet.slug}`} className="group block h-full">
                  <div className="bg-white rounded-[2.5rem] border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all duration-300 flex flex-col h-full overflow-hidden">
                    <div className="relative h-72 overflow-hidden border-b-2 border-black">
                      <img
                        src={pet.images[0]}
                        alt={pet.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-4 py-2 rounded-xl border-2 border-black font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${pet.type === 'free' ? 'bg-[#34D399] text-white' : 'bg-[#FCD34D] text-stone-900'
                          }`}>
                          {pet.type === 'free' ? 'Adopt Me' : 'For Sale'}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-2xl font-black text-stone-900 font-serif group-hover:text-emerald-600 transition-colors">
                          {pet.title}
                        </h3>
                        {pet.type === 'paid' && (
                          <span className="text-xl font-black text-emerald-600 font-mono">
                            ₹{pet.amount.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>

                      <p className="text-stone-500 font-medium mb-6 line-clamp-2 leading-relaxed">
                        {pet.discription}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8 mt-auto">
                        <span className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-black text-stone-600 uppercase tracking-widest flex items-center gap-2">
                          <PawIcon /> {pet.species}
                        </span>
                        <span className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-lg text-xs font-black text-stone-600 uppercase tracking-widest">
                          {pet.category}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-6 border-t-2 border-stone-100 border-dashed">
                        {pet.address && (
                          <div className="flex items-center text-sm font-black text-stone-400">
                            <LocationIcon />
                            <span>{pet.address.city}, {pet.address.state}</span>
                          </div>
                        )}
                        <div className="text-emerald-600 font-black flex items-center gap-1 group-hover:gap-2 transition-all">
                          Details
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedPets;