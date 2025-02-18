import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import api from '../api';
import { FaPlus, FaBell } from "react-icons/fa";

const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [profilePic, setProfilePic] = useState(null); 
    const [showCreatePostDropdown, setShowCreatePostDropdown] = useState(false);
    const [username, setUsername] = useState(''); // State to store username
    const [unreadNotifications, setUnreadNotifications] = useState(0);  // State for unread notifications


    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await api.get("api/Auth/check-session");
                setIsLoggedIn(response.data.sessionValid);
                if (response.data.sessionValid) {
                    const profilePicBase64 = response.data.profilePic
                        ? `data:image/png;base64,${response.data.profilePic}`
                        : null;
                    setProfilePic(profilePicBase64);
                    setUsername(response.data.username || '');
                }
            } catch (error) {
                console.error("Error checking session:", error);
                setIsLoggedIn(false);
            }
        };
        const fetchUnreadNotifications = async () => {
            try {
                const response = await api.get("api/Notification/UnreadCount");
                setUnreadNotifications(response.data.unreadCount); // Fetch unread notification count
            } catch (error) {
                console.error("Error fetching unread notifications:", error);
            }
        };

        checkSession();
        if (isLoggedIn) {
            fetchUnreadNotifications(); // Fetch unread notifications only when the user is logged in
        }

        checkSession(); // Call the function to check session validity when component mounts or location changes
    }, [location.pathname, isLoggedIn]);  // Now also depends on location.pathname

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleProfileClick = () => {
        navigate("/account-dashboard");
    };

    const toggleCreatePostDropdown = () => {
        setShowCreatePostDropdown(!showCreatePostDropdown);
    };
    const handleNotificationsClick = () => {
        navigate("/account-dashboard/notifications"); // Navigate to the notifications page
    };
    const getInitials = (name) => {
        if (!name) return '';
        const nameParts = name.split(' ');
        const initials = nameParts[0].charAt(0).toUpperCase() + (nameParts[1] ? nameParts[1].charAt(0).toUpperCase() : '');
        return initials;
    };

    return (
        <>
        <nav className="bg-[#F0EAD6] text-[#2D4B33] sticky top-0 z-50 shadow-md">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <div className="flex items-center space-x-2">
                    <img src="/CSGO.PNG" alt="Cold Storage Go" className="h-14 w-auto" />
                </div>

                <div className="flex space-x-6">
                    <Link to="/" className="hover:text-[#355E3B]">Home</Link>
                    <Link to="/gallery" className="hover:text-[#355E3B]">Gallery</Link>
                    <Link to="/subscriptions" className="hover:text-[#355E3B]">Subscribe</Link>
                    <Link to="/rewards" className="hover:text-[#355E3B]">Rewards</Link>
                    <Link to="/help-centre" className="hover:text-[#355E3B]">Help Centre</Link>
                    <Link to="/forum" className="hover:text-[#355E3B]">Forum</Link>
                    <Link to="/cheffie-ai" className="hover:text-[#355E3B]">Cheffie AI</Link>
                </div>

                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <div className="cursor-pointer" onClick={handleProfileClick}>
                            {profilePic ? (
                                <img
                                    src={profilePic}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border-2 border-[#2D4B33]"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full border-2 border-[#2D4B33] bg-[#E2F2E6] flex items-center justify-center">
                                    <span className="text-[#2D4B33]">{getInitials(username)}</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleLoginClick}
                            className="border border-[#2D4B33] px-4 py-2 rounded hover:bg-[#355E3B] hover:text-white"
                        >
                            Login
                        </button>
                    )}

                    <div className="relative">
                        <AiOutlineShoppingCart className="w-6 h-6 text-black" />
                        <Link to="/cart" className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">!</Link>
                        </div>

                        <div className="relative cursor-pointer" onClick={handleNotificationsClick}>
                            <FaBell className="w-6 h-6 text-black" />
                            {unreadNotifications > 0 && (
                                <div className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                    {unreadNotifications}
                                </div>
                            )}
                        </div>
                        <AiOutlineShoppingCart className="w-6 h-6" />
                        <Link to="/cart" className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                            !
                        </Link>
                    </div>
                </div>
        </nav>

            {location.pathname.startsWith("/forum") && (
                <div className="bg-[#f0f0e0] text-[#123524] py-4 px-6 flex justify-between items-center sticky top-[85px] w-full z-40">
                    <div className="flex items-center space-x-2">
                        <img src="/CSGO.PNG" alt="Cold Storage Go" className="h-10 w-auto" />
                        <h1 className="text-2xl font-semibold">Community</h1>
                    </div>
                    <div className="relative flex items-center space-x-4">
                        {isLoggedIn ? (
                            <div className="cursor-pointer" onClick={handleProfileClick}>
                                {profilePic ? (
                                    <img
                                        src={profilePic}
                                        alt="Profile"
                                        className="w-8 h-8 rounded-full border-2 border-[#123524]"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full border-2 border-[#123524] bg-[#e0e0d0] flex items-center justify-center">
                                        <span className="text-[#123524]">{getInitials(username)}</span>
                                    </div>
                                )}
                            </div>
                        ) : null}
                        <div className="relative">
                            <button
                                className="bg-[#204037] px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-[#2a5246] text-[#f0f0e0]"
                                onClick={toggleCreatePostDropdown}
                            >
                                <span>Share a recipe or ask something to everyone!</span>
                                <FaPlus />
                            </button>
                            {showCreatePostDropdown && (
                                <div className="absolute right-0 top-full mt-2 bg-[#204037] text-[#f0f0e0] rounded shadow-lg w-48">
                                    <Link to="/create-recipe" className="block px-4 py-2 hover:bg-[#2a5246]">Create Recipe</Link>
                                    <Link to="/create-discussion" className="block px-4 py-2 hover:bg-[#2a5246]">Create Discussion</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default Navigation;
