import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import api from '../api';

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();  // Add useLocation hook to track route changes
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profilePic, setProfilePic] = useState(null); // State to store profile picture
    const [username, setUsername] = useState(''); // State to store username

    useEffect(() => {
        // Function to check session validity
        const checkSession = async () => {
            try {
                const response = await api.get("api/Auth/check-session");
                setIsLoggedIn(response.data.sessionValid); // Update isLoggedIn state based on session validity
                if (response.data.sessionValid) {
                    // Format the profile picture if it exists
                    const profilePicBase64 = response.data.profilePic
                        ? `data:image/png;base64,${response.data.profilePic}`
                        : null;
                    setProfilePic(profilePicBase64); // Set the formatted profile picture
                    setUsername(response.data.username || ''); // Store the username
                }
            } catch (error) {
                console.error("Error checking session:", error);
                setIsLoggedIn(false); // Set logged out state on error
            }
        };

        checkSession(); // Call the function to check session validity when component mounts or location changes
    }, [location]); // Dependency on location means it will re-run when the route changes

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleProfileClick = () => {
        navigate("/account-dashboard");
    };

    const getInitials = (name) => {
        if (!name) return ''; // Return empty string if no name
        const nameParts = name.split(' ');
        const initials = nameParts[0].charAt(0).toUpperCase() + (nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : '');
        return initials; // Combine initials from first and last name
    };

    return (
        <nav className="bg-[#383838] text-white sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <div className="flex items-center space-x-2">
                    <img src="/CSGO.PNG" alt="Cold Storage Go" className="h-14 w-auto" />
                </div>

                <div className="flex space-x-6">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    <Link to="/gallery" className="hover:text-gray-300">Gallery</Link>
                    <Link to="/subscriptions" className="hover:text-gray-300">Subscribe</Link>
                    <Link to="/rewards" className="hover:text-gray-300">Rewards</Link>
                    <Link to="/help-centre" className="hover:text-gray-300">Help Centre</Link>
                    <Link to="/forum" className="hover:text-gray-300">Forum</Link>
                </div>

                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <div className="cursor-pointer" onClick={handleProfileClick}>
                            {profilePic ? (
                                <img
                                    src={profilePic} // Use the formatted Base64 string
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border-2 border-white"
                                />
                            ) : (
                                    <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-800">{getInitials(username)}</span> {/* Show initials if no profile picture */}
                                    </div>

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
                        <Link to="/cart" className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">!</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;