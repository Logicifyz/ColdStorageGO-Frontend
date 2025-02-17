import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundBlobs = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-to-r from-[#302b63] to-[#24243e] opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-[#4b379c] to-[#1a1a2e] opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
);

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
        <div className="min-h-screen bg-[#0b0b1a] text-gray-100 relative overflow-hidden p-8">
            <BackgroundBlobs />
            <div className="relative z-10 max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    Subscription History
                </h1>

                {/* Search Bar and Filter Tabs */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search by Subscription ID or Choice..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="py-2 px-4 rounded-lg bg-[#ffffff05] border border-[#ffffff15] text-white focus:ring-2 focus:ring-cyan-500 w-full md:w-96"
                    />
                    <div className="flex gap-4">
                        <button
                            onClick={() => setFilterStatus("all")}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                filterStatus === "all"
                                    ? "bg-purple-600 hover:bg-purple-700"
                                    : "bg-[#ffffff05] hover:bg-[#ffffff10]"
                            }`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilterStatus("expired")}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                filterStatus === "expired"
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-[#ffffff05] hover:bg-[#ffffff10]"
                            }`}
                        >
                            Expired
                        </button>
                        <button
                            onClick={() => setFilterStatus("canceled")}
                            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                                filterStatus === "canceled"
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-[#ffffff05] hover:bg-[#ffffff10]"
                            }`}
                        >
                            Canceled
                        </button>
                    </div>
                </div>

                {/* Subscription History Cards */}
                <div className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-[#ffffff10]">
                    {isLoading ? (
                        <p className="text-center text-lg animate-pulse">Loading subscription history...</p>
                    ) : filteredHistory.length > 0 ? (
                        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto space-y-4 p-2">
                            {filteredHistory.map((subscription, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-[#1a1a2e] p-6 rounded-lg border border-[#ffffff10] shadow-md hover:shadow-xl transition duration-300"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold">{subscription.subscriptionChoice} Plan</h2>
                                        <p className="text-purple-400 font-bold text-lg">${subscription.price}/month</p>
                                    </div>
                                    <p className="text-sm text-gray-400">Subscription ID: {subscription.subscriptionId}</p>

                                    {/* Status Badge */}
                                    <p className="mt-2">
                                        <strong>Status:</strong>
                                        <span
                                            className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[subscription.status]}`}
                                        >
                                            {subscription.status}
                                        </span>
                                    </p>

                                    {/* Dates */}
                                    <p className="text-md mt-1">
                                        <strong>Start Date:</strong> {formatDate(subscription.startDate)}
                                    </p>
                                    <p className="text-md">
                                        <strong>End Date:</strong> {formatDate(subscription.endDate)}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-lg text-gray-400">No subscription history available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionHistory;