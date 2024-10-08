export interface LoginRequest {
	email: string;
	password: string;
}

export interface RegisterResponse {
	message: string,
	ok?: boolean
}

export interface RegisterRequest {
	username: string;
	email: string;
	password: string;
}

export interface User {
	id: number;
	username: string;
	email: string;
	role: string;
}

export type AuthState = {
	user: User | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
	token: string | null;
};

export interface UserResponse {
	token: string;
	username: string;
	userId: number;
	email: string;
	role: string;
	status: number;
	ok: boolean;
}

export interface LogOutResponse {
	message: string;
	ok?: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
  quantity: number;
  sellerId: number;
}

export interface WishlistItem {
  id: number;
  productId: number;
  user: User;
  product: {
    id: number;
    title: string;
    price: number;
    image: string;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AddUserRequest {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface AddUserResponse {
  message: string;
  user: User;
  status: number;
  ok: boolean;
}

export interface DeleteUserResponse {
  message: string;
  status: number;
  ok: boolean;
}

export interface EditUserRequest {
  username?: string;
  email?: string;
  role?: string;
}

export interface AdminState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}