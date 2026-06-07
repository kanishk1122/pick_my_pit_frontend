import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import { SLICER } from "../../Consts/apikeys";

// --- Custom SVGs (Stone/Emerald Theme) ---

const GridIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
    />
  </svg>
);

const ListIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M4 6h16M4 12h16M4 18h16"
    />
  </svg>
);

const SortIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
    />
  </svg>
);

const ChevronDownIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const SparklesIcon = () => (
  <svg
    className="w-3.5 h-3.5 mr-1.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
    />
  </svg>
);

const MoneyIcon = () => (
  <svg
    className="w-3.5 h-3.5 mr-1.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-emerald-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const PostSlicer = ({
  pageInfo,
  onSortChange,
  onViewModeChange,
  onPageSizeChange,
  currentSort = "newest",
  currentViewMode = "grid",
  currentPageSize = 12,
}) => {
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Map sort options locally to avoid dependency issues with icons in const files
  const sortOptions = SLICER.SORT_OPTIONS;
  const pageSizeOptions = SLICER.PAGE_SIZE_OPTIONS;

  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.value === currentSort);
    return option ? option.label : "Sort By";
  };

  const urlSearchParams = new URLSearchParams(window.location.search);
  const parametersort = urlSearchParams.get("sort");
  
  useEffect(() => {
    if (parametersort) {
      onSortChange(parametersort);
    }
  }, [onSortChange, parametersort]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-transparent w-full"
    >
      <div className="px-4 md:px-6 py-4 md:py-5">
        {/* Top Row - Results and Controls */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
          {/* Left: Results Info */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="text-sm text-stone-800">
              <span className="font-black text-2xl text-emerald-600 ">
                {pageInfo?.totalPosts || 0}
              </span>{" "}
              <span className="hidden sm:inline font-bold">pets found</span>
              <span className="sm:hidden font-bold">pets</span>
            </div>
            {/* Page Badge */}
            <div className="text-xs font-black text-stone-900 bg-amber-100 border-2 border-black px-3 py-1 rounded-full shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Page {pageInfo?.currentPage || 1} of {pageInfo?.totalPages || 1}
            </div>
          </div>

          {/* Right: Controls Row */}
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full lg:w-auto ">
            {/* Page Size Selector */}
            <div className="flex items-center gap-2 bg-white border-2 border-black rounded-xl px-3 py-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <label className="text-xs font-black text-stone-500 whitespace-nowrap uppercase tracking-wider">
                Show
              </label>
              <select
                value={currentPageSize}
                onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
                className="bg-transparent text-stone-900 text-sm font-bold focus:outline-none cursor-pointer appearance-none"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 lg:flex-initial">
              <button
                onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                className="w-full lg:w-auto flex items-center justify-between gap-3 px-4 py-2 bg-white border-2 border-black rounded-xl text-sm font-bold text-stone-900 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <div className="flex items-center gap-2">
                  <SortIcon />
                  <span className="truncate max-w-[100px] md:max-w-none">
                    {getCurrentSortLabel()}
                  </span>
                </div>
                <ChevronDownIcon
                  className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                    sortDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {sortDropdownOpen && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setSortDropdownOpen(false)}
                    />
                    {/* Dropdown Menu */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden"
                    >
                      <div className="py-2 bg-white px-2 flex flex-col gap-1">
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => {
                              onSortChange(option.value);
                              setSortDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${
                              currentSort === option.value
                                ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200"
                                : "text-stone-700 hover:bg-stone-50"
                            } rounded-lg`}
                          >
                            <span>{option.label}</span>
                            {currentSort === option.value && <CheckIcon />}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* View Mode Toggle (Segmented Control Style) */}
            <div className="flex items-center p-1 bg-stone-100 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <button
                onClick={() => onViewModeChange(SLICER.VIEW_MODES.GRID)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentViewMode === SLICER.VIEW_MODES.GRID
                    ? "bg-white text-emerald-600 shadow-sm border border-stone-200"
                    : "text-stone-400 hover:text-stone-600"
                } `}
                title="Grid View"
              >
                <GridIcon />
              </button>
              <button
                onClick={() => onViewModeChange(SLICER.VIEW_MODES.LIST)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  currentViewMode === SLICER.VIEW_MODES.LIST
                    ? "bg-white text-emerald-600 shadow-sm border border-stone-200"
                    : "text-stone-400 hover:text-stone-600"
                }`}
                title="List View"
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Quick Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t-2 border-black">
          <span className="text-xs font-black text-stone-500 uppercase tracking-wider mr-1 hidden sm:block">
            Quick Sort:
          </span>

          <button
            onClick={() => onSortChange("newest")}
            className={parametersort === "newest" ? "slicer-chip-active" : "slicer-chip"}
          >
            <SparklesIcon />
            Latest
          </button>

          <button
            onClick={() => onSortChange("price-low")}
            className={parametersort === "price-low" ? "slicer-chip-active" : "slicer-chip"}
          >
            <MoneyIcon />
            Budget Friendly
          </button>
        </div>
      </div>
    </motion.div>
  );
};

PostSlicer.propTypes = {
  pageInfo: PropTypes.shape({
    totalPosts: PropTypes.number,
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }),
  onSortChange: PropTypes.func.isRequired,
  onViewModeChange: PropTypes.func.isRequired,
  onPageSizeChange: PropTypes.func.isRequired,
  currentSort: PropTypes.string,
  currentViewMode: PropTypes.string,
  currentPageSize: PropTypes.number,
};

export default PostSlicer;
