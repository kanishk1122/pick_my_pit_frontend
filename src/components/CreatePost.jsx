import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import AddressForm from "./User/UpdateAddress";
import { useSwal } from "@utils/Customswal.jsx";
import { useSpecies } from "@hooks/useSpecies";
import { useAddresses } from "@hooks/useAddresses";
import { usePosts } from "@hooks/usePosts";
import CustomSelect from "./Pet/CustomSelect";

const inputStyle = "w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-stone-900 focus:outline-none focus:ring-0 focus:shadow-[3px_3px_0px_0px_rgba(16,185,129,1)] transition-all font-bold placeholder-stone-400 text-sm";
const selectStyle = "w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-stone-900 focus:outline-none focus:ring-0 focus:shadow-[3px_3px_0px_0px_rgba(16,185,129,1)] transition-all font-bold appearance-none cursor-pointer text-sm";
const labelStyle = "block text-xs font-black text-stone-700 mb-2 uppercase tracking-wider";

// --- Icons ---
const UploadIcon = () => (
  <svg
    className="w-8 h-8 text-emerald-500 mb-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

const TrashIcon = () => (
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
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const getSpeciesIcon = (name) => {
  const css = "w-5 h-5 text-current";
  switch (name.toLowerCase()) {
    case "dog":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5.5a2.5 2.5 0 0 1 5 0v5a2.5 2.5 0 0 1-5 0z" fill="#FFFDF5" stroke="currentColor" />
          <path d="M7 5.5a2.5 2.5 0 0 1 5 0v5a2.5 2.5 0 0 1-5 0z" fill="#FFFDF5" stroke="currentColor" />
          <circle cx="9.5" cy="11.5" r="1" fill="currentColor" />
          <circle cx="14.5" cy="11.5" r="1" fill="currentColor" />
          <path d="M12 14c-1.5 0-2.5 1-2.5 2s1.5 3 2.5 3 2.5-2 2.5-3-1-2-2.5-2z" fill="#10B981" stroke="currentColor" />
        </svg>
      );
    case "cat":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21c-4.5 0-8-3.5-8-8s3.5-8 8-8 8 3.5 8 8-3.5 8-8 8z" fill="#FFFDF5" stroke="currentColor" />
          <path d="M5 6l4 3-2-4z" fill="currentColor" />
          <path d="M19 6l-4 3 2-4z" fill="currentColor" />
          <circle cx="9.5" cy="12.5" r="1" fill="currentColor" />
          <circle cx="14.5" cy="12.5" r="1" fill="currentColor" />
          <path d="M12 15l-1.5-1.5h3z" fill="currentColor" />
        </svg>
      );
    case "bird":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3c-1.5 0-3 1-3 3v3h6V6c0-2-1.5-3-3-3z" fill="#FFFDF5" stroke="currentColor" />
          <path d="M13 9c-3 0-5 2-5 5v3h7v-3c0-3-1-5-2-5z" fill="#FFFDF5" stroke="currentColor" />
          <path d="M8 17H3l3-3z" fill="currentColor" />
          <path d="M19 9l3 1-3 2z" fill="#FCD34D" stroke="currentColor" />
          <circle cx="15.5" cy="6.5" r="0.75" fill="currentColor" />
        </svg>
      );
    case "rabbit":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 2c-1 0-2 2-2 5v5h4V7c0-3-1-5-2-5z" fill="#FFFDF5" stroke="currentColor" />
          <path d="M15 2c-1 0-2 2-2 5v5h4V7c0-3-1-5-2-5z" fill="#FFFDF5" stroke="currentColor" />
          <circle cx="12" cy="16" r="4.5" fill="#FFFDF5" stroke="currentColor" />
          <circle cx="10" cy="15" r="0.75" fill="currentColor" />
          <circle cx="14" cy="15" r="0.75" fill="currentColor" />
          <path d="M12 17.5l-1-1h2z" fill="currentColor" />
        </svg>
      );
    case "fish":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12c-4 4-10 5-14 2L3 17l1-5-1-5 5 3c4-3 10-2 14 2z" fill="#FFFDF5" stroke="currentColor" />
          <circle cx="17" cy="11.5" r="0.75" fill="currentColor" />
          <path d="M8 12.5c1 1.5 2 1.5 3 0" stroke="currentColor" />
        </svg>
      );
    case "rodent":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="13" r="5" fill="#FFFDF5" stroke="currentColor" />
          <circle cx="7" cy="8" r="2.5" fill="#FCD34D" stroke="currentColor" />
          <circle cx="17" cy="8" r="2.5" fill="#FCD34D" stroke="currentColor" />
          <circle cx="10" cy="12.5" r="0.75" fill="currentColor" />
          <circle cx="14" cy="12.5" r="0.75" fill="currentColor" />
          <path d="M12 14.5l-0.75-0.75h1.5z" fill="currentColor" />
          <path d="M12 18c.5 1 1 1.5 2 1.5M12 18c-.5 1-1 1.5-2 1.5" stroke="currentColor" />
        </svg>
      );
    case "reptile":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4a3 3 0 0 1 3 3v2a3 3 0 0 1-6 0V7a3 3 0 0 1 3-3z" fill="#FFFDF5" stroke="currentColor" />
          <path d="M12 9c-3 0-5 3-5 7v4h10v-4c0-4-2-7-5-7z" fill="#FFFDF5" stroke="currentColor" />
          <circle cx="10" cy="6.5" r="0.75" fill="currentColor" />
          <circle cx="14" cy="6.5" r="0.75" fill="currentColor" />
          <path d="M5 14h2M17 14h2M6 18h2M16 18h2" stroke="currentColor" />
        </svg>
      );
    case "amphibian":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="14" rx="7" ry="5" fill="#FFFDF5" stroke="currentColor" />
          <circle cx="8" cy="8.5" r="2" fill="#FFFDF5" stroke="currentColor" />
          <circle cx="16" cy="8.5" r="2" fill="#FFFDF5" stroke="currentColor" />
          <circle cx="8" cy="8.5" r="0.75" fill="currentColor" />
          <circle cx="16" cy="8.5" r="0.75" fill="currentColor" />
          <path d="M9 14.5c1.5 1.5 4.5 1.5 6 0" stroke="currentColor" />
        </svg>
      );
    case "invertebrate":
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3.5" fill="#FFFDF5" stroke="currentColor" />
          <path d="M9 12H3M15 12h6M10 10L5 6M14 10l5-4M10 14l-5 4M14 14l5 4" stroke="currentColor" />
        </svg>
      );
    default:
      return (
        <svg className={css} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" stroke="currentColor" />
          <path d="M12 8v4M12 16h.01" stroke="currentColor" />
        </svg>
      );
  }
};

const CreatePost = () => {
  const Swal = useSwal();
  const {
    species,
    hierarchy: speciesHierarchy,
    breeds: availableBreeds,
    loading: isLoadingSpecies,
    getSpeciesHierarchy,
    getBreeds,
  } = useSpecies();
  const { addresses, getAddresses } = useAddresses();
  const { createPost, loading: isSubmitting } = usePosts();

  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoadingBreeds, setIsLoadingBreeds] = useState(false);
  const [formData, setFormData] = useState({
    petName: "",
    species: "",
    breed: "",
    ageValue: "",
    ageUnit: "months",
    description: "",
    price: "",
    isNegotiable: false,
    useUserAddress: true,
    address: {
      country: "",
      city: "",
      zip: "",
      district: "",
      street: "",
      building: "",
      floor: "",
      location: "",
    },
  });

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    getSpeciesHierarchy();
    getAddresses();
  }, [getSpeciesHierarchy, getAddresses]);

  useEffect(() => {
    const fetchBreedsForSpecies = async () => {
      if (formData.species) {
        const selectedSpeciesData = speciesHierarchy.find(
          (s) => s.name === formData.species
        );

        if (selectedSpeciesData && selectedSpeciesData.breeds) {
          // Breeds are already in hierarchy, no need to fetch
        } else {
          setIsLoadingBreeds(true);
          await getBreeds(formData.species);
          setIsLoadingBreeds(false);
        }
      } else {
        getBreeds(null); // Clear breeds
      }
    };
    fetchBreedsForSpecies();
  }, [formData.species, speciesHierarchy, getBreeds]);

  useEffect(() => {
    if (formData.species) {
      const selectedSpeciesData = speciesHierarchy.find(
        (s) => s.name === formData.species
      );
      if (selectedSpeciesData?.breeds) {
        setFormData((prev) => ({ ...prev, breed: "" }));
      }
    }
  }, [availableBreeds, formData.species, speciesHierarchy]);

  // Compress Image Function
  const compressImage = (imageDataUrl) => {
    return new Promise((resolve) => {
      const maxWidth = 1200;
      const maxHeight = 1200;
      const quality = 0.7;

      const img = new Image();
      img.onload = function () {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
        resolve(compressedDataUrl);
      };

      img.src = imageDataUrl;
    });
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + selectedImages.length > 5) {
      Swal.fire("Error", "You can upload a maximum of 5 images.", "error");
      return;
    }

    if (files.length > 0) {
      setUploadProgress(10);
    }

    let processed = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const compressedImage = await compressImage(reader.result);
          setSelectedImages((prevImages) => [...prevImages, compressedImage]);

          processed++;
          setUploadProgress(Math.round((processed / files.length) * 90) + 10);

          if (processed === files.length) {
            setTimeout(() => {
              setUploadProgress(0);
            }, 500);
          }
        } catch (error) {
          console.error("Error compressing image:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "There was an error processing your image. Please try another image.",
          });

          processed++;
          if (processed === files.length) {
            setUploadProgress(0);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages((prevImages) =>
      prevImages.filter((_, imgIndex) => imgIndex !== index)
    );
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "species") {
      setFormData((prev) => ({
        ...prev,
        breed: "",
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "species" ? { breed: "" } : {}),
    }));
  };

  const handleSpeciesChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      species: value,
      breed: "",
    }));
  };

  const handleBreedChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      breed: value,
    }));
  };

  const handleAgeUnitChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      ageUnit: value,
    }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowNewAddressForm(false);
  };

  const handleNewAddressSubmit = async () => {
    await getAddresses();
    setShowNewAddressForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    try {
      if (!formData.species) throw new Error("Please select a species");
      if (!formData.breed) throw new Error("Please select a breed");
      if (formData.petName.length < 3)
        throw new Error("Pet name must be at least 3 characters long");
      if (formData.description.length < 20)
        throw new Error("Description must be at least 20 characters long");
      if (!selectedAddress) throw new Error("Please select an address");
      if (selectedImages.length === 0)
        throw new Error("Please upload at least one image");

      const phoneRegex =
        /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
      const linkRegex = /(https?:\/\/[^\s]+)/g;

      if (
        phoneRegex.test(formData.petName) ||
        linkRegex.test(formData.petName)
      ) {
        throw new Error("Pet name cannot contain phone numbers or links.");
      }

      phoneRegex.lastIndex = 0;
      linkRegex.lastIndex = 0;

      if (
        phoneRegex.test(formData.description) ||
        linkRegex.test(formData.description)
      ) {
        throw new Error("Description cannot contain phone numbers or links.");
      }

      if (
        formData.ageValue &&
        (isNaN(formData.ageValue) || formData.ageValue < 0)
      ) {
        throw new Error("Age must be a positive number");
      }

      setUploadProgress(10);

      let compressedImages = [];
      for (let i = 0; i < selectedImages.length; i++) {
        setUploadProgress(10 + Math.round((i / selectedImages.length) * 20));
        if (selectedImages[i].length > 1000000) {
          const recompressed = await compressImage(selectedImages[i]);
          compressedImages.push(recompressed);
        } else {
          compressedImages.push(selectedImages[i]);
        }
      }

      setUploadProgress(30);

      const postData = {
        title: formData.petName,
        discription: formData.description,
        amount: formData.price || 0,
        type: formData.price > 0 ? "paid" : "free",
        category: formData.breed,
        species: formData.species,
        addressId: selectedAddress._id,
        images: compressedImages,
        age: formData.ageValue
          ? {
              value: Number(formData.ageValue),
              unit: formData.ageUnit,
            }
          : undefined,
        isNegotiable: formData.isNegotiable,
      };

      setUploadProgress(40);

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.floor(Math.random() * 5) + 1;
          return newProgress < 95 ? newProgress : 95;
        });
      }, 500);

      const result = await createPost(postData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.meta.requestStatus === "fulfilled") {
        Swal.fire({
          icon: "success",
          title: "Success!",
          text: "Your pet listing has been created successfully.",
          confirmButtonColor: "#10B981",
        });
        setFormData({
          petName: "",
          species: "",
          breed: "",
          ageValue: "",
          ageUnit: "months",
          description: "",
          price: "",
          isNegotiable: false,
          useUserAddress: true,
          address: {
            country: "",
            city: "",
            zip: "",
            district: "",
            street: "",
            building: "",
            floor: "",
            location: "",
          },
        });
        setSelectedImages([]);
        setSelectedAddress(null);
      } else {
        const errorMessage =
          result.payload?.message ||
          "An unexpected error occurred during post creation.";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating post:", error);
      let errorMessage = "Failed to create pet listing";

      if (error.message === "Network Error" || error.code === "ECONNABORTED") {
        errorMessage =
          "The upload timed out. Please try with smaller or fewer images.";
      } else if (error.response?.status === 413) {
        errorMessage =
          "The images are too large. Please use smaller images or fewer images.";
      } else {
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      }

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setUploadProgress(0);
    }
  };

  const ageUnitOptions = [
    { value: "days", label: "Days" },
    { value: "weeks", label: "Weeks" },
    { value: "months", label: "Months" },
    { value: "years", label: "Years" },
  ];

  const ageInputSection = (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className={labelStyle}>
          Age Value
        </label>
        <input
          type="number"
          name="ageValue"
          value={formData.ageValue}
          onChange={handleInputChange}
          min="0"
          placeholder="e.g. 2"
          className={inputStyle}
        />
      </div>
      <div>
        <label className={labelStyle}>
          Age Unit
        </label>
        <CustomSelect
          options={ageUnitOptions}
          value={formData.ageUnit}
          onChange={handleAgeUnitChange}
          placeholder="Select Unit"
        />
      </div>
    </div>
  );

  const speciesOptions = (species || []).map((item) => ({
    value: item.name,
    label: item.displayName || item.name,
    icon: getSpeciesIcon(item.name),
  }));

  const breedOptions = (availableBreeds || []).map((breed) => ({
    value: breed.name,
    label: breed.name.charAt(0).toUpperCase() + breed.name.slice(1),
  }));

  const speciesAndBreedSection = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-0">
      <div>
        <label className={labelStyle}>
          Species
        </label>
        <CustomSelect
          options={speciesOptions}
          value={formData.species}
          onChange={handleSpeciesChange}
          placeholder="Select Species"
          disabled={isLoadingSpecies}
        />
        {isLoadingSpecies && (
          <div className="mt-1 text-xs font-bold text-stone-400">
            Loading species...
          </div>
        )}
      </div>

      <motion.div
        initial={{ opacity: formData.species ? 1 : 0.5 }}
        animate={{ opacity: formData.species ? 1 : 0.5 }}
        className={!formData.species ? "pointer-events-none grayscale" : ""}
      >
        <label className={labelStyle}>
          Breed
        </label>
        <CustomSelect
          options={breedOptions}
          value={formData.breed}
          onChange={handleBreedChange}
          placeholder="Select Breed"
          disabled={isLoadingBreeds || !formData.species}
        />
        {isLoadingBreeds && (
          <div className="mt-1 text-xs font-bold text-stone-400">
            Loading breeds...
          </div>
        )}
        {availableBreeds.length === 0 &&
          formData.species &&
          !isLoadingBreeds && (
            <div className="mt-1 text-xs font-bold text-amber-500">
              No breeds found. You can continue with a custom breed.
            </div>
          )}
      </motion.div>
    </div>
  );

  const renderLoadingOverlay = () => {
    if (!isSubmitting) return null;

    return (
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100] flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-[2rem] border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-96 text-center">
          <div className="mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto"
            />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-stone-800 font-serif">
            Creating Post...
          </h3>
          <p className="text-stone-500 mb-6 font-medium">
            Please wait while we upload your images and create your listing.
          </p>

          <div className="w-full bg-stone-100 rounded-full h-4 border border-stone-200 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm font-bold text-emerald-600 mt-2">
            {uploadProgress}% complete
          </p>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      // Padding top added for fixed navbar
      className="min-h-screen pt-4 pb-20 px-4 w-full max-w-5xl mx-auto"
    >
      {renderLoadingOverlay()}

      {/* Main Card - Neubrutalist Style */}
      <div className="w-full bg-white rounded-[2.5rem] border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold font-serif text-gray-900 mb-1 leading-tight">
            Create New <br className="md:hidden" />
            <span className="text-[#10B981] underline decoration-4 underline-offset-4 decoration-[#FCD34D]">Listing</span>
          </h1>
          <p className="text-xs text-gray-500 font-medium max-w-lg mx-auto">
            Share your pet with the world and find them a loving home.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Media & Location */}
          <div className="lg:col-span-6 space-y-6">
            {/* Image Upload Section */}
            <div className="bg-[#FFFDF5] rounded-3xl p-5 border-2 border-black border-dashed shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[#10B981] mb-3 font-black text-xs uppercase tracking-wider flex items-center gap-2">
                <span>Upload Pet Images</span>
                <span className="text-stone-500 text-[10px] font-bold uppercase">(Max 5)</span>
              </p>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 p-1.5 -m-1.5">
                {selectedImages.map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group aspect-square rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                  >
                    <img
                      src={image}
                      alt={`Preview ${index}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-white border border-black text-red-500 rounded p-1 shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      <TrashIcon />
                    </button>
                  </motion.div>
                ))}
                {selectedImages.length < 5 && (
                  <label className="aspect-square border-2 border-dashed border-black rounded-xl bg-emerald-50 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50/50 hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all group select-none">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                    <div className="bg-[#10B981] p-2 rounded-full mb-1.5 group-hover:scale-105 transition-transform border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] text-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <span className="text-stone-900 font-black text-[9px] uppercase tracking-wider">
                      Add Photo
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Address Section */}
            <div>
              <h3 className="text-xs font-black mb-3 text-stone-900 uppercase tracking-wider">
                Location Details
              </h3>

              {addresses && addresses.length > 0 ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[160px] overflow-y-auto -mx-1 p-1 scrollbar-thin">
                    {addresses.map((address) => (
                      <motion.div
                        key={address._id}
                        onClick={() => handleAddressSelect(address)}
                        className={`cursor-pointer p-4 bg-white border-2 border-black rounded-xl transition-all duration-200 select-none relative ${
                          selectedAddress && selectedAddress._id === address._id
                            ? "bg-emerald-50/70 shadow-[3px_3px_0px_0px_rgba(16,185,129,1)] translate-y-[-1px]"
                            : "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px]"
                        }`}
                      >
                        {address.isDefault && (
                          <span className="absolute -top-2.5 -right-1 bg-[#FCD34D] border border-black px-1.5 py-0.5 rounded-full font-bold text-[8px] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] rotate-3">
                            DEFAULT
                          </span>
                        )}
                        <div className="flex gap-2">
                          <div className="w-7 h-7 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center shrink-0">
                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs truncate text-stone-900">{address.street}</h4>
                            <p className="text-[10px] text-gray-500 truncate">{address.city}, {address.state}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 bg-[#FFFDF5] rounded-xl border-2 border-dashed border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] p-3">
                  <p className="text-stone-500 font-bold text-xs uppercase">
                    No addresses found.
                  </p>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                className="mt-3 w-full py-2.5 rounded-lg border-2 border-dashed border-black bg-white text-stone-700 font-black hover:bg-stone-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                {showNewAddressForm
                  ? "Cancel Adding Address"
                  : "+ Add New Address"}
              </button>

              {showNewAddressForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 bg-[#FFFDF5] p-4 rounded-2xl border border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] max-h-60 overflow-y-auto"
                >
                  <AddressForm onAddressAdded={handleNewAddressSubmit} />
                </motion.div>
              )}
            </div>
          </div>

          {/* Right Column: Info & Submit */}
          <div className="lg:col-span-6 space-y-4 bg-stone-50/30 p-5 rounded-[2rem] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            {/* Pet Name */}
            <div>
              <label className={labelStyle}>
                Pet Name
              </label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleInputChange}
                placeholder="What is their name?"
                className={inputStyle}
              />
            </div>

            {/* Species and Breed */}
            {speciesAndBreedSection}

            {/* Age */}
            {ageInputSection}

            {/* Description */}
            <div>
              <label className={labelStyle}>
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2.5 bg-white border-2 border-black rounded-xl text-stone-900 focus:outline-none focus:ring-0 focus:shadow-[3px_3px_0px_0px_rgba(16,185,129,1)] transition-all font-semibold placeholder-stone-400 text-sm"
                placeholder="Tell us about your pet's personality..."
              ></textarea>
            </div>

            {/* Price & Negotiable */}
            <div className="grid grid-cols-2 gap-4 items-center">
              <div>
                <label className={labelStyle}>
                  Price (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-900 font-bold">
                    ₹
                  </span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-2.5 bg-white border-2 border-black rounded-xl text-stone-900 focus:outline-none focus:ring-0 focus:shadow-[3px_3px_0px_0px_rgba(16,185,129,1)] transition-all font-bold placeholder-stone-400 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center pt-5">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      name="isNegotiable"
                      checked={formData.isNegotiable}
                      onChange={handleInputChange}
                      className="sr-only peer"
                    />
                    <div className="relative w-12 h-7 bg-stone-100 border-2 border-black rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-black after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-2 after:border-black after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                  <span className="text-[10px] font-black text-stone-700 group-hover:text-emerald-600 transition-colors select-none uppercase tracking-wider">
                    Negotiable
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-3 border-t border-dashed border-stone-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3.5 bg-[#10B981] text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center justify-center gap-2 text-base cursor-pointer ${
                  isSubmitting ? "opacity-50 cursor-not-allowed shadow-none translate-y-[4px] translate-x-[4px]" : ""
                }`}
              >
                {isSubmitting ? "Creating..." : "Create Listing"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreatePost;
