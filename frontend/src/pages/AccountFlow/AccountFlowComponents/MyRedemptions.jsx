import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from "../../../api";
import { ChevronDownIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { ClipboardIcon } from "@heroicons/react/24/outline";

const MyRedemptions = () => {
    const [redemptions, setRedemptions] = useState([]);
    const [expandedRedemption, setExpandedRedemption] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Helper to map reward type to full name.
    const getRewardName = (rewardType) => {
        switch (rewardType) {
            case 'Voucher5':
                return '5$ Discount Voucher';
            case 'Voucher10':
                return '10$ Discount Voucher';
            case 'Voucher15':
                return '15$ Discount Voucher';
            case 'Voucher20':
                return '20$ Discount Voucher';
            default:
                return rewardType;
        }
    };

    useEffect(() => {
        const fetchRedemptions = async () => {
            try {
                const response = await api.get('/api/Wallet/redemptions');
                let fetchedRedemptions = response.data;

                // Enrich each redemption with the reward name from the Rewards API.
                const enrichedRedemptions = await Promise.all(
                    fetchedRedemptions.map(async (redemption) => {
                        try {
                            const rewardResponse = await api.get(`/api/rewards/${redemption.rewardId}`);
                            const reward = rewardResponse.data;
                            return {
                                ...redemption,
                                rewardName: getRewardName(reward.rewardType)
                            };
                        } catch (err) {
                            // If there is an error fetching reward, return the redemption without rewardName.
                            return { ...redemption, rewardName: redemption.rewardId };
                        }
                    })
                );

                // Sort: active (usable and not expired) first, then used/expired.
                enrichedRedemptions.sort((a, b) => {
                    const aActive = a.rewardUsable && new Date(a.expiryDate) >= new Date();
                    const bActive = b.rewardUsable && new Date(b.expiryDate) >= new Date();
                    if (aActive === bActive) return 0;
                    return aActive ? -1 : 1;
                });

                setRedemptions(enrichedRedemptions);
                setLoading(false);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setRedemptions([]);
                    setLoading(false);
                } else {
                    setError('Failed to load redemptions');
                    setLoading(false);
                }
            }
        };

        fetchRedemptions();
    }, []);

    const toggleExpand = (redemptionId) => {
        setExpandedRedemption(expandedRedemption === redemptionId ? null : redemptionId);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // Add toast notification here if needed
    };

    const getStatusStyle = (usable, expiry) => {
        if (new Date(expiry) < new Date()) return 'bg-red-900/30 text-red-300';
        return usable ? 'bg-emerald-900/30 text-emerald-300' : 'bg-amber-900/30 text-amber-300';
    };

    if (loading)
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full"
                />
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-red-400">
                {error}
            </div>
        );

    return (
        <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden p-8">
            {/* Abstract background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-to-r from-purple-700/10 to-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-pink-700/10 to-cyan-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <SparklesIcon className="w-12 h-12 text-purple-400" />
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        My Rewards Vault
                    </h1>
                </div>

                {redemptions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-gray-400 py-20">
                        <p className="text-xl font-semibold mt-4">No rewards redeemed yet</p>
                        <p className="mt-2 text-sm text-gray-500">
                            Your redeemed rewards will appear here when available.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence>
                            {redemptions.map((redemption) => (
                                <motion.div
                                    key={redemption.redemptionId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 backdrop-blur-xl rounded-2xl border border-[#ffffff10] shadow-2xl overflow-hidden"
                                >
                                    <div className="p-6 cursor-pointer" onClick={() => toggleExpand(redemption.redemptionId)}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`px-3 py-1 rounded-full ${getStatusStyle(redemption.rewardUsable, redemption.expiryDate)}`}>
                                                    {new Date(redemption.expiryDate) < new Date()
                                                        ? 'Expired'
                                                        : redemption.rewardUsable
                                                            ? 'Active'
                                                            : 'Used'}
                                                </div>
                                                <span className="text-gray-300">
                                                    Reward: {redemption.rewardName}
                                                </span>
                                            </div>
                                            <ChevronDownIcon
                                                className={`w-6 h-6 transform transition-transform ${expandedRedemption === redemption.redemptionId ? 'rotate-180' : ''
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {expandedRedemption === redemption.redemptionId && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                exit={{ opacity: 0, height: 0 }}
                                                className="border-t border-[#ffffff10]"
                                            >
                                                <div className="p-6 space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="bg-[#ffffff05] p-4 rounded-xl">
                                                            <p className="text-sm text-gray-400 mb-2">Expiry Date</p>
                                                            <p className="text-gray-200">
                                                                {new Date(redemption.expiryDate).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div className="bg-[#ffffff05] p-4 rounded-xl">
                                                            <p className="text-sm text-gray-400 mb-2">Reward Code</p>
                                                            <div className="flex items-center justify-between">
                                                                <span className="font-mono text-purple-300">
                                                                    {redemption.redemptionId.slice(0, 8).toUpperCase()}
                                                                </span>
                                                                <button
                                                                    onClick={() => copyToClipboard(redemption.redemptionId)}
                                                                    className="p-2 hover:bg-[#ffffff10] rounded-lg"
                                                                >
                                                                    <ClipboardIcon className="w-5 h-5 text-gray-400" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-[#ffffff05] p-4 rounded-xl">
                                                        <p className="text-sm text-gray-400 mb-2">Terms & Conditions</p>
                                                        <p className="text-gray-300">
                                                            This reward is {redemption.rewardUsable ? 'ready to use' : 'already used'}.
                                                            Present this code at checkout to redeem your reward.
                                                        </p>
                                                    </div>

                                                 
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyRedemptions;
