import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiService from "@utils/apiService";
import { POST } from "../../Consts/apikeys";

// Initial state
const initialState = {
  posts: [],
  post: null,
  loading: false,
  error: null,
  pageInfo: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    limit: 12,
  },
  filters: {
    species: "",
    breed: "",
    type: "",
    minPrice: "0",
    maxPrice: "100000",
    sortBy: "newest",
    page: 1,
    // Location Filters
    nearMe: false,
    locationId: "",
    latitude: null,
    longitude: null,
    maxDistance: "50",
    city: "",
  },
  viewMode: "grid",
};

// Async thunks
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (params, { rejectWithValue, signal }) => {
    try {
      const response = await apiService.get(
        POST.Filter,
        params, // 2nd arg: The filters (species, breed, etc.)
        { signal } // 3rd arg: Options (AbortSignal)
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch posts");
      }

      return {
        posts: response.data.data || [],
        pageInfo: {
          currentPage: response.data.meta?.pagination?.page || 1,
          totalPages: response.data.meta?.pagination?.totalPages || 1,
          totalPosts: response.data.meta?.pagination?.total || 0,
          limit: response.data.meta?.pagination?.limit || 12,
        },
      };
    } catch (error) {
      if (apiService.isCancel(error)) {
        throw error;
      }
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch posts"
      );
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async ({ page = 1, limit = 6 } = {}, { rejectWithValue }) => {
    try {
      const response = await apiService.get(
        `${POST.GetUserPosts}?page=${page}&limit=${limit}`
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch user posts");
      }

      return {
        posts: response.data.data || [],
        pageInfo: {
          currentPage: response.data.meta?.pagination?.page || 1,
          totalPages: response.data.meta?.pagination?.totalPages || 1,
          totalPosts: response.data.meta?.pagination?.total || 0,
          limit: response.data.meta?.pagination?.limit || 6,
        },
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch user posts"
      );
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await apiService.post(POST.Create, postData);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to create post");
      }

      return response.data.post;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create post"
      );
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ id, postData }, { rejectWithValue }) => {
    try {
      const response = await apiService.put(POST.Update(id), postData);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update post");
      }

      return response.data.post;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update post"
      );
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.delete(POST.Delete(id));

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete post");
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete post"
      );
    }
  }
);

export const fetchPostById = createAsyncThunk(
  "posts/fetchPostById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiService.get(POST.GetPostById(id));

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch post");
      }

      return response.data.post;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch post"
      );
    }
  }
);

// Utility function to sort posts
const sortPosts = (posts, sortBy) => {
  const sorted = [...posts];
  switch (sortBy) {
    case "newest":
      return sorted.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    case "oldest":
      return sorted.sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );
    case "price-low":
      return sorted.sort((a, b) => (a.amount || 0) - (b.amount || 0));
    case "price-high":
      return sorted.sort((a, b) => (b.amount || 0) - (a.amount || 0));
    case "title-az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "title-za":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted;
  }
};

// Slice
const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        species: "",
        breed: "",
        type: "",
        minPrice: "0",
        maxPrice: "100000",
        sortBy: "newest",
        page: 1,
        nearMe: false,
        locationId: "",
        latitude: null,
        longitude: null,
        maxDistance: "50",
        city: "",
      };
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
      state.posts = sortPosts(state.posts, action.payload);
    },
    setCurrentPage: (state, action) => {
      state.filters.page = action.payload;
      state.pageInfo.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageInfo.limit = action.payload;
      state.filters.page = 1; // Reset to first page when changing page size
      state.pageInfo.currentPage = 1;
    },
    clearPosts: (state) => {
      state.posts = [];
      state.pageInfo = {
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        limit: 12,
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pageInfo = action.payload.pageInfo;
        state.error = null;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch posts";
      })

      // Fetch User Posts
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
        state.pageInfo = action.payload.pageInfo;
        state.error = null;
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch user posts";
      })

      // Create Post
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload); // Add new post to the beginning
        state.pageInfo.totalPosts += 1;
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create post";
      })

      // Update Post
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update post";
      })

      // Delete Post
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.pageInfo.totalPosts -= 1;
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete post";
      })

      // Fetch Post By ID
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        // Update the post in the list if it exists
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch post";
      });
  },
});

// Export actions
export const {
  setFilters,
  clearFilters,
  setViewMode,
  setSortBy,
  setCurrentPage,
  setPageSize,
  clearPosts,
  clearError,
} = postSlice.actions;

// Selectors
export const selectPosts = (state) => state.posts.posts;
export const selectPostsLoading = (state) => state.posts.loading;
export const selectPostsError = (state) => state.posts.error;
export const selectPageInfo = (state) => state.posts.pageInfo;
export const selectFilters = (state) => state.posts.filters;
export const selectViewMode = (state) => state.posts.viewMode;
export const selectPostById = (id) => (state) =>
  state.posts.posts.find((post) => post._id === id) || state.posts.post;

// Export reducer
export default postSlice.reducer;
