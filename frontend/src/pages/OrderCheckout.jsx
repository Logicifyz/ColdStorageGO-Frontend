import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
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
    // Combine address parts into one string
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
      // Enrich each cart item with MealKit details including the listing image
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
      // Clear cart and reset form fields
      setStreet("");
      setCity("");
      setState("");
      setPostalCode("");
      setCardNumber("");
      setExpiry("");
      setCvc("");
      // Redirect to order success page
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
      .replace(/\D/g, '')
      .match(/.{1,4}/g)
      ?.join(' ')
      .substr(0, 19) || '';
  };

  const formatExpiry = (value) => {
    return value
      .replace(/\D/g, '')
      .match(/.{1,2}/g)
      ?.join('/')
      .substr(0, 5) || '';
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8 font-inter text-gray-100">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Checkout Form */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Checkout Details</h1>
          <form onSubmit={handleCheckout}>
            {/* Address Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Street Address"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="p-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="p-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Payment Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={formatCardNumber(cardNumber)}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full p-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={19}
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={formatExpiry(expiry)}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="p-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={5}
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    value={cvc}
                    onChange={(e) =>
                      setCvc(e.target.value.replace(/\D/g, "").substr(0, 3))
                    }
                    className="p-3 border border-gray-700 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 transition py-4 rounded-lg font-semibold text-lg"
            >
              Pay ${total.toFixed(2)}
            </button>
          </form>
        </div>

        {/* Right Column - Order Summary */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Order Summary</h2>
          <div className="divide-y divide-gray-700">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center py-4">
                <img
                  src={item.mealKit.listingImage}
                  alt={item.mealKit?.name || "Meal Kit"}
                  className="w-20 h-20 rounded-lg object-cover mr-4"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-xl">
                    {item.mealKit?.name || "Meal Kit"}
                  </h3>
                  <p className="text-gray-400">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-xl">
                    ${(item.mealKit?.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between text-lg">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Delivery (5%):</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Tax (9%):</span>
              <span>${taxes.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-2xl pt-4">
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
