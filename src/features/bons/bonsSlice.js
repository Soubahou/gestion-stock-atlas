import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchBonsAPI, createBonAPI, deleteBonAPI } from "./bonsService";

/* =========================
   THUNKS
========================= */

export const fetchBons = createAsyncThunk(
  "bons/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await fetchBonsAPI();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const createBon = createAsyncThunk(
  "bons/create",
  async (bon, thunkAPI) => {
    try {
      return await createBonAPI(bon);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const deleteBon = createAsyncThunk(
  "bons/delete",
  async (id, thunkAPI) => {
    try {
      await deleteBonAPI(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/* =========================
   SLICE
========================= */

const bonsSlice = createSlice({
  name: "bons",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      type: "", // ENTREE / SORTIE / ""
    },
  },
  reducers: {
    clearBonError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchBons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBons.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchBons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* CREATE */
      .addCase(createBon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBon.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createBon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* DELETE */
      .addCase(deleteBon.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBon.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter((b) => b.id !== action.payload);
      })
      .addCase(deleteBon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/* =========================
   SELECTORS
========================= */

export const selectFilteredBons = (state) => {
  const { type } = state.bons.filters;
  return type
    ? state.bons.items.filter((b) => b.type === type)
    : state.bons.items;
};

export const selectBonsStats = (state) => {
  const totalBons = state.bons.items.length;
  const totalEntree = state.bons.items.filter((b) => b.type === "ENTREE").length;
  const totalSortie = state.bons.items.filter((b) => b.type === "SORTIE").length;
  const totalArticles = state.bons.items.reduce(
    (acc, b) => acc + b.articles.length,
    0
  );

  return { totalBons, totalEntree, totalSortie, totalArticles };
};

export const { clearBonError, setFilters } = bonsSlice.actions;
export default bonsSlice.reducer;
