import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../utils/Usercontext";
import { usePosts } from "../../hooks/usePosts";
import { useSwal } from "@utils/Customswal.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useSpecies } from "@hooks/useSpecies";

const UserPosts = () => {
  const { user } = useUser();
  const Swal = useSwal();
  const { posts, loading, pageInfo, fetchUserPosts, deletePost, updatePost } =
    usePosts();
  const [editingPost, setEditingPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUserPosts(currentPage);
  }, [fetchUserPosts, currentPage]);

  const handleDelete = async (postId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const deleteResult = await deletePost(postId);
        if (deleteResult.meta.requestStatus === "fulfilled") {
          Swal.fire("Deleted!", "Your post has been deleted.", "success");
        } else {
          throw new Error(deleteResult.payload || "Failed to delete post");
        }
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Failed to delete post",
      });
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
  };

  const handleUpdate = async (updatedPost) => {
    try {
      const result = await updatePost({
        id: updatedPost._id,
        postData: updatedPost,
      });

      if (result.meta.requestStatus === "fulfilled") {
        Swal.fire({
          icon: "success",
          title: "Updated!",
          text: "Your post has been updated successfully.",
        });
        setEditingPost(null);
      } else {
        throw new Error(result.payload || "Failed to update post");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Failed to update post",
      });
    }
  };

  if (loading && posts.length === 0) {
    return <LoadingSkeleton />;
  }

  if (posts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-green-600">
        My Pet Listings
      </h2>
      <AnimatePresence>
        <motion.div
          className="grid  grid-cols-2  gap-6 max-md:grid-cols-1 lg:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onDelete={handleDelete}
              onEdit={() => handleEdit(post)}
            />
          ))}
        </motion.div>
      </AnimatePresence>
      {editingPost && (
        <EditModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
          onUpdate={handleUpdate}
        />
      )}
      <Pagination
        pageInfo={pageInfo}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

const Pagination = ({ pageInfo, onPageChange, currentPage }) => {
  if (!pageInfo || pageInfo.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-gray-700">
        Page {pageInfo.currentPage} of {pageInfo.totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === pageInfo.totalPages}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

const PostCard = ({ post, onDelete, onEdit }) => {
  return (
    <motion.div
      className="bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Gallery - Compact on mobile */}
      <div className="relative h-40 sm:h-48 md:h-56 lg:h-64 bg-gray-100">
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full">
          {post?.images && post.images.length > 0 ? (
            post.images.map((img, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-full h-full snap-center"
              >
                <img
                  src={img}
                  alt={`${post.title} - ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8.5,13.5L11,16.5L14.5,12L19,18H5M21,19V5C21,3.89 20.1,3 19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19Z" />
              </svg>
            </div>
          )}
        </div>

        {/* Type Badge - Compact */}
        <div className="absolute top-2 right-2">
          <span
            className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase shadow-lg backdrop-blur-sm ${
              post.type === "free"
                ? "bg-emerald-500/90 text-white"
                : "bg-blue-500/90 text-white"
            }`}
          >
            {post.type === "free" ? "🏡 Free" : "💰 Sale"}
          </span>
        </div>

        {/* Image Counter - Compact */}
        {post?.images && post.images.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium">
            {post.images.length}
          </div>
        )}
      </div>

      {/* Content - Compact on mobile */}
      <div className="p-3 sm:p-4 md:p-5">
        {/* Title - Compact */}
        <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1.5 sm:mb-2 text-gray-900 line-clamp-2">
          {post.title}
        </h3>

        {/* Description - Show less on mobile */}
        <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
          {post.discription}
        </p>

        {/* Info Grid - Compact */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 md:gap-3 mb-2 sm:mb-3">
          <div className="bg-gray-50 p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg">
            <span className="text-[10px] sm:text-xs text-gray-500 block mb-0.5">
              Species
            </span>
            <p className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base truncate">
              {post.species}
            </p>
          </div>
          <div className="bg-gray-50 p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg">
            <span className="text-[10px] sm:text-xs text-gray-500 block mb-0.5">
              Breed
            </span>
            <p className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base truncate">
              {post.category}
            </p>
          </div>
          <div className="bg-gray-50 p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg">
            <span className="text-[10px] sm:text-xs text-gray-500 block mb-0.5">
              Price
            </span>
            <p className="font-bold text-emerald-600 text-sm sm:text-base md:text-lg truncate">
              {post.type === "free"
                ? "Free"
                : `₹${post.amount.toLocaleString("en-IN")}`}
            </p>
          </div>
          <div className="bg-gray-50 p-1.5 sm:p-2 md:p-3 rounded-md sm:rounded-lg">
            <span className="text-[10px] sm:text-xs text-gray-500 block mb-0.5">
              Status
            </span>
            <p className="font-semibold text-gray-900 capitalize flex items-center gap-1 text-xs sm:text-sm md:text-base">
              <span
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                  post.status === "available"
                    ? "bg-green-500"
                    : post.status === "pending"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
              ></span>
              <span className="truncate">{post.status}</span>
            </p>
          </div>
        </div>

        {/* Address - Compact on mobile */}
        {post.address && (
          <div className="mb-2 sm:mb-3 flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 md:p-3 bg-gray-50 rounded-md sm:rounded-lg">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400 flex-shrink-0 mt-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-[10px] sm:text-xs md:text-sm line-clamp-1">
                {post.address.city}
                {post.address.state && `, ${post.address.state}`}
              </p>
            </div>
          </div>
        )}

        {/* Footer - Compact */}
        <div className="flex flex-col gap-2 pt-2 sm:pt-3 border-t border-gray-100">
          <span className="text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z" />
            </svg>
            {new Date(post.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })}
          </span>

          <div className="flex gap-1.5 sm:gap-2">
            <button
              onClick={() => onEdit(post)}
              className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 bg-blue-500 text-white px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm hover:shadow-md text-xs sm:text-sm"
            >
              <svg
                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => onDelete(post._id)}
              className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 bg-red-50 text-red-600 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-red-100 transition-all duration-200 font-medium border border-red-200 text-xs sm:text-sm"
            >
              <svg
                className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const EditModal = ({ post, onClose, onUpdate }) => {
  const [editedPost, setEditedPost] = useState(post);
  const {
    species: allSpecies,
    breeds,
    loading: isLoadingBreeds,
    getSpecies,
    getBreeds,
  } = useSpecies();
  const [loading, setLoading] = useState(false);
  const Swal = useSwal();
  const modalRef = useRef(null);

  useEffect(() => {
    getSpecies(); // Fetch all species for the dropdown
  }, [getSpecies]);

  useEffect(() => {
    if (editedPost.species) {
      getBreeds(editedPost.species);
    }
  }, [editedPost.species, getBreeds]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPost((prev) => ({
      ...prev,
      [name]: value,
      // Reset breed when species changes
      ...(name === "species" && { category: "" }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!editedPost.species || !editedPost.category) {
        throw new Error("Species and breed are required");
      }

      if (
        editedPost.type === "paid" &&
        (!editedPost.amount || editedPost.amount <= 0)
      ) {
        throw new Error("Please enter a valid price");
      }

      await onUpdate(editedPost);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Your post has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      onClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message || "Failed to update post. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 flex justify-between items-center">
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
            </svg>
            Edit Post
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors duration-200"
            disabled={loading}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]"
        >
          <div className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={editedPost.title}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                placeholder="Enter pet title"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="discription"
                value={editedPost.discription}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none resize-none"
                placeholder="Describe your pet..."
                required
              ></textarea>
            </div>

            {/* Species and Breed Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Species */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Species <span className="text-red-500">*</span>
                </label>
                <select
                  name="species"
                  value={editedPost.species}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
                  required
                >
                  <option value="">Select Species</option>
                  {allSpecies.map((s) => (
                    <option key={s._id} value={s.name}>
                      {s.displayName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Breed */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Breed <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={editedPost.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
                  required
                  disabled={isLoadingBreeds || !editedPost.species}
                >
                  <option value="">Select Breed</option>
                  {isLoadingBreeds ? (
                    <option disabled>Loading...</option>
                  ) : (
                    breeds.map((breed) => (
                      <option key={breed._id} value={breed.name}>
                        {breed.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>

            {/* Type and Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  value={editedPost.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
                  required
                >
                  <option value="free">Free (Adoption)</option>
                  <option value="paid">Paid (For Sale)</option>
                </select>
              </div>

              {/* Price */}
              {editedPost.type === "paid" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={editedPost.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none"
                    placeholder="Enter price"
                    min="1"
                    required
                  />
                </div>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={editedPost.status}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none appearance-none bg-white cursor-pointer"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-600 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
                Update Post
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Add these animations to your CSS
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}

.animate-slideUp {
  animation: slideUp 0.3s ease-out;
}
`;

const LoadingSkeleton = () => (
  <div className="container mx-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-lg overflow-hidden"
        >
          <div className="h-48 bg-gray-300 animate-pulse"></div>
          <div className="p-4">
            <div className="h-6 bg-gray-300 rounded w-3/4 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-full mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmptyState = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center max-w-lg mx-auto h-full">
      {/* SVG Illustration Container */}
      <div className="relative mb-8 w-44 h-44 bg-[#FFF9E6] border-4 border-black rounded-full flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <svg viewBox="0 0 100 100" className="w-28 h-28 text-stone-800 animate-bounce" style={{ animationDuration: '3s' }}>
          {/* Ears */}
          <path d="M25,30 Q15,10 35,20 Z" fill="#FCD34D" stroke="black" strokeWidth="3" strokeLinejoin="round" />
          <path d="M75,30 Q85,10 65,20 Z" fill="#FCD34D" stroke="black" strokeWidth="3" strokeLinejoin="round" />
          
          {/* Face/Head */}
          <circle cx="50" cy="50" r="30" fill="white" stroke="black" strokeWidth="3" />
          
          {/* Eye Patches */}
          <ellipse cx="40" cy="45" rx="8" ry="10" fill="#E7E5E4" />
          
          {/* Eyes */}
          <circle cx="40" cy="45" r="4" fill="black" />
          <circle cx="60" cy="45" r="4" fill="black" />
          
          {/* Snout */}
          <ellipse cx="50" cy="60" rx="14" ry="10" fill="#FDE047" stroke="black" strokeWidth="3" />
          
          {/* Nose */}
          <polygon points="45,55 55,55 50,62" fill="black" stroke="black" strokeWidth="1" strokeLinejoin="round" />
          
          {/* Mouth */}
          <path d="M47,65 Q50,68 53,65" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" />
        </svg>
        
        {/* Playful Floating Badges */}
        <div className="absolute -top-2 -right-4 bg-[#10B981] text-white border-2 border-black px-2.5 py-1 rounded-lg font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rotate-6">
          Hello! 🐾
        </div>
        <div className="absolute -bottom-2 -left-6 bg-[#FCD34D] text-black border-2 border-black px-2.5 py-1 rounded-lg font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -rotate-6">
          Woof!
        </div>
      </div>

      {/* Text Content */}
      <h2 className="text-3xl font-black font-serif text-gray-900 mb-3 tracking-tight">
        No Listings <span className="underline decoration-4 decoration-[#FCD34D] underline-offset-4">Found</span>
      </h2>
      <p className="text-gray-500 font-semibold text-sm mb-8 leading-relaxed max-w-sm">
        Your pet shelf is looking a bit lonely. Share a listing and find a loving companion today!
      </p>

      {/* Neubrutalist Button */}
      <button
        onClick={() => navigate("/create-post")}
        className="group relative px-8 py-4 bg-[#10B981] text-white font-black rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all flex items-center gap-3 text-lg cursor-pointer animate-pulse"
      >
        <span>Create Your First Listing</span>
        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  );
};

export default UserPosts;
