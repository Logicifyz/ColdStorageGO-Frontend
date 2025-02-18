import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { motion } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

// 🍂 Enhanced Falling Leaves Animation with Rotation
const LeavesAnimation = () => {
    const leaves = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        delay: Math.random() * 3,
        left: `${Math.random() * 100}vw`,
        rotate: Math.random() * 360,
        size: Math.random() * 1.2 + 0.8, // Random sizes for variation
    }));

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {leaves.map((leaf) => (
                <motion.div
                    key={leaf.id}
                    initial={{ opacity: 0, y: -50, rotate: leaf.rotate }}
                    animate={{ opacity: 1, y: "100vh", rotate: leaf.rotate + 180 }}
                    transition={{
                        duration: 6 + Math.random() * 3,
                        delay: leaf.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute w-6 h-6 text-4xl"
                    style={{ left: leaf.left, fontSize: `${leaf.size}rem` }}
                >
                    🍃🍂
                </motion.div>
            ))}
        </div>
    );
};

// 🌿 Soft Background Blobs for Depth
const BackgroundBlobs = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] -top-40 -left-48 bg-gradient-to-r from-green-300 to-green-500 opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-green-400 to-green-700 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
);

// 🎉 Floating "Thank You" Message
const FloatingText = () => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 4, repeatType: "reverse" }}
        className="absolute top-16 left-1/2 transform -translate-x-1/2 text-green-900 text-6xl font-extrabold z-20 pointer-events-none"
    >
        Thank You! 🍀
    </motion.div>
);

const SubscriptionSuccessPage = () => {
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchLatestSubscription = async () => {
            try {
                const response = await api.get("/api/subscriptions/latest", {
                    withCredentials: true,
                });
                setSubscription(response.data);
                toast.success("Subscription Confirmed!", { duration: 2000 });
            } catch (error) {
                setError("No payment session found.");
            } finally {
                setLoading(false);
            }
        };

        fetchLatestSubscription();
    }, []);

    return (
        <div className="min-h-screen bg-[#F5F5DC] text-green-900 p-8 relative flex items-center justify-center overflow-hidden">
            <Toaster position="top-right" />
            <LeavesAnimation />
            <BackgroundBlobs />
            <FloatingText />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-green-100 shadow-xl rounded-3xl p-8 max-w-2xl w-full text-center border-2 border-green-400 relative z-50" // Added z-10
            >
                {/* ✨ Glow Effect */}
                <div className="absolute inset-0 bg-green-400 opacity-10 blur-xl rounded-3xl"></div>

                {loading ? (
                    <p className="text-2xl font-semibold animate-pulse">Loading...</p>
                ) : error ? (
                    <p className="text-red-600 text-xl font-bold">{error}</p>
                ) : (
                    <>
                        <motion.h1
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-green-600 to-green-900 bg-clip-text text-transparent"
                        >
                            Subscription Confirmed! 🎉
                        </motion.h1>
                        <p className="text-lg mb-6">
                            Thank you for subscribing to our meal plans! 🍽️
                        </p>

                        {/* Order Review Section */}
                        <div className="bg-green-200 p-6 rounded-lg shadow-md text-left space-y-4 border border-green-400">
                            <p className="text-lg font-semibold">
                                <span className="text-green-700">✅ Subscription ID:</span>{" "}
                                {subscription.subscriptionId}
                            </p>
                            <p className="text-lg font-semibold">
                                <span className="text-green-700">🍽️ Subscription Type:</span>{" "}
                                {subscription.subscriptionType}
                            </p>
                            <p className="text-lg font-semibold">
                                <span className="text-green-700">🥗 Subscription Choice:</span>{" "}
                                {subscription.subscriptionChoice}
                            </p>
                        </div>

                        {/* 🎯 New Return to Home Button */}
                        <div className="mt-6">
                                    <button
                                        onClick={() => {
                                            console.log("Navigating to home..."); // Debugging
                                            navigate("/");
                                        }}
                                        className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 active:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 shadow-md relative z-50"
                                    >
                                        Return to Home 🏡
                                    </button>

                        </div>
                    </>
                )}
            </motion.div>
        </div>
    );
};

export default SubscriptionSuccessPage;