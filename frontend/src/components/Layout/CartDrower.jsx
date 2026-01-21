import React from "react";
import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContent";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();

  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;

  // Safely calculate cart total
  const cartTotal = cart?.totalPrice 
    ? Number(cart.totalPrice).toFixed(2) 
    : "0.00";

  const handleCheckOut = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600 cursor-pointer hover:text-gray-800" />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your cart</h2>
        {cart && cart?.products?.length > 0 ? (
          <CartContent cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p className="text-gray-500">Your cart is empty</p>
        )}
      </div>

      <div className="p-4 bg-white border-t sticky bottom-0">
        {cart && cart?.products?.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Subtotal:</span>
              <span className="text-xl font-bold">${cartTotal}</span>
            </div>
            <button
              onClick={handleCheckOut}
              className="w-full py-3 text-white rounded-lg font-semibold bg-black hover:bg-gray-800 cursor-pointer transition"
            >
              Checkout
            </button>
            <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
              Shipping, taxes and discount codes calculated at checkout.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;