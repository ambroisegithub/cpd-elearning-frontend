import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface DashboardSummary {
  users: { total: number; new_last_7_days: number };
  institutions: { total: number; new_last_7_days: number };
  standalone_courses: { total: number; public: number; private: number };
  pending_applications: { total: number };
  pending_enrollment_requests: { total: number };
  recent_activity: {
    new_users: number;
    new_enrollments: number;
    new_courses: number;
    new_institutions: number;
    activity_list: Array<{
      id: string;
      type: string;
      first_name?: string;
      last_name?: string;
      email?: string;
      title?: string;
      course_title?: string;
      timestamp: string;
    }>;
  };
  timestamp: string;
}

interface DashboardState {
  summary: DashboardSummary | null;
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;
}

const initialState: DashboardState = {
  summary: null,
  isLoading: false,
  error: null,
  lastFetched: null,
};

export const fetchDashboardSummary = createAsyncThunk(
  "admin/dashboard/fetchSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/admin/dashboard/summary");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard data"
      );
    }
  }
);

const dashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    clearDashboard: (state) => {
      state.summary = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;