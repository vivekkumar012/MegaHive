import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PaypalButton";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";
import { createCheckout } from "../../redux/slices/checkoutSlice";

const CheckOut = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  // Calculate total price from cart products
  const totalPrice = useMemo(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      return 0;
    }
    
    // First try to use cart.totalPrice if it exists and is valid
    if (cart.totalPrice && Number(cart.totalPrice) > 0) {
      return Number(cart.totalPrice);
    }
    
    // Otherwise calculate from products
    const calculated = cart.products.reduce((sum, product) => {
      const price = Number(product.price) || 0;
      const quantity = Number(product.quantity) || 1;
      return sum + (price * quantity);
    }, 0);
    
    return calculated;
  }, [cart]);

  // Check if user is logged in and has a valid token
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!user || !token || token === 'null' || token === 'undefined') {
      navigate("/login?redirect=checkout");
      return;
    }
  }, [user, navigate]);

  // Ensure that cart is loaded before proceeding
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    setCheckoutError(null);
    
    // Validate user and token
    const token = localStorage.getItem("userToken");
    if (!user || !token || token === 'null' || token === 'undefined') {
      setCheckoutError("Please log in to continue");
      navigate("/login?redirect=checkout");
      return;
    }

    // Validate cart
    if (!cart || !cart.products || cart.products.length === 0) {
      setCheckoutError("Your cart is empty");
      return;
    }

    // Validate total price
    if (totalPrice <= 0) {
      setCheckoutError("Unable to proceed. Cart total is $0. Please check your cart.");
      return;
    }

    setIsProcessing(true);

    try {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Paypal",
          totalPrice: totalPrice,
        })
      );

      if (res.payload && res.payload._id) {
        setCheckoutId(res.payload._id);
        setCheckoutError(null);
      } else if (res.error) {
        setCheckoutError(res.error.message || "Failed to create checkout");
        
        // If unauthorized, redirect to login
        if (res.error.message?.includes("Not Authorized") || 
            res.error.message?.includes("token")) {
          setTimeout(() => navigate("/login?redirect=checkout"), 2000);
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setCheckoutError(error.message || "Failed to create checkout");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      await handleFinalizeCheckout(checkoutId);
    } catch (error) {
      console.error("Payment error:", error);
      setCheckoutError("Payment processing failed. Please try again.");
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Finalize error:", error);
      setCheckoutError("Failed to finalize order. Please contact support.");
    }
  };

  if (loading) return <p>Loading cart ...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* left section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">Checkout</h2>
        
        {/* Error Message */}
        {checkoutError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {checkoutError}
          </div>
        )}

        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={user ? user.email : ""}
              className="w-full p-2 border rounded"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">Delivery</h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Continue to Payment"}
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">Pay with Paypal</h3>
                
                {/* Debug Info - Remove after fixing */}
                <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded text-xs">
                  <p><strong>Debug Info:</strong></p>
                  <p>Amount: ${totalPrice.toFixed(2)}</p>
                  <p>Checkout ID: {checkoutId}</p>
                  <p>Client ID: {import.meta.env.VITE_PAYPAL_CLIENT_ID ? '✅ Set' : '❌ Missing'}</p>
                </div>

                {/* Paypal component */}
                <PayPalButton
                  amount={totalPrice.toFixed(2)}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => {
                    console.error("PayPal error:", err);
                    setCheckoutError(
                      err.message || "Payment failed. Please try again."
                    );
                  }}
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Right section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products.map((product, index) => {
            const price = Number(product.price) || 0;
            const quantity = Number(product.quantity) || 1;
            const lineTotal = price * quantity;
            
            return (
              <div
                key={index}
                className="flex items-start justify-between py-2 border-b"
              >
                <div className="flex items-start">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-20 h-24 object-cover mr-4 rounded"
                  />
                  <div>
                    <h3 className="text-md font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-500">Size: {product.size}</p>
                    <p className="text-sm text-gray-500">Color: {product.color}</p>
                    <p className="text-sm text-gray-500">Qty: {quantity}</p>
                    <p className="text-sm text-gray-600 mt-1">${price.toFixed(2)} each</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">${lineTotal.toFixed(2)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p className="font-semibold">${totalPrice.toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-xl mt-4 border-t pt-4">
          <p className="font-bold">Total</p>
          <p className="font-bold">${totalPrice.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;