import React, { useState, useEffect } from 'react';
import api from '../../../api';

const statusColors = {
    Active: "bg-green-500 text-white",
    Frozen: "bg-blue-500 text-white",
    Canceled: "bg-red-500 text-white"
};

const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const SubscriptionHistory = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/api/subscriptions/history', { withCredentials: true });
                setHistory(response.data);
            } catch (error) {
                console.error('Error fetching history:', error);
                setHistory([]); // Ensure empty history is handled
            } finally {
                setIsLoading(false);
            }
        };

        fetchHistory();
    }, []);

    return (
        <div className="flex flex-col bg-[#383838] text-white p-8 min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-center">Subscription History</h1>

            <div className="flex-1 w-full max-w-4xl mx-auto bg-[#1E1F2B] rounded-xl shadow-lg p-6 border border-gray-700 backdrop-blur-lg">
                {isLoading ? (
                    <p className="text-center text-lg animate-pulse">Loading subscription history...</p>
                ) : history.length > 0 ? (
                    <div className="max-h-[calc(100vh-12rem)] overflow-y-auto space-y-4 p-2">
                        {history.map((subscription, index) => (
                            <div
                                key={index}
                                className="bg-gray-800 p-6 rounded-lg border border-gray-600 shadow-md hover:shadow-xl transition duration-300"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold">{subscription.subscriptionChoice} Plan</h2>
                                    <p className="text-purple-400 font-bold text-lg">${subscription.price}/month</p>
                                </div>
                                <p className="text-sm text-gray-400">Subscription ID: {subscription.subscriptionId}</p>

                                {/* Status Badge */}
                                <p className="mt-2">
                                    <strong>Status:</strong>
                                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${statusColors[subscription.status]}`}>
                                        {subscription.status}
                                    </span>
                                </p>

                                {/* Dates */}
                                <p className="text-md mt-1"><strong>Start Date:</strong> {formatDate(subscription.startDate)}</p>
                                <p className="text-md"><strong>End Date:</strong> {formatDate(subscription.endDate)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-lg text-gray-400">No subscription history available.</p>
                )}
            </div>
        </div>
    );
};

export default SubscriptionHistory;
