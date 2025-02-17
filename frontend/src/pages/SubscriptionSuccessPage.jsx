import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use'; // To get window dimensions for confetti

const SubscriptionSuccessPage = () => {
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { width, height } = useWindowSize(); // Get window dimensions

    useEffect(() => {
        const fetchLatestSubscription = async () => {
            try {
                const response = await api.get('/api/subscriptions/latest', { withCredentials: true });
                setSubscription(response.data);
            } catch (error) {
                setError('No payment session found.');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestSubscription();
    }, []);

    return (
        <div className="min-h-screen bg-[#0b0b1a] text-gray-100 relative overflow-hidden p-8">
            {/* Confetti Effect */}
            <Confetti
                width={width}
                height={height}
                numberOfPieces={300}
                recycle={false} // Stop confetti after a while
                colors={['#9F7AEA', '#6EE7B7', '#818CF8', '#F472B6', '#FBBF24']} // Purple, cyan, pink, yellow
                opacity={0.8}
                gravity={0.2}
                initialVelocityY={20}
            />

            {/* Background Blobs */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-to-r from-[#302b63] to-[#24243e] opacity-20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-[#4b379c] to-[#1a1a2e] opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto flex items-center justify-center min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-[#ffffff10] text-center w-full"
                >
                    {loading ? (
                        <p className="text-2xl font-semibold animate-pulse">Loading...</p>
                    ) : error ? (
                        <p className="text-red-500 text-xl font-bold">{error}</p>
                    ) : (
                        <>
                            <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                                Subscription Confirmed!
                            </h1>
                            <p className="text-lg mb-8 text-gray-300">Thank you for subscribing to our meal plans!</p>

                            {/* Order Review Section */}
                            <div className="bg-[#1a1a2e] p-8 rounded-lg shadow-lg text-left space-y-6 border border-[#ffffff10]">
                                <p className="text-xl font-semibold">
                                    <span className="text-purple-400">✅ Subscription ID:</span> {subscription.subscriptionId}
                                </p>
                                <p className="text-xl font-semibold">
                                    <span className="text-purple-400">🍽️ Subscription Type:</span> {subscription.subscriptionType}
                                </p>
                                <p className="text-xl font-semibold">
                                    <span className="text-purple-400">🥗 Subscription Choice:</span> {subscription.subscriptionChoice}
                                </p>
                            </div>

                            {/* Return Button */}
                            <button
                                onClick={() => navigate("/")}
                                className="mt-8 px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-bold text-lg hover:from-purple-700 hover:to-cyan-700 transition duration-300 shadow-lg"
                            >
                                Return to Home
                            </button>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default SubscriptionSuccessPage;