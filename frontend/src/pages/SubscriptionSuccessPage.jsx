import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const SubscriptionSuccessPage = () => {
    const navigate = useNavigate();
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-8">
            <div className="bg-gray-800 p-12 rounded-lg shadow-2xl text-center max-w-lg w-full border-2 border-yellow-500 animate-fade-in">
                {loading ? (
                    <p className="text-2xl font-semibold">Loading...</p>
                ) : error ? (
                    <p className="text-red-500 text-xl font-bold">{error}</p>
                ) : (
                    <>
                        <h1 className="text-5xl font-extrabold mb-6 text-yellow-400 animate-fade-in">
                            🎉 Subscription Confirmed!
                        </h1>
                        <p className="text-lg mb-6">Thank you for subscribing to our meal plans!</p>

                        {/* Order Review Section */}
                        <div className="bg-gray-700 p-6 rounded-lg shadow-lg text-left space-y-4 border-2 border-gray-600">
                            <p className="text-xl font-semibold">
                                <span className="text-yellow-400">✅ Subscription ID:</span> {subscription.subscriptionId}
                            </p>
                            <p className="text-xl font-semibold">
                                <span className="text-yellow-400">🍽️ Subscription Type:</span> {subscription.subscriptionType}
                            </p>
                            <p className="text-xl font-semibold">
                                <span className="text-yellow-400">🥗 Subscription Choice:</span> {subscription.subscriptionChoice}
                            </p>
                        </div>

                        {/* Return Button */}
                        <button
                            onClick={() => navigate("/")}
                            className="mt-8 px-8 py-3 bg-yellow-500 text-black rounded-lg font-bold text-lg hover:bg-yellow-600 transition duration-300 shadow-lg"
                        >
                            Return to Home
                        </button>
                    </>
                )}
            </div>

            {/* Animation CSS */}
            <style>
                {`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.8s ease-out forwards;
                }
                `}
            </style>
        </div>
    );
};

export default SubscriptionSuccessPage;
