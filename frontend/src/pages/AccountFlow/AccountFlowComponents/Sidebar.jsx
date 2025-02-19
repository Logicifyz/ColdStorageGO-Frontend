import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Gift, Package, LogOut } from "lucide-react"; // Importing icons
import api from '../../../api';

const Sidebar = () => {
    const navigate = useNavigate();
    const [profileDropdown, setProfileDropdown] = useState(false);
    const [subscriptionsDropdown, setSubscriptionsDropdown] = useState(false);
    const [activityDropdown, setActivityDropdown] = useState(false);

    const handleLogout = async () => {
        try {
            // Make the logout request to the backend
            await api.post('/api/Auth/logout');
            console.log("Logging out...");

            // Redirect to the login page after successful logout
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className="flex justify-center bg-white p-4 shadow-md z-100">
            <nav className="flex space-x-6">
                {/* Profile and Account Settings Dropdown */}
                <div
                    className="relative"
                >
                    <button
                        onClick={() => setProfileDropdown(prev => !prev)}
                        onMouseEnter={() => setProfileDropdown(true)}
                        onMouseLeave={() => setProfileDropdown(false)}
                        className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800"
                    >
                        <Home size={20} />
                        <span className="text-sm font-medium">Profile and Account Settings</span>
                    </button>
                    {profileDropdown && (
                        <div className="absolute bg-white text-black rounded shadow-lg w-48 left-1/2 transform -translate-x-1/2 z-20"
                            onMouseEnter={() => setProfileDropdown(true)}
                            onMouseLeave={() => setProfileDropdown(false)}>
                            <NavLink
                                to="/account-dashboard/profile"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                View Profile
                            </NavLink>
                            <NavLink
                                to="/account-dashboard/address"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Address
                            </NavLink>
                            <NavLink
                                to="/account-dashboard/change-password"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Change Password
                            </NavLink>
                            <NavLink
                                to="/account-dashboard/delete-account"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Delete Account
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Subscriptions Dropdown */}
                <div
                    className="relative"
                >
                    <button
                        onClick={() => setSubscriptionsDropdown(prev => !prev)}
                        onMouseEnter={() => setSubscriptionsDropdown(true)}
                        onMouseLeave={() => setSubscriptionsDropdown(false)}
                        className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800"
                    >
                        <Package size={20} />
                        <span className="text-sm font-medium">Subscriptions</span>
                    </button>
                    {subscriptionsDropdown && (
                        <div className="absolute bg-white text-black rounded shadow-lg w-48 left-1/2 transform -translate-x-1/2 z-20"
                            onMouseEnter={() => setSubscriptionsDropdown(true)}
                            onMouseLeave={() => setSubscriptionsDropdown(false)}>
                            <NavLink
                                to="/account-dashboard/subscription-management"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Subscription Management
                            </NavLink>
                            <NavLink
                                to="/account-dashboard/subscription-history"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Subscription History
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Activity Dropdown */}
                <div
                    className="relative"
                >
                    <button
                        onClick={() => setActivityDropdown(prev => !prev)}
                        onMouseEnter={() => setActivityDropdown(true)}
                        onMouseLeave={() => setActivityDropdown(false)}
                        className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-800"
                    >
                        <Gift size={20} />
                        <span className="text-sm font-medium">Activity</span>
                    </button>
                    {activityDropdown && (
                        <div className="absolute bg-white text-black rounded shadow-lg w-48 left-1/2 transform -translate-x-1/2 z-20"
                            onMouseEnter={() => setActivityDropdown(true)}
                            onMouseLeave={() => setActivityDropdown(false)}>
                            <NavLink
                                to="/account-dashboard/my-orders"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                My Orders
                            </NavLink>
                            <NavLink
                                to="/account-dashboard/my-tickets"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                My Tickets
                            </NavLink>
                            <NavLink
                                to="/account-dashboard/my-redemptions"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                My Redemptions
                            </NavLink>
                            <NavLink
                                to="/account-dashboard/notifications"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Notifications
                            </NavLink>
                            <NavLink
                                to="/account-dashboard/my-forum-activity"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                My Forum Activity
                            </NavLink>
                            <NavLink
                                to="/account-dashboard/my-saved-items"
                                className="block px-4 py-2 hover:bg-gray-200"
                            >
                                Saved AI Recipes
                            </NavLink>
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;
