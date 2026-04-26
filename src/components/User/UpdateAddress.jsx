import { useState, useEffect, useRef } from "react";
import { useSwal } from "@utils/Customswal.jsx";
import { useUser } from "../../utils/Usercontext";
import { useAddresses } from "../../hooks/useAddresses";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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
  const LocationMarker = () => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setSelectedPosition([lat, lng]);
        map.flyTo(e.latlng, map.getZoom());
        reverseGeocodeLocationIQ(lat, lng);
      },
    });

    return selectedPosition === null ? null : (
      <Marker position={selectedPosition}></Marker>
    );
  };

  const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    map.setView(center, zoom);
    return null;
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
        if (!street) street = addr.suburb || addr.neighbourhood || "";

        let rawCity = addr.city || addr.town || addr.village || addr.municipality || "";
        const city = cleanCityName(rawCity);

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
        if (mapRef.current) mapRef.current.flyTo([latitude, longitude], 17);
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
  const cardStyle = "bg-white border-2 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200";
  const inputStyle = "w-full p-3 bg-white border-2 border-black rounded-xl focus:outline-none focus:ring-0 focus:shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] transition-all font-medium placeholder-gray-400";
  const labelStyle = "block text-sm font-bold text-gray-800 mb-2 font-serif tracking-wide";
  const btnPrimary = "w-full py-3.5 bg-[#10B981] text-white font-bold rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 text-lg";
  const btnSecondary = "py-2 px-4 bg-[#FCD34D] text-black font-bold rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all text-sm flex items-center justify-center gap-2";
  const btnDanger = "py-2 px-4 bg-white text-red-600 font-bold rounded-lg border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all text-sm flex items-center justify-center gap-2";

  return (
    <div className="min-h-screen bg-[#FFFBF5] py-12 px-4 font-sans text-gray-900">
      
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
        
          <h1 className="text-4xl md:text-5xl font-extrabold font-serif text-gray-900 mb-4 leading-tight">
            Where Should We Send <br/>
            <span className="text-[#10B981] underline decoration-4 underline-offset-4 decoration-[#FCD34D]">Your Goodies?</span>
          </h1>
          <p className="text-gray-600 font-medium max-w-lg mx-auto">
            Manage your delivery locations so your furry friends never have to wait for their treats.
          </p>
        </div>

        {/* --- SAVED ADDRESSES GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Loading Skeleton */}
          {loading && Array(2).fill(0).map((_, i) => (
             <div key={i} className="h-48 rounded-3xl bg-white border-2 border-black p-6 animate-pulse opacity-50"></div>
          ))}

          {!loading && addresses.map((addr) => (
            <div key={addr._id} className={cardStyle + " relative p-6 md:p-8 flex flex-col justify-between"}>
              
              {/* Default Badge */}
              {addr.isDefault && (
                <div className="absolute -top-4 -right-2 bg-[#FCD34D] border-2 border-black px-3 py-1 rounded-full font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-3 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  PRIMARY HOME
                </div>
              )}

              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-[#D1FAE5] rounded-full border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[#065F46]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-serif leading-tight">{addr.street}</h3>
                    <p className="text-gray-500 font-medium mt-1">{addr.city}, {addr.state}</p>
                    <p className="text-sm text-gray-400 font-medium mt-1 uppercase tracking-wider">{addr.postalCode}</p>
                  </div>
                </div>
                {addr.landmark && (
                  <div className="bg-gray-50 border border-black/10 rounded-lg p-2 text-sm text-gray-600 mb-4 flex items-center gap-2">
                     <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                     </svg>
                    <span className="font-bold">Landmark:</span> {addr.landmark}
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t-2 border-dashed border-gray-200">
                <button onClick={() => handleEdit(addr)} className={btnSecondary + " flex-1 bg-white hover:bg-gray-50"}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button onClick={() => handleDelete(addr._id)} className={btnDanger + " flex-1"}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))}

          {/* "Add New" Card Placeholder */}
          {!loading && !editingId && (
            <button 
              onClick={() => document.getElementById("address-form-section")?.scrollIntoView({ behavior: 'smooth' })}
              className="group h-full min-h-[250px] rounded-3xl border-2 border-dashed border-black/30 flex flex-col items-center justify-center hover:bg-[#FFF] hover:border-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
            >
              <div className="w-16 h-16 bg-[#10B981] text-white rounded-full border-2 border-black flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="font-bold text-lg font-serif">Add New Address</span>
            </button>
          )}
        </div>


        {/* --- FORM SECTION --- */}
        <div id="address-form-section" className="relative">
          {/* Decorative Shape */}
          <div className="absolute -inset-1 bg-[#FCD34D] rounded-[2.5rem] rotate-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-2 border-black z-0"></div>

          <div className="relative bg-white border-2 border-black rounded-[2rem] p-6 md:p-10 z-10">
            
            <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-black">
              <h2 className="text-2xl md:text-3xl font-bold font-serif flex items-center gap-3">
                <div className="bg-[#10B981] text-white w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                   {/* Form Header Icon */}
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                   </svg>
                </div>
                {editingId ? "Update Details" : "New Location"}
              </h2>
              {editingId && (
                <button onClick={cancelEdit} className="text-gray-500 hover:text-red-500 font-bold underline decoration-2 underline-offset-2">
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
              
              {/* MAP COLUMN */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                <label className={labelStyle}>1. Drop a Pin</label>
                <div className="relative h-[350px] w-full rounded-2xl overflow-hidden border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <MapContainer
                    center={[20.5937, 78.9629]}
                    zoom={5}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                    whenCreated={(map) => { mapRef.current = map; }}
                  >
                    <TileLayer
                      url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                      attribution='&copy; CARTO'
                    />
                    <LocationMarker />
                    {selectedPosition && <ChangeView center={selectedPosition} zoom={17} />}
                  </MapContainer>

                  {/* Locate Me Button */}
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="absolute bottom-4 right-4 z-[400] bg-[#FCD34D] text-black p-3 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                  >
                    {isLocating ? (
                      <div className="animate-spin w-6 h-6 border-4 border-black border-t-transparent rounded-full"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-sm font-medium text-gray-500 text-center italic">
                  *Tap map to auto-fill address
                </p>
              </div>

              {/* FORM COLUMN */}
              <div className="lg:col-span-7">
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Street */}
                  <div>
                    <label className={labelStyle}>Street Address</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      className={inputStyle}
                      placeholder="e.g. 123 Puppy Lane, Building A"
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

                  {/* Grid Fields */}
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

                  {/* Checkbox */}
                  <div className="pt-2">
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
                      <span className="font-bold text-gray-700 group-hover:text-[#10B981] transition-colors">
                        Set as my default address
                      </span>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button type="submit" disabled={isSubmitting} className={btnPrimary}>
                      {isSubmitting ? (
                        "Saving..."
                      ) : (
                        <>
                          {editingId ? "Update Address" : "Save Address"} 
                          <svg className="w-5 h-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
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
    </div>
  );
};

export default UpdateAddress;