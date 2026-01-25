import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import Pagination from "./Pagination";
import { SLICER } from "../../Consts/apikeys";

// --- Icons ---
const LocationIcon = () => (
  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PawIcon = () => (
  <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 2.5c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5 5.5c-2.5 0-4.5 2-4.5 4.5v2.5h9v-2.5c0-2.5-2-4.5-4.5-4.5z" />
  </svg>
);

// --- Component: List View Item ---
const PetListItem = ({ pet, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
  >
    <Link
      to={`/pet/${pet?.slug}`}
      className="block bg-white rounded-3xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 overflow-hidden group"
    >
      <div className="flex h-40 sm:h-48">
        {/* Image */}
        <div className="w-40 sm:w-56 flex-shrink-0 relative border-r-2 border-black">
          <img
            src={pet.images[0]}
            alt={pet.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 left-2">
            <span
              className={`px-3 py-1 text-xs font-bold uppercase rounded-lg border-2 border-black shadow-sm ${
                pet.type === "free"
                  ? "bg-[#34D399] text-white"
                  : "bg-[#FCD34D] text-stone-900"
              }`}
            >
              {pet.type === "free" ? "Adopt" : "Buy"}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex flex-col justify-between flex-grow">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold text-stone-800 font-serif group-hover:text-emerald-600 transition-colors line-clamp-1">
                {pet.title}
              </h3>
              {pet.type === "paid" && (
                <span className="text-lg font-bold text-emerald-600 font-mono whitespace-nowrap ml-2">
                  ₹{pet.amount.toLocaleString("en-IN")}
                </span>
              )}
            </div>
            
            <p className="text-sm text-stone-500 mb-3 line-clamp-2 font-medium">
              {pet.discription}
            </p>

            <div className="flex flex-wrap gap-2 mb-2">
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-stone-100 border border-stone-200 text-xs font-bold text-stone-600">
                <PawIcon /> {pet.species}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-stone-100 border border-stone-200 text-xs font-bold text-stone-600">
                {pet.category}
              </span>
            </div>
          </div>

          {/* Footer: Location */}
          {pet.address && (
            <div className="flex items-center text-xs font-bold text-stone-400">
              <LocationIcon />
              <span className="truncate">
                {pet.address.city}, {pet.address.state}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  </motion.div>
);

PetListItem.propTypes = {
  pet: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};

// --- Main List Component ---
const FilteredPetList = ({ posts, pageInfo, onPageChange, viewMode }) => {
  if (!posts || !posts.length) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-4 bg-white border-2 border-dashed border-stone-300 rounded-[2.5rem]">
        <div className="text-6xl mb-4 grayscale opacity-50">🐾</div>
        <h3 className="text-2xl font-bold text-stone-800 font-serif mb-2">
          No pets found
        </h3>
        <p className="text-stone-500 font-medium max-w-xs mx-auto">
          Try adjusting your filters to find more furry friends.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* List View */}
      {viewMode === SLICER.VIEW_MODES.LIST ? (
        <div className="space-y-4">
          {posts.map((pet, index) => (
            <PetListItem key={pet._id} pet={pet} index={index} />
          ))}
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {posts.map((pet, index) => (
            <motion.div
              key={pet._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              className="h-full"
            >
              <Link to={`/pet/${pet.slug}`} className="block h-full group">
                <div className="bg-white rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 h-full flex flex-col overflow-hidden">
                  
                  {/* Image Container */}
                  <div className="relative h-56 overflow-hidden border-b-2 border-black">
                    <img
                      src={pet.images[0]}
                      alt={pet.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    
                    {/* Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 text-xs font-bold uppercase rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                          pet.type === "free"
                            ? "bg-[#34D399] text-white"
                            : "bg-[#FCD34D] text-stone-900"
                        }`}
                      >
                        {pet.type === "free" ? "Adopt" : "Buy"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-stone-800 font-serif leading-tight line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {pet.title}
                      </h3>
                    </div>

                    <p className="text-xs text-stone-500 font-medium mb-4 line-clamp-2 leading-relaxed">
                      {pet.discription}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-stone-100 border border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wide">
                        {pet.species}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-stone-100 border border-stone-200 text-[10px] font-bold text-stone-600 uppercase tracking-wide">
                        {pet.category}
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end pt-3 border-t-2 border-stone-100 border-dashed">
                      {/* Location */}
                      {pet.address && (
                        <div className="flex items-center text-xs font-bold text-stone-400 max-w-[60%]">
                          <LocationIcon />
                          <span className="truncate">
                            {pet.address.city}, {pet.address.state}
                          </span>
                        </div>
                      )}

                      {/* Price */}
                      {pet.type === "paid" ? (
                        <span className="text-base font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          ₹{pet.amount.toLocaleString("en-IN")}
                        </span>
                      ) : (
                        <span className="text-base font-bold font-serif text-emerald-500">
                          Free
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pageInfo && pageInfo.totalPages > 1 && (
        <div className="mt-12">
          <Pagination
            currentPage={pageInfo.currentPage}
            totalPages={pageInfo.totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
};

FilteredPetList.propTypes = {
  posts: PropTypes.array,
  pageInfo: PropTypes.shape({
    currentPage: PropTypes.number,
    totalPages: PropTypes.number,
  }),
  onPageChange: PropTypes.func,
  viewMode: PropTypes.string,
};

FilteredPetList.defaultProps = {
  posts: [],
  pageInfo: null,
  viewMode: SLICER.VIEW_MODES.GRID,
};

export default FilteredPetList;