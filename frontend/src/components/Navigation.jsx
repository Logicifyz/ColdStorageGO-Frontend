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
    const [forumDropdown, setForumDropdown] = useState(false);
    const [createPostDropdown, setCreatePostDropdown] = useState(false);
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
        <nav className="bg-white text-black sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                <div className="flex items-center space-x-2">
                    <img src="/CSGO.PNG" alt="Cold Storage Go" className="h-14 w-auto" />
                </div>

                <div className="flex space-x-6">
                    <Link to="/" className="hover:text-gray-700">Home</Link>
                    <Link to="/gallery" className="hover:text-gray-700">Gallery</Link>
                    <Link to="/subscriptions" className="hover:text-gray-700">Subscribe</Link>
                    <Link to="/rewards" className="hover:text-gray-700">Rewards</Link>
                    <Link to="/help-centre" className="hover:text-gray-700">Help Centre</Link>

                    {/* Forum Dropdown */}
                    <div
                        className="relative"
                        onMouseEnter={() => setForumDropdown(true)}
                        onMouseLeave={() => {
                            setForumDropdown(false);
                            setCreatePostDropdown(false);
                        }}
                    >
                        <button className="hover:text-gray-700">Forum</button>
                        {forumDropdown && (
                            <div className="absolute bg-white text-black rounded shadow-lg mt-2 w-40">
                                <Link to="/forum" className="block px-4 py-2 hover:bg-gray-200">
                                    Home
                                </Link>
                                <div
                                    className="relative"
                                    onMouseEnter={() => setCreatePostDropdown(true)}
                                    onMouseLeave={() => setCreatePostDropdown(false)}
                                >
                                    <button className="block w-full text-left px-4 py-2 hover:bg-gray-200">
                                        Create New Post
                                    </button>
                                    {createPostDropdown && (
                                        <div className="absolute left-full top-0 bg-white text-black rounded shadow-lg mt-0 w-48">
                                            <Link to="/create-recipe" className="block px-4 py-2 hover:bg-gray-200">
                                                Create Recipe
                                            </Link>
                                            <Link to="/create-discussion" className="block px-4 py-2 hover:bg-gray-200">
                                                Create Discussion
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Link to="/cheffie-ai" className="hover:text-gray-700">Cheffie AI</Link>
                </div>

                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        <div className="cursor-pointer" onClick={handleProfileClick}>
                            {profilePic ? (
                                <img
                                    src={profilePic} // Use the formatted Base64 string
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border-2 border-black"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full border-2 border-black bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-800">{getInitials(username)}</span> {/* Show initials if no profile picture */}
                                </div>

                            )}
                        </div>
                    ) : (
                        <button
                            onClick={handleLoginClick}
                            className="border border-black px-4 py-2 rounded hover:bg-black hover:text-white"
                        >
                            Login
                        </button>
                    )}

                    <div className="relative">
                        <AiOutlineShoppingCart className="w-6 h-6 text-black" />
                        <Link to="/cart" className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">!</Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;