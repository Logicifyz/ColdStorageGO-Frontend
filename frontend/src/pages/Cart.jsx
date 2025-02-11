import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
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
            const mealKitResponse = await api.get(
              `/api/MealKit/${item.mealKitId}`
            );
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
    <div className="min-h-screen bg-gray-900 p-8 font-inter text-gray-100">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
          <div className="divide-y divide-gray-700">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center py-6">
                <img
                  src={item.MealKit.ListingImage}
                  alt={item.MealKit.name}
                  className="w-24 h-24 rounded-lg object-cover mr-6"
                />
                
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">
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
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-lg">
              <span className="text-gray-400">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-400">Delivery (5%):</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span className="text-gray-400">Tax (9%):</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-between text-2xl font-bold pt-4 border-t border-gray-700">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <Link
            to="/checkout"
            className="mt-6 w-full py-4 bg-blue-600 hover:bg-blue-700 transition rounded-lg font-semibold text-lg flex justify-center items-center"
          >
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;