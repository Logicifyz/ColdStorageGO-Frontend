import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { motion, AnimatePresence } from 'framer-motion';

const statusColors = {
    Expired: "bg-blue-500 text-white",
    Canceled: "bg-red-500 text-white",
};

const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return isNaN(date.getTime())
        ? "Invalid Date"
        : date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
};

const SubscriptionHistory = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "frozen", "canceled"

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get("/api/subscriptions/history", { withCredentials: true });
                setHistory(response.data);
            } catch (error) {
                console.error("Error fetching history:", error);
                setHistory([]); // Ensure empty history is handled
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const filteredHistory = history.filter(sub => {
        const matchesSearchTerm =
            sub.subscriptionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.subscriptionChoice.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || sub.status.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearchTerm && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-[#F5F5DC] text-[#2D4B33] relative overflow-hidden p-8">
            <div className="relative z-10 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-[#2D4B33] to-[#355E3B] bg-clip-text text-transparent">
                    Subscription History
                </h1>

                {/* Search Bar and Filter Tabs */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search by Subscription ID or Choice..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="py-2 px-4 rounded-lg bg-[#ffffff08] border border-[#2D4B33] text-[#2D4B33] placeholder-[#2D4B33] focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-all w-full md:w-96"
                    />
                    <div className="flex gap-4">
                        <button
                            onClick={() => setFilterStatus("all")}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${filterStatus === "all"
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-white hover:bg-green-100 text-[#2D4B33]"
                                }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus("expired")}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${filterStatus === "expired"
                                ? "bg-blue-600 hover:bg-blue-700 text-white"
                                : "bg-white hover:bg-blue-100 text-[#2D4B33]"
                                }`}
                        >
                            Expired
                        </button>
                        <button
                            onClick={() => setFilterStatus("canceled")}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${filterStatus === "canceled"
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-white hover:bg-red-100 text-[#2D4B33]"
                                }`}
                        >
                            Canceled
                        </button>
                    </div>
                </div>

                {/* Subscription History Cards */}
                <div className="bg-[#F8F9FA] backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-[#2D4B33]/20">
                    {isLoading ? (
                        <p className="text-center text-lg animate-pulse text-[#2D4B33]">Loading subscription history...</p>
                    ) : filteredHistory.length > 0 ? (
                        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto space-y-4 p-2">
                            <AnimatePresence>
                                {filteredHistory.map((subscription, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="bg-white p-6 rounded-xl border border-gray-300 shadow-md hover:shadow-lg transition duration-300"
                                    >
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-xl font-semibold text-[#2D4B33]">{subscription.subscriptionChoice} Plan</h2>
                                            <p className="text-[#355E3B] font-bold text-lg">${subscription.price} {subscription.subscriptionType}</p>
                                        </div>
                                        <p className="text-sm text-gray-500">Subscription ID: {subscription.subscriptionId}</p>

                                        {/* Status Badge */}
                                        <p className="mt-2">
                                            <strong>Status:</strong>
                                            <span
                                                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${subscription.status === "Expired"
                                                        ? "bg-blue-200 text-blue-800 border border-blue-400"
                                                        : "bg-red-200 text-red-800 border border-red-400"
                                                    }`}
                                            >
                                                {subscription.status}
                                            </span>
                                        </p>

                                        {/* Dates */}
                                        <p className="text-md mt-1 text-gray-700">
                                            <strong>Start Date:</strong> {formatDate(subscription.startDate)}
                                        </p>
                                        <p className="text-md text-gray-700">
                                            <strong>End Date:</strong> {formatDate(subscription.endDate)}
                                        </p>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <p className="text-center text-lg text-[#2D4B33]">No subscription history available.</p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SubscriptionHistory;