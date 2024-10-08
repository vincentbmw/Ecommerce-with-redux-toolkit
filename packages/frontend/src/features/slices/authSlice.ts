import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type {
  UserResponse,
  LoginRequest,
  LogOutResponse,
  AuthState,
  RegisterResponse,
  RegisterRequest,
} from "./types";
import type { RootState } from "../../store";

const API_URL = "http://127.0.0.1:4040/api";

export const login = createAsyncThunk<UserResponse, LoginRequest, { rejectValue: any }>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:4040/api/auth/login", credentials, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.error || "Something went wrong",
        });
      } else {
        return rejectWithValue({
          status: 500,
          message: "Unknown server error",
        });
      }
    }
  }
);

export const logout = createAsyncThunk<LogOutResponse>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to logout");
    }
  }
);

export const register = createAsyncThunk<RegisterResponse, RegisterRequest, { rejectValue: any }>(
  "auth/register",
  async (info, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, info, {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status) {
        return rejectWithValue({
          status: error.response.status,
          message: error.response.data.message || "Registration failed",
        });
      } else {
        return rejectWithValue({
          status: 500,
          message: "Internal Server Error",
        });
      }
    }
  }
);

export const fetchUserProfile = createAsyncThunk<UserResponse>(
  "auth/fetchUserProfile",
  async (_, { getState, rejectWithValue }) => {
    const state = getState() as RootState;
    const token = state.auth.token;

    if (!token) {
      return rejectWithValue("No token found. Please login.");
    }

    try {
      const response = await axios.get(`${API_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
    }
  }
);

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    refreshAuthentication: (state) => {
      const isAuthenticated = sessionStorage.getItem("isAuthenticated");
      if (isAuthenticated === "true") {
        const userSession = sessionStorage.getItem("user");
        const response: UserResponse = JSON.parse(
          userSession as string
        ) as UserResponse;
        state.token = response.token;
        state.user = {
          username: response.username,
          id: response.userId,
          email: response.email,
          role: response.role,
        };
      }
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action: PayloadAction<UserResponse>) => {
      state.token = action.payload.token;
      state.user = {
        id: action.payload.userId,
        username: action.payload.username,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.status = "succeeded";
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("user", JSON.stringify(action.payload));
    });
    builder.addCase(login.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.token = null;
      state.user = null;
      state.status = "succeeded";
      sessionStorage.removeItem("isAuthenticated");
      sessionStorage.removeItem("user");
    });
    builder.addCase(logout.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(register.fulfilled, (state) => {
      state.status = "succeeded";
    });
    builder.addCase(register.rejected, (state) => {
      state.status = "failed";
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action: PayloadAction<UserResponse>) => {
      state.user = {
        id: action.payload.userId,
        username: action.payload.username,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.status = "succeeded";
    });
    builder.addCase(fetchUserProfile.rejected, (state) => {
      state.status = "failed";
    });
  },
});

export default authSlice.reducer;
export const { refreshAuthentication } = authSlice.actions;
