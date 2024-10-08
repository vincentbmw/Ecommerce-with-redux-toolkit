import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { HeartIcon } from '@heroicons/react/24/outline';
import { removeFromWishlistLocal, removeFromWishlist, fetchWishlist } from '../features/slices/productSlice';
import { WishlistItem } from '../features/slices/types';

const WishlistButton: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const wishlist = useAppSelector((state) => state.products.wishlist) || [];

  const wishlistCount = wishlist.length;

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleRemoveFromWishlist = (productId: number) => {
    dispatch(removeFromWishlistLocal(productId));
    dispatch(removeFromWishlist(productId));
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="relative flex items-center p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
        aria-label="Wishlist"
      >
        <HeartIcon className="h-6 w-6 text-gray-700" />
        {wishlistCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {wishlistCount}
          </span>
        )}
      </button>

      {/* Modal Wishlist */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 relative">
            <div className="flex justify-end p-2">
              <button onClick={handleClose} className="text-gray-600 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                     viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="px-4 pb-4">
              <h2 className="text-xl font-bold mb-4">Your Wishlist</h2>
              {wishlistCount > 0 ? (
                <ul>
                  {wishlist.map((item: WishlistItem) => (
                    <li key={item.id} className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="font-semibold">{item.product.title}</h3>
                        <p>Price: ${item.product.price}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveFromWishlist(item.product.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Your wishlist is empty.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WishlistButton;
