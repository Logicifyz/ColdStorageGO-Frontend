import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Reward = () => {
    const [wallet, setWallet] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedReward, setSelectedReward] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const response = await api.get("/api/Wallet");
                setWallet(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    setErrorMessage("Please log in to access rewards.");
                } else {
                    setErrorMessage("Failed to load wallet. Please try again later.");
                }
            }
        };

        const fetchRewards = async () => {
            try {
                const response = await api.get("/api/Rewards");
                setRewards(response.data);
            } catch (error) {
                setErrorMessage("Failed to load rewards. Please try again later.");
            }
        };

        fetchWallet();
        fetchRewards();
    }, []);

    const handleRedeemClick = (reward) => {
        setSelectedReward(reward);
        setIsModalOpen(true);
        setIsSuccess(false);
    };

    const handleConfirmRedeem = async () => {
        if (!selectedReward) return;
        try {
            await api.post(`/api/Wallet/redeem?rewardId=${selectedReward.rewardId}`);
            setIsSuccess(true);
            setWallet((prev) => ({
                ...prev,
                currentBalance: prev.currentBalance - selectedReward.coinsCost,
            }));
        } catch (error) {
            setErrorMessage("Failed to redeem reward. Please try again later.");
        }
    };

    const handleLoginRedirect = () => {
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-[#F0EAD6] p-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#2D4B3310] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#355E3B10] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-[#2D4B33] to-[#355E3B] bg-clip-text text-transparent">
                        Rewards Hub
                    </h1>
                    <div className="flex items-center gap-4 bg-white/80 px-6 py-3 rounded-2xl shadow border border-[#E2F2E6]">
                        <span className="text-xl font-bold text-[#355E3B]">🪙</span>
                        <span className="text-xl font-bold text-[#2D4B33]">
                            {wallet?.currentBalance || 0} CSGO Points
                        </span>
                    </div>
                </div>

                {errorMessage ? (
                    <div className="mt-8 p-4 bg-red-900/20 text-red-500 rounded-xl border border-red-500/30">
                        <p>{errorMessage}</p>
                        {errorMessage === "Please log in to access rewards." && (
                            <button
                                onClick={handleLoginRedirect}
                                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                            >
                                Log In
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rewards.map((reward) => (
                            <div key={reward.rewardId} className="group relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#2D4B33] to-[#355E3B] rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="h-full flex flex-col justify-between bg-white/90 backdrop-blur-sm rounded-3xl p-6 border border-[#E2F2E6] hover:border-[#E2F2E6] transition-all">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <h2 className="text-2xl font-bold text-[#2D4B33]">
                                                {reward.name}
                                            </h2>
                                            <span className="bg-[#E2F2E6] px-4 py-1 rounded-full text-[#355E3B] font-bold flex items-center gap-2">
                                                <span>{reward.coinsCost}</span>
                                                <span className="text-lg">🪙</span>
                                            </span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed">{reward.description}</p>
                                        <div className="text-sm text-gray-500">
                                            Expires: {new Date(reward.expiryDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRedeemClick(reward)}
                                        className="mt-6 w-full py-3 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] rounded-xl font-bold text-white transition-colors"
                                    >
                                        Redeem Now →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-[#E2F2E6] relative">
                            {isSuccess ? (
                                <div className="text-center space-y-6">
                                    <div className="text-6xl">🎉</div>
                                    <h2 className="text-2xl font-bold text-[#2D4B33]">Success!</h2>
                                    <p className="text-gray-700">
                                        You've redeemed {selectedReward?.name}. Enjoy your reward!
                                    </p>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full py-3 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] text-white rounded-xl hover:opacity-90 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-center text-[#2D4B33]">
                                        Confirm Redemption
                                    </h2>
                                    <div className="bg-white p-6 rounded-xl border border-[#E2F2E6]">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[#2D4B33]">{selectedReward?.name}</span>
                                            <span className="text-[#355E3B] font-bold">
                                                {selectedReward?.coinsCost} 🪙
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-700">
                                            This action will deduct {selectedReward?.coinsCost} CSGO Points from your account.
                                        </div>
                                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                                            <div className="flex justify-between">
                                                <span>Current Points:</span>
                                                <span>{wallet?.currentBalance || 0}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Points After Redemption:</span>
                                                <span>
                                                    {wallet ? wallet.currentBalance - selectedReward.coinsCost : 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            onClick={handleConfirmRedeem}
                                            className="flex-1 py-3 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] text-white rounded-xl hover:opacity-90 transition-colors"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reward;
