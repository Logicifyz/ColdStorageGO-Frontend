import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../api";
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
    const preparingEnd = new Date(orderTime.getTime() + 30 * 1000); // OrderTime + 30 seconds
    const outForDeliveryEnd = new Date(orderTime.getTime() + 60 * 1000); // OrderTime + 60 seconds
    const deliveredEnd = new Date(orderTime.getTime() + 90 * 1000); // OrderTime + 90 seconds

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

const MyOrderDetail = ({ orderId, onBack }) => {
    const [order, setOrder] = useState(null);
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [progressData, setProgressData] = useState({
        currentStep: 0,
        progress: 0,
        estimatedTimeRemaining: 0,
        stepLabel: ""
    });

    const fetchOrderDetail = async () => {
        try {
            const response = await api.get(`/api/order/${orderId}`);
            const orderData = response.data;
            setOrder(orderData);
            setProgressData(mapStatusToProgress(orderData));

            const items = orderData.orderItems || [];
            const enrichedItems = await Promise.all(
                items.map(async (item) => {
                    try {
                        const mealKitResponse = await api.get(`/api/MealKit/${item.mealKitId}`);
                        const mealKit = mealKitResponse.data;
                        return {
                            ...item,
                            mealKit: {
                                ...mealKit,
                                listingImage: mealKit.listingImage
                                    ? `data:image/jpeg;base64,${mealKit.listingImage}`
                                    : "/default-image.png"
                            }
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
            setOrderItems(enrichedItems);
        } catch (err) {
            setError("Failed to load order details. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetail();
        // Poll every 5 seconds for updated order details/status.
        const interval = setInterval(fetchOrderDetail, 5000);
        return () => clearInterval(interval);
    }, [orderId]);

    // Additional interval to update the progress tracker in real time
    useEffect(() => {
        if (order) {
            const progressInterval = setInterval(() => {
                setProgressData(mapStatusToProgress(order));
            }, 10000); // update every 10 seconds
            return () => clearInterval(progressInterval);
        }
    }, [order]);

    const formatDate = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleString();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
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
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-red-500 p-8">
                <p>{error}</p>
                <motion.button
                    onClick={onBack}
                    whileHover={{ scale: 1.05 }}
                    className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                    Back to Orders
                </motion.button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-8">
                <p>Order not found.</p>
                <motion.button
                    onClick={onBack}
                    whileHover={{ scale: 1.05 }}
                    className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                    Back to Orders
                </motion.button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden p-8">
            <motion.div
                className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-purple-700/10 to-blue-500/10 rounded-full blur-3xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-pink-700/10 to-cyan-500/10 rounded-full blur-3xl"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.button
                    onClick={onBack}
                    whileHover={{ scale: 1.05 }}
                    className="mb-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md"
                >
                    ← Back to Orders
                </motion.button>

                {/* Progress Tracker */}
                <div className="mb-8 p-6 bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 rounded-2xl border border-[#ffffff10] shadow-lg">
                    <div className="relative h-2 bg-gray-700 rounded-full mb-4">
                        <motion.div
                            className="absolute h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressData.progress}%` }}
                            transition={{ duration: 0.8 }}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {statusSteps.map((step, index) => (
                            <div
                                key={step.title}
                                className={`text-center transition-opacity ${index <= progressData.currentStep ? "opacity-100" : "opacity-40"}`}
                            >
                                <div
                                    className={`w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-2xl bg-gradient-to-br ${step.color} ${index <= progressData.currentStep ? "scale-100" : "scale-90"}`}
                                >
                                    {step.icon}
                                </div>
                                <p className="font-medium text-sm text-white">
                                    {step.title}
                                    {index === progressData.currentStep && progressData.estimatedTimeRemaining > 0 && (
                                        <span className="block mt-1 text-xs text-gray-300">
                                            {progressData.estimatedTimeRemaining} secs remaining
                                        </span>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Order #{(order.id || order.Id)?.slice(-6)}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 rounded-2xl border border-[#ffffff10] shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-white">Delivery Details</h2>
                        <p className="text-gray-400">
                            <span className="block mb-2">📦 {order.deliveryAddress || order.DeliveryAddress}</span>
                            <span className="block">⏰ Scheduled: {formatDate(order.shipTime || order.ShipTime)}</span>
                        </p>
                    </div>
                    <div className="p-6 bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 rounded-2xl border border-[#ffffff10] shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-white">Payment Summary</h2>
                        <div className="space-y-2">
                            <p className="flex justify-between text-white">
                                <span>Subtotal:</span>
                                <span>${order.subtotal?.toFixed(2) || order.Subtotal?.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between text-white">
                                <span>Shipping:</span>
                                <span>${order.shippingCost?.toFixed(2) || order.ShippingCost?.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between text-white">
                                <span>Tax:</span>
                                <span>${order.tax?.toFixed(2) || order.Tax?.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between font-bold text-lg text-white">
                                <span>Total:</span>
                                <span>${order.totalAmount?.toFixed(2) || order.TotalAmount?.toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6 text-white">Order Items</h2>
                    <div className="space-y-4">
                        {orderItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 rounded-xl border border-[#ffffff10] flex items-center shadow-md"
                            >
                                <img
                                    src={item.mealKit.listingImage}
                                    alt={item.mealKit.name}
                                    className="w-16 h-16 rounded-lg object-cover mr-4"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-white">
                                        {item.mealKit.name || "Unknown Meal Kit"}
                                    </h3>
                                    <p className="text-gray-400">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-white">
                                        ${((item.unitPrice || item.UnitPrice) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrderDetail;
