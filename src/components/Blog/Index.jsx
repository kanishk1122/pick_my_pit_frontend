import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../../hooks/useBlogs";

// --- Custom Icons ---
const SearchIcon = () => (
  <svg
    className="w-5 h-5 text-stone-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    className="w-4 h-4 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    className="w-4 h-4 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M14 5l7 7m0 0l-7 7m7-7H3"
    />
  </svg>
);

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { posts, categories, loading, error } = useBlogs({
    page: 1,
    limit: 12,
  });

  return (
    <div className="w-full min-h-screen bg-[#FDFCF8] px-4 py-12 md:py-20">
      {/* --- Header & Search --- */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 border-2 border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-6">
            The Pawsome Blog
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-stone-800 font-serif mb-6">
            Tales, Tips & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Wagging Tails
            </span>
          </h1>

          {/* Search Bar - Neubrutalist Style */}
          <div className="relative max-w-lg mx-auto mt-8 group">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black rounded-2xl text-stone-800 placeholder-stone-400 font-medium focus:outline-none focus:shadow-[4px_4px_0px_0px_#FCD34D] transition-all"
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              className={`px-5 py-2 rounded-full border-2 border-black font-bold text-sm transition-all hover:-translate-y-1 ${
                idx === 0
                  ? "bg-stone-900 text-white shadow-[4px_4px_0px_0px_#10B981]"
                  : "bg-white text-stone-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[4px_4px_0px_0px_#FCD34D]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- Featured Post --- */}
      {loading && (
        <div className="max-w-7xl mx-auto mb-16">
          <div className="bg-white rounded-[2rem] border-2 border-black p-8 text-center text-stone-700">
            Loading blogs…
          </div>
        </div>
      )}
      {error && !loading && (
        <div className="max-w-7xl mx-auto mb-16">
          <div className="bg-[#FCD34D] rounded-[2rem] border-2 border-black p-8 text-center text-stone-900 font-bold">
            {error}
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto mb-16">
        {posts
          .filter((p) => p.featured)
          .map((post) => (
            <div
              key={post.id}
              className="group relative bg-emerald-600 rounded-[3rem] border-2 border-black p-6 md:p-12 text-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row gap-10 items-center relative z-10">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4 text-emerald-100 text-sm font-bold uppercase tracking-wide">
                    <span className="bg-white/20 px-3 py-1 rounded-lg backdrop-blur-md border border-white/30">
                      Featured
                    </span>
                    <span>{post.category}</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold font-serif leading-tight group-hover:underline decoration-4 decoration-emerald-300 underline-offset-4 cursor-pointer">
                    {post.title}
                  </h2>
                  <p className="text-lg text-emerald-50 font-medium leading-relaxed max-w-xl">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-6 pt-4 text-sm font-semibold">
                    <div className="flex items-center">
                      <UserIcon /> {post.author}
                    </div>
                    <div className="flex items-center">
                      <CalendarIcon /> {post.date}
                    </div>
                  </div>

                  <Link to={`/blog/${post.id}`} className="inline-block mt-6">
                    <button className="bg-white text-stone-900 px-8 py-3 rounded-xl font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                      Read Article
                    </button>
                  </Link>
                </div>

                <div className="flex-1 w-full">
                  <div className="relative aspect-[4/3] rounded-[2rem] border-4 border-black overflow-hidden bg-stone-200">
                    <img
                      src={
                        post.image ||
                        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1000&auto=format&fit=crop"
                      }
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </div>

              {/* Background Blob */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            </div>
          ))}
      </div>

      {/* --- Recent Posts Grid --- */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {posts
          .filter((p) => !p.featured)
          .map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-[2.5rem] border-2 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col h-full group"
            >
              {/* Image */}
              <div className="h-60 w-full border-b-2 border-black overflow-hidden relative">
                <span className="absolute top-4 left-4 bg-[#FCD34D] text-stone-900 text-xs font-bold px-3 py-1 rounded-lg border-2 border-black z-10">
                  {post.category}
                </span>
                <img
                  src={
                    post.image ||
                    "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1000&auto=format&fit=crop"
                  }
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-8 flex flex-col flex-grow">
                <div className="flex items-center gap-4 text-xs font-bold text-stone-400 mb-3">
                  <span className="flex items-center">
                    <UserIcon /> {post.author}
                  </span>
                  <span>•</span>
                  <span className="flex items-center">
                    <CalendarIcon /> {post.date}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-stone-800 font-serif mb-3 leading-tight group-hover:text-emerald-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-stone-500 text-sm font-medium leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto">
                  <Link
                    to={`/blog/${post.id}`}
                    className="inline-flex items-center text-sm font-bold text-stone-900 hover:text-emerald-600 transition-colors group/btn"
                  >
                    Read More <ArrowRightIcon />
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* --- Newsletter Section --- */}
      <div className="max-w-5xl mx-auto bg-[#FCD34D] rounded-[3rem] border-2 border-black p-10 md:p-16 text-center shadow-[12px_12px_0px_0px_#10B981] relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-stone-900 font-serif mb-4">
            Join the Pack! 🐶
          </h2>
          <p className="text-stone-800 text-lg font-medium mb-8 max-w-xl mx-auto">
            Get the latest adoption stories, pet care tips, and exclusive offers
            delivered straight to your inbox.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-xl border-2 border-black focus:outline-none focus:shadow-[4px_4px_0px_0px_#10B981] transition-all font-medium"
            />
            <button className="bg-stone-900 text-white px-8 py-3 rounded-xl font-bold border-2 border-black hover:bg-stone-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              Subscribe
            </button>
          </form>
        </div>

        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000000_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
    </div>
  );
};

export default Index;
