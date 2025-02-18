import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import "tailwindcss/tailwind.css";

const statusSteps = [
    { title: "Preparing", icon: "🥘", color: "from-yellow-500 to-orange-500" },
    { title: "Out For Delivery", icon: "🚚", color: "from-blue-500 to-purple-500" },
    { title: "Delivered", icon: "📦", color: "from-green-500 to-teal-500" },
    { title: "Completed", icon: "✅", color: "from-purple-500 to-pink-500" }
];

const generateShippingTimes = () => {
    const options = [];
    const now = new Date();
    // Round up to next half-hour.
    const minutes = now.getMinutes();
    const next = new Date(now);
    next.setMinutes(minutes < 30 ? 30 : 60, 0, 0);
    // Generate 12 options (6 hours in 30-minute increments).
    for (let i = 0; i < 12; i++) {
        const time = new Date(next.getTime() + i * 30 * 60000);
        const label = time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }).toUpperCase();
        options.push({ value: time.toISOString(), label: `${label} SLOT` });
    }
    return options;
};

const formatSelectedTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })
        .toUpperCase() + " DELIVERY";
};

// Helper function to validate GUID format.
const isValidGuid = (value) => {
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return guidRegex.test(value);
};

const OrderCheckout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [taxRate] = useState(0.09); // 9%
    const [deliveryRate] = useState(0.05); // 5%
    const [taxes, setTaxes] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [total, setTotal] = useState(0);
    const [selectedShippingTime, setSelectedShippingTime] = useState("");

    // Address fields
    const [street, setStreet] = useState("");
    const [city, setCity] = useState("");
    const [region, setRegion] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");

    // Payment fields
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvc, setCvc] = useState("");

    // Discount code fields
    const [discountCode, setDiscountCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [discountApplied, setDiscountApplied] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCartItems().finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        setDeliveryAddress(`${street}, ${city}, ${region} ${postalCode}`);
    }, [street, city, region, postalCode]);

    // Recalculate taxes, shipping, and total using discounted subtotal (if applied)
    useEffect(() => {
        const effectiveSubtotal = discountApplied ? Math.max(subtotal - discount, 0) : subtotal;
        const newTax = effectiveSubtotal * taxRate;
        const newShipping = effectiveSubtotal * deliveryRate;
        setTaxes(newTax);
        setShippingCost(newShipping);
        setTotal(effectiveSubtotal + newTax + newShipping);
    }, [subtotal, discount, discountApplied, taxRate, deliveryRate]);

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
                            mealKit: { ...mealKit, listingImage: base64Image }
                        };
                    } catch (error) {
                        return {
                            ...item,
                            mealKit: {
                                name: "Unknown Meal Kit",
                                listingImage: "/default-image.png",
                                price: 0
                            }
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

    const removeCartItem = async (mealKitId) => {
        try {
            await api.delete(`/api/cart/${mealKitId}`);
            fetchCartItems();
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    // If cart becomes empty, redirect to gallery after a brief message.
    useEffect(() => {
        if (!loading && cartItems.length === 0) {
            const timeout = setTimeout(() => {
                navigate("/gallery");
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [cartItems, navigate, loading]);

    // Function to apply discount code and update discount value
    const applyDiscount = async () => {
        setError("");
        setSuccess("");
        try {
            const response = await api.get("/api/wallet/redemptions");
            const redemptions = response.data;
            // Find a redemption with matching redemptionId (case-insensitive)
            const redemption = redemptions.find(
                (r) => r.redemptionId.toLowerCase() === discountCode.trim().toLowerCase()
            );
            if (!redemption) {
                setError("Invalid discount code.");
                return;
            }
            if (!redemption.rewardUsable) {
                setError("Discount code has already been used.");
                return;
            }
            // Fetch the associated reward to determine discount amount
            const rewardResponse = await api.get(`/api/rewards/${redemption.rewardId}`);
            const reward = rewardResponse.data;
            let discountAmount = 0;
            switch (reward.rewardType) {
                case "Voucher5":
                    discountAmount = 5;
                    break;
                case "Voucher10":
                    discountAmount = 10;
                    break;
                case "Voucher15":
                    discountAmount = 15;
                    break;
                case "Voucher20":
                    discountAmount = 20;
                    break;
                default:
                    discountAmount = 0;
                    break;
            }
            setDiscount(discountAmount);
            setDiscountApplied(true);
            setSuccess(`Discount code applied: -$${discountAmount}`);
        } catch (err) {
            console.error(err);
            setError("Error applying discount code.");
        }
    };

    const handleCheckout = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) return;

        // If a discount was applied, ensure the discountCode is a valid GUID
        const orderPayload = {
            orderType: "Single-Order",
            deliveryAddress,
            shippingCost: shippingCost,
            tax: taxes,
            shipTime: selectedShippingTime
        };

        if (discountApplied) {
            if (!isValidGuid(discountCode.trim())) {
                setError("Discount code format is invalid. Please enter a valid code.");
                return;
            }
            // Include the RedemptionId (model binder will convert the valid GUID string)
            orderPayload.RedemptionId = discountCode.trim();
        }

        try {
            const orderResponse = await api.post("/api/order", orderPayload);
            const orderData = orderResponse.data;
            // Award CSGO points: 1 point per $1 in total.
            await api.post("/api/Wallet/earn", {
                userId: orderData.userId,
                coins: Math.floor(total)
            });
            setSuccess("Order placed successfully!");
            // Clear fields after successful checkout.
            setStreet("");
            setCity("");
            setRegion("");
            setPostalCode("");
            setCardNumber("");
            setExpiry("");
            setCvc("");
            // Reset discount state if applied.
            setDiscountCode("");
            setDiscount(0);
            setDiscountApplied(false);
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
        if (!region) errors.push("State/Region is required");
        if (!postalCode) errors.push("Postal code is required");
        if (!selectedShippingTime) errors.push("Shipping time is required");
        if (!cardNumber.match(/^\d{4} \d{4} \d{4} \d{4}$/)) errors.push("Invalid card number");
        if (!expiry.match(/^\d{2}\/\d{2}$/)) errors.push("Invalid expiry date");
        if (!cvc.match(/^\d{3}$/)) errors.push("Invalid CVC");

        if (errors.length) {
            setError(errors.join(". ") + ".");
            return false;
        }
        return true;
    };

    return (
        <div className="min-h-screen bg-[#F0EAD6] relative overflow-hidden p-8 font-inter text-[#2D4B33]">
            {/* Abstract Background Blobs */}
            <motion.div
                className="absolute top-0 right-0 w-[40%] h-[60%] bg-[#355E3B10] rounded-full blur-3xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-[#2D4B3310] rounded-full blur-3xl"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Checkout Form */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] bg-clip-text text-transparent">
                        Checkout Details
                    </h1>
                    <form onSubmit={handleCheckout}>
                        {/* Shipping Address */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Shipping Details</h2>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Street Address"
                                    value={street}
                                    onChange={(e) => setStreet(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-white border border-[#E2F2E6] text-[#2D4B33] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-all"
                                    required
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="City"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="p-6 border border-[#E2F2E6] rounded-2xl bg-white text-[#2D4B33] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-all"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="State/Region"
                                        value={region}
                                        onChange={(e) => setRegion(e.target.value)}
                                        className="p-6 border border-[#E2F2E6] rounded-2xl bg-white text-[#2D4B33] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-all"
                                        required
                                    />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Postal Code"
                                    value={postalCode}
                                    onChange={(e) => setPostalCode(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-white border border-[#E2F2E6] text-[#2D4B33] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-all"
                                    required
                                />
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold mb-3">Delivery Time Selection</h2>
                                    <div className="relative group">
                                        <div className="border-2 border-[#E2F2E6] rounded-xl focus-within:border-[#355E3B] transition-all">
                                            <select
                                                value={selectedShippingTime}
                                                onChange={(e) => setSelectedShippingTime(e.target.value)}
                                                className="w-full px-5 py-4 bg-white text-[#2D4B33] rounded-xl appearance-none border border-[#E2F2E6] focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
                                            >
                                                <option value="" className="bg-white text-gray-500">
                                                    Select your delivery window
                                                </option>
                                                {generateShippingTimes().map((time, index) => (
                                                    <option
                                                        key={index}
                                                        value={time.value}
                                                        className="bg-white text-[#2D4B33]"
                                                    >
                                                        {time.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                        {selectedShippingTime && (
                                            <div className="mt-3 p-3 bg-[#E2F2E6] rounded-lg border border-[#355E3B]/30">
                                                <p className="text-[#2D4B33] font-medium flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {formatSelectedTime(selectedShippingTime)}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Orders arrive within 15 minutes of selected time
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Discount Code Input */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold mb-4">Discount Code</h2>
                            <div className="flex">
                                <input
                                    type="text"
                                    placeholder="Enter discount code"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    className="w-full px-6 py-4 rounded-2xl bg-white border border-[#E2F2E6] text-[#2D4B33] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={applyDiscount}
                                    className="ml-4 px-6 py-4 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] text-white rounded-2xl"
                                >
                                    Apply
                                </button>
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
                                    className="w-full px-6 py-4 rounded-2xl bg-white border border-[#E2F2E6] text-[#2D4B33] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-all"
                                    maxLength={19}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        value={formatExpiry(expiry)}
                                        onChange={(e) => setExpiry(e.target.value)}
                                        className="p-6 border border-[#E2F2E6] rounded-2xl bg-white text-[#2D4B33] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-all"
                                        maxLength={5}
                                    />
                                    <input
                                        type="text"
                                        placeholder="CVC"
                                        value={cvc}
                                        onChange={(e) =>
                                            setCvc(e.target.value.replace(/\D/g, "").substr(0, 3))
                                        }
                                        className="p-6 border border-[#E2F2E6] rounded-2xl bg-white text-[#2D4B33] placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-all"
                                        maxLength={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <div className="text-red-500 mb-4">{error}</div>}
                        {success && <div className="text-green-600 mb-4">{success}</div>}

                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] hover:from-[#355E3B] hover:to-[#2D4B33] transition rounded-2xl font-bold text-xl flex justify-center items-center shadow-lg text-white"
                        >
                            Pay ${total.toFixed(2)}
                        </button>
                    </form>
                </div>

                {/* Right Column - Order Summary */}
                <div className="bg-white rounded-3xl p-8 shadow-2xl">
                    <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] bg-clip-text text-transparent">
                        Order Summary
                    </h2>
                    <div className="divide-y divide-[#E2F2E6]">
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
                                    <p className="text-gray-500">Qty: {item.quantity}</p>
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
                            <span>${(discountApplied ? Math.max(subtotal - discount, 0) : subtotal).toFixed(2)}</span>
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

const formatCardNumber = (value) => {
    return (
        value
            .replace(/\D/g, "")
            .match(/.{1,4}/g)
            ?.join(" ")
            .substr(0, 19) || ""
    );
};

const formatExpiry = (value) => {
    return (
        value
            .replace(/\D/g, "")
            .match(/.{1,2}/g)
            ?.join("/")
            .substr(0, 5) || ""
    );
};

export default OrderCheckout;
