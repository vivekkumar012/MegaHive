import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../redux/slices/cartSlice";

const CartContent = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  //Handle adding or subtracting to cart
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        }),
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, guestId, userId, size, color }));
  };

  return (
    <div>
      {cart.products.map((product, index) => {
        // Safely calculate item total
        const itemPrice = Number(product.price) || 0;
        const itemQuantity = Number(product.quantity) || 0;
        const itemTotal = itemPrice * itemQuantity;

        return (
          <div
            key={index}
            className="flex items-start justify-between py-4 border-b"
          >
            <div className="flex items-start">
              <img
                src={product.image}
                alt={product.name}
                className="w-20 h-24 object-cover mr-4 rounded"
              />
              <div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">
                  Size: {product.size} | Color: {product.color}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  ${itemPrice.toFixed(2)} each
                </p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product.productId,
                        -1,
                        product.quantity,
                        product.size,
                        product.color,
                      )
                    }
                    className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="mx-4 font-medium">{product.quantity}</span>
                  <button
                    onClick={() =>
                      handleAddToCart(
                        product.productId,
                        1,
                        product.quantity,
                        product.size,
                        product.color,
                      )
                    }
                    className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-semibold">${itemTotal.toFixed(2)}</p>
              <button
                onClick={() =>
                  handleRemoveFromCart(
                    product.productId,
                    product.size,
                    product.color,
                  )
                }
                className="mt-2 hover:text-red-600 transition-colors"
              >
                <RiDeleteBin3Line className="h-6 w-6" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartContent;