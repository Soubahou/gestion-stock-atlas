import { configureStore } from '@reduxjs/toolkit';
import articlesReducer from '../features/articles/articlesSlice';
import mouvementsReducer from '../features/mouvements/mouvementsSlice';

export const store = configureStore({
  reducer: {
    articles: articlesReducer,
    mouvements: mouvementsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});