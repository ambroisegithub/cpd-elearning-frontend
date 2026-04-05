import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

// ==================== TYPES ====================

export interface Article {
  id: string;
  title: string;
  slug: string;
  cover_image_url?: string;
  abstract: string;
  manuscript: string;
  author_name?: string;
  category?: string;
  status: "draft" | "published";
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface Protocol {
  id: string;
  title: string;
  slug: string;
  cover_image_url?: string;
  content: string;
  version?: string;
  category?: string;
  status: "draft" | "published";
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface Guideline {
  id: string;
  title: string;
  slug: string;
  content: string;
  category?: string;
  status: "draft" | "published";
  published_at?: string;
  created_at: string;
  updated_at: string;
  created_by?: string;
  creator?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface PublicationsState {
  // Articles
  articles: Article[];
  selectedArticle: Article | null;
  articlesPagination: PaginationData;
  
  // Protocols
  protocols: Protocol[];
  selectedProtocol: Protocol | null;
  protocolsPagination: PaginationData;
  
  // Guidelines
  guidelines: Guideline[];
  selectedGuideline: Guideline | null;
  guidelinesPagination: PaginationData;
  
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

const initialState: PublicationsState = {
  articles: [],
  selectedArticle: null,
  articlesPagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
  protocols: [],
  selectedProtocol: null,
  protocolsPagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
  guidelines: [],
  selectedGuideline: null,
  guidelinesPagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
  isLoading: false,
  isSubmitting: false,
  error: null,
};

// ==================== ARTICLES THUNKS ====================

// Public
export const fetchPublicArticles = createAsyncThunk(
  "publications/fetchPublicArticles",
  async (params: { page?: number; limit?: number; search?: string; category?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get("/publications/articles", { params });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch articles");
    }
  }
);

export const fetchArticleBySlug = createAsyncThunk(
  "publications/fetchArticleBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/publications/articles/${slug}`);
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Article not found");
    }
  }
);

// Admin
export const adminFetchArticles = createAsyncThunk(
  "publications/adminFetchArticles",
  async (params: { page?: number; limit?: number; search?: string; status?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/publications/articles", { params });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch articles");
    }
  }
);

export const adminFetchArticleById = createAsyncThunk(
  "publications/adminFetchArticleById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/publications/articles/${id}`);
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch article");
    }
  }
);

export const createArticle = createAsyncThunk(
  "publications/createArticle",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/publications/articles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to create article");
    }
  }
);

export const updateArticle = createAsyncThunk(
  "publications/updateArticle",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/admin/publications/articles/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to update article");
    }
  }
);

export const deleteArticle = createAsyncThunk(
  "publications/deleteArticle",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/publications/articles/${id}`);
      return id;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to delete article");
    }
  }
);

// ==================== PROTOCOLS THUNKS ====================

// Public
export const fetchPublicProtocols = createAsyncThunk(
  "publications/fetchPublicProtocols",
  async (params: { page?: number; limit?: number; search?: string; category?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get("/publications/protocols", { params });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch protocols");
    }
  }
);

export const fetchProtocolBySlug = createAsyncThunk(
  "publications/fetchProtocolBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/publications/protocols/${slug}`);
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Protocol not found");
    }
  }
);

// Admin
export const adminFetchProtocols = createAsyncThunk(
  "publications/adminFetchProtocols",
  async (params: { page?: number; limit?: number; search?: string; status?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/publications/protocols", { params });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch protocols");
    }
  }
);

export const adminFetchProtocolById = createAsyncThunk(
  "publications/adminFetchProtocolById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/publications/protocols/${id}`);
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch protocol");
    }
  }
);

export const createProtocol = createAsyncThunk(
  "publications/createProtocol",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/publications/protocols", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to create protocol");
    }
  }
);

export const updateProtocol = createAsyncThunk(
  "publications/updateProtocol",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/admin/publications/protocols/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to update protocol");
    }
  }
);

export const deleteProtocol = createAsyncThunk(
  "publications/deleteProtocol",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/publications/protocols/${id}`);
      return id;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to delete protocol");
    }
  }
);

// ==================== GUIDELINES THUNKS ====================

// Public
export const fetchPublicGuidelines = createAsyncThunk(
  "publications/fetchPublicGuidelines",
  async (params: { page?: number; limit?: number; search?: string; category?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get("/publications/guidelines", { params });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch guidelines");
    }
  }
);

export const fetchGuidelineBySlug = createAsyncThunk(
  "publications/fetchGuidelineBySlug",
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/publications/guidelines/${slug}`);
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Guideline not found");
    }
  }
);

// Admin
export const adminFetchGuidelines = createAsyncThunk(
  "publications/adminFetchGuidelines",
  async (params: { page?: number; limit?: number; search?: string; status?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/publications/guidelines", { params });
      return res.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch guidelines");
    }
  }
);

export const adminFetchGuidelineById = createAsyncThunk(
  "publications/adminFetchGuidelineById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/admin/publications/guidelines/${id}`);
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch guideline");
    }
  }
);

export const createGuideline = createAsyncThunk(
  "publications/createGuideline",
  async (data: { title: string; content: string; category?: string; status: string }, { rejectWithValue }) => {
    try {
      const res = await api.post("/admin/publications/guidelines", data);
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to create guideline");
    }
  }
);

export const updateGuideline = createAsyncThunk(
  "publications/updateGuideline",
  async ({ id, data }: { id: string; data: { title?: string; content?: string; category?: string; status?: string } }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/admin/publications/guidelines/${id}`, data);
      return res.data.data;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to update guideline");
    }
  }
);

export const deleteGuideline = createAsyncThunk(
  "publications/deleteGuideline",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/publications/guidelines/${id}`);
      return id;
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to delete guideline");
    }
  }
);

// ==================== SLICE ====================

const publicationsSlice = createSlice({
  name: "publications",
  initialState,
  reducers: {
    clearSelectedArticle: (state) => {
      state.selectedArticle = null;
    },
    clearSelectedProtocol: (state) => {
      state.selectedProtocol = null;
    },
    clearSelectedGuideline: (state) => {
      state.selectedGuideline = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== ARTICLES ====================
      // Fetch Public Articles
      .addCase(fetchPublicArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data;
        state.articlesPagination = action.payload.pagination;
      })
      .addCase(fetchPublicArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Article By Slug
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedArticle = action.payload;
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Admin Fetch Articles
      .addCase(adminFetchArticles.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminFetchArticles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.articles = action.payload.data;
        state.articlesPagination = action.payload.pagination;
      })
      .addCase(adminFetchArticles.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Admin Fetch Article By ID
      .addCase(adminFetchArticleById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminFetchArticleById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedArticle = action.payload;
      })
      .addCase(adminFetchArticleById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Article
      .addCase(createArticle.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.articles.unshift(action.payload);
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      
      // Update Article
      .addCase(updateArticle.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.articles.findIndex(a => a.id === action.payload.id);
        if (index !== -1) state.articles[index] = action.payload;
        if (state.selectedArticle?.id === action.payload.id) state.selectedArticle = action.payload;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      
      // Delete Article
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.articles = state.articles.filter(a => a.id !== action.payload);
      })
      
      // ==================== PROTOCOLS ====================
      // Fetch Public Protocols
      .addCase(fetchPublicProtocols.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicProtocols.fulfilled, (state, action) => {
        state.isLoading = false;
        state.protocols = action.payload.data;
        state.protocolsPagination = action.payload.pagination;
      })
      .addCase(fetchPublicProtocols.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Protocol By Slug
      .addCase(fetchProtocolBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProtocolBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProtocol = action.payload;
      })
      .addCase(fetchProtocolBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Admin Fetch Protocols
      .addCase(adminFetchProtocols.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminFetchProtocols.fulfilled, (state, action) => {
        state.isLoading = false;
        state.protocols = action.payload.data;
        state.protocolsPagination = action.payload.pagination;
      })
      .addCase(adminFetchProtocols.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Admin Fetch Protocol By ID
      .addCase(adminFetchProtocolById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminFetchProtocolById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProtocol = action.payload;
      })
      .addCase(adminFetchProtocolById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Protocol
      .addCase(createProtocol.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createProtocol.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.protocols.unshift(action.payload);
      })
      .addCase(createProtocol.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      
      // Update Protocol
      .addCase(updateProtocol.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateProtocol.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.protocols.findIndex(p => p.id === action.payload.id);
        if (index !== -1) state.protocols[index] = action.payload;
        if (state.selectedProtocol?.id === action.payload.id) state.selectedProtocol = action.payload;
      })
      .addCase(updateProtocol.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      
      // Delete Protocol
      .addCase(deleteProtocol.fulfilled, (state, action) => {
        state.protocols = state.protocols.filter(p => p.id !== action.payload);
      })
      
      // ==================== GUIDELINES ====================
      // Fetch Public Guidelines
      .addCase(fetchPublicGuidelines.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicGuidelines.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guidelines = action.payload.data;
        state.guidelinesPagination = action.payload.pagination;
      })
      .addCase(fetchPublicGuidelines.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Guideline By Slug
      .addCase(fetchGuidelineBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuidelineBySlug.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedGuideline = action.payload;
      })
      .addCase(fetchGuidelineBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Admin Fetch Guidelines
      .addCase(adminFetchGuidelines.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminFetchGuidelines.fulfilled, (state, action) => {
        state.isLoading = false;
        state.guidelines = action.payload.data;
        state.guidelinesPagination = action.payload.pagination;
      })
      .addCase(adminFetchGuidelines.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Admin Fetch Guideline By ID
      .addCase(adminFetchGuidelineById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminFetchGuidelineById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedGuideline = action.payload;
      })
      .addCase(adminFetchGuidelineById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Guideline
      .addCase(createGuideline.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(createGuideline.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.guidelines.unshift(action.payload);
      })
      .addCase(createGuideline.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      
      // Update Guideline
      .addCase(updateGuideline.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(updateGuideline.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const index = state.guidelines.findIndex(g => g.id === action.payload.id);
        if (index !== -1) state.guidelines[index] = action.payload;
        if (state.selectedGuideline?.id === action.payload.id) state.selectedGuideline = action.payload;
      })
      .addCase(updateGuideline.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })
      
      // Delete Guideline
      .addCase(deleteGuideline.fulfilled, (state, action) => {
        state.guidelines = state.guidelines.filter(g => g.id !== action.payload);
      });
  },
});

export const {
  clearSelectedArticle,
  clearSelectedProtocol,
  clearSelectedGuideline,
  clearError,
} = publicationsSlice.actions;

export default publicationsSlice.reducer;