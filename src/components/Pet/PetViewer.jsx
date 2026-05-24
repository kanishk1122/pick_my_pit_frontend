import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { POST } from "../../Consts/apikeys";
import { useUser } from "../../utils/Usercontext";
import apiService from "../../utils/apiService";
import "./PetViewer.css";

const PetViewer = () => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await apiService.get(`${POST.GetPostBySlug(slug)}`);
        setPet(response.data.data);

        if (
          response.data.canonicalSlug &&
          response.data.canonicalSlug !== slug
        ) {
          navigate(`/pet/${response.data.canonicalSlug}`, { replace: true });
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pet details:", error);
        setLoading(false);
      }
    };

    fetchPet();
  }, [slug, navigate]);

  const handleChatClick = async () => {
    if (!user) {
      navigate('/auth'); // Redirect to login if not authenticated
      return;
    }
    
    try {
      // Initiate chat with the pet owner
      await apiService.post('/api/messages/contact-pet-owner', {
        postId: pet._id,
        message: `Hi, I'm interested in your pet listing: ${pet.title}`
      });
      navigate('/messenger');
    } catch (error) {
      console.error('Error initiating chat:', error);
      // Navigate to messenger anyway, perhaps they already have a chat open
      navigate('/messenger');
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === pet.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? pet.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const toggleImageZoom = () => {
    setIsImageZoomed(!isImageZoomed);
  };

  return (
    <>
      <div className="w-full p-4">
        {loading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : pet ? (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 relative">
                {/* Main Image Display */}
                <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg bg-gray-100">
                  <div
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{
                      transform: `translateX(-${currentImageIndex * 100}%)`,
                    }}
                  >
                    {pet.images.map((image, index) => (
                      <div key={index} className="min-w-full h-full relative">
                        <img
                          src={image}
                          alt={`${pet.title} - image ${index + 1}`}
                          className={`w-full h-full object-cover cursor-zoom-in transition-transform duration-300 ${
                            isImageZoomed ? "scale-150" : "hover:scale-105"
                          }`}
                          onClick={toggleImageZoom}
                        />
                        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                          {index + 1} / {pet.images.length}
                        </div>
                      </div>
                    ))}
                  </div>

                  {pet.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}

                  {pet.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      {pet.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => goToImage(index)}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            index === currentImageIndex
                              ? "bg-white scale-125"
                              : "bg-white bg-opacity-50 hover:bg-opacity-75"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {pet.images.length > 1 && (
                  <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
                    {pet.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          index === currentImageIndex
                            ? "border-green-500 scale-105"
                            : "border-gray-300 hover:border-green-300"
                        }`}
                      >
                        <img src={image} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="md:w-1/2 p-8 pet-details">
                <h1 className="text-3xl font-bold text-green-600 mb-4">
                  {pet.title}
                </h1>
                <div className="mb-4">
                  <span className={`pet-tag ${pet.type === "free" ? "adoption" : "sale"}`}>
                    {pet.type === "free" ? "For Adoption" : "For Sale"}
                  </span>
                  {pet.type === "paid" && (
                    <span className="text-2xl font-bold text-green-600 ml-2">
                      ₹{pet.amount.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-6">{pet.discription}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Species</h3>
                    <p className="text-lg">{pet.species}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Breed</h3>
                    <p className="text-lg">{pet.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500">Status</h3>
                    <p className="text-lg capitalize">{pet.status}</p>
                  </div>
                  {pet.address && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500">Location</h3>
                      <p className="text-lg">{`${pet.address.city}, ${pet.address.state}`}</p>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleChatClick}
                  className="w-full bg-[#10B981] text-stone-900 border-2 border-black rounded-lg py-3 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-[#059669] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-200"
                >
                  Contact Owner
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-screen flex items-center justify-center text-2xl text-red-600">
            Pet not found
          </div>
        )}
      </div>
    </>
  );
};

export default PetViewer;
