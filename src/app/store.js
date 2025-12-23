import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from '../features/articles/articlesSlice';
import bonsReducer from "../features/bons/bonsSlice";

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    bons: bonsReducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});