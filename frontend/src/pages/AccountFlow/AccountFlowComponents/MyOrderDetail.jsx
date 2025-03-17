import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../../api";
import "tailwindcss/tailwind.css";

const statusSteps = [
    { title: "Preparing", icon: "🥘", color: "from-green-200 to-green-400" },
    { title: "Out For Delivery", icon: "🚚", color: "from-green-300 to-green-500" },
    { title: "Delivered", icon: "📦", color: "from-green-400 to-green-600" },
    { title: "Completed", icon: "✅", color: "from-green-500 to-green-700" }
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
            <div className="min-h-screen bg-gradient-to-br from-[#A8E6CF] to-[#DCEDC1] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-green-600/30 border-t-green-600 rounded-full"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#A8E6CF] to-[#DCEDC1] flex flex-col items-center justify-center text-red-500 p-8">
                <p>{error}</p>
                <motion.button
                    onClick={onBack}
                    whileHover={{ scale: 1.05 }}
                    className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                >
                    Back to Orders
                </motion.button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#A8E6CF] to-[#DCEDC1] flex flex-col items-center justify-center text-[#2D4B33] p-8">
                <p>Order not found.</p>
                <motion.button
                    onClick={onBack}
                    whileHover={{ scale: 1.05 }}
                    className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white"
                >
                    Back to Orders
                </motion.button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#A8E6CF] to-[#DCEDC1] relative overflow-hidden p-8">
            <motion.div
                className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-r from-[#2D4B33]/10 to-[#355E3B]/10 rounded-full blur-3xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-r from-[#355E3B]/10 to-[#2D4B33]/10 rounded-full blur-3xl"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.button
                    onClick={onBack}
                    whileHover={{ scale: 1.05 }}
                    className="mb-6 px-6 py-3 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] hover:from-[#355E3B] hover:to-[#2D4B33] rounded-lg shadow-md text-white"
                >
                    ← Back to Orders
                </motion.button>

                {/* Progress Tracker */}
                <div className="mb-8 p-6 bg-white/90 rounded-2xl border border-[#E2F2E6] shadow-lg">
                    <div className="relative h-2 bg-gray-300 rounded-full mb-4">
                        <motion.div
                            className="absolute h-full bg-gradient-to-r from-[#2D4B33] to-[#355E3B] rounded-full"
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
                                <p className="font-medium text-sm text-[#2D4B33]">
                                    {step.title}
                                    {index === progressData.currentStep && progressData.estimatedTimeRemaining > 0 && (
                                        <span className="block mt-1 text-xs text-gray-600">
                                            {progressData.estimatedTimeRemaining} secs remaining
                                        </span>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] bg-clip-text text-transparent">
                    Order #{(order.id || order.Id)?.slice(-6)}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="p-6 bg-white/90 rounded-2xl border border-[#E2F2E6] shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-[#2D4B33]">Delivery Details</h2>
                        <p className="text-gray-700">
                            <span className="block mb-2">📦 {order.deliveryAddress || order.DeliveryAddress}</span>
                            <span className="block">⏰ Scheduled: {formatDate(order.shipTime || order.ShipTime)}</span>
                        </p>
                    </div>
                    <div className="p-6 bg-white/90 rounded-2xl border border-[#E2F2E6] shadow-lg">
                        <h2 className="text-xl font-semibold mb-4 text-[#2D4B33]">Payment Summary</h2>
                        <div className="space-y-2">
                            <p className="flex justify-between text-[#2D4B33]">
                                <span>Subtotal:</span>
                                <span>${order.subtotal?.toFixed(2) || order.Subtotal?.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between text-[#2D4B33]">
                                <span>Shipping:</span>
                                <span>${order.shippingCost?.toFixed(2) || order.ShippingCost?.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between text-[#2D4B33]">
                                <span>Tax:</span>
                                <span>${order.tax?.toFixed(2) || order.Tax?.toFixed(2)}</span>
                            </p>
                            <p className="flex justify-between font-bold text-lg text-[#2D4B33]">
                                <span>Total:</span>
                                <span>${order.totalAmount?.toFixed(2) || order.TotalAmount?.toFixed(2)}</span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-6 text-[#2D4B33]">Order Items</h2>
                    <div className="space-y-4">
                        {orderItems.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-white/90 rounded-xl border border-[#E2F2E6] flex items-center shadow-md"
                            >
                                <img
                                    src={item.mealKit.listingImage}
                                    alt={item.mealKit.name}
                                    className="w-16 h-16 rounded-lg object-cover mr-4"
                                />
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-[#2D4B33]">
                                        {item.mealKit.name || "Unknown Meal Kit"}
                                    </h3>
                                    <p className="text-gray-700">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-[#2D4B33]">
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
