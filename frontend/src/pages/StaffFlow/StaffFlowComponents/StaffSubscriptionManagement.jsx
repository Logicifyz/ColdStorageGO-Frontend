import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api";
import { UserIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";


const FloatingCard = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-100/50 backdrop-blur-xl rounded-3xl p-6 border border-[#2D4B33]/20 shadow-2xl"
    >
        {children}
    </motion.div>
);

const StaffSubscriptionManagement = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "expired", "canceled"
    const [modal, setModal] = useState({ isOpen: false, subscriptionId: null });
    const [showAnalytics, setShowAnalytics] = useState(false);
    const [analyticsData, setAnalyticsData] = useState({
        cancellationRate: 0,
        frozenRate: 0,
        popularChoices: { mostPopular: { Choice: "N/A", Count: 0 }, leastPopular: { Choice: "N/A", Count: 0 } },
        popularTypes: { mostPopular: { Type: "N/A", Count: 0 }, leastPopular: { Type: "N/A", Count: 0 } },
        summary: { totalSubscriptions: 0, activeSubscriptions: 0, expiredSubscriptions: 0, canceledSubscriptions: 0 }
    });

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    const fetchSubscriptions = async () => {
        setIsLoading(true);
        try {
            const response = await api.get("/api/subscriptions/staff/all");
            setSubscriptions(response.data);
        } catch (error) {
            toast.error("Error fetching subscriptions");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAnalytics = async () => {
        try {
            const cancellationRate = await api.get("/api/subscriptions/analytics/cancellation-rate").catch(() => ({ data: { cancellationRate: 0 } }));
            const frozenRate = await api.get("/api/subscriptions/analytics/frozen-rate").catch(() => ({ data: { frozenRate: 0 } }));
            const popularChoices = await api.get("/api/subscriptions/analytics/popular-choices").catch(() => ({
                data: { mostPopular: { choice: "N/A", count: 0 }, leastPopular: { choice: "N/A", count: 0 } }
            }));
            const popularTypes = await api.get("/api/subscriptions/analytics/popular-types").catch(() => ({
                data: { mostPopular: { type: "N/A", count: 0 }, leastPopular: { type: "N/A", count: 0 } }
            }));
            const summary = await api.get("/api/subscriptions/analytics/summary").catch(() => ({
                data: { totalSubscriptions: 0, activeSubscriptions: 0, expiredSubscriptions: 0, canceledSubscriptions: 0 }
            }));

            const formattedChoices = [
                { choice: popularChoices.data?.mostPopular?.choice || "N/A", count: popularChoices.data?.mostPopular?.count || 0 },
                { choice: popularChoices.data?.leastPopular?.choice || "N/A", count: popularChoices.data?.leastPopular?.count || 0 }
            ];

            const formattedTypes = [
                { type: popularTypes.data?.mostPopular?.type || "N/A", count: popularTypes.data?.mostPopular?.count || 0 },
                { type: popularTypes.data?.leastPopular?.type || "N/A", count: popularTypes.data?.leastPopular?.count || 0 }
            ];

            setAnalyticsData({
                cancellationRate: cancellationRate.data.cancellationRate,
                frozenRate: frozenRate.data.frozenRate,
                popularChoices: {
                    mostPopular: popularChoices.data.mostPopular,
                    leastPopular: popularChoices.data.leastPopular,
                    allChoices: formattedChoices || [] // ✅ Ensure it's always an array
                },
                popularTypes: {
                    mostPopular: popularTypes.data.mostPopular,
                    leastPopular: popularTypes.data.leastPopular,
                    allTypes: formattedTypes || [] // ✅ Ensure it's always an array
                },
                summary: summary.data
            });
        } catch (error) {
            toast.error("Error fetching analytics data");
            setAnalyticsData({
                cancellationRate: 0,
                frozenRate: 0,
                popularChoices: {
                    mostPopular: { choice: "N/A", count: 0 },
                    leastPopular: { choice: "N/A", count: 0 },
                    allChoices: [] // ✅ Default to an empty array
                },
                popularTypes: {
                    mostPopular: { type: "N/A", count: 0 },
                    leastPopular: { type: "N/A", count: 0 },
                    allTypes: [] // ✅ Default to an empty array
                },
                summary: { totalSubscriptions: 0, activeSubscriptions: 0, expiredSubscriptions: 0, canceledSubscriptions: 0 }
            });
        }
    };

    const toggleAnalytics = () => {
        if (!showAnalytics) {
            fetchAnalytics();
        }
        setShowAnalytics(!showAnalytics);
    };

    const filteredSubscriptions = (subscriptions || []).filter(sub => {
        const matchesSearchTerm =
            sub?.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub?.subscriptionType?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || sub?.status?.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearchTerm && matchesStatus;
    });

    const handleCancelSubscription = async () => {
        if (!modal.subscriptionId) return;
        try {
            await api.delete(`/api/subscriptions/cancel/${modal.subscriptionId}`, { withCredentials: true });
            toast.success("Subscription canceled successfully.");
            fetchSubscriptions();
        } catch (error) {
            toast.error("Error canceling subscription");
        } finally {
            setModal({ isOpen: false, subscriptionId: null });
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5DC] text-[#2D4B33] relative overflow-hidden p-8">
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-4xl font-bold bg-gradient-to-r from-[#2D4B33] to-[#355E3B] bg-clip-text text-transparent"
                    >
                        <UserIcon className="w-12 h-12 mr-4 inline-block" />
                        Subscription Management
                    </motion.h1>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search by user or plan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="py-2 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-cyan-500 w-64"
                        />
                        <button
                            onClick={toggleAnalytics}
                            className={`py-2 px-4 rounded-lg text-[#2D4B33] border border-[#2D4B33] transition-all duration-300 flex items-center gap-2 ${showAnalytics ? "bg-green-300" : "bg-white hover:bg-white"
                                }`}
                        >
                            <ChartBarIcon className="w-5 h-5" />
                            {showAnalytics ? "Hide Analytics" : "Show Analytics"}
                        </button>
                    </div>
                </header>
                {/* Filter Tabs */}
                <div className="flex gap-4 mb-8">
                    {[
                        {
                            label: "All", value: "all", color: "bg-green-100 text-green-600 hover:bg-green-200" },
                        { label: "Active", value: "active", color: "bg-green-200 text-green-700 hover:bg-green-300" },
                        { label: "Expired", value: "expired", color: "bg-blue-200 text-blue-700 hover:bg-blue-300" },
                        { label: "Canceled", value: "canceled", color: "bg-red-200 text-red-700 hover:bg-red-300" },
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilterStatus(tab.value)}
                            className={`px-6 py-3 rounded-full font-semibold border text-lg transition-all duration-300 
                ${filterStatus === tab.value ? tab.color : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                {/* Analytics Section */}
                {showAnalytics && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <FloatingCard>
                            {/* 📊 Subscription Analytics (Top Section) */}
                            <h2 className="text-2xl font-bold mb-4">Subscription Analytics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-green-200 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold">Cancellation Rate</h3>
                                    <p className="text-2xl">{analyticsData.cancellationRate}%</p>
                                </div>
                                <div className="bg-green-200 p-4 rounded-lg">
                                    <h3 className="text-lg font-semibold">Frozen Rate</h3>
                                    <p className="text-2xl">{analyticsData.frozenRate}%</p>
                                </div>
                            </div>

                            {/* 🥧 Popular Subscription Choices & Types Pie Charts */}
                            <h2 className="text-2xl font-bold mt-6 mb-4">Subscription Trends</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                {/* 🥗 Subscription Choices Pie Chart */}
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold mb-2">Most vs. Least Popular Choice</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={analyticsData.popularChoices.allChoices || []} // ✅ Ensure it's always an array
                                                dataKey="count"
                                                nameKey="choice"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {(analyticsData.popularChoices.allChoices || []).map((entry, index) => ( // ✅ Ensure safe mapping
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? "#4CAF50" : "#FF6347"} />
                                                ))}
                                            </Pie>
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <p className="text-sm text-gray-400 mt-2">
                                        <span className="text-green-400">Most Popular: </span>{analyticsData.popularChoices.mostPopular.choice} <br />
                                        <span className="text-red-400">Least Popular: </span>{analyticsData.popularChoices.leastPopular.choice}
                                    </p>
                                </div>

                                {/* 📆 Subscription Types Pie Chart */}
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold mb-2">Most vs. Least Popular Type</h3>
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={analyticsData.popularTypes.allTypes || []} // ✅ Ensure it's always an array
                                                dataKey="count"
                                                nameKey="type"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {(analyticsData.popularTypes.allTypes || []).map((entry, index) => ( // ✅ Ensure safe mapping
                                                    <Cell key={`cell-${index}`} fill={index === 0 ? "#4CAF50" : "#FF6347"} />
                                                ))}
                                            </Pie>
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <p className="text-sm text-gray-400 mt-2">
                                        <span className="text-green-400">Most Popular: </span>{analyticsData.popularTypes.mostPopular.type} <br />
                                        <span className="text-red-400">Least Popular: </span>{analyticsData.popularTypes.leastPopular.type}
                                    </p>
                                </div>
                            </div>

                            {/* 🔢 Subscription Summary (Bottom Section) */}
                            <div className="bg-green-200 p-4 rounded-lg col-span-full mt-6">
                                <h3 className="text-lg font-semibold">Subscription Summary</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                                    <div>
                                        <p className="text-gray-400">Total</p>
                                        <p className="text-xl">{analyticsData.summary.totalSubscriptions}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Active</p>
                                        <p className="text-xl">{analyticsData.summary.activeSubscriptions}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Expired</p>
                                        <p className="text-xl">{analyticsData.summary.expiredSubscriptions}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400">Canceled</p>
                                        <p className="text-xl">{analyticsData.summary.canceledSubscriptions}</p>
                                    </div>
                                </div>
                            </div>
                        </FloatingCard>
                    </motion.div>
                )}
                {/* Confirmation Modal */}
                <AnimatePresence>
                    {modal.isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                        >
                            <div className="bg-green-100/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-[#2D4B33]/20 text-center w-80">
                                <h2 className="text-2xl font-bold mb-4">Confirm Action</h2>
                                <p className="mb-6 text-[#2D4B33]">
                                    Are you sure you want to cancel this subscription?
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => setModal({ isOpen: false, subscriptionId: null })}
                                        className="px-4 py-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-all duration-300 transform hover:scale-105"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={handleCancelSubscription}
                                        className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    <AnimatePresence>
                        {filteredSubscriptions.map((subscription) => (
                            <motion.div
                                key={subscription.subscriptionId}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative h-full flex flex-col justify-between"
                            >
                                <div className="relative bg-gradient-to-br from-[#A8E6CF] to-[#DCEDC1] backdrop-blur-xl rounded-xl p-6 border-2 border-transparent hover:border-[#2D4B33]/30 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-[#2D4B33]">{subscription.subscriptionType} Plan</h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${subscription.status === "Active"
                                                ? "bg-green-200 text-green-700"
                                                : "bg-red-200 text-red-700"
                                                }`}
                                        >
                                            {subscription.status}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#2D4B33]">{subscription.subscriptionChoice}</h3>
                                    <p className="text-gray-700 mb-2">User ID: {subscription.userId}</p>
                                    <p className="text-gray-700 mb-2">Auto-Renew: {subscription.autoRenewal ? "Yes" : "No"}</p>
                                    <p className="text-gray-700 mb-2">Street Address: {subscription.user?.userProfile?.streetAddress || "N/A"}</p>
                                    <p className="text-gray-700 mb-4">Postal Code: {subscription.user?.userProfile?.postalCode || "N/A"}</p>

                                    {/* ✅ Keep Button Spacing Consistent */}
                                    <div className="mt-4 min-h-[44px] flex items-center">
                                        {subscription.status === "Active" ? (
                                            <button
                                                onClick={() => setModal({ isOpen: true, subscriptionId: subscription.subscriptionId })}
                                                className="w-full bg-red-200 hover:bg-red-300 text-red-700 px-4 py-2 rounded-lg font-semibold transition-all duration-300"
                                            >
                                                Cancel Subscription
                                            </button>
                                        ) : (
                                            <div className="h-[44px]"></div> // Keeps layout uniform
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>


            </div>
        </div>
    );
};

export default StaffSubscriptionManagement;