import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api";
import { motion } from "framer-motion"; // For animations
import { FiUser, FiMail, FiPhone, FiMapPin, FiShield, FiCheck, FiX, FiZap } from "react-icons/fi"; // Icons for flair

const AccountDetails = () => {
    const { userID } = useParams(); // Get userID from URL params
    const [userDetails, setUserDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false); // To disable button during API call

    // Fetch user details from the API
    const fetchUserDetails = async () => {
        try {
            const response = await api.get(`/api/StaffAccount/GetUserDetails/${userID}`, {
                withCredentials: true, // Include cookies (for sessionId)
            });
            setUserDetails(response.data);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching user details:", error);
            setErrorMessage("Failed to load user details.");
            setIsLoading(false);
        }
    };

    // Handle Activate/Deactivate Account
    const handleToggleActivation = async () => {
        setIsProcessing(true);

        try {
            if (userDetails.administration.activation) {
                // If active, deactivate the account
                await api.put(`/api/StaffAccount/DeactivateAccount/${userID}`, {}, {
                    withCredentials: true,
                });
                setUserDetails(prevDetails => ({
                    ...prevDetails,
                    administration: {
                        ...prevDetails.administration,
                        activation: false,
                    }
                }));
            } else {
                // If inactive, activate the account
                await api.put(`/api/StaffAccount/ActivateAccount/${userID}`, {}, {
                    withCredentials: true,
                });
                setUserDetails(prevDetails => ({
                    ...prevDetails,
                    administration: {
                        ...prevDetails.administration,
                        activation: true,
                    }
                }));
            }
        } catch (error) {
            console.error("Error updating account status:", error);
            alert("Failed to update account status.");
        }

        setIsProcessing(false);
    };

    // Fetch user details on component mount
    useEffect(() => {
        fetchUserDetails();
    }, [userID]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-[#355E3B] text-2xl"
                >
                    Loading...
                </motion.div>
            </div>
        );
    }

    if (errorMessage) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-red-800 font-bold text-2xl"
                >
                    {errorMessage}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#F0EAD6] min-h-screen relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header with Animation */}
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl font-bold mb-6 text-[#355E3B] text-center"
                >
                    User Account Details
                </motion.h1>

                {userDetails ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <h2 className="text-2xl font-semibold text-[#355E3B] mb-4 flex items-center gap-2">
                                <FiUser className="text-[#355E3B]" /> Basic Information
                            </h2>
                            <div className="space-y-3">
                                <p className="text-gray-800"><span className="font-semibold">Full Name:</span> {userDetails.profile?.fullName || "N/A"}</p>
                                <p className="text-gray-800"><span className="font-semibold">Username:</span> {userDetails.username}</p>
                                <p className="text-gray-800"><span className="font-semibold">Email:</span> {userDetails.email}</p>
                                <p className="text-gray-800"><span className="font-semibold">Phone Number:</span> {userDetails.profile?.phoneNumber || "N/A"}</p>
                            </div>
                        </motion.div>

                        {/* Account Status */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <h2 className="text-2xl font-semibold text-[#355E3B] mb-4 flex items-center gap-2">
                                <FiShield className="text-[#355E3B]" /> Account Status
                            </h2>
                            <div className="space-y-3">
                                <p className="text-gray-800">
                                    <span className="font-semibold">Active:</span>{" "}
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm font-semibold ${userDetails.administration.activation
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {userDetails.administration.activation ? "Active" : "Inactive"}
                                    </span>
                                </p>
                                <p className="text-gray-800">
                                    <span className="font-semibold">Verified:</span>{" "}
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm font-semibold ${userDetails.administration.verified
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {userDetails.administration.verified ? "Yes" : "No"}
                                    </span>
                                </p>
                                <p className="text-gray-800">
                                    <span className="font-semibold">Online Status:</span>{" "}
                                    <span
                                        className={`px-2 py-1 rounded-full text-sm font-semibold ${userDetails.isOnline
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {userDetails.isOnline ? "Online" : "Offline"}
                                    </span>
                                </p>

                                <button
                                    className={`mt-4 w-full px-4 py-2 rounded-lg text-white font-semibold ${userDetails.administration.activation
                                            ? "bg-red-600 hover:bg-red-700"
                                            : "bg-green-600 hover:bg-green-700"
                                        } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={handleToggleActivation}
                                    disabled={isProcessing}
                                >
                                    {isProcessing
                                        ? "Processing..."
                                        : userDetails.administration.activation
                                            ? "Deactivate Account"
                                            : "Activate Account"}
                                </button>
                            </div>
                        </motion.div>

                        {/* Address */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <h2 className="text-2xl font-semibold text-[#355E3B] mb-4 flex items-center gap-2">
                                <FiMapPin className="text-[#355E3B]" /> Address
                            </h2>
                            <div className="space-y-3">
                                <p className="text-gray-800"><span className="font-semibold">Street Address:</span> {userDetails.profile?.streetAddress || "N/A"}</p>
                                <p className="text-gray-800"><span className="font-semibold">Postal Code:</span> {userDetails.profile?.postalCode || "N/A"}</p>
                            </div>
                        </motion.div>

                        {/* Additional Information */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <h2 className="text-2xl font-semibold text-[#355E3B] mb-4 flex items-center gap-2">
                                <FiZap className="text-[#355E3B]" /> Additional Information
                            </h2>
                            <div className="space-y-3">
                                <p className="text-gray-800"><span className="font-semibold">Subscription Status:</span> {userDetails.profile?.subscriptionStatus || "N/A"}</p>
                                <p className="text-gray-800"><span className="font-semibold">Password Reset Token:</span> {userDetails.administration.passwordResetToken || "N/A"}</p>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="text-center text-[#355E3B] text-2xl">No user details available.</div>
                )}
            </div>
        </div>
    );
};

export default AccountDetails;