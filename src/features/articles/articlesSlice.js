import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { articlesService } from './articlesService';

export const fetchArticles = createAsyncThunk(
  'articles/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await articlesService.fetchArticles();
      return data;
    } catch (error) {
      console.log('Erreur:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchArticleById = createAsyncThunk(
  'articles/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await articlesService.fetchArticleById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createArticle = createAsyncThunk(
  'articles/create',
  async (articleData, { rejectWithValue }) => {
    try {
      const data = await articlesService.createArticle(articleData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateArticle = createAsyncThunk(
  'articles/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updatedArticle = await articlesService.updateArticle(id, data);
      return updatedArticle;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/delete',
  async (id, { rejectWithValue }) => {
    try {
      await articlesService.deleteArticle(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState: {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    lastFetch: null,
    filters: {
      search: '',
      category: '',
      stockAlert: false,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        search: '',
        category: '',
        stockAlert: false,
      };
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.lastFetch = new Date().toISOString();
        if (Array.isArray(action.payload)) {
          state.items = action.payload;
        } else {
          state.items = [action.payload].filter(Boolean);
        }
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.items = [];
      })
      .addCase(fetchArticleById.fulfilled, (state, action) => {
        state.currentItem = action.payload;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

export const selectAllArticles = (state) => {
  return state.articles.items || [];
};

export const selectArticleById = (state, articleId) => {
  const article = state.articles.items.find(item => item.id === articleId);
  return article;
};

export const selectFilteredArticles = (state) => {
  const { items, filters } = state.articles;
  if (!items || !Array.isArray(items)) {
    return [];
  }
  const filtered = items.filter(article => {
    if (!article) return false;
    const matchesSearch = !filters.search || 
      (article.nom && article.nom.toLowerCase().includes(filters.search.toLowerCase())) ||
      (article.reference && article.reference.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesCategory = !filters.category || article.categorie === filters.category;
    const matchesAlert = !filters.stockAlert || article.quantite <= article.seuilMin;
    return matchesSearch && matchesCategory && matchesAlert;
  });
  return filtered;
};

export const selectArticlesLoading = (state) => {
  return state.articles.loading;
};

export const selectArticlesError = (state) => state.articles.error;

export const selectArticlesStats = (state) => {
  const items = state.articles.items || [];
  const totalValue = items.reduce((sum, item) => {
    const qte = Number(item.quantite) || 0;
    const prix = Number(item.prixUnitaire) || 0;
    return sum + (qte * prix);
  }, 0);
  const alertCount = items.filter(item => 
    Number(item.quantite) <= Number(item.seuilMin)
  ).length;
  const lowStockCount = items.filter(item => 
    Number(item.quantite) <= (Number(item.seuilMin) * 0.5)
  ).length;
  const stats = {
    totalValue: totalValue.toFixed(2),
    alertCount,
    lowStockCount,
    totalItems: items.length,
  };
  return stats;
};

export const selectLastFetch = (state) => state.articles.lastFetch;

export const { 
  setFilters, 
  clearFilters, 
  clearCurrentItem, 
  clearError,
  addTestData 
} = articlesSlice.actions;

export default articlesSlice.reducer;