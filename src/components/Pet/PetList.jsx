import { useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store";
import {
  fetchPosts,
  setFilters,
  setViewMode,
} from "../../store/slices/postSlice";
import FilterSidebar from "./FilterSidebar";
import FilteredPetList from "./FilteredPetList";
import PostSlicer from "./PostSlicer";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

// --- Icons (Unified Stone Color) ---
const FilterIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const SadFaceIcon = () => (
  <svg
    className="w-16 h-16 text-stone-300 mx-auto mb-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const PetList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const hasInitialized = useRef(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Redux state
  const posts = useAppSelector((state) => state.posts.posts);
  const loading = useAppSelector((state) => state.posts.loading);
  const error = useAppSelector((state) => state.posts.error);
  const pageInfo = useAppSelector((state) => state.posts.pageInfo);
  const filters = useAppSelector((state) => state.posts.filters);
  const viewMode = useAppSelector((state) => state.posts.viewMode);

  // Memoized handlers
  const handleFilterChange = useCallback(
    (newFilters) => {
      const queryParams = new URLSearchParams({
        ...newFilters,
        page: "1",
      });
      navigate(`${location.pathname}?${queryParams.toString()}`);
    },
    [navigate, location.pathname]
  );

  const handleSortChange = useCallback(
    (sortBy) => {
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("sort", sortBy);
      queryParams.set("page", "1");
      navigate(`${location.pathname}?${queryParams.toString()}`);
    },
    [navigate, location.pathname, location.search]
  );

  const handlePageChange = useCallback(
    (page) => {
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("page", page.toString());
      navigate(`${location.pathname}?${queryParams.toString()}`);
    },
    [navigate, location.pathname, location.search]
  );

  const handlePageSizeChange = useCallback(
    (size) => {
      const queryParams = new URLSearchParams(location.search);
      queryParams.set("limit", size.toString());
      queryParams.set("page", "1");
      navigate(`${location.pathname}?${queryParams.toString()}`);
    },
    [navigate, location.pathname, location.search]
  );

  const handleViewModeChange = useCallback(
    (mode) => {
      dispatch(setViewMode(mode));
    },
    [dispatch]
  );

  // Single effect to handle URL changes and fetch posts
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const params = Object.fromEntries(searchParams.entries());

    // Set defaults
    if (!params.page) {
      params.page = "1";
    }
    if (!params.limit) {
      params.limit = "12";
    }

    // Update filters from URL on first load
    if (!hasInitialized.current) {
      const urlFilters = {
        species: params.species || "",
        breed: params.breed || "",
        type: params.type || "",
        minPrice: params.minPrice || "0",
        maxPrice: params.maxPrice || "100000",
        sortBy: params.sort || "newest",
        page: parseInt(params.page) || 1,
        // Location params
        nearMe: params.nearMe === "true",
        latitude: params.latitude ? parseFloat(params.latitude) : null,
        longitude: params.longitude ? parseFloat(params.longitude) : null,
        maxDistance: params.maxDistance || "50",
      };
      dispatch(setFilters(urlFilters));
      hasInitialized.current = true;
    }

    // Fetch posts
    dispatch(fetchPosts(params));
  }, [location.search, dispatch]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#FDFCF8] flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-[2rem] border border-stone-200 shadow-sm max-w-md w-full">
          <SadFaceIcon />
          <h3 className="text-xl font-bold text-stone-800 font-serif mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-stone-500 mb-6 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    // Global Background: Cream/Off-white
    <div className="min-h-screen bg-[#FDFCF8]">
      
      {/* Hero Section Card */}
      <div className="mx-auto px-4 mb-12 mt-6">
        <div className="bg-emerald-600 text-white py-12 md:py-16 px-8 md:px-12 rounded-[2.5rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="bg-emerald-800/40 text-emerald-50 border border-emerald-400/30 text-xs font-black px-4 py-2 rounded-full mb-4 inline-block tracking-widest uppercase">
              🐾 BROWSE COMPANIONS
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-4 font-serif leading-tight">
              Find Your Perfect <br/>
              <span className="text-[#FCD34D] italic">Companion</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-50 font-medium opacity-90 leading-relaxed">
              Explore adorable pets waiting for a loving family. Start your journey with trust, joy, and wagging tails.
            </p>
          </div>
          {/* Decorative floating paws background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 right-10 text-white/5 pointer-events-none select-none hidden md:block">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="4" r="2" />
              <circle cx="18" cy="8" r="2" />
              <circle cx="20" cy="16" r="2" />
              <circle cx="4" cy="14" r="2" />
              <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
            </svg>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-4 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <div className="sticky top-28 bg-[#FFFDF5] border-2 border-black rounded-[2rem] p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <FilterSidebar
                initialFilters={filters}
                onFilterChange={handleFilterChange}
                loading={loading}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setIsMobileFilterOpen(true)}
                className="w-full bg-white border-2 border-black rounded-2xl p-4 flex items-center justify-center gap-2 text-stone-900 font-bold hover:bg-emerald-50 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <FilterIcon />
                Filters & Sort
              </button>
            </div>

            {/* Mobile Filter Drawer */}
            <AnimatePresence>
              {isMobileFilterOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[100]"
                  />
                  <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed right-0 top-0 h-full w-[90%] max-w-sm bg-[#FDFCF8] border-l-2 border-black z-[101] shadow-2xl overflow-y-auto"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
                        <h2 className="text-xl font-bold text-stone-800">Filters</h2>
                        <button
                          onClick={() => setIsMobileFilterOpen(false)}
                          className="p-2 rounded-full hover:bg-stone-100 text-stone-400"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <FilterSidebar
                        initialFilters={filters}
                        onFilterChange={(f) => {
                          handleFilterChange(f);
                          setIsMobileFilterOpen(false);
                        }}
                        loading={loading}
                      />
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Post Slicer (Control Bar) Container */}
            <div className="bg-[#FFFDF5] border-2 border-black rounded-[2rem] mb-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden p-2">
              <PostSlicer
                currentSort={filters.sortBy}
                currentViewMode={viewMode}
                currentPageSize={pageInfo.limit}
                onSortChange={handleSortChange}
                onPageSizeChange={handlePageSizeChange}
                onViewModeChange={handleViewModeChange}
                pageInfo={pageInfo}
              />
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-24 bg-white border-2 border-dashed border-stone-300 rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-4"></div>
                  <p className="text-stone-500 font-medium animate-pulse">
                    Looking for friends...
                  </p>
                </div>
              </div>
            )}

            {/* Pet List Container */}
            {!loading && (
              <div className="bg-white border-2 border-black rounded-[2.5rem] p-4 md:p-8 min-h-[600px] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                <FilteredPetList
                  posts={posts}
                  viewMode={viewMode}
                  pageInfo={pageInfo}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetList;