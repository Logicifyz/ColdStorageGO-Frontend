import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import SubscriptionRecommendation from './SubscriptionRecommendation';

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

const SubscriptionManagement = () => {
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [modal, setModal] = useState({ isOpen: false, action: null, freezeId: null });
    const [freezeDates, setFreezeDates] = useState({ startDate: "", endDate: "" });
    const [scheduledFreezes, setScheduledFreezes] = useState([]);
    const [userId, setUserId] = useState(null);
    const [freezeMessage, setFreezeMessage] = useState({ type: "", text: "" });
    const [canceledFreezes, setCanceledFreezes] = useState(new Set());

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const sessionResponse = await api.get('/api/account/profile', { withCredentials: true });
                setUserId(sessionResponse.data.userId);

                const response = await api.get(`/api/subscriptions/user?userId=${sessionResponse.data.userId}`);
                if (!response.data || response.data.isCanceled) {
                    setSubscription(null);
                    return;
                }

                setSubscription(response.data);
                const freezeResponse = await api.get(`/api/subscriptions/scheduled-freezes/${response.data.subscriptionId}`, { withCredentials: true });
                setScheduledFreezes(freezeResponse.data);

                const storedCanceledFreezes = JSON.parse(localStorage.getItem('canceledFreezes')) || [];
                setCanceledFreezes(new Set(storedCanceledFreezes));
            } catch (error) {
                console.error('Error fetching subscription:', error);
                setSubscription(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscription();
    }, []);

    const validateFreezeDates = () => {
        if (!freezeDates.startDate || !freezeDates.endDate) {
            setFreezeMessage({ type: "error", text: "Please select both start and end dates." });
            return false;
        }

        if (new Date(freezeDates.startDate) >= new Date(freezeDates.endDate)) {
            setFreezeMessage({ type: "error", text: "End date must be after start date." });
            return false;
        }

        if (subscription && (new Date(freezeDates.startDate) > new Date(subscription.endDate) || new Date(freezeDates.endDate) > new Date(subscription.endDate))) {
            setFreezeMessage({ type: "error", text: "Freeze dates cannot be after the subscription's end date." });
            return false;
        }

        setFreezeMessage({ type: "", text: "" });
        return true;
    };

    const handleScheduleFreeze = () => {
        if (validateFreezeDates()) {
            openModal('scheduleFreeze');
        }
    };

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
                setFreezeMessage({ type: "success", text: "Subscription canceled successfully." });
            } else if (modal.action === 'autoRenew') {
                await api.put(`/api/subscriptions/toggle-autorenewal/${subscription.subscriptionId}`, {}, { withCredentials: true });
                setSubscription(prev => ({
                    ...prev,
                    autoRenewal: !prev.autoRenewal,
                }));
            } else if (modal.action === 'freeze') {
                await api.put(`/api/subscriptions/toggle-freeze/${subscription.subscriptionId}`, {}, { withCredentials: true });
                setSubscription(prev => ({
                    ...prev,
                    isFrozen: !prev.isFrozen,
                    freezeStarted: prev.isFrozen ? null : new Date().toISOString(),
                }));
            } else if (modal.action === 'scheduleFreeze') {
                const response = await api.post(
                    `/api/subscriptions/schedule-freeze/${subscription.subscriptionId}`,
                    { startDate: freezeDates.startDate, endDate: freezeDates.endDate },
                    { withCredentials: true }
                );

                const freezeResponse = await api.get(`/api/subscriptions/scheduled-freezes/${subscription.subscriptionId}`, { withCredentials: true });
                setScheduledFreezes(freezeResponse.data);
                setFreezeDates({ startDate: "", endDate: "" });
                setFreezeMessage({ type: "success", text: `Freeze scheduled from ${freezeDates.startDate} to ${freezeDates.endDate}` });
            } else if (modal.action === 'cancelScheduledFreeze') {
                if (!modal.freezeId) {
                    setFreezeMessage({ type: "error", text: "Freeze ID is missing." });
                    return;
                }

                await api.delete(
                    `/api/subscriptions/cancel-scheduled-freeze/${subscription.subscriptionId}/${modal.freezeId}`,
                    { withCredentials: true }
                );

                setScheduledFreezes(prev => prev.filter(f => f.id !== modal.freezeId));
                const updatedCanceledFreezes = new Set([...canceledFreezes, modal.freezeId]);
                setCanceledFreezes(prev => new Set([...prev, modal.freezeId]));
                localStorage.setItem('canceledFreezes', JSON.stringify([...updatedCanceledFreezes]));
                setFreezeMessage({ type: "success", text: "Scheduled freeze canceled successfully." });
            }
        } catch (error) {
            console.error('Error executing action:', error);
            if (error.response) {
                setFreezeMessage({ type: "error", text: error.response.data || "An unexpected error occurred. Please try again." });
            } else {
                setFreezeMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5DC] text-[#2D4B33] relative flex justify-center items-center p-6">
            <div className="w-full max-w-4xl p-8 rounded-3xl shadow-lg bg-white/90 backdrop-blur-lg border border-green-200">
                {isLoading ? (
                    <p className="text-lg text-center animate-pulse">Loading...</p>
                ) : subscription ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Subscription Header */}
                        <div className="text-center">
                            <h1 className="text-4xl font-bold text-green-700">My Subscription</h1>
                            <p className="text-md text-gray-500 mt-1">Manage your active subscription below.</p>
                        </div>

                        {/* Subscription Info Card */}
                        <div className="bg-green-100 p-6 rounded-xl shadow-md border border-green-300">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-semibold">{subscription.subscriptionChoice} Plan</h2>
                                <p className="text-green-800 text-xl font-bold">${subscription.price}/month</p>
                            </div>

                            <p className="text-gray-600 mt-1">Subscription ID: {subscription.subscriptionId}</p>

                            {/* Status */}
                            <div className="flex items-center mt-3">
                                <strong className="mr-2">Status:</strong>
                                {subscription.isFrozen ? (
                                    <span className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center">
                                        <ExclamationCircleIcon className="w-5 h-5 mr-1" /> Frozen
                                    </span>
                                ) : (
                                    <span className="bg-green-500 text-white px-3 py-1 rounded-lg flex items-center">
                                        <CheckCircleIcon className="w-5 h-5 mr-1" /> Active
                                    </span>
                                )}
                            </div>

                            {/* Dates */}
                            <p className="mt-2"><strong>End Date:</strong> {formatDate(subscription.endDate)}</p>
                        </div>

                        {/* Freeze Scheduling */}
                        <div className="bg-white p-6 rounded-xl shadow-md border border-green-300">
                            <h3 className="text-xl font-semibold text-green-700">Schedule a Freeze</h3>
                            <div className="flex flex-col mt-3 space-y-2">
                                <input
                                    type="date"
                                    className="p-2 rounded-lg border border-gray-300"
                                    value={freezeDates.startDate}
                                    onChange={(e) => setFreezeDates(prev => ({ ...prev, startDate: e.target.value }))}
                                />
                                <input
                                    type="date"
                                    className="p-2 rounded-lg border border-gray-300"
                                    value={freezeDates.endDate}
                                    onChange={(e) => setFreezeDates(prev => ({ ...prev, endDate: e.target.value }))}
                                />
                                {freezeMessage.text && (
                                    <p className={`text-sm ${freezeMessage.type === "error" ? "text-red-500" : "text-green-500"}`}>
                                        {freezeMessage.text}
                                    </p>
                                )}
                                <button
                                    onClick={handleScheduleFreeze}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
                                >
                                    Schedule Freeze
                                </button>
                            </div>
                        </div>
                            {/* Scheduled Freezes List */}
                            {scheduledFreezes.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Scheduled Freezes</h3>
                                    <div className="max-h-40 overflow-y-auto pr-2">
                                        {scheduledFreezes.map((freeze) => {
                                            const freezeEndDate = new Date(freeze.endDate);
                                            const todayPlusOne = new Date();
                                            todayPlusOne.setDate(todayPlusOne.getDate() + 1);

                                            return (
                                                <div
                                                    key={freeze.freezeId}
                                                    className="flex justify-between items-center text-[#2D4B33] border-b border-[#2D4B33] pb-2"
                                                >
                                                    <p>
                                                        <strong>{formatDate(freeze.startDate)}</strong> to <strong>{formatDate(freeze.endDate)}</strong>
                                                    </p>
                                                    {!canceledFreezes.has(freeze.freezeId) && (
                                                        <button
                                                            onClick={() => openModal('cancelScheduledFreeze', freeze.freezeId)}
                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm transition-all duration-300 transform hover:scale-110"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        {/* Cancel Subscription */}
                        <button
                            onClick={() => openModal('cancel')}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
                        >
                            Cancel Subscription
                        </button>

                        {/* Recommendations */}
                            {userId && (
                                console.log('UserId:', userId), // Add this line
                                <SubscriptionRecommendation userId={userId} />
                            )}                    </motion.div>
                ) : (
                    <p className="text-lg text-center text-gray-600">You do not have an active subscription.</p>
                )}
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
                        <div className="bg-white/90 backdrop-blur-lg p-6 rounded-xl shadow-lg border border-green-300 text-center w-80">
                            <h2 className="text-2xl font-bold text-green-700 mb-4">Confirm Action</h2>
                            <p className="mb-6 text-gray-600">
                                Are you sure you want to {modal.action.replace(/([A-Z])/g, ' $1').toLowerCase()}?
                            </p>
                            <div className="flex justify-center space-x-4">
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold"
                                >
                                    No
                                </button>
                                <button
                                    onClick={executeAction}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"
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

export default SubscriptionManagement;