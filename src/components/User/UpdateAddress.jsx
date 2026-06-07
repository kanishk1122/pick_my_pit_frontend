import { useState, useEffect, useRef } from "react";
import { useSwal } from "@utils/Customswal.jsx";
import { useUser } from "../../utils/Usercontext";
import { useAddresses } from "../../hooks/useAddresses";
import { Map, Marker } from "../ui/Map";

const UpdateAddress = () => {
  const Swal = useSwal();
  const { user } = useUser();
  const {
    addresses,
    pagination,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    loading,
  } = useAddresses();

  const initialFormState = {
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    landmark: "",
    isDefault: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef();

  // REPLACE WITH YOUR KEY
  const LOCATIONIQ_API_KEY = "YOUR_LOCATIONIQ_API_KEY";

  useEffect(() => {
    getAddresses(currentPage);
  }, [getAddresses, currentPage]);

  const handleEdit = (address) => {
    setEditingId(address._id);
    setFormData({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      landmark: address.landmark || "",
      isDefault: address.isDefault,
    });

    if (address.location && address.location.coordinates) {
      const [lng, lat] = address.location.coordinates;
      setSelectedPosition([lat, lng]);
    }

    if (window.innerWidth < 768) {
      setTimeout(() => {
        document
          .getElementById("address-form-section")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 200);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete Address?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#059669",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Yes, remove it!",
      background: "#fff",
      customClass: {
        popup: "border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
        confirmButton: "border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
        cancelButton: "border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
      }
    });

    if (result.isConfirmed) {
      const deleteResult = await deleteAddress(id);
      if (deleteResult.meta.requestStatus === "fulfilled") {
        Swal.fire("Deleted!", "Address removed successfully.", "success");
      } else {
        Swal.fire("Error!", "Failed to delete address.", "error");
      }
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setSelectedPosition(null);
  };

  // --- MAP LOGIC ---
  const handleMapClick = (coords) => {
    setSelectedPosition([coords.lat, coords.lng]);
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [coords.lng, coords.lat], zoom: 17 });
    }
    reverseGeocodeLocationIQ(coords.lat, coords.lng);
  };

  const cleanCityName = (cityName) => {
    if (!cityName) return "";
    return cityName
      .replace(/Municipal Corporation/gi, "")
      .replace(/Nagar Nigam/gi, "")
      .replace(/Cantonment Board/gi, "")
      .trim();
  };

  const reverseGeocodeLocationIQ = async (lat, lng) => {
    try {
     
      const response = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${import.meta.env.VITE_REACT_APP_GEO_API}&lat=${lat}&lon=${lng}&format=json`
      );
      if (!response.ok) throw new Error("Geocoding failed");
      const data = await response.json();

      if (data && data.address) {
        const addr = data.address;
        
        let streetParts = [];
        if (addr.house_number) streetParts.push(addr.house_number);
        if (addr.building) streetParts.push(addr.building);
        if (addr.road) streetParts.push(addr.road);
        
        let street = streetParts.length > 0 ? streetParts.join(", ") : "";
        
        let rawCity = addr.city || addr.town || addr.village || addr.municipality || "";
        const city = cleanCityName(rawCity);

        if (!street) {
          if (data.display_name) {
            const parts = data.display_name.split(",").map(p => p.trim());
            const filterOut = [
              city.toLowerCase(),
              (addr.state || "").toLowerCase(),
              (addr.country || "").toLowerCase(),
              (addr.postcode || "").toLowerCase(),
              "india"
            ];
            const streetPartsFallback = parts.filter(p => !filterOut.some(fo => fo && p.toLowerCase().includes(fo)));
            if (streetPartsFallback.length > 0) {
              street = streetPartsFallback.slice(0, 2).join(", ");
            } else {
              street = addr.suburb || addr.neighbourhood || "";
            }
          } else {
            street = addr.suburb || addr.neighbourhood || "";
          }
        }

        let landmarkParts = [];
        if (data.display_name && data.display_name.split(",")[0] !== street) {
            if (addr.suburb) landmarkParts.push(addr.suburb);
            if (addr.neighbourhood && !landmarkParts.includes(addr.neighbourhood)) landmarkParts.push(addr.neighbourhood);
        }
        const landmark = landmarkParts.join(", ");

        setFormData((prev) => ({
          ...prev,
          street: street,
          city: city,
          state: addr.state || "",
          postalCode: addr.postcode || "",
          country: addr.country || "India",
          landmark: landmark,
        }));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      Swal.fire("Error", "Geolocation not supported.", "error");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedPosition([latitude, longitude]);
        if (mapRef.current) mapRef.current.flyTo({ center: [longitude, latitude], zoom: 17 });
        reverseGeocodeLocationIQ(latitude, longitude);
        setIsLocating(false);
      },
      (error) => {
        setIsLocating(false);
        Swal.fire("Error", "Could not retrieve location.", "error");
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPosition) {
      Swal.fire("Error!", "Please select a location on the map.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const [lat, lon] = selectedPosition;
      const addressData = {
        ...formData,
        location: { type: "Point", coordinates: [parseFloat(lon), parseFloat(lat)] },
      };
      const action = editingId ? updateAddress(editingId, addressData) : addAddress(addressData);
      const result = await action;
      if (result.meta.requestStatus === "fulfilled") {
        Swal.fire({ icon: "success", title: "Woohoo!", text: `Address saved successfully!` });
        cancelEdit();
      } else {
        throw new Error(result.payload || "Failed to save");
      }
    } catch (error) {
      Swal.fire({ icon: "error", title: "Oops!", text: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // --- STYLES FOR THEME ---
  // --- STYLES FOR THEME ---
  const inputStyle = "w-full p-2.5 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-0 focus:shadow-[3px_3px_0px_0px_rgba(16,185,129,1)] transition-all font-semibold text-sm placeholder-gray-400";
  const labelStyle = "block text-xs font-black text-stone-700 mb-1.5 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-[#FFFBF5] py-8 px-4 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold font-serif text-gray-900 mb-2 leading-tight">
            Where Should We Send <br/>
            <span className="text-[#10B981] underline decoration-4 underline-offset-4 decoration-[#FCD34D]">Your Goodies?</span>
          </h1>
          <p className="text-sm text-gray-500 font-medium max-w-lg mx-auto">
            Manage your delivery locations so your furry friends never have to wait.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Saved Addresses */}
          <div className="lg:col-span-4 space-y-5">
            
            {/* Add New Address Card */}
            <button
              onClick={cancelEdit}
              className={`w-full group p-4 rounded-2xl border-2 border-dashed border-black flex items-center gap-4 bg-white hover:bg-stone-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all duration-200 ${
                !editingId ? "border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-500/20" : ""
              }`}
            >
              <div className="w-10 h-10 bg-[#10B981] text-white rounded-full border-2 border-black flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-sm font-serif">Add New Address</h4>
                <p className="text-xs text-gray-500">Create a new location</p>
              </div>
            </button>

            {/* List Header */}
            <div className="flex items-center justify-between pt-1 border-b-2 border-black pb-2">
              <h3 className="font-bold text-base font-serif">Saved Locations</h3>
              <span className="bg-stone-100 text-stone-700 text-xs font-bold px-2 py-0.5 rounded-full border border-stone-200">
                {addresses.length} total
              </span>
            </div>

            {/* Scrollable addresses list container */}
            <div className="space-y-4 max-h-[480px] overflow-y-auto -mx-2 p-2 scrollbar-thin">
              {loading && Array(2).fill(0).map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-white border-2 border-black p-4 animate-pulse opacity-50"></div>
              ))}

              {!loading && addresses.length === 0 && (
                <div className="text-center py-8 bg-white border-2 border-dashed border-black/20 rounded-2xl p-4">
                  <p className="text-sm font-semibold text-gray-400">No saved addresses yet</p>
                </div>
              )}

              {!loading && addresses.map((addr) => {
                const isActive = editingId === addr._id;
                return (
                  <div
                    key={addr._id}
                    className={`relative p-5 bg-white border-2 border-black rounded-2xl transition-all duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] ${
                      isActive ? "ring-2 ring-emerald-500 bg-emerald-50/10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-y-[-2px]" : ""
                    }`}
                  >
                    {addr.isDefault && (
                      <span className="absolute -top-3 -right-2 bg-[#FCD34D] border-2 border-black px-2 py-0.5 rounded-full font-bold text-[9px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] rotate-3">
                        DEFAULT
                      </span>
                    )}

                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-sm truncate">{addr.street}</h4>
                        <p className="text-xs text-gray-500 truncate">{addr.city}, {addr.state}</p>
                        <p className="text-[10px] text-gray-400 font-mono mt-0.5">{addr.postalCode}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4 pt-3 border-t border-dashed border-gray-200">
                      <button
                        onClick={() => handleEdit(addr)}
                        className="flex-1 py-1.5 px-2.5 bg-[#FCD34D] hover:bg-[#ebd046] text-black font-bold rounded-lg border-2 border-black text-xs transition-all flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(addr._id)}
                        className="flex-1 py-1.5 px-2.5 bg-white hover:bg-red-50 text-red-600 font-bold rounded-lg border-2 border-black text-xs transition-all flex items-center justify-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Address Form / Action Column */}
          <div className="lg:col-span-8 relative">
            <div className="absolute -inset-1 bg-[#FCD34D] rounded-[2.5rem] rotate-0.5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black z-0"></div>

            <div className="relative bg-white border-2 border-black rounded-[2rem] p-6 md:p-8 z-10">
              
              <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-black">
                <h2 className="text-xl md:text-2xl font-bold font-serif flex items-center gap-3">
                  <div className="bg-[#10B981] text-white w-9 h-9 rounded-lg border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                     <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                  </div>
                  {editingId ? "Update Details" : "New Location"}
                </h2>
                {editingId && (
                  <button onClick={cancelEdit} className="text-sm text-gray-500 hover:text-red-500 font-bold underline decoration-2 underline-offset-2">
                    Cancel Edit
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Map Column */}
                  <div className="flex flex-col gap-2">
                    <label className={labelStyle}>1. Drop a Pin</label>
                    <div className="relative h-[260px] w-full rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <Map
                        ref={mapRef}
                        center={selectedPosition ? [selectedPosition[1], selectedPosition[0]] : [78.9629, 20.5937]}
                        zoom={selectedPosition ? 17 : 5}
                        onClick={handleMapClick}
                        className="w-full h-full"
                      >
                        {selectedPosition && (
                          <Marker
                            longitude={selectedPosition[1]}
                            latitude={selectedPosition[0]}
                          />
                        )}
                      </Map>

                      {/* Locate Me Button */}
                      <button
                        type="button"
                        onClick={handleGetCurrentLocation}
                        className="absolute bottom-3 right-3 z-[400] bg-[#FCD34D] text-black p-2.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                      >
                        {isLocating ? (
                          <div className="animate-spin w-5 h-5 border-3 border-black border-t-transparent rounded-full"></div>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-xs font-medium text-gray-500 text-center italic mt-1">
                      *Tap map to auto-fill address
                    </p>
                  </div>

                  {/* Fields Column */}
                  <div className="space-y-4">
                    {/* Street */}
                    <div>
                      <label className={labelStyle}>Street Address</label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="e.g. 123 Puppy Lane"
                        required
                      />
                    </div>

                    {/* Landmark */}
                    <div>
                      <label className={labelStyle}>Landmark (Optional)</label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        className={inputStyle}
                        placeholder="e.g. Near the big park"
                      />
                    </div>

                    {/* Grid: City & State */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyle}>City</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          className={inputStyle}
                          required
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>State</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          className={inputStyle}
                          required
                        />
                      </div>
                    </div>

                    {/* Grid: Zip & Country */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelStyle}>Zip Code</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleChange}
                          className={inputStyle}
                          maxLength="6"
                          required
                        />
                      </div>
                      <div>
                        <label className={labelStyle}>Country</label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          className={inputStyle}
                          required
                        />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer section: Default Checkbox & Action Button */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t-2 border-dashed border-gray-200 mt-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="peer sr-only"
                      />
                      <div className="w-6 h-6 border-2 border-black rounded bg-white peer-checked:bg-[#10B981] transition-colors"></div>
                      {formData.isDefault && (
                        <svg className="absolute top-0.5 left-0.5 w-5 h-5 text-white pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="font-bold text-sm text-gray-700 group-hover:text-[#10B981] transition-colors select-none">
                      Set as my default address
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#10B981] text-white font-bold rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center justify-center gap-2 text-base cursor-pointer"
                  >
                    {isSubmitting ? (
                      "Saving..."
                    ) : (
                      <>
                        {editingId ? "Update Address" : "Save Address"} 
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default UpdateAddress;