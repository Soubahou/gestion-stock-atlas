import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { mouvementsService } from "./mouvementsService";
import { fetchArticles} from '../articles/articlesSlice';

export const fetchMouvements = createAsyncThunk(
  "mouvements/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      return await mouvementsService.fetchMouvements();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createMouvement = createAsyncThunk(
  "mouvements/create",
  async (mouvementData, { rejectWithValue }) => {
    try {
      return await mouvementsService.createMouvement(mouvementData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMouvement = createAsyncThunk(
  "mouvements/delete",
  async (id, { rejectWithValue, dispatch }) => {
    try {
      await mouvementsService.deleteMouvement(id);
      
      dispatch(fetchArticles());
      
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const mouvementsSlice = createSlice({
  name: "mouvements",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      type: "",
      dateFrom: "",
      dateTo: "",
      articleId: "",
    },
  },
  reducers: {
    setMouvementFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearMouvementFilters: (state) => {
      state.filters = {
        type: "",
        dateFrom: "",
        dateTo: "",
        articleId: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMouvements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMouvements.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMouvements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createMouvement.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(deleteMouvement.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { setMouvementFilters, clearMouvementFilters } =
  mouvementsSlice.actions;

export const selectAllMouvements = (state) => state.mouvements.items;
export const selectFilteredMouvements = (state) => {
  const { items, filters } = state.mouvements;
  return items.filter((mouvement) => {
    const matchesType = !filters.type || mouvement.type === filters.type;
    const matchesDateFrom =
      !filters.dateFrom || mouvement.date >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || mouvement.date <= filters.dateTo;
    const matchesArticle =
      !filters.articleId || mouvement.articleId === parseInt(filters.articleId);

    return matchesType && matchesDateFrom && matchesDateTo && matchesArticle;
  });
};
export const selectMouvementsLoading = (state) => state.mouvements.loading;
export const selectMouvementsError = (state) => state.mouvements.error;
export const selectMouvementsStats = (state) => {
  const items = state.mouvements.items;
  const today = new Date().toISOString().split("T")[0];

  const mouvementsToday = items.filter((m) => m.date === today);
  const entréesToday = mouvementsToday.filter((m) => m.type === "entrée");
  const sortiesToday = mouvementsToday.filter((m) => m.type === "sortie");

  return {
    totalMouvements: items.length,
    mouvementsToday: mouvementsToday.length,
    entréesToday: entréesToday.length,
    sortiesToday: sortiesToday.length,
  };
};

export default mouvementsSlice.reducer;
