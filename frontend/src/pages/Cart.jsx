﻿import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";
import "tailwindcss/tailwind.css";

const statusSteps = [
    { title: "Preparing", icon: "🥘", color: "from-yellow-500 to-orange-500" },
    { title: "Out For Delivery", icon: "🚚", color: "from-blue-500 to-purple-500" },
    { title: "Delivered", icon: "📦", color: "from-green-500 to-teal-500" },
    { title: "Completed", icon: "✅", color: "from-purple-500 to-pink-500" }
];

const mapStatusToProgress = (order) => {
    if (!order?.orderTime) 
        return { currentStep: 0, progress: 0, estimatedTimeRemaining: 0, stepLabel: "Loading" };

    const now = new Date();
    const orderTime = new Date(order.orderTime);
    const preparingEnd = new Date(orderTime.getTime() + 30 * 1000);
    const outForDeliveryEnd = new Date(orderTime.getTime() + 60 * 1000);
    const deliveredEnd = new Date(orderTime.getTime() + 90 * 1000);

    if (now < preparingEnd) {
        return {
            currentStep: 0,
            progress: 33,
            estimatedTimeRemaining: Math.ceil((preparingEnd - now) / 1000),
            stepLabel: "Preparing"
        };
    }

    if (now < outForDeliveryEnd) {
        return {
            currentStep: 1,
            progress: 66,
            estimatedTimeRemaining: Math.ceil((outForDeliveryEnd - now) / 1000),
            stepLabel: "Out For Delivery"
        };
    }

    if (now < deliveredEnd) {
        return {
            currentStep: 2,
            progress: 85,
            estimatedTimeRemaining: Math.ceil((deliveredEnd - now) / 1000),
            stepLabel: "Delivered"
        };
    }

    return { currentStep: 3, progress: 100, estimatedTimeRemaining: 0, stepLabel: "Completed" };
};

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    const [taxRate] = useState(0.09); // 9%
    const [deliveryRate] = useState(0.05); // 5%
    const [taxes, setTaxes] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [total, setTotal] = useState(0);
    const navigate = useNavigate();

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

    const removeCartItem = async (mealKitId) => {
        try {
            // Assuming you have an endpoint for removal; using DELETE here.
            await api.delete(`/api/cart/${mealKitId}`);
            // Refresh cart after removal.
            fetchCartItems();
        } catch (error) {
            console.error("Failed to remove item:", error);
        }
    };

    // Redirect to gallery if cart is empty.
    useEffect(() => {
        if (!loading && cartItems.length === 0) {
            // Delay redirection to allow the user to see a message.
            const timeout = setTimeout(() => {
                navigate("/gallery");
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [cartItems, navigate]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCartItems().finally(() => setLoading(false));
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] flex flex-col items-center justify-center text-red-500 p-8">
                <p>{error}</p>
                <motion.button
                    onClick={() => navigate("/gallery")}
                    whileHover={{ scale: 1.05 }}
                    className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                    Back to Gallery
                </motion.button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] flex flex-col items-center justify-center text-white p-8">
                <p className="text-2xl mb-4">Your cart is empty.</p>
                <motion.button
                    onClick={() => navigate("/gallery")}
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] hover:from-[#ff8e53] hover:to-[#ff6b6b] rounded-lg shadow-lg font-bold text-xl"
                >
                    Go to Gallery
                </motion.button>
            </div>
        );
    }

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
                                    <div className="text-right w-24">
                                        <p className="text-lg font-semibold">
                                            ${(item.MealKit.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => removeCartItem(item.mealKitId)}
                                        className="ml-4 text-2xl hover:text-red-500 transition"
                                        title="Remove Item"
                                    >
                                        🗑️
                                    </button>
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
