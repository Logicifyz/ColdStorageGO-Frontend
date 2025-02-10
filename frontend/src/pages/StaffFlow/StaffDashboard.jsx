import React, { useState } from 'react';
// import api from '../../api';
// import UserManagement from './StaffFlowComponents/UserManagement'; // Component for managing users
// import OrderManagement from './StaffFlowComponents/OrderManagement'; // Component for managing orders
// import SubscriptionManagement from './StaffFlowComponents/SubscriptionManagement'; // Component for managing subscriptions
// import RewardManagement from './StaffFlowComponents/RewardManagement'; // Component for managing rewards
// import GalleryManagement from './StaffFlowComponents/GalleryManagement'; // Component for managing galleries
import SupportManagement from './StaffFlowComponents/SupportManagement'; // Component for managing support tickets
import { useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
    const [activeTab, setActiveTab] = useState('Support Management'); // Default tab now points to Support Management
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [hovered, setHovered] = useState(false);
    const navigate = useNavigate();

    const tabs = [
        // { name: 'User Management' },
        // { name: 'Order Management' },
        // { name: 'Subscription Management' },
        // { name: 'Rewards Management' }, // Commented out the Rewards tab
        // { name: 'Gallery Management' }, // Commented out the Gallery tab
        { name: 'Support Management' },
        { name: 'Settings' },
        { name: 'Logout' }
    ];

    const handleSettingsClick = () => {
        if (activeTab === 'Settings') {
            setIsSettingsOpen(!isSettingsOpen);
        } else {
            setActiveTab('Settings');
            setIsSettingsOpen(true);
        }
    };

    const handleSettingsHover = (isHovered) => {
        if (!isSettingsOpen) {
            setHovered(isHovered);
        }
    };

    const handleTabClick = (tabName) => {
        if (tabName === 'Logout') {
            // api.post('/api/Auth/logout')
            //     .then(() => {
            //         navigate('/login');
            //     })
            //     .catch((error) => {
            //         console.error('Logout failed:', error);
            //     });
            navigate('/login'); // This will redirect to login without calling the logout API
        } else {
            setActiveTab(tabName);
        }
        setIsSettingsOpen(false);
    };

    return (
        <div className="flex h-screen bg-[#383838]">
            {/* Sidebar */}
            <div className="w-1/4 bg-[#2B2E4A] text-white p-6">
                <h2 className="text-xl font-bold mb-6">Staff Dashboard</h2>
                <ul>
                    {tabs.map((tab, index) => (
                        <li
                            key={index}
                            className={`p-3 cursor-pointer rounded-lg ${activeTab === tab.name ? 'bg-[#4D5C60]' : 'hover:bg-[#4D5C60]'} 
                                ${tab.name === 'Settings' ? 'relative' : ''}`}
                            onClick={() => {
                                if (tab.name !== 'Settings') {
                                    setActiveTab(tab.name);
                                } else {
                                    handleSettingsClick();
                                }
                            }}
                            onMouseEnter={() => tab.name === 'Settings' && handleSettingsHover(true)}
                            onMouseLeave={() => tab.name === 'Settings' && handleSettingsHover(false)}
                        >
                            {tab.name}

                            {/* Settings Dropdown */}
                            {tab.name === 'Settings' && isSettingsOpen && (
                                <ul className="absolute left-0 top-full mt-2 bg-[#3E4752] text-white rounded-lg shadow-lg w-full">
                                    <li className="p-3 cursor-pointer hover:bg-[#4D5C60]" onClick={() => handleTabClick('Change Password')}>Change Password</li>
                                    <li className="p-3 cursor-pointer hover:bg-[#4D5C60]" onClick={() => handleTabClick('Delete Account')}>Delete Account</li>
                                    <li className="p-3 cursor-pointer hover:bg-[#4D5C60]" onClick={() => handleTabClick('Logout')}>Logout</li>
                                </ul>
                            )}

                            {/* Hovered Settings Dropdown */}
                            {tab.name === 'Settings' && !isSettingsOpen && hovered && (
                                <ul className="absolute left-0 top-full mt-2 bg-[#3E4752] text-white rounded-lg shadow-lg w-full">
                                    <li className="p-3 cursor-pointer hover:bg-[#4D5C60]" onClick={() => handleTabClick('Change Password')}>Change Password</li>
                                    <li className="p-3 cursor-pointer hover:bg-[#4D5C60]" onClick={() => handleTabClick('Delete Account')}>Delete Account</li>
                                    <li className="p-3 cursor-pointer hover:bg-[#4D5C60]" onClick={() => handleTabClick('Logout')}>Logout</li>
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="w-3/4 p-8">
                <div className="text-white">
                    {activeTab === 'Support Management' ? (
                        <SupportManagement />
                    ) : (
                        <p>Currently viewing the {activeTab} section.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
