import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Product, CartItem, WishlistItem } from './types';
import { RootState } from '../../store';
import axios from 'axios';

interface ProductState {
  products: Product[];
  cart: CartItem[];
  wishlist: WishlistItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  cart: [],
  wishlist: [],
  status: 'idle',
  error: null,
};

const API_URL = "http://127.0.0.1:4040/api";

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to fetch products');
  const data = await response.json();
  return data.products;
});

export const fetchProductById = createAsyncThunk('products/fetchProductById', async (id: number, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;

  if (!user) {
    throw new Error('Login First as a Shopper');
  }
  if (user?.role !== 'shopper') {
    throw new Error('Access denied. Only shoppers can fetch product by id.');
  }

  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`Failed to fetch product with id ${id}`);
  const data = await response.json();
  return data.product;
});

export const fetchProductsByCategory = createAsyncThunk('products/fetchProductsByCategory', async (category: string) => {
  const response = await fetch(`h${API_URL}/category/${category}`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) throw new Error(`Failed to fetch products in category ${category}`);
  const data = await response.json();
  return data.products;
});

export const addToCart = createAsyncThunk('products/addToCart', async ({ productId, quantity }: { productId: number; quantity: number }, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;
  console.log(user?.role);

  if (!user) {
    throw new Error('Login First as a Shopper');
  }
  if (user?.role !== 'shopper') {
    throw new Error('Access denied. Only shoppers can add to cart.');
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
    const response = await axios.post(`${API_URL}/cart/add`, 
      { userId: user.id, id_product: productId, qty: quantity },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to add to cart');
    }
    throw error;
  }
});

export const removeFromCart = createAsyncThunk('products/removeFromCart', async (cartId: number, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;
  console.log(user?.role);

  if (!user) {
    throw new Error('Login First as a Shopper');
  }
  if (user?.role !== 'shopper') {
    throw new Error('Access denied. Only shoppers can remove from cart.');
  }

    const tokenData = sessionStorage.getItem('user');
    let token = null;

    if (tokenData) {
      const parsedUser = JSON.parse(tokenData);
      token = parsedUser?.token;
    }

    if (!token) {
      throw new Error('No token found. Please login again.');
    }

  const response = await fetch(`${API_URL}/cart/remove/${cartId}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ userId: user.id })
  });

  if (!response.ok) throw new Error('Failed to remove from cart');
  return response.json();
});

export const fetchCart = createAsyncThunk('products/fetchCart', async (_, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;
  console.log(user?.role);

  if (!user) {
    throw new Error('Login First as a Shopper');
  }
  if (user?.role !== 'shopper') {
    throw new Error('Access denied. Only shoppers can fetch cart.');
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

    const response = await axios.post(`${API_URL}/cart`,
      { userId: user.id },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      }
    );

    return response.data.cart;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch cart');
    }
    throw error;
  }
});

export const addToWishlist = createAsyncThunk('products/addToWishlist', async (productId: number, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;
  console.log(user?.role);

  if (!user) {
    throw new Error('Login First as a Shopper');
  }
  if (user?.role !== 'shopper') {
    throw new Error('Access denied. Only shoppers can add to wishlist.');
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
    const response = await axios.post(`${API_URL}/wishlist/add`, 
      { userId: user.id, productId },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to add to wishlist');
    }
    throw error;
  }
});

export const removeFromWishlist = createAsyncThunk('products/removeFromWishlist', async (productId: number, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;
  console.log(user?.role);

  if (!user) {
    throw new Error('Login First as a Shopper');
  }
  if (user?.role !== 'shopper') {
    throw new Error('Access denied. Only shoppers can remove from wishlist.');
  }

  const tokenData = sessionStorage.getItem('user');
  let token = null;

  if (tokenData) {
    const parsedUser = JSON.parse(tokenData);
    token = parsedUser?.token;
  }

  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  const response = await fetch(`${API_URL}/wishlist/remove/${productId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId: user.id }),
      credentials: 'include',
  });

  if (!response.ok) throw new Error('Failed to remove from wishlist');
  const data = await response.json();
  return { productId, updatedWishlist: data.wishlist };
});

export const fetchWishlist = createAsyncThunk('products/fetchWishlist', async (_, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;
  console.log(user?.role);

  const tokenData = sessionStorage.getItem('user');
  let token = null;

  if (tokenData) {
    const parsedUser = JSON.parse(tokenData);
    token = parsedUser?.token;
  }

  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  if (!user) {
    throw new Error('Login First as a Shopper');
  }
  if (user?.role !== 'shopper') {
    throw new Error('Access denied. Only shoppers can fetch wishlist.');
  }

  try {
    const response = await axios.post(`${API_URL}/wishlists`, 
      { userId: user.id },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        withCredentials: true,
      }
    );
    return response.data.wishlist;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch wishlist');
    }
    throw error;
  }
});

export const buyProduct = createAsyncThunk('products/buyProduct', async ({ productId, quantity }: { productId: number; quantity: number }, { getState }) => {
  const state = getState() as RootState;
  const user = state.auth.user;
  const tokenData = sessionStorage.getItem('user');
  let token = null;

  if (tokenData) {
    const parsedUser = JSON.parse(tokenData);
    token = parsedUser?.token;
  }

  if (!token) {
    throw new Error('No token found. Please login again.');
  }

  if (!user) {
    throw new Error('Login First as a Shopper');
  }
  if (user?.role !== 'shopper') {
    throw new Error('Access denied. Only shoppers can buy products.');
  }

  const response = await fetch(`${API_URL}/buy`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    credentials: 'include',
    body: JSON.stringify({ productId, quantity }),
  });

  if (!response.ok) throw new Error('Failed to buy product');
  return response.json();
});

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    increaseCartItemQuantityLocal: (state, action: PayloadAction<number>) => {
      const cartItemId = action.payload;
      const cartItem = state.cart.find(item => item.id === cartItemId);
      if (cartItem) {
        cartItem.quantity += 1;
      }
    },
    decreaseCartItemQuantityLocal: (state, action: PayloadAction<number>) => {
      const cartItemId = action.payload;
      const cartItemIndex = state.cart.findIndex(item => item.id === cartItemId);
      if (cartItemIndex !== -1) {
        if (state.cart[cartItemIndex].quantity > 1) {
          state.cart[cartItemIndex].quantity -= 1;
        } else {
          state.cart.splice(cartItemIndex, 1);
        }
      }
    },
    removeCartItemLocal: (state, action: PayloadAction<number>) => {
      const cartItemId = action.payload;
      state.cart = state.cart.filter(item => item.id !== cartItemId);
    },
    removeFromWishlistLocal: (state, action: PayloadAction<number>) => {
      const productId = action.payload;
      state.wishlist = state.wishlist.filter(item => item.productId !== productId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || null;
      })
      .addCase(addToCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.cart = action.payload;
      })
      .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
        state.cart = action.payload;
        state.status = 'succeeded';
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
      })
      .addCase(buyProduct.fulfilled, (state, action) => {
        state.cart = [];
        state.status = 'succeeded';
        console.log('Purchase successful:', action.payload);
      })
      .addCase(buyProduct.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to complete purchase';
      })
      .addCase(removeFromWishlist.fulfilled, (state, action: PayloadAction<{ productId: number; updatedWishlist: any }>) => {
        state.wishlist = state.wishlist.filter(item => item.productId !== action.payload.productId);
        state.wishlist = action.payload.updatedWishlist;
      })
      .addCase(removeFromCart.fulfilled, (state, action: PayloadAction<{ cartId: number }>) => {
        state.cart = state.cart.filter(item => item.productId !== action.payload.cartId);
        state.status = 'succeeded';
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to remove item from cart';
      });
  },
});

export const { increaseCartItemQuantityLocal, decreaseCartItemQuantityLocal, removeCartItemLocal, removeFromWishlistLocal } = productSlice.actions;

export default productSlice.reducer;