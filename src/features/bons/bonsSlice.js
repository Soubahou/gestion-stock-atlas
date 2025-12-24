import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import { fetchBonsAPI, createBonAPI, deleteBonAPI } from "./bonsService";

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

const bonsSlice = createSlice({
  name: "bons",
  initialState: {
    items: [],
    loading: false,
    error: null,
    filters: {
      type: "",
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

const parseBonDate = (dateStr) => {
  if (!dateStr) return new Date(0);
  if (typeof dateStr === 'number' || !isNaN(dateStr)) {
    return new Date(dateStr);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return new Date(dateStr);
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
  }
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) {
    const [day, month, year] = dateStr.split('-');
    return new Date(year, month - 1, day);
  }
  return new Date(dateStr);
};

export const selectAllBons = (state) => {
  return [...state.bons.items].sort((a, b) => {
    const dateA = parseBonDate(a.date);
    const dateB = parseBonDate(b.date);
    return dateB - dateA;
  });
};

export const selectFilteredBons = createSelector(
  [selectAllBons, (state) => state.bons.filters.type],
  (sortedBons, typeFilter) => {
    if (!typeFilter) return sortedBons;
    return sortedBons.filter((b) => b.type === typeFilter);
  }
);

export const selectBonsStats = (state) => {
  const items = state.bons.items;
  const totalBons = items.length;
  const totalEntree = items.filter((b) => b.type === "ENTREE").length;
  const totalSortie = items.filter((b) => b.type === "SORTIE").length;
  const totalArticles = items.reduce(
    (acc, b) => acc + b.articles.length,
    0
  );
  return { totalBons, totalEntree, totalSortie, totalArticles };
};

const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const normalizeBonDate = (bonDate) => {
  const parsedDate = parseBonDate(bonDate);
  return formatDateToYYYYMMDD(parsedDate);
};

export const selectBonsByDay = (state) => {
  const today = new Date();
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    last7Days.push({
      dateObj: date,
      dateStr: formatDateToYYYYMMDD(date),
      displayDate: date.toLocaleDateString('fr-FR', { 
        weekday: 'short', 
        day: '2-digit', 
        month: '2-digit' 
      })
    });
  }
  return last7Days.map(day => {
    const bonsForDay = state.bons.items.filter(bon => {
      const bonDate = normalizeBonDate(bon.date);
      return bonDate === day.dateStr;
    });
    const entrees = bonsForDay
      .filter(b => b.type === 'ENTREE')
      .reduce((sum, b) => sum + b.articles.reduce((s, a) => s + a.quantity, 0), 0);
    const sorties = bonsForDay
      .filter(b => b.type === 'SORTIE')
      .reduce((sum, b) => sum + b.articles.reduce((s, a) => s + a.quantity, 0), 0);
    return { 
      date: day.displayDate, 
      fullDate: day.dateStr,
      dateObj: day.dateObj,
      entrees, 
      sorties,
      totalBons: bonsForDay.length
    };
  });
};

export const selectRecentBons = createSelector(
  [selectAllBons],
  (sortedBons) => sortedBons.slice(0, 5)
);

export const { clearBonError, setFilters } = bonsSlice.actions;
export default bonsSlice.reducer;