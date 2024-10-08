import React, { useState } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const CartButton: React.FC<{ 
  cart: any[], 
  handleRemove: (id: number) => void,
  handleDecrease: (id: number) => void,
  handleIncrease: (id: number) => void,
  handleCheckout: () => void,
}> = ({ cart, handleRemove, handleDecrease, handleIncrease, handleCheckout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const cartCount = Array.isArray(cart) ? cart.length : 0;

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={handleOpen} className="relative flex items-center p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" aria-label="Cart">
        <ShoppingCartIcon className="h-6 w-6 text-gray-700" />
        {cartCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
            {cartCount}
          </span>
        )}
      </button>

      {/* Modal Cart */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 relative">
            <div className="flex justify-end p-2">
              <button onClick={handleClose} className="text-gray-600 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
            <div className="px-4 pb-4">
              <h2 className="text-xl font-bold mb-4">Your Cart</h2>
              {Array.isArray(cart) && cart.length > 0 ? (
                <>
                  <ul>
                    {cart.map((item) => (
                      <li key={item.id} className="flex flex-col mb-4 border-b pb-4">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">{item.product.title}</h3>
                          <p className="font-bold">Total: ${item.totalPrice.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between items-center">
                          <p>Quantity: {item.quantity}</p>
                          <div className="flex space-x-2">
                            <button onClick={() => handleIncrease(item.id)} className="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600">
                              +
                            </button>
                            <button onClick={() => handleDecrease(item.id)} className="bg-yellow-500 text-white px-2 py-1 rounded-md hover:bg-yellow-600">
                              -
                            </button>
                            <button onClick={() => handleRemove(item.id)} className="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600">
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={handleCheckout}
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      Checkout
                    </button>
                  </div>
                </>
              ) : (
                <p>Your cart is empty.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartButton;
