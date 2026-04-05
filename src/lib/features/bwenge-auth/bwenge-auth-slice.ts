import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";
import Cookies from "js-cookie";

interface CPDUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  profile_picture_url?: string;
  bio?: string;
  account_type: string;
  cpd_role: "LEARNER" | "INSTRUCTOR" | "CONTENT_CREATOR" | "ADMIN";
  enrolled_courses_count: number;
  completed_courses_count: number;
  total_learning_hours: number;
  achievements?: string[];
  learning_preferences?: any;
  profile?: any;
}

interface CPDAuthState {
  token: string | null;
  user: CPDUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  ssoInitialized: boolean;
}

const parseCookieJSON = (cookieValue: string | undefined): any => {
  if (!cookieValue) return null;
  try {
    return JSON.parse(cookieValue);
  } catch (error) {
    return null;
  }
};

const initialState: CPDAuthState = {
  token: Cookies.get("cpd_token") || null,
  user: parseCookieJSON(Cookies.get("cpd_user")),
  isAuthenticated: !!Cookies.get("cpd_token"),
  isLoading: false,
  error: null,
  ssoInitialized: false,
};

// ==================== LOGIN WITH EMAIL/PASSWORD ====================
export const loginCPD = createAsyncThunk(
  "cpdAuth/login",
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", credentials);

      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// ==================== CONSUME SSO TOKEN FROM ONGERA ====================
export const consumeSSOToken = createAsyncThunk(
  "cpdAuth/consumeSSOToken",
  async (ssoToken: string, { rejectWithValue }) => {
    try {
      
      const response = await api.post("/auth/sso/consume", {
        sso_token: ssoToken,
      });


      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "SSO authentication failed"
      );
    }
  }
);

// ==================== GET PROFILE ====================
export const fetchCPDProfile = createAsyncThunk(
  "cpdAuth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/profile");

      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// ==================== LOGOUT ====================
export const logoutCPD = createAsyncThunk(
  "cpdAuth/logout",
  async (crossSystem: boolean = false, { rejectWithValue }) => {
    try {
      await api.post(`/auth/logout?cross_system=${crossSystem}`);
      return { crossSystem };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

const cpdAuthSlice = createSlice({
  name: "cpdAuth",
  initialState,
  reducers: {
    clearCPDError: (state) => {
      state.error = null;
    },
    setSSOInitialized: (state, action) => {
      state.ssoInitialized = action.payload;
    },
    clearCPDAuth: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.ssoInitialized = false;
      Cookies.remove("cpd_token");
      Cookies.remove("cpd_user");
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== LOGIN ====================
      .addCase(loginCPD.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginCPD.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        
        Cookies.set("cpd_token", action.payload.token, { expires: 7 });
        Cookies.set("cpd_user", JSON.stringify(action.payload.user), { expires: 7 });
      })
      .addCase(loginCPD.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ==================== SSO TOKEN CONSUMPTION ====================
      .addCase(consumeSSOToken.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(consumeSSOToken.fulfilled, (state, action) => {
        
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.ssoInitialized = true;
        
        Cookies.set("cpd_token", action.payload.token, { expires: 7 });
        Cookies.set("cpd_user", JSON.stringify(action.payload.user), { expires: 7 });
      })
      .addCase(consumeSSOToken.rejected, (state, action) => {
        
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ==================== FETCH PROFILE ====================
      .addCase(fetchCPDProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCPDProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        Cookies.set("cpd_user", JSON.stringify(action.payload), { expires: 7 });
      })
      .addCase(fetchCPDProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ==================== LOGOUT ====================
      .addCase(logoutCPD.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutCPD.fulfilled, (state) => {
        state.isLoading = false;
        state.token = null;
        state.user = null;
        state.isAuthenticated = false;
        state.ssoInitialized = false;
        
        Cookies.remove("cpd_token");
        Cookies.remove("cpd_user");
      })
      .addCase(logoutCPD.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCPDError, setSSOInitialized, clearCPDAuth } = cpdAuthSlice.actions;
export default cpdAuthSlice.reducer;