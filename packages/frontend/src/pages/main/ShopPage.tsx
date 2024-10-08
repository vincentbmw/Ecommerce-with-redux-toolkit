import React, { useEffect, useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  fetchProducts,
  addToCart,
  addToWishlist,
  removeFromWishlist,
  fetchWishlist,
  fetchCart,
  removeCartItemLocal,
  removeFromCart,
  buyProduct,
  decreaseCartItemQuantityLocal,
  increaseCartItemQuantityLocal
} from '../../features/slices/productSlice';
import { ProductCard } from '../../components/ProductCard';
import { DetailProduct } from '../../components/DetailProduct';
import { CategoryFilter } from '../../components/CategoryFilter';
import { Product } from '../../features/slices/types';
import NavBar from '../../components/NavBar';
import { ToastContainer, toast } from "react-toastify";
import Lottie from 'lottie-react';
import searchAnim from '../../assets/searchAnim.json';

const ShopPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [showNoResultsAnimation, setShowNoResultsAnimation] = useState(false);
  const lottieRef = useRef<any>(null);

  const loadProducts = async () => {
    try {
      const result = await dispatch(fetchProducts()).unwrap();
      setProducts(result);
      const uniqueCategories = Array.from(new Set(result.map((product: Product) => product.category)));
      setCategories([...uniqueCategories.map(category => category as string)]);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    }
  };

  const loadWishlist = async () => {
    try {
      const result = await dispatch(fetchWishlist()).unwrap();
      setWishlist(result.map((item: any) => item.productId));
    } catch (err) {
      console.error('Failed to fetch wishlist:', err);
    }
  };

  const loadCart = async () => {
    try {
      const result = await dispatch(fetchCart()).unwrap();
      setCart(result);
    } catch (err) {
      console.error('Failed to fetch Cart:', err);
    }
  };

  useEffect(() => {
    loadProducts();
    if (user && token) {
      loadWishlist();
      loadCart();
    }
  }, [dispatch, user, token]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc' | '');
  };

  const handleAddToCart = async (productId: number) => {
    const product = products.find((item) => item.id === productId);

    if (!product || product.quantity === 0 || product.quantity === null) {
      toast.error('This product is sold out');
      return;
    }

    if (!user || !token) {
      toast.error('Please log in to add items to the cart');
      return;
    }

    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      await loadCart();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    if (!user || !token) {
      toast.error('Please log in to add items to the wishlist');
      return;
    }
    try {
      const result = await dispatch(fetchWishlist()).unwrap();
      const isProductInWishlist = result.some((item: any) => item.productId === productId);
      
      if (isProductInWishlist) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        setWishlist(wishlist.filter(id => id !== productId));
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        setWishlist([...wishlist, productId]);
      }
      await loadWishlist();
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleClosePopup = () => {
    setSelectedProduct(null);
  };

  const handleRemoveFromCart = (cartItemId: number) => {
    dispatch(removeCartItemLocal(cartItemId));
    dispatch(removeFromCart(cartItemId));
    const updatedCart = cart.filter(item => item.id !== cartItemId);
    setCart(updatedCart);
  };

  const handleDecrease = (cartItemId: number) => {
    dispatch(decreaseCartItemQuantityLocal(cartItemId));
    const updatedCart = cart.map(item =>
      item.id === cartItemId ? { ...item, quantity: item.quantity - 1 } : item
    );
    setCart(updatedCart);
  };

  const handleIncrease = (productId: number) => {
  const productInCart = cart.find((item) => item.id === productId);
  const productInList = products.find((product) => product.id === productId);

  if (productInList && productInCart) {
    if (productInCart.quantity < productInList.quantity) {
      dispatch(increaseCartItemQuantityLocal(productId));
      const updatedCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      toast.error("Quantity cannot exceed available stock.");
    }
  }
};

  const handleCheckQuantity = (productId: number) => {
    const productInCart = products.find(item => item.id === productId);
    return productInCart ? productInCart.quantity : 0;
  };

  const handleCheckout = async () => {
    if (!user || !token) {
      toast.error('Please log in to add items to the wishlist');
      return;
    }
    try {
      for (let item of cart) {
        await dispatch(buyProduct(item.productId)).unwrap();
      }

      cart.forEach((item) => {
        handleRemoveFromCart(item.id);
      });

      toast.success('Checkout successful', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error('Checkout failed! Please try again later.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const filteredProducts = products
    ? products
        .filter(
          (product: Product) =>
            (selectedCategory === 'all' || product.category === selectedCategory) &&
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a: Product, b: Product) => {
          if (sortOrder === 'asc') return a.price - b.price;
          if (sortOrder === 'desc') return b.price - a.price;
          return 0;
        })
    : [];

  useEffect(() => {
    setShowNoResultsAnimation(filteredProducts.length === 0 && searchTerm !== '');
    if (lottieRef.current) {
      if (filteredProducts.length === 0 && searchTerm !== '') {
        lottieRef.current.play();
      } else {
        lottieRef.current.stop();
      }
    }
  }, [filteredProducts, searchTerm]);

  return (
    <div className="container mx-auto px-2 py-8">
      <h1 className="text-2xl font-bold mb-8">Shop</h1>

      <NavBar
        cart={cart}
        handleRemove={handleRemoveFromCart}
        handleDecrease={handleDecrease}
        handleIncrease={handleIncrease}
        handleCheckout={handleCheckout}
      />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full md:w-1/3 mb-4 md:mb-0">
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
          />
        </div>

        <div className="w-full md:w-1/3">
          <select
            value={sortOrder}
            onChange={handleSortChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort by</option>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {showNoResultsAnimation ? (
        <div className="flex justify-center items-center h-80">
          <Lottie
            animationData={searchAnim}
            loop
            autoplay
            className="mt-20"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product: Product) => (
            <div
              key={product.id}
              className="relative cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              <ProductCard
                product={product}
                wishlist={wishlist}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
                quantity={handleCheckQuantity(product.id)}
              />
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <DetailProduct
          product={selectedProduct}
          onClose={handleClosePopup}
          onAddToCart={handleAddToCart}
          onAddToWishlist={handleAddToWishlist}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default ShopPage;
