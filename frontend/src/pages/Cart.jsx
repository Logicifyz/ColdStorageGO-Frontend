import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate] = useState(0.09); // 9%
  const [deliveryRate] = useState(0.05); // 5%
  const [taxes, setTaxes] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    const newTax = subtotal * taxRate;
    const newShipping = subtotal * deliveryRate;
    setTaxes(newTax);
    setShippingCost(newShipping);
    setTotal(subtotal + newTax + newShipping);
  }, [subtotal, taxRate, deliveryRate]);

  const fetchCartItems = async () => {
    try {
      const response = await api.get("/api/cart/view-cart");
      const items = await Promise.all(
        response.data.map(async (item) => {
          try {
            const mealKitResponse = await api.get(`/api/MealKit/${item.mealKitId}`);
            const MealKit = mealKitResponse.data;
            const base64Image = MealKit.listingImage
              ? `data:image/jpeg;base64,${MealKit.listingImage}`
              : "/default-image.png";
            return {
              ...item,
              MealKit: {
                ...MealKit,
                ListingImage: base64Image,
              },
            };
          } catch (error) {
            return {
              ...item,
              MealKit: {
                name: "Unknown Meal Kit",
                ListingImage: "/default-image.png",
                price: 0,
                expiryDate: new Date().toISOString(),
              },
            };
          }
        })
      );
      setCartItems(items);
      calculateSubtotal(items);
    } catch (error) {
      console.error("Failed to fetch cart items", error);
    }
  };

  const calculateSubtotal = (items) => {
    const sub = items.reduce(
      (acc, item) => acc + (item.MealKit?.price || 0) * (item.quantity || 0),
      0
    );
    setSubtotal(sub);
  };

  const updateQuantity = async (mealKitId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await api.post("/api/Cart", { mealKitId, quantity: newQuantity });
      const updatedCart = cartItems.map((item) =>
        item.mealKitId === mealKitId ? { ...item, quantity: newQuantity } : item
      );
      setCartItems(updatedCart);
      calculateSubtotal(updatedCart);
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] relative overflow-hidden p-8 font-inter text-gray-100">
      {/* Abstract Liquid Gradient Background Blobs */}
      <motion.div
        className="absolute top-0 left-0 w-[40%] h-[60%] bg-[#ff6b6b10] rounded-full blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-[#ff8e5310] rounded-full blur-3xl"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-8 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] bg-clip-text text-transparent">
          Shopping Cart
        </h1>

        {/* Cart Items List */}
        <div className="bg-gray-800/60 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="divide-y divide-gray-700">
            {cartItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center py-6"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={item.MealKit.ListingImage}
                  alt={item.MealKit.name}
                  className="w-24 h-24 rounded-lg object-cover mr-6"
                />
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2">
                    {item.MealKit.name}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Expires: {new Date(item.MealKit.expiryDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 bg-gray-700 rounded-lg p-2">
                    <button
                      onClick={() => updateQuantity(item.mealKitId, item.quantity - 1)}
                      className="px-3 py-1 rounded hover:bg-gray-600 transition"
                    >
                      -
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.mealKitId, item.quantity + 1)}
                      className="px-3 py-1 rounded hover:bg-gray-600 transition"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-right w-32">
                    <p className="text-lg font-semibold">
                      ${(item.MealKit.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Order Totals Summary */}
        <div className="bg-gray-800/60 rounded-3xl p-8 shadow-2xl">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-xl">
              <span className="text-gray-400">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl">
              <span className="text-gray-400">Delivery (5%):</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl">
              <span className="text-gray-400">Tax (9%):</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-between text-3xl font-bold pt-4 border-t border-gray-700">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="mt-6 w-full py-4 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] hover:from-[#ff8e53] hover:to-[#ff6b6b] transition rounded-2xl font-bold text-xl flex justify-center items-center shadow-lg"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
