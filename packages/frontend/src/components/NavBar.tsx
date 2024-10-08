import React from "react";
import CartButton from "./CartButton";
import WishlistButton from "./WishlistButton";
import Profile from "./Profile";

interface NavBarProps {
  cart: any[];
  handleRemove: (id: number) => void;
  handleDecrease: (id: number) => void;
  handleIncrease: (id: number) => void;
  handleCheckout: () => void;
}

const NavBar: React.FC<NavBarProps> = ({
  cart,
  handleRemove,
  handleDecrease,
  handleIncrease,
  handleCheckout,
}) => {
  return (
    <div className="flex justify-end space-x-4 mb-4">
      <WishlistButton />
      <CartButton
        cart={cart}
        handleRemove={handleRemove}
        handleDecrease={handleDecrease}
        handleIncrease={handleIncrease}
        handleCheckout={handleCheckout}
      />
      <Profile />
    </div>
  );
};

export default NavBar;
