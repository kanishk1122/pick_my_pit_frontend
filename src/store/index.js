import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import postReducer from "./slices/postSlice";
import speciesReducer from "./slices/speciesSlice";
import addressReducer from "./slices/addressSlice";
import userReducer from "./slices/userSlice";
import breedReducer from "./slices/breedSlice";
import allSpeciesReducer from "./slices/allSpeciesSlice";
import blogReducer from "./slices/blogSlice";

// Configure the store
export const store = configureStore({
  reducer: {
    posts: postReducer,
    species: speciesReducer,
    addresses: addressReducer,
    user: userReducer,
    breeds: breedReducer,
    allSpecies: allSpeciesReducer,
    blogs: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "posts/fetchPosts/pending",
          "posts/fetchPosts/fulfilled",
        ],
        // Ignore these field paths in all actions
        ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
        // Ignore these paths in the state
        ignoredPaths: ["posts.timestamp"],
      },
    }),
  devTools: import.meta.env.DEV,
});

// Export types for TypeScript (optional)
export const RootState = store.getState;
export const AppDispatch = store.dispatch;

// Typed hooks for use throughout the app
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export default store;
