import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from "../../store";
import { AddUserResponse, AddUserRequest, DeleteUserResponse, User, EditUserRequest } from "./types";
import axios from 'axios';

const API_URL = "http://127.0.0.1:4040/api/admin";

interface AdminState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdminState = {
  users: [],
  status: 'idle',
  error: null,
};

export const addUser = createAsyncThunk('admin/addUser', async (userData: AddUserRequest, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;

  if (!user) {
    throw new Error('Login First as an Admin');
  }
  if (user?.role !== 'admin') {
    throw new Error('Access denied. Only admins can add users.');
  }

  try {
    const tokenData = sessionStorage.getItem('user');
    let token = null;

    if (tokenData) {
      const parsedUser = JSON.parse(tokenData);
      token = parsedUser?.token;
    }

    if (!token) {
      throw new Error('No token found. Please login again.');
    }
    const response = await axios.post<AddUserResponse>(`${API_URL}/user/add`, userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to add user');
    }
    throw error;
  }
});

export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId: number, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;

  if (!user) {
    throw new Error('Login First as an Admin');
  }
  if (user?.role !== 'admin') {
    throw new Error('Access denied. Only admins can delete users.');
  }

  try {
    const tokenData = sessionStorage.getItem('user');
    let token = null;

    if (tokenData) {
      const parsedUser = JSON.parse(tokenData);
      token = parsedUser?.token;
    }

    if (!token) {
      throw new Error('No token found. Please login again.');
    }
    const response = await axios.delete<DeleteUserResponse>(`${API_URL}/user/delete/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
    throw error;
  }
});

export const getUsers = createAsyncThunk('admin/getUsers', async (_, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;

  if (!user) {
    throw new Error('Login First as an Admin');
  }
  if (user.role !== 'admin') {
    throw new Error('Access denied. Only admins can get users list.');
  }

  try {
    const tokenData = sessionStorage.getItem('user');
    let token = null;

    if (tokenData) {
      const parsedUser = JSON.parse(tokenData);
      token = parsedUser?.token;
    }

    if (!token) {
      throw new Error('No token found. Please login again.');
    }
    const response = await axios.get<{ users: User[] }>(`${API_URL}/users`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true,
    });

    return response.data.users;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to get users');
    }
    throw error;
  }
});

export const editUser = createAsyncThunk('admin/editUser', async ({ userId, userData }: { userId: number, userData: EditUserRequest }, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;

  if (!user) {
    throw new Error('Login First as an Admin');
  }
  if (user?.role !== 'admin') {
    throw new Error('Access denied. Only admins can edit users.');
  }

  try {
    const tokenData = sessionStorage.getItem('user');
    let token = null;

    if (tokenData) {
      const parsedUser = JSON.parse(tokenData);
      token = parsedUser?.token;
    }

    if (!token) {
      throw new Error('No token found. Please login again.');
    }
    const response = await axios.put<User>(`${API_URL}/edit-user/${userId}`, userData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to edit user');
    }
    throw error;
  }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(deleteUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = state.users.filter(user => user.id !== action.meta.arg);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(getUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(editUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(editUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(editUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      });
  },
});

export default adminSlice.reducer;