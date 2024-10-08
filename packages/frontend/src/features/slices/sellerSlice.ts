import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../../store';
import { Product } from './types';

const API_URL = "http://127.0.0.1:4040/api";

interface SellerState {
  products: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SellerState = {
  products: [],
  status: 'idle',
  error: null,
};

export const addProduct = createAsyncThunk(
  'seller/addProduct',
  async (productData: Partial<Product>, { getState, rejectWithValue }) => {
    try {
        const state = getState() as RootState;
        const { user } = state.auth;
        if (!user || user.role !== 'seller') {
            throw new Error('Unauthorized. Only sellers can add products.');
        }
        const tokenData = sessionStorage.getItem('user');
        let token = null;

        if (tokenData) {
            const parsedUser = JSON.parse(tokenData);
            token = parsedUser?.token;
        }
        
        const response = await axios.post(`${API_URL}/product/add/${user.id}`, productData, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            withCredentials: true,
        });
        return response.data.product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'seller/updateProduct',
  async ({ id, productData }: { id: number; productData: Partial<Product> }, { getState, rejectWithValue }) => {
    try {
      const tokenData = sessionStorage.getItem('user');
      let token = null;

      if (tokenData) {
        const parsedUser = JSON.parse(tokenData);
        token = parsedUser?.token;
      }
      
      const state = getState() as RootState;
      const { user } = state.auth;
      if (!user || user.role !== 'seller') {
        throw new Error('Unauthorized. Only sellers can update products.');
      }
      const response = await axios.put(`${API_URL}/product/update/${id}/${user.id}`, productData, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });
      return response.data.product;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'seller/deleteProduct',
  async (id: number, { getState, rejectWithValue }) => {
    try {
      const tokenData = sessionStorage.getItem('user');
      let token = null;

      if (tokenData) {
        const parsedUser = JSON.parse(tokenData);
        token = parsedUser?.token;
      }
      
      const state = getState() as RootState;
      const { user } = state.auth;
      if (!user || user.role !== 'seller') {
        throw new Error('Unauthorized. Only sellers can delete products.');
      }
      await axios.delete(`${API_URL}/product/delete/${id}/${user.id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete product');
    }
  }
);

export const fetchSellerProducts = createAsyncThunk(
  'seller/fetchProducts',
  async (_, { getState, rejectWithValue }) => {
    try {
        const state = getState() as RootState;
        const { user } = state.auth;
        if (!user || user.role !== 'seller') {
            throw new Error('Unauthorized. Only sellers can fetch their products.');
      }
        const tokenData = sessionStorage.getItem('user');
        let token = null;

        if (tokenData) {
            const parsedUser = JSON.parse(tokenData);
            token = parsedUser?.token;
        }
      const response = await axios.get(`${API_URL}/seller/products/${user.id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      });
      return response.data.products;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

const sellerSlice = createSlice({
  name: 'seller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded';
        state.products.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(updateProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.status = 'succeeded';
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = 'succeeded';
        state.products = state.products.filter(product => product.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchSellerProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default sellerSlice.reducer;