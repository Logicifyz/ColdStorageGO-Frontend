import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api";
import { UserIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BackgroundBlobs = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-to-r from-[#302b63] to-[#24243e] opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-[#4b379c] to-[#1a1a2e] opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
);

const FloatingCard = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 backdrop-blur-xl rounded-3xl p-6 border border-[#ffffff10] shadow-2xl"
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

    const filteredSubscriptions = subscriptions.filter(sub => {
        const matchesSearchTerm =
            sub.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.subscriptionType.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || sub.status.toLowerCase() === filterStatus.toLowerCase();

        return matchesSearchTerm && matchesStatus;
    });

    const handleCancelSubscription = async () => {
        if (!modal.subscriptionId) return;
        try {
            await api.delete(`/api/subscriptions/cancel/${modal.subscriptionId}`, { withCredentials: true });
            toast.success("Subscription canceled successfully.");
            fetchSubscriptions(); // Refresh the list
        } catch (error) {
            toast.error("Error canceling subscription");
        } finally {
            setModal({ isOpen: false, subscriptionId: null });
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0b1a] text-gray-100 relative overflow-hidden p-8">
            <BackgroundBlobs />
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
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
                            className="py-2 px-4 rounded-lg bg-[#ffffff05] border border-[#ffffff15] text-white focus:ring-2 focus:ring-cyan-500 w-64"
                        />
                    </div>
                </header>

                {/* Filter Tabs */}
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setFilterStatus("all")}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${filterStatus === "all"
                                ? "bg-purple-600 hover:bg-purple-700"
                                : "bg-[#ffffff05] hover:bg-[#ffffff10]"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterStatus("active")}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${filterStatus === "active"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-[#ffffff05] hover:bg-[#ffffff10]"
                            }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilterStatus("expired")}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${filterStatus === "expired"
                                ? "bg-yellow-600 hover:bg-yellow-700"
                                : "bg-[#ffffff05] hover:bg-[#ffffff10]"
                            }`}
                    >
                        Expired
                    </button>
                    <button
                        onClick={() => setFilterStatus("canceled")}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 ${filterStatus === "canceled"
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-[#ffffff05] hover:bg-[#ffffff10]"
                            }`}
                    >
                        Canceled
                    </button>
                </div>

                {/* Subscription Cards */}
                <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    <AnimatePresence>
                        {filteredSubscriptions.map((subscription) => (
                            <motion.div
                                key={subscription.subscriptionId}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative"
                            >
                                <FloatingCard>
                                    <h3 className="text-xl font-bold">{subscription.subscriptionType} Plan</h3>
                                    <h3 className="text-xxl font-bold">{subscription.subscriptionChoice}</h3>
                                    <p className="text-gray-400 mb-4">User ID: {subscription.userId}</p>
                                    <p>Status: <span className={`text-${subscription.status === "Active" ? "green" : "red"}-400`}>{subscription.status}</span></p>
                                    <p>Auto-Renew: {subscription.autoRenewal ? "Yes" : "No"}</p>

                                    {/* Cancel Button for Active Subscriptions */}
                                    {subscription.status === "Active" && (
                                        <button
                                            onClick={() => setModal({ isOpen: true, subscriptionId: subscription.subscriptionId })}
                                            className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                        >
                                            Cancel Subscription
                                        </button>
                                    )}
                                </FloatingCard>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {modal.isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <div className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-[#ffffff10] text-center w-80">
                            <h2 className="text-2xl font-bold mb-4">Confirm Action</h2>
                            <p className="mb-6 text-gray-300">
                                Are you sure you want to cancel this subscription?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={() => setModal({ isOpen: false, subscriptionId: null })}
                                    className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-white transition-all duration-300 transform hover:scale-105"
                                >
                                    No
                                </button>
                                <button
                                    onClick={handleCancelSubscription}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-all duration-300 transform hover:scale-105"
                                >
                                    Yes
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default StaffSubscriptionManagement;