// Reward.jsx
import React, { useState, useEffect } from "react";
import api from "../api";

const Reward = () => {
    const [wallet, setWallet] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedReward, setSelectedReward] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const response = await api.get("/api/Wallet");
                setWallet(response.data);
            } catch (error) {
                setErrorMessage("Failed to load wallet. Please try again later.");
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-8 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#ff6b6b20] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#ff8e5320] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] bg-clip-text text-transparent">
                        Rewards Hub
                    </h1>
                    <div className="flex items-center gap-4 bg-[#ffffff10] px-6 py-3 rounded-2xl backdrop-blur-sm border border-[#ffffff15]">
                        <span className="text-xl font-bold text-[#ff8e53]">🪙</span>
                        <span className="text-xl font-bold text-gray-200">
                            {wallet?.currentBalance || 0} CSGO Points
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {rewards.map((reward) => (
                        <div key={reward.rewardId} className="group relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e53] rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
                            <div className="h-full flex flex-col justify-between bg-[#ffffff05] backdrop-blur-sm rounded-3xl p-6 border border-[#ffffff10] hover:border-[#ffffff20] transition-all">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h2 className="text-2xl font-bold text-gray-200">{reward.name}</h2>
                                        <span className="bg-[#ffffff15] px-4 py-1 rounded-full text-[#ff8e53] font-bold flex items-center gap-2">
                                            <span>{reward.coinsCost}</span>
                                            <span className="text-lg">🪙</span>
                                        </span>
                                    </div>
                                    <p className="text-gray-400 leading-relaxed">{reward.description}</p>
                                    <div className="text-sm text-gray-500">
                                        Expires: {new Date(reward.expiryDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRedeemClick(reward)}
                                    className="mt-6 w-full py-3 bg-[#ffffff10] hover:bg-[#ffffff20] rounded-xl font-bold text-[#ff6b6b] transition-colors"
                                >
                                    Redeem Now →
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {errorMessage && (
                    <div className="mt-8 p-4 bg-red-900/20 text-red-400 rounded-xl border border-red-400/30">
                        {errorMessage}
                    </div>
                )}

                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] rounded-3xl p-8 max-w-md w-full border border-[#ffffff15] relative">
                            {isSuccess ? (
                                <div className="text-center space-y-6">
                                    <div className="text-6xl">🎉</div>
                                    <h2 className="text-2xl font-bold text-green-400">Success!</h2>
                                    <p className="text-gray-300">
                                        You've redeemed {selectedReward?.name}. Enjoy your reward!
                                    </p>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="w-full py-3 bg-green-600/20 text-green-400 rounded-xl hover:bg-green-600/30 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold text-center">Confirm Redemption</h2>
                                    <div className="bg-[#ffffff05] p-6 rounded-xl border border-[#ffffff10]">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-gray-300">{selectedReward?.name}</span>
                                            <span className="text-[#ff8e53] font-bold">
                                                {selectedReward?.coinsCost} 🪙
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            This action will deduct {selectedReward?.coinsCost} CSGO Points from your account.
                                        </div>
                                        <div className="mt-4 space-y-2 text-sm text-gray-300">
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
                                            className="flex-1 py-3 bg-green-600/20 text-green-400 rounded-xl hover:bg-green-600/30 transition-colors"
                                        >
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 py-3 bg-red-600/20 text-red-400 rounded-xl hover:bg-red-600/30 transition-colors"
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
