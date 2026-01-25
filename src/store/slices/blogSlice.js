import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiService from "../../utils/apiService";

const initialState = {
  list: [],
  status: "idle",
  error: null,
  pagination: null,
  detail: null,
  detailStatus: "idle",
  detailError: null,
};

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async ({ page = 1, limit = 12 } = {}, { rejectWithValue }) => {
    try {
      const res = await apiService.get("/api/blogs", { page, limit });
      const payload = res?.data || {};
      return {
        list: Array.isArray(payload.data) ? payload.data : [],
        pagination: payload?.meta?.pagination || null,
      };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

export const fetchBlogBySlug = createAsyncThunk(
  "blogs/fetchBlogBySlug",
  async ({ slug }, { rejectWithValue }) => {
    try {
      // Require authentication before allowing full blog content access
      try {
        await apiService.get("/api/auth/verify-token");
      } catch (authErr) {
        return rejectWithValue("Authentication required to read full article");
      }

      const res = await apiService.get(`/api/blogs/${slug}`);
      const payload = res?.data || {};
      if (!payload?.data) {
        return rejectWithValue("Blog not found");
      }
      return payload.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // List
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.list;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Failed to load blogs";
      })
      // Detail
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.detail = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.detail = action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload || "Failed to load blog";
      });
  },
});

export default blogSlice.reducer;
