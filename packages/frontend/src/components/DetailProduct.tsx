import React from 'react';
import { Product } from '../features/slices/types';

interface DetailProductProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (productId: number) => void;
  onAddToWishlist: (productId: number) => void;
}

export const DetailProduct: React.FC<DetailProductProps> = ({ product, onClose, onAddToCart, onAddToWishlist }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-4 relative">
        <button 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" 
          onClick={onClose}
        >
          &#x2715;
        </button>
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-64 object-contain mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">{product.title}</h2>
        <p className="text-gray-700 mb-4">{product.description}</p>

        {/* Flex container untuk harga dan tombol */}
        <div className="flex justify-between items-center mt-6">
          {/* Harga di kiri */}
          <p className="text-lg font-bold text-blue-600">${product.price.toFixed(2)}</p>

          {/* Tombol Add to Cart dan Add to Wishlist di kanan */}
          <div className="flex space-x-2">
            <button
              onClick={() => onAddToCart(product.id)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Add to Cart
            </button>
            <button
              onClick={() => onAddToWishlist(product.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
