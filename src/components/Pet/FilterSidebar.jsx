import { useState, useEffect } from "react";
import { useAddresses } from "../../hooks/useAddresses";
import { useUser } from "../../utils/Usercontext";
import { useSpecies } from "../../hooks/useSpecies";
import CustomSelect from "./CustomSelect";

import "../../styles/rangeSlider.css";

// --- Icons ---
const FilterIcon = () => (
  <svg
    className="w-5 h-5 text-emerald-600 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const PawIcon = () => (
  <svg
    className="w-4 h-4 text-stone-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
    />
  </svg>
);

const TagIcon = () => (
  <svg
    className="w-4 h-4 text-stone-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const MoneyIcon = () => (
  <svg
    className="w-4 h-4 text-stone-400"
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

const MapPinIcon = ({ className = "w-4 h-4 text-stone-400" }) => (
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
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const HomeIcon = ({ className = "w-4 h-4 text-stone-400" }) => (
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
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const KeyboardIcon = ({ className = "w-4 h-4 text-stone-400" }) => (
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
      d="M3 10h18M3 14h18m-9-4v8m-3-8v8m6-8v8M3 6h18a2 2 0 012 2v8a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2z"
    />
  </svg>
);

import { useAllSpecies } from "../../hooks/useAllSpecies";
import { useBreeds } from "../../hooks/useBreeds";
const FilterSidebar = ({ onFilterChange, initialFilters }) => {
  const { user } = useUser();
  const { addresses: userAddresses, getAddresses } = useAddresses();
  const { species: allSpecies, loading: isLoadingSpecies } = useAllSpecies();

  useEffect(() => {
    if (user) {
      getAddresses();
    }
  }, [user, getAddresses]);

  // Find default address ID
  const defaultAddressId =
    userAddresses.find((addr) => addr.isDefault)?._id ||
    userAddresses[0]?._id ||
    "";

  const [filters, setFilters] = useState({
    species: "",
    breed: "",
    type: "",
    minPrice: "0",
    maxPrice: "100000",
    // Location Filters
    nearMe: true,
    locationId: defaultAddressId,
    latitude: null, // Stores raw latitude
    longitude: null, // Stores raw longitude
    maxDistance: "50",
    city: "",
    ...initialFilters,
  });

  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(""); // To show permission errors

  const {
    breeds,
    loading: isLoadingBreeds,
    getBreeds,
  } = useBreeds(filters.species);
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  const distancePct = ((parseFloat(filters.maxDistance) - 5) / (500 - 5)) * 100;

  // Sync initial filters
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      ...initialFilters,
    }));
  }, [initialFilters]);

  // Default address logic: If 'Near Me' is on, but no location is set, pick default
  useEffect(() => {
    if (
      !filters.locationId &&
      !filters.latitude &&
      defaultAddressId &&
      filters.nearMe
    ) {
      setFilters((prev) => ({ ...prev, locationId: defaultAddressId }));
    }
  }, [defaultAddressId, filters.locationId, filters.latitude, filters.nearMe]);

  useEffect(() => {
    getBreeds(filters.species);
  }, [filters.species, getBreeds]);

  // --- 📍 GEOLOCATION HANDLER ---
  const handleLocationSelect = (valueOrEvent) => {
    const value = valueOrEvent && valueOrEvent.target ? valueOrEvent.target.value : valueOrEvent;
    setLocationError("");

    if (value === "current_location") {
      // Check browser support
      if (!navigator.geolocation) {
        setLocationError("Geolocation is not supported by your browser");
        return;
      }

      setIsLocating(true);

      // Request Permission & Get Position
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // ✅ Success: Permission granted
          console.log(
            "Got Location:",
            position.coords.latitude,
            position.coords.longitude
          );

          setFilters((prev) => ({
            ...prev,
            locationId: "", // Clear saved address ID (important!)
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
          setIsLocating(false);
        },
        (error) => {
          // ❌ Error: Permission denied or unavailable
          console.error("Geolocation Error:", error);
          setIsLocating(false);

          let errorMessage = "Unable to retrieve location.";
          if (error.code === 1)
            errorMessage = "Permission denied. Please allow location access.";
          else if (error.code === 2) errorMessage = "Position unavailable.";
          else if (error.code === 3) errorMessage = "Request timed out.";

          setLocationError(errorMessage);

          // Fallback to default address if available
          setFilters((prev) => ({ ...prev, locationId: defaultAddressId }));
        },
        {
          enableHighAccuracy: true, // Request best possible accuracy
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else if (value === "manual") {
      setFilters((prev) => ({
        ...prev,
        locationId: "",
        latitude: null,
        longitude: null,
      }));
    } else {
      // User selected a Saved Address
      setFilters((prev) => ({
        ...prev,
        locationId: value,
        latitude: null, // Clear raw coords
        longitude: null, // Clear raw coords
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "species" && { breed: "" }),
      ...(name === "type" &&
        value !== "paid" && { minPrice: "0", maxPrice: "100000" }),
    }));
  };

  const formatPrice = (value) => {
    return `₹${parseInt(value).toLocaleString("en-IN")}`;
  };

  const handleRangeChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const newFilters = { ...prev, [name]: value };
      if (name === "minPrice" && parseInt(value) > parseInt(prev.maxPrice)) {
        newFilters.maxPrice = value;
      }
      if (name === "maxPrice" && parseInt(value) < parseInt(prev.minPrice)) {
        newFilters.minPrice = value;
      }
      return newFilters;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const effectiveFilters = { ...debouncedFilters };
    if (effectiveFilters.locationId) {
      const selectedAddress = userAddresses.find(
        (addr) => addr._id === effectiveFilters.locationId
      );
      if (selectedAddress) {
        effectiveFilters.latitude = selectedAddress.location.coordinates[1];
        effectiveFilters.longitude = selectedAddress.location.coordinates[0];
      }
    }
    onFilterChange(effectiveFilters);
  }, [debouncedFilters, onFilterChange, userAddresses]);

  const getBreedDisplayName = (breed) => {
    if (typeof breed === "string")
      return breed.charAt(0).toUpperCase() + breed.slice(1);
    if (typeof breed === "object" && breed !== null) {
      const name = breed.name || breed.displayName || breed;
      if (typeof name === "string")
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return "Unknown Breed";
  };

  const getBreedValue = (breed) => {
    if (typeof breed === "string") return breed;
    if (typeof breed === "object" && breed !== null)
      return breed.name || breed.slug || breed.displayName || breed;
    return "";
  };

  const locationOptions = [
    {
      value: "current_location",
      label: (
        <span className="flex items-center gap-2">
          <MapPinIcon className="w-4 h-4 text-emerald-600" />
          <span>{isLocating ? "Loading location..." : "Use Current Location"}</span>
        </span>
      ),
    },
    ...userAddresses.map((addr) => ({
      value: addr._id,
      label: (
        <span className="flex items-center gap-2">
          <HomeIcon className="w-4 h-4 text-stone-500" />
          <span>
            {addr.city} {addr.isDefault ? "(Default)" : ""}
          </span>
        </span>
      ),
    })),
    {
      value: "manual",
      label: (
        <span className="flex items-center gap-2">
          <KeyboardIcon className="w-4 h-4 text-stone-500" />
          <span>Enter City Manually</span>
        </span>
      ),
    },
  ];

  const speciesOptions = [
    { value: "", label: "All Species" },
    ...(allSpecies?.data || []).map((s) => ({
      value: s.name.toLowerCase(),
      label: s.name,
    })),
  ];

  const breedOptions = [
    { value: "", label: "All Breeds" },
    ...(breeds?.data || []).map((breed) => ({
      value: getBreedValue(breed),
      label: getBreedDisplayName(breed),
    })),
  ];

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "free", label: "Adoption (Free)" },
    { value: "paid", label: "Sale (Paid)" },
  ];

  const getSelectedLocationValue = () => {
    if (filters.latitude) return "current_location";
    if (filters.locationId) return filters.locationId;
    return "manual";
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center mb-6 pb-4 border-b-2 border-black">
        <FilterIcon />
        <h2 className="text-xl font-bold text-stone-950 tracking-tight font-serif">
          Filter Pets
        </h2>
      </div>

      <div className="space-y-8">
        {/* --- Location Section --- */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-bold text-stone-600">
              <MapPinIcon /> Pets Near Me
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="nearMe"
                checked={filters.nearMe}
                onChange={handleInputChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Location Options */}
          {filters.nearMe && (
            <div className="animate-fade-in-down p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-600 mb-2 uppercase tracking-wider">
                  Search Around
                </label>
                <CustomSelect
                  options={locationOptions}
                  value={getSelectedLocationValue()}
                  onChange={handleLocationSelect}
                  disabled={isLocating}
                  placeholder="Select Location"
                />

                {/* Manual City Input */}
                {(!filters.locationId && !filters.latitude && filters.nearMe) || (filters.nearMe && !filters.locationId && !filters.latitude) || (filters.nearMe && filters.locationId === "" && filters.latitude === null) ? (
                   <div className="mt-3 animate-fade-in">
                     <label className="block text-[10px] font-bold text-stone-500 mb-1 uppercase">City Name</label>
                     <input 
                       type="text"
                       name="city"
                       value={filters.city}
                       onChange={handleInputChange}
                       placeholder="e.g. Jaipur"
                       className="w-full px-3 py-2 text-sm bg-white border-2 border-black rounded-lg text-stone-900 focus:border-emerald-500 outline-none transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                     />
                   </div>
                ) : null}

                {/* Status Messages */}
                {isLocating && (
                  <p className="text-[10px] text-stone-500 mt-1 animate-pulse">
                    Please allow location access in your browser...
                  </p>
                )}
                {locationError && (
                  <p className="text-[10px] text-red-500 mt-1 font-medium">
                    {locationError}
                  </p>
                )}
                {typeof filters.latitude === "number" && !isNaN(filters.latitude) && !isLocating && (
                  <p className="text-[10px] text-emerald-600 mt-1 font-medium ml-1">
                    ✓ Location set: {filters.latitude.toFixed(4)},{" "}
                    {filters.longitude.toFixed(4)}
                  </p>
                )}
              </div>

              {/* Distance Slider */}
              <div className="pt-8">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                    Max Distance
                  </label>
                  <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                    {filters.maxDistance} km
                  </span>
                </div>

                <div className="gsap-slider-container">
                  {/* Tooltip Pin showing dynamic value */}
                  <div 
                    className="gsap-slider-tooltip"
                    style={{ left: `${distancePct}%` }}
                  >
                    {filters.maxDistance}
                    <div className="gsap-slider-tooltip-arrow" />
                  </div>

                  {/* Custom Track */}
                  <div className="gsap-slider-track" />

                  {/* Custom Progress */}
                  <div 
                    className="gsap-slider-progress" 
                    style={{ width: `${distancePct}%` }}
                  />

                  {/* Custom Thumb */}
                  <div 
                    className="gsap-slider-thumb" 
                    style={{ left: `${distancePct}%` }}
                  />

                  {/* Invisible Range Input */}
                  <input
                    type="range"
                    name="maxDistance"
                    min="5"
                    max="500"
                    step="5"
                    value={filters.maxDistance}
                    onChange={handleInputChange}
                    className="gsap-slider-input"
                  />
                </div>

                <div className="flex justify-between text-[10px] text-stone-400 mt-2">
                  <span>5km</span>
                  <span>500km</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="border-b border-stone-100"></div>

        {/* Species Selection */}
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-bold mb-2 text-stone-700">
            <PawIcon /> Species
          </label>
          <div className="relative">
            <CustomSelect
              options={speciesOptions}
              value={filters.species}
              onChange={(val) => handleInputChange({ target: { name: "species", value: val } })}
              disabled={isLoadingSpecies}
              placeholder={isLoadingSpecies ? "Loading species..." : "All Species"}
            />
          </div>
        </div>

        {/* Breed Selection */}
        {filters.species && (
          <div className="animate-fade-in-down">
            <label className="flex items-center gap-2 text-sm font-bold mb-2 text-stone-700">
              <TagIcon /> Breed
            </label>
            <CustomSelect
              options={breedOptions}
              value={filters.breed}
              onChange={(val) => handleInputChange({ target: { name: "breed", value: val } })}
              disabled={isLoadingBreeds}
              placeholder={isLoadingBreeds ? "Loading breeds..." : "All Breeds"}
            />
          </div>
        )}

        {/* Type Selection */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold mb-2 text-stone-700">
            <TagIcon /> Category
          </label>
          <CustomSelect
            options={categoryOptions}
            value={filters.type}
            onChange={(val) => handleInputChange({ target: { name: "type", value: val } })}
            placeholder="All Categories"
          />
        </div>

        {/* Price Range */}
        {filters.type !== "free" && (
          <div className="animate-fade-in-down p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <label className="flex items-center gap-2 text-sm font-bold mb-4 text-stone-700">
              <MoneyIcon /> Price Range
            </label>

            <div className="space-y-5">
              <div className="flex justify-between text-xs font-bold font-mono">
                <span className="text-stone-900 bg-amber-100 px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {formatPrice(filters.minPrice)}
                </span>
                <span className="text-stone-900 bg-amber-100 px-3 py-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  {formatPrice(filters.maxPrice)}
                </span>
              </div>

              <div className="relative h-2 bg-stone-200 rounded-full border border-black">
                <div
                  className="absolute h-full bg-emerald-500 rounded-full opacity-80"
                  style={{
                    left: `${(filters.minPrice / 100000) * 100}%`,
                    right: `${100 - (filters.maxPrice / 100000) * 100}%`,
                  }}
                />
              </div>

              <div className="relative h-0">
                <input
                  type="range"
                  name="minPrice"
                  min="0"
                  max="100000"
                  step="1000"
                  value={filters.minPrice}
                  onChange={handleRangeChange}
                  className="absolute w-full -top-3 h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />
                <input
                  type="range"
                  name="maxPrice"
                  min="0"
                  max="100000"
                  step="1000"
                  value={filters.maxPrice}
                  onChange={handleRangeChange}
                  className="absolute w-full -top-3 h-2 appearance-none bg-transparent pointer-events-auto cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-black [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
                />
              </div>

              <div className="flex justify-between gap-2 pt-2">
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleRangeChange}
                    className="w-full pl-6 pr-2 py-2 text-sm border-2 border-black rounded-lg focus:border-emerald-500 focus:outline-none bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    min="0"
                    max={filters.maxPrice}
                  />
                </div>
                <div className="relative w-full">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleRangeChange}
                    className="w-full pl-6 pr-2 py-2 text-sm border-2 border-black rounded-lg focus:border-emerald-500 focus:outline-none bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    min={filters.minPrice}
                    max="100000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Apply Filters Button */}
        <button
          onClick={() => onFilterChange(filters)}
          className="w-full mt-6 brand-button-accent"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;
