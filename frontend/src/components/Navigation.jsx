import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import api from '../api';

const Navigation = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profilePic, setProfilePic] = useState(null); // State to store profile picture

    useEffect(() => {
        // Function to check session validity
        const checkSession = async () => {
            try {
                const response = await api.get("api/Auth/check-session");
                setIsLoggedIn(response.data.sessionValid); // Update isLoggedIn state based on session validity
                if (response.data.sessionValid) {
                    // Assuming the profile picture URL is part of the response
                    setProfilePic(response.data.profilePic || null);
                }
            } catch (error) {
                console.error("Error checking session:", error);
                setIsLoggedIn(false); // Set logged out state on error
            }
        };

        checkSession(); // Call the function to check session validity
    }, []);

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleProfileClick = () => {
        navigate("/account-dashboard");
    };

    return (
        <nav className="bg-[#383838] text-white sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <div className="flex items-center space-x-2">
                    <img src="/CSGO.PNG" alt="Cold Storage Go" className="h-14 w-auto" />
                </div>

                <div className="flex space-x-6">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    <Link to="/mealkits" className="hover:text-gray-300">Mealkits</Link>
                    <Link to="/subscribe" className="hover:text-gray-300">Subscribe</Link>
                    <Link to="/rewards" className="hover:text-gray-300">Rewards</Link>
                    <Link to="/help" className="hover:text-gray-300">Help Centre</Link>
                    <Link to="/forum" className="hover:text-gray-300">Forum</Link>
                </div>

                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <div className="cursor-pointer" onClick={handleProfileClick}>
                            {profilePic ? (
                                <img
                                    src={profilePic}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border-2 border-white"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-white"></div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleLoginClick}
                            className="border border-white px-4 py-2 rounded hover:bg-white hover:text-[#383838]"
                        >
                            Login
                        </button>
                    )}
                    <div className="relative">
                        <AiOutlineShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
