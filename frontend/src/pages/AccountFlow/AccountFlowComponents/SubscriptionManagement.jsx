﻿import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/solid';
import SubscriptionRecommendation from './SubscriptionRecommendation'; // Import the component

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
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState({ isOpen: false, action: null });
    const [freezeDates, setFreezeDates] = useState({ startDate: "", endDate: "" });
    const [scheduledFreezes, setScheduledFreezes] = useState([]);
    const [userId, setUserId] = useState(null); // Add userId state

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const sessionResponse = await api.get('/api/account/profile', { withCredentials: true });
                const userId = sessionResponse.data.userId;
                setUserId(userId); // Set userId
                const response = await api.get(`/api/subscriptions/user?userId=${userId}`);
                if (!response.data || response.data.isCanceled) {
                    setSubscription(null);
                    return;
                }
                const activeSubscription = response.data.status === "Active" ? response.data : null;

                if (!activeSubscription) {
                    setSubscription(null);
                    return;
                }
                setSubscription(response.data);
                const freezeResponse = await api.get(`/api/subscriptions/scheduled-freezes/${response.data.subscriptionId}`, { withCredentials: true });
                setScheduledFreezes(freezeResponse.data);
            } catch (error) {
                console.error('Error fetching subscription:', error);
                setSubscription(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscription();
    }, []);

    const openModal = (action, freezeId = null) => {
        setModal({ isOpen: true, action, freezeId });
    };

    const closeModal = () => {
        setModal({ isOpen: false, action: null, freezeId: null });
    };

    const executeAction = async () => {
        if (!modal.action) return;
        closeModal();

        try {
            if (modal.action === 'cancel') {
                await api.delete(`/api/subscriptions/cancel/${subscription.subscriptionId}`, { withCredentials: true });
                setSubscription(null);
                alert('Subscription canceled successfully.');
            } else if (modal.action === 'autoRenew') {
                await api.put(`/api/subscriptions/toggle-autorenewal/${subscription.subscriptionId}`, {}, { withCredentials: true });
                setSubscription(prev => ({
                    ...prev,
                    autoRenewal: !prev.autoRenewal
                }));
            } else if (modal.action === 'freeze') {
                await api.put(`/api/subscriptions/toggle-freeze/${subscription.subscriptionId}`, {}, { withCredentials: true });
                setSubscription(prev => ({
                    ...prev,
                    isFrozen: !prev.isFrozen,
                    freezeStarted: prev.isFrozen ? null : new Date().toISOString()
                }));
            } else if (modal.action === 'scheduleFreeze') {
                const response = await api.post(`/api/subscriptions/schedule-freeze/${subscription.subscriptionId}`,
                    { startDate: freezeDates.startDate, endDate: freezeDates.endDate },
                    { withCredentials: true }
                );
                setScheduledFreezes([...scheduledFreezes, response.data]);
                setFreezeDates({ startDate: "", endDate: "" });
                alert(`Freeze scheduled from ${freezeDates.startDate} to ${freezeDates.endDate}`);
            } else if (modal.action === 'cancelScheduledFreeze') {
                await api.delete(`/api/subscriptions/cancel-scheduled-freeze/${subscription.subscriptionId}`, { withCredentials: true });
                setScheduledFreezes(scheduledFreezes.filter(f => f.id !== modal.freezeId));
                alert("Scheduled freeze canceled.");
            }
        } catch (error) {
            console.error('Error executing action:', error);
        }
    };

    return (
        <div className="flex min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-900 to-black text-white p-8">
            <div className="w-full flex flex-col items-center justify-center">
                {isLoading ? (
                    <p className="text-lg animate-pulse">Loading...</p>
                ) : subscription ? (
                    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl border border-gray-700">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent mb-6">
                            My Subscription
                        </h1>

                        {/* Subscription Details */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">{subscription.subscriptionChoice} Subscription</h2>
                                <p className="text-purple-400 text-2xl font-bold">${subscription.price}/month</p>
                            </div>

                            {/* Status Section */}
                            <div className="flex justify-between items-center">
                                <p className="text-lg flex items-center">
                                    <strong>Status:</strong>
                                    <span className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${subscription.isFrozen ? 'bg-blue-500' : 'bg-green-500'}`}>
                                        {subscription.isFrozen ? 'Frozen' : 'Active'}
                                    </span>
                                </p>
                                {subscription.isFrozen ? (
                                    <ExclamationCircleIcon className="h-8 w-8 text-blue-400" />
                                ) : (
                                    <CheckCircleIcon className="h-8 w-8 text-green-400" />
                                )}
                            </div>

                            {/* Dates */}
                            <p className="text-lg"><strong>Ending Date:</strong> {formatDate(subscription.endDate)}</p>
                            {subscription.isFrozen && (
                                <p className="text-lg"><strong>Freeze Started:</strong> {formatDate(subscription.freezeStarted)}</p>
                            )}

                            {/* Auto-Renewal Switch */}
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-semibold">Auto-Renewal</p>
                                <label
                                    style={{
                                        fontSize: '17px',
                                        position: 'relative',
                                        display: 'inline-block',
                                        width: '3.5em',
                                        height: '2em',
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={subscription.autoRenewal}
                                        onChange={() => openModal('autoRenew')}
                                        style={{
                                            opacity: 0,
                                            width: 0,
                                            height: 0,
                                        }}
                                    />
                                    <span
                                        style={{
                                            position: 'absolute',
                                            cursor: 'pointer',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            backgroundColor: subscription.autoRenewal ? '#007bff' : '#fff',
                                            border: `1px solid ${subscription.autoRenewal ? '#007bff' : '#adb5bd'}`,
                                            transition: '.4s',
                                            borderRadius: '30px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                position: 'absolute',
                                                content: '""',
                                                height: '1.4em',
                                                width: '1.4em',
                                                borderRadius: '20px',
                                                left: '0.27em',
                                                bottom: '0.25em',
                                                backgroundColor: subscription.autoRenewal ? '#fff' : '#adb5bd',
                                                transition: '.4s',
                                                transform: subscription.autoRenewal ? 'translateX(1.4em)' : 'translateX(0)',
                                            }}
                                        />
                                    </span>
                                </label>
                            </div>

                            {/* Freeze Scheduling Section */}
                            <div className="space-y-4">
                                <h3 className="text-xl font-semibold">Schedule a Freeze</h3>
                                <div className="space-y-2">
                                    <input
                                        type="date"
                                        className="w-full p-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={freezeDates.startDate}
                                        onChange={(e) => setFreezeDates(prev => ({ ...prev, startDate: e.target.value }))}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <input
                                        type="date"
                                        className="w-full p-2 rounded-lg bg-gray-900 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={freezeDates.endDate}
                                        onChange={(e) => setFreezeDates(prev => ({ ...prev, endDate: e.target.value }))}
                                        min={freezeDates.startDate || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <button
                                    onClick={() => openModal('scheduleFreeze')}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                    Schedule Freeze
                                </button>
                            </div>

                            {/* Scheduled Freezes List */}
                            {scheduledFreezes.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Scheduled Freezes</h3>
                                    <div className="max-h-40 overflow-y-auto pr-2">
                                        {scheduledFreezes.map((freeze) => (
                                            <div key={freeze.id} className="flex justify-between items-center text-gray-300 border-b border-gray-600 pb-2">
                                                <p>
                                                    <strong>{formatDate(freeze.startDate)}</strong> to <strong>{formatDate(freeze.endDate)}</strong>
                                                </p>
                                                <button
                                                    onClick={() => openModal('cancelScheduledFreeze', freeze.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300 transform hover:scale-110"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Cancel Subscription Button */}
                            <button
                                onClick={() => openModal('cancel')}
                                className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                                Cancel Subscription
                            </button>
                        </div>

                        {/* Subscription Recommendation */}
                        {userId && <SubscriptionRecommendation userId={userId} />}
                    </div>
                ) : (
                    <p className="text-lg text-gray-400">You do not have an active subscription.</p>
                )}
            </div>

            {/* Confirmation Modal */}
            {modal.isOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl text-center w-80">
                        <h2 className="text-2xl font-bold mb-4">Confirm Action</h2>
                        <p className="mb-6 text-gray-300">Are you sure you want to {modal.action.replace(/([A-Z])/g, ' $1').toLowerCase()}?</p>
                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={closeModal}
                                className="bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-white transition-all duration-300 transform hover:scale-105"
                            >
                                No
                            </button>
                            <button
                                onClick={executeAction}
                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition-all duration-300 transform hover:scale-105"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionManagement;