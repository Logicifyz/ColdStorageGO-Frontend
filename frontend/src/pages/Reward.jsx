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
            setWallet((prev) => ({ ...prev, currentBalance: prev.currentBalance - selectedReward.coinsCost }));
        } catch (error) {
            setErrorMessage("Failed to redeem reward. Please try again later.");
        }
    };

    return (
        <div className="bg-[#383838] min-h-screen p-6 text-white">
            <h1 className="text-4xl font-bold mb-6">Rewards</h1>
            <div className="text-right mb-4 text-lg font-semibold">Your CSGO Points: {wallet?.currentBalance || 0} 🪙</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                    <div key={reward.rewardId} className="flex flex-col items-center">
                        <div className="bg-gradient-to-br from-purple-400 to-blue-900 rounded-lg p-10 shadow-lg w-full">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">{reward.name}</h2>
                                <span className="bg-white text-purple-700 font-bold px-5 py-1 rounded-full">{reward.coinsCost} 🪙</span>
                            </div>
                            <p className="mt-2 text-md font-light">{reward.description}</p>
                            <p className="text-sm mt-2 opacity-80">Expires on: {new Date(reward.expiryDate).toLocaleDateString()}</p>
                        </div>
                        <button
                            onClick={() => handleRedeemClick(reward)}
                            className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-bold">
                            Redeem the reward
                        </button>
                    </div>
                ))}
            </div>
            {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-[#2D2D2D] p-6 rounded-lg shadow-lg text-center max-w-sm">
                        {isSuccess ? (
                            <>
                                <h2 className="text-xl font-bold text-green-400">Successfully Redeemed!</h2>
                                <p className="mt-2">You have redeemed {selectedReward?.name}. Enjoy!</p>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-lg">
                                    Close
                                </button>
                            </>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold">Are you sure?</h2>
                                <p className="mt-2">You are about to redeem <span className="text-purple-400 font-bold">{selectedReward?.name}</span>. This action is irreversible.</p>
                                <div className="flex justify-center gap-4 mt-4">
                                    <button
                                        onClick={handleConfirmRedeem}
                                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg">
                                        Confirm
                                    </button>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-6 rounded-lg">
                                        Cancel
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reward;
