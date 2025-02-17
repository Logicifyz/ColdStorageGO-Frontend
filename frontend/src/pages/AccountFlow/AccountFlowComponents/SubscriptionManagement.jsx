import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import SubscriptionRecommendation from './SubscriptionRecommendation';

const BackgroundBlobs = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-to-r from-[#302b63] to-[#24243e] opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-[#4b379c] to-[#1a1a2e] opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
);

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
    const [freezeMessage, setFreezeMessage] = useState({ type: "", text: "" }); // type: "error" or "success", text: message
    const [canceledFreezes, setCanceledFreezes] = useState(new Set());

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const sessionResponse = await api.get('/api/account/profile', { withCredentials: true });
                const userId = sessionResponse.data.userId;
                setUserId(userId);
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
                setScheduledFreezes(freezeResponse.data);  // ✅ Ensure FreezeId is received and stored
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

        setFreezeMessage({ type: "", text: "" }); // Clear any previous messages
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

                // Fetch the updated list of scheduled freezes
                const freezeResponse = await api.get(`/api/subscriptions/scheduled-freezes/${subscription.subscriptionId}`, { withCredentials: true });
                setScheduledFreezes(freezeResponse.data)
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

                // Update the UI by removing the canceled freeze
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
        <div className="min-h-screen bg-[#0b0b1a] text-gray-100 relative overflow-hidden p-8">
            <BackgroundBlobs />
            <div className="relative z-10 max-w-7xl mx-auto">
                {isLoading ? (
                    <p className="text-lg animate-pulse">Loading...</p>
                ) : subscription ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-[#ffffff10]"
                    >
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-6">
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
                                    <span
                                        className={`ml-2 px-3 py-1 rounded-full text-white text-sm ${subscription.isFrozen ? 'bg-blue-500' : 'bg-green-500'
                                            }`}
                                    >
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
                            <p className="text-lg">
                                <strong>Ending Date:</strong> {formatDate(subscription.endDate)}
                            </p>
                            {subscription.isFrozen && (
                                <p className="text-lg">
                                    <strong>Freeze Started:</strong> {formatDate(subscription.freezeStarted)}
                                </p>
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
                                        className="w-full p-2 rounded-lg bg-[#1a1a2e] text-white border border-[#ffffff10] focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={freezeDates.startDate}
                                        onChange={(e) => setFreezeDates(prev => ({ ...prev, startDate: e.target.value }))}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                    <input
                                        type="date"
                                        className="w-full p-2 rounded-lg bg-[#1a1a2e] text-white border border-[#ffffff10] focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        value={freezeDates.endDate}
                                        onChange={(e) => setFreezeDates(prev => ({ ...prev, endDate: e.target.value }))}
                                        min={freezeDates.startDate || new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                {freezeMessage.text && (
                                    <p className={`text-sm ${freezeMessage.type === "error" ? "text-red-500" : "text-green-500"}`}>
                                        {freezeMessage.text}
                                    </p>
                                )}
                                <button
                                    onClick={handleScheduleFreeze}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                                >
                                    Schedule Freeze
                                </button>
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
                                                    className="flex justify-between items-center text-gray-300 border-b border-[#ffffff10] pb-2"
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
                    </motion.div>
                ) : (
                    <p className="text-lg text-gray-400">You do not have an active subscription.</p>
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
                        <div className="bg-[#1a1a2e]/50 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-[#ffffff10] text-center w-80">
                            <h2 className="text-2xl font-bold mb-4">Confirm Action</h2>
                            <p className="mb-6 text-gray-300">
                                Are you sure you want to {modal.action.replace(/([A-Z])/g, ' $1').toLowerCase()}?
                            </p>
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
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SubscriptionManagement;