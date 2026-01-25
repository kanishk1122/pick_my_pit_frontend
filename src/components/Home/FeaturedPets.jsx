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
    dispatch(fetchPosts({ limit: 3, page: 1, sortBy: 'newest' }));
  }, [dispatch]);

  const featuredPosts = posts.slice(0, 3);

  if (!loading && featuredPosts.length === 0) return null;

  return (
    <section className="py-24 bg-[#FDFCF8]">
      <div className="container mx-auto px-5">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-4 py-2 rounded-full border-2 border-amber-200 mb-4 inline-block tracking-widest uppercase">
              New arrivals
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-stone-900 font-serif leading-tight">
              Latest <span className="text-emerald-600">Furry Friends</span>
            </h2>
          </div>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-[500px] bg-stone-100 rounded-[2.5rem] animate-pulse border-2 border-stone-200" />
            ))
          ) : (
            featuredPosts.map((pet, index) => (
              <motion.div
                key={pet._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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
                        <span className={`px-4 py-2 rounded-xl border-2 border-black font-black text-xs uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                          pet.type === 'free' ? 'bg-[#34D399] text-white' : 'bg-[#FCD34D] text-stone-900'
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
        </div>
      </div>
    </section>
  );
};

export default FeaturedPets;