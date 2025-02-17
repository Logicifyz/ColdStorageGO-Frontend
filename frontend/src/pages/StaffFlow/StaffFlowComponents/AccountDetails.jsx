import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../../api";

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
        return <div className="text-black">Loading...</div>;
    }

    if (errorMessage) {
        return <div className="text-red-800 font-bold">{errorMessage}</div>;
    }

    return (
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-4xl font-bold mb-6 text-black">User Account Details</h1>

            {userDetails ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border rounded-lg p-4 shadow-md">
                        <h2 className="text-2xl font-semibold text-black mb-2">Basic Information</h2>
                        <p className="text-black"><span className="font-semibold">Full Name:</span> {userDetails.profile?.fullName || "N/A"}</p>
                        <p className="text-black"><span className="font-semibold">Username:</span> {userDetails.username}</p>
                        <p className="text-black"><span className="font-semibold">Email:</span> {userDetails.email}</p>
                        <p className="text-black"><span className="font-semibold">Phone Number:</span> {userDetails.profile?.phoneNumber || "N/A"}</p>
                    </div>

                    <div className="border rounded-lg p-4 shadow-md">
                        <h2 className="text-2xl font-semibold text-black mb-2">Account Status</h2>
                        <p className="text-black">
                            <span className="font-semibold">Active:</span> {userDetails.administration.activation ? "Active" : "Inactive"}
                        </p>
                        <p className="text-black"><span className="font-semibold">Verified:</span> {userDetails.administration.verified ? "Yes" : "No"}</p>
                        <p className="text-black"><span className="font-semibold">Online Status:</span> {userDetails.isOnline ? "Online" : "Offline"}</p>

                        <button
                            className={`mt-4 px-4 py-2 rounded-lg text-white ${userDetails.administration.activation ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={handleToggleActivation}
                            disabled={isProcessing}
                        >
                            {isProcessing
                                ? 'Processing...'
                                : userDetails.administration.activation
                                    ? 'Deactivate Account'
                                    : 'Activate Account'
                            }
                        </button>
                    </div>

                    <div className="border rounded-lg p-4 shadow-md">
                        <h2 className="text-2xl font-semibold text-black mb-2">Address</h2>
                        <p className="text-black"><span className="font-semibold">Street Address:</span> {userDetails.profile?.streetAddress || "N/A"}</p>
                        <p className="text-black"><span className="font-semibold">Postal Code:</span> {userDetails.profile?.postalCode || "N/A"}</p>
                    </div>

                    <div className="border rounded-lg p-4 shadow-md">
                        <h2 className="text-2xl font-semibold text-black mb-2">Additional Information</h2>
                        <p className="text-black"><span className="font-semibold">Subscription Status:</span> {userDetails.profile?.subscriptionStatus || "N/A"}</p>
                        <p className="text-black"><span className="font-semibold">Password Reset Token:</span> {userDetails.administration.passwordResetToken || "N/A"}</p>
                    </div>
                </div>
            ) : (
                <div className="text-black">No user details available.</div>
            )}
        </div>
    );
};

export default AccountDetails;
