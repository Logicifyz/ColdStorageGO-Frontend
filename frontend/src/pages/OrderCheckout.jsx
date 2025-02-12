import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import "tailwindcss/tailwind.css";

const OrderCheckout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate] = useState(0.09); // 9%
  const [deliveryRate] = useState(0.05); // 5%
  const [taxes, setTaxes] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [total, setTotal] = useState(0);

  // Address fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  // Payment fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    setDeliveryAddress(`${street}, ${city}, ${state} ${postalCode}`);
  }, [street, city, state, postalCode]);

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
            const mealKit = mealKitResponse.data;
            const base64Image = mealKit.listingImage
              ? `data:image/jpeg;base64,${mealKit.listingImage}`
              : "/default-image.png";
            return {
              ...item,
              mealKit: { ...mealKit, listingImage: base64Image },
            };
          } catch (error) {
            return {
              ...item,
              mealKit: {
                name: "Unknown Meal Kit",
                listingImage: "/default-image.png",
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
      (acc, item) => acc + (item.mealKit?.price || 0) * (item.quantity || 0),
      0
    );
    setSubtotal(sub);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) return;

    const orderPayload = {
      orderType: "Single-Order",
      deliveryAddress,
      orderStatus: "Pending",
      shippingCost: shippingCost,
      tax: taxes,
      shipTime: new Date(Date.now() + 30 * 60000).toISOString()
    };

    try {
      await api.post("/api/order", orderPayload);
      setSuccess("Order placed successfully!");
      setStreet("");
      setCity("");
      setState("");
      setPostalCode("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      navigate("/ordersuccess");
    } catch (err) {
      console.error("Checkout error", err);
      setError(err.response?.data || "Checkout failed. Please try again.");
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!street) errors.push("Street address is required");
    if (!city) errors.push("City is required");
    if (!state) errors.push("State is required");
    if (!postalCode) errors.push("Postal code is required");
    if (!cardNumber.match(/^\d{4} \d{4} \d{4} \d{4}$/)) errors.push("Invalid card number");
    if (!expiry.match(/^\d{2}\/\d{2}$/)) errors.push("Invalid expiry date");
    if (!cvc.match(/^\d{3}$/)) errors.push("Invalid CVC");

    if (errors.length) {
      setError(errors.join(". ") + ".");
      return false;
    }
    return true;
  };

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .match(/.{1,4}/g)
      ?.join(" ")
      .substr(0, 19) || "";
  };

  const formatExpiry = (value) => {
    return value
      .replace(/\D/g, "")
      .match(/.{1,2}/g)
      ?.join("/")
      .substr(0, 5) || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] relative overflow-hidden p-8 font-inter text-gray-100">
      {/* Abstract Background Blobs */}
      <motion.div
        className="absolute top-0 right-0 w-[40%] h-[60%] bg-[#ff6b6b10] rounded-full blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#ff8e5310] rounded-full blur-3xl"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Checkout Form */}
        <div className="bg-gray-800/60 rounded-3xl p-8 shadow-2xl">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] bg-clip-text text-transparent">
            Checkout Details
          </h1>
          <form onSubmit={handleCheckout}>
            {/* Shipping Address */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-[#ffffff08] backdrop-blur-sm border border-[#ffffff15] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="p-6 border border-[#ffffff15] rounded-2xl bg-[#ffffff08] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="p-6 border border-[#ffffff15] rounded-2xl bg-[#ffffff08] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-[#ffffff08] backdrop-blur-sm border border-[#ffffff15] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all"
                  required
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Payment Information</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-[#ffffff08] backdrop-blur-sm border border-[#ffffff15] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all"
                  maxLength={19}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formatExpiry(expiry)}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="p-6 border border-[#ffffff15] rounded-2xl bg-[#ffffff08] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all"
                    maxLength={5}
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) =>
                      setCvc(e.target.value.replace(/\D/g, "").substr(0, 3))
                    }
                    className="p-6 border border-[#ffffff15] rounded-2xl bg-[#ffffff08] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] hover:from-[#ff8e53] hover:to-[#ff6b6b] transition rounded-2xl font-bold text-xl flex justify-center items-center shadow-lg"
            >
              Pay ${total.toFixed(2)}
            </button>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-gray-800/60 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] bg-clip-text text-transparent">
            Order Summary
          </h2>
          <div className="divide-y divide-gray-700">
            {cartItems.map((item, index) => (
              <motion.div
                key={index}
                className="flex items-center py-4"
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={item.mealKit.listingImage}
                  alt={item.mealKit?.name || "Meal Kit"}
                  className="w-20 h-20 rounded-lg object-cover mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-2xl">
                    {item.mealKit?.name || "Meal Kit"}
                  </h3>
                  <p className="text-gray-400">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-2xl">
                    ${(item.mealKit?.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-xl">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl">
              <span>Delivery (5%):</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl">
              <span>Tax (9%):</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-3xl pt-4">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCheckout;
