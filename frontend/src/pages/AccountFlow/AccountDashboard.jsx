import React, { useState } from 'react';
import api from '../../api';

import ChangePassword from './AccountFlowComponents/ChangePassword';
import DeleteAccount from './AccountFlowComponents/DeleteAccount';
import Profile from './AccountFlowComponents/Profile';
import MyRedemptions from './AccountFlowComponents/MyRedemptions';
import MyOrders from './AccountFlowComponents/MyOrders';
import MyOrderDetail from './AccountFlowComponents/MyOrderDetail';
import MyTickets from './AccountFlowComponents/MyTickets';
import SubscriptionManagement from './AccountFlowComponents/SubscriptionManagement';
import SubscriptionHistory from './AccountFlowComponents/SubscriptionHistory';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting

const AccountDashboard = () => {
    const [activeTab, setActiveTab] = useState('Profile');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSubscriptionOpen, setIsSubscriptionOpen] = useState(false);
    const navigate = useNavigate(); // Hook to navigate after logout

    const tabs = [
        { name: 'Profile' },
        { name: 'Address' },
        { name: 'Notifications' },
        { name: 'My Orders' },
        { name: 'My Tickets' },
        { name: 'Recipes and Discussions' },
        { name: 'Subscription' },
        { name: 'My Redemptions' },
        { name: 'Settings' }
    ];

    const handleSettingsClick = () => {
        setIsSettingsOpen(!isSettingsOpen);
        setIsSubscriptionOpen(false); // Close subscription dropdown
        setActiveTab('Settings');




    };

    const handleSubscriptionClick = () => {
        setIsSubscriptionOpen(!isSubscriptionOpen);
        setIsSettingsOpen(false); // Close settings dropdown
        setActiveTab('Subscription');
    };

    const handleTabClick = (tabName) => {
        if (tabName === 'Change Password') {
            setActiveTab('Change Password');
        } else if (tabName === 'Delete Account') {
            setActiveTab('Delete Account');
        } else if (tabName === 'Logout') {
            // Call the logout endpoint
            api.post('/api/Auth/logout')
                .then(() => {
                    navigate('/login'); // Redirect to login page


                })
                .catch((error) => {
                    console.error('Logout failed:', error);

                });
        } else {
            setActiveTab(tabName);
        }
        setIsSettingsOpen(false);
        setIsSubscriptionOpen(false);
    };

    return (
        <div className="flex h-screen bg-[#383838]">
            {/* Sidebar */}
            <div className="w-1/4 bg-[#2B2E4A] text-white p-6">
                <h2 className="text-xl font-bold mb-6">Account Dashboard</h2>
                <ul className="space-y-2">
                    {tabs.map((tab, index) => (
                        <div key={index}>
                            <li
                                className={`p-3 cursor-pointer rounded-lg ${activeTab === tab.name ? 'bg-[#4D5C60]' : 'hover:bg-[#4D5C60]'
                                    }`}
                                onClick={() => {
                                    if (tab.name === 'Settings') {
                                        handleSettingsClick();
                                    } else if (tab.name === 'Subscription') {
                                        handleSubscriptionClick();
                                    } else {
                                        handleTabClick(tab.name);
                                    }
                                }}
                            >
                                {tab.name}
                            </li>

                            {/* Expanding Dropdown for Settings */}
                            {tab.name === 'Settings' && isSettingsOpen && (
                                <ul className="space-y-2 pl-6 pt-2">
                                    <li
                                        className="p-3 cursor-pointer rounded-lg hover:bg-[#4D5C60]"
                                        onClick={() => handleTabClick('Change Password')}
                                    >
                                        Change Password
                                    </li>
                                    <li
                                        className="p-3 cursor-pointer rounded-lg hover:bg-[#4D5C60]"
                                        onClick={() => handleTabClick('Delete Account')}
                                    >
                                        Delete Account
                                    </li>

                                    <li
                                        className="p-3 cursor-pointer rounded-lg hover:bg-[#4D5C60]"
                                        onClick={() => handleTabClick('Logout')}
                                    >
                                        Logout
                                    </li>
                                </ul>
                            )}

                            {/* Expanding Dropdown for Subscription */}
                            {tab.name === 'Subscription' && isSubscriptionOpen && (
                                <ul className="space-y-2 pl-6 pt-2">
                                    <li
                                        className="p-3 cursor-pointer rounded-lg hover:bg-[#4D5C60]"
                                        onClick={() => handleTabClick('Subscription Management')}
                                    >
                                        My Subscription
                                    </li>
                                    <li
                                        className="p-3 cursor-pointer rounded-lg hover:bg-[#4D5C60]"
                                        onClick={() => handleTabClick('Subscription History')}
                                    >
                                        Subscription History







                                    </li>
                                </ul>
                            )}
                        </div>
                    ))}
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="w-3/4 p-8">
                <div className="text-white">
                    {activeTab === 'Profile' ? (
                        <Profile />
                    ) : activeTab === 'Change Password' ? (
                        <ChangePassword />
                    ) : activeTab === 'Delete Account' ? (
                        <DeleteAccount />
                    ) : activeTab === 'My Tickets' ? (
                        <MyTickets />
                    ) : activeTab === 'Subscription Management' ? (
                        <SubscriptionManagement />
                    ) : activeTab === 'Subscription History' ? (
                        <SubscriptionHistory />
                    ) : activeTab === 'My Orders' ? (
                        <MyOrders />
                    ) : activeTab === 'My Redemptions' ? (
                        <MyRedemptions />
                    ) : (
                        <p>Currently viewing the {activeTab} section.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountDashboard;