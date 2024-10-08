import React from 'react'; 
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { Product } from '../features/slices/types';

interface ProductCardProps {
  product: Product;
  wishlist: number[];
  onAddToCart: (productId: number) => void;
  quantity: number;
  onAddToWishlist: (productId: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, quantity, onAddToWishlist, wishlist }) => {
  const isSoldOut = product.quantity === 0;

  return (
    <div className="relative border rounded-lg overflow-hidden shadow-lg flex flex-col h-full bg-white cursor-pointer transition-transform transform hover:scale-105">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onAddToWishlist(product.id);
        }}
        className="absolute top-2 right-2 p-1 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-all"
      >
        {wishlist.includes(product.id) ? (
          <HeartIcon className="h-6 w-6 text-red-500" />
        ) : (
          <HeartIconOutline className="h-6 w-6 text-gray-500" />
        )}
      </button>

      <img src={product.image} alt={product.title} className="w-full h-48 object-contain" />

      <div className="p-4 flex-grow flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{product.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">{product.description}</p>
        
        <div className="mt-auto flex justify-between items-center">
          <div className="flex flex-col items-start">
            {product.quantity > 0 ? (
              <span className="text-sm text-gray-500 font-medium mb-1">
                QTY: {quantity}
              </span>
            ) : (
              <span className="text-sm text-red-600 font-medium mb-1">
                Sold Out
              </span>
            )}
            <p className="text-blue-600 font-bold">${product.price.toFixed(2)}</p>
          </div>

          {!isSoldOut && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product.id);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition-colors"
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
