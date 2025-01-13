import React, { useState, useEffect } from 'react';
import api from '../api';

const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid Date" : date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
};

const SubscriptionManagement = () => {
    const [subscription, setSubscription] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const userId = "123e4567-e89b-12d3-a456-426614174000";  // Static for now, replace with dynamic ID
                const response = await api.get(`/api/subscriptions/user?userId=${userId}`);
                setSubscription(response.data);
            } catch (error) {
                console.error('Error fetching subscription:', error);
                setError('Failed to fetch subscription data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscription();
    }, []);

    const handleToggleAutoRenewal = async () => {
        try {
            await api.put(`/api/subscriptions/toggle-autorenewal/${subscription.subscriptionId}`);
            setSubscription(prev => ({
                ...prev,
                autoRenewal: !prev.autoRenewal
            }));
            alert('Auto-Renewal status updated successfully.');
        } catch (error) {
            console.error('Error toggling auto-renewal:', error);
            alert('Failed to update Auto-Renewal.');
        }
    };

    const handleToggleFreeze = async () => {
        try {
            await api.put(`/api/subscriptions/toggle-freeze/${subscription.subscriptionId}`);
            setSubscription(prev => ({
                ...prev,
                isFrozen: !prev.isFrozen
            }));
            alert('Subscription freeze status updated successfully.');
        } catch (error) {
            console.error('Error toggling freeze:', error);
            alert('Failed to update Freeze status.');
        }
    };

    const handleCancelSubscription = async () => {
        try {
            await api.delete(`/api/subscriptions/cancel/${subscription.subscriptionId}`);
            alert('Subscription canceled successfully.');
        } catch (error) {
            console.error('Error canceling subscription:', error);
            alert('Failed to cancel subscription.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8 space-y-6">
            <h1 className="text-4xl font-bold mb-6">Subscription Management</h1>

            {isLoading ? (
                <p className="text-lg">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-lg">{error}</p>
            ) : (
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4 max-w-md w-full border border-gray-700">
                    <p className="text-lg"><strong>Subscribed Since:</strong> {formatDate(subscription.startDate)}</p>
                    <p className="text-lg"><strong>Subscription Type:</strong> {subscription.subscriptionType || 'N/A'}</p>
                    <p className="text-lg"><strong>Next Billing Date:</strong> {formatDate(subscription.endDate)}</p>

                    {/* Auto-Renewal Toggle */}
                    <label className="inline-flex items-center cursor-pointer space-x-3">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={subscription.autoRenewal}
                            onChange={handleToggleAutoRenewal}
                        />
                        <div className={`relative w-11 h-6 rounded-full
                            ${subscription.autoRenewal ? 'bg-green-500' : 'bg-red-500'}
                            peer-focus:ring-4 peer-focus:ring-blue-300 
                            dark:peer-focus:ring-blue-800`}>
                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 transition-all
                                ${subscription.autoRenewal ? 'translate-x-full' : ''}`}></div>
                        </div>
                        <span className="text-lg font-medium">
                            {subscription.autoRenewal ? 'Auto-Renewal On' : 'Auto-Renewal Off'}
                        </span>
                    </label>

                    {/* Freeze Subscription Toggle */}
                    <label className="inline-flex items-center cursor-pointer space-x-3">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={subscription.isFrozen}
                            onChange={handleToggleFreeze}
                        />
                        <div className={`relative w-11 h-6 rounded-full
                            ${subscription.isFrozen ? 'bg-red-500' : 'bg-green-500'}
                            peer-focus:ring-4 peer-focus:ring-blue-300 
                            dark:peer-focus:ring-blue-800`}>
                            <div className={`absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 transition-all
                                ${subscription.isFrozen ? 'translate-x-full' : ''}`}></div>
                        </div>
                        <span className="text-lg font-medium">
                            {subscription.isFrozen ? 'Frozen' : 'Active'}
                        </span>
                    </label>

                    {/* Cancel Subscription Button */}
                    <button
                        onClick={handleCancelSubscription}
                        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition duration-300"
                    >
                        Cancel Subscription
                    </button>
                </div>
            )}
        </div>
    );
};

export default SubscriptionManagement;
