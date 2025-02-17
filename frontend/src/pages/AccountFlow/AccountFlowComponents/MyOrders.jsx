import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api";
import MyOrderDetail from "./MyOrderDetail";

const statusConfig = {
    Preparing: { color: "bg-yellow-500/20 text-yellow-400", icon: "⏳", label: "Being Prepared" },
    "Out For Delivery": { color: "bg-blue-500/20 text-blue-400", icon: "🚚", label: "On The Way" },
    Delivered: { color: "bg-green-500/20 text-green-400", icon: "📦", label: "Delivered" },
    Completed: { color: "bg-purple-500/20 text-purple-400", icon: "✅", label: "Completed" }
};

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Format time for display (order ship time)
    const formatTime = (dateStr) => {
        if (!dateStr) return "";
        const date = new Date(dateStr);
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    const fetchOrders = async () => {
        try {
            const response = await api.get(`/api/order/user`);
            setOrders(response.data);
        } catch (err) {
            setError("Failed to load orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
        // Poll the backend every 5 seconds for real-time updates
        const interval = setInterval(fetchOrders, 5000);
        return () => clearInterval(interval);
    }, []);

    const getStatusDetails = (order) => {
        return statusConfig[order.orderStatus] || statusConfig.Preparing;
    };

    const getTimeEstimate = (order) => {
        const now = new Date();
        const shipTime = new Date(order.shipTime);
        const status = order.orderStatus;

        if (status === "Preparing") {
            const diff = shipTime - now;
            if (diff > 0) {
                const seconds = Math.ceil(diff / 1000);
                return { text: `Dispatch in ${seconds} secs`, color: "text-yellow-400" };
            }
            return { text: "Dispatching now", color: "text-blue-400" };
        }

        if (status === "Out For Delivery") {
            const estimatedDeliveryTime = new Date(shipTime.getTime() + 30 * 1000);
            const diff = estimatedDeliveryTime - now;
            if (diff > 0) {
                const seconds = Math.ceil(diff / 1000);
                return { text: `Arriving in ${seconds} secs`, color: "text-blue-400" };
            }
            return { text: "Arriving shortly", color: "text-green-400" };
        }

        // For Delivered and Completed, simply return the status text with appropriate color.
        return {
            text: status,
            color: statusConfig[status]
                ? statusConfig[status].color.split(" ")[1]
                : "text-gray-400"
        };
    };

    if (selectedOrderId) {
        return <MyOrderDetail orderId={selectedOrderId} onBack={() => setSelectedOrderId(null)} />;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl shadow-lg">
                        <span className="text-2xl">📦</span>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Active Orders
                    </h1>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400 py-12">
                        <div className="animate-pulse">Loading your orders...</div>
                    </div>
                ) : error ? (
                    <div className="text-center text-red-500 py-12">{error}</div>
                ) : orders.length === 0 ? (
                    <div className="text-center text-gray-400 py-12">
                        <p className="mb-4">No active orders found</p>
                        <p className="text-sm">Your upcoming orders will appear here</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence>
                            {orders.map((order) => {
                                const status = getStatusDetails(order);
                                const timeEstimate = getTimeEstimate(order);
                                return (
                                    <motion.div
                                        key={order.id || order.Id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 backdrop-blur-xl rounded-xl border-2 border-transparent hover:border-purple-500/30 transition cursor-pointer group shadow-md p-6"
                                        onClick={() => setSelectedOrderId(order.id || order.Id)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">
                                                    Order #{(order.id || order.Id)?.slice(-6)}
                                                </h3>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(order.orderTime || order.OrderTime).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-sm ${status.color} font-bold`}>
                                                {status.icon} {status.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center space-x-2">
                                                <div className={`w-2 h-2 rounded-full ${timeEstimate.color} animate-pulse`} />
                                                <span className={`text-sm ${timeEstimate.color} font-semibold`}>
                                                    {timeEstimate.text}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-white">
                                                    ${(order.totalAmount || order.TotalAmount)?.toFixed(2)}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {formatTime(order.shipTime || order.ShipTime)}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;
