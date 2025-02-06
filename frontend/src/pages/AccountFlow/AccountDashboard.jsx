import React, { useState } from 'react';
import api from '../../api';
import ChangePassword from './AccountFlowComponents/ChangePassword'; // Adjust the path as necessary
import DeleteAccount from './AccountFlowComponents/DeleteAccount'; // Import the DeleteAccount component
import Profile from './AccountFlowComponents/Profile'; // Import the Profile component
import MyTickets from './AccountFlowComponents/MyTickets';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirecting

const AccountDashboard = () => {
    const [activeTab, setActiveTab] = useState('Profile');
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Track if settings dropdown is open
    const [hovered, setHovered] = useState(false); // Track if settings tab is hovered
    const navigate = useNavigate(); // Hook to navigate after logout

    const tabs = [
        { name: 'Profile' },
        { name: 'Address' },
        { name: 'Notifications' },
        { name: 'My Orders' },
        { name: 'My Tickets' },
        { name: 'Recipes and Discussions' },
        { name: 'My Subscription' },
        { name: 'My Redemptions' },
        { name: 'Settings' } // Added settings tab
    ];

    const handleSettingsClick = () => {
        // Toggle dropdown visibility when clicked
        if (activeTab === 'Settings') {
            setIsSettingsOpen(!isSettingsOpen); // Only toggle dropdown if Settings is already active
        } else {
            setActiveTab('Settings'); // Set activeTab to 'Settings' when clicked
            setIsSettingsOpen(true); // Open dropdown when Settings is clicked
        }
    };

    const handleSettingsHover = (isHovered) => {
        if (!isSettingsOpen) {
            setHovered(isHovered); // Only show the dropdown on hover if not clicked
        }
    };

    const handleTabClick = (tabName) => {
        if (tabName === 'Change Password') {
            setActiveTab('Change Password');
        } else if (tabName === 'Delete Account') {
            setActiveTab('Delete Account'); // Set active tab to Delete Account when clicked
        } else if (tabName === 'Logout') {
            // Call the logout endpoint
            api.post('/api/Auth/logout')
                .then(() => {
                    // Redirect to login page after successful logout
                    navigate('/login'); // Adjust the route as needed
                    // Optionally, clear the user's session or token here
                })
                .catch((error) => {
                    console.error('Logout failed:', error);
                    // Handle error (show message to user, etc.)
                });
        } else {
            setActiveTab(tabName); // Update active tab for other options
        }
        setIsSettingsOpen(false); // Close dropdown after clicking on an option
    };

    return (
        <div className="flex h-screen bg-[#383838]">
            {/* Sidebar */}
            <div className="w-1/4 bg-[#2B2E4A] text-white p-6">
                <h2 className="text-xl font-bold mb-6">Account Dashboard</h2>
                <ul>
                    {tabs.map((tab, index) => (
                        <li
                            key={index}
                            className={`p-3 cursor-pointer rounded-lg ${activeTab === tab.name ? 'bg-[#4D5C60]' : 'hover:bg-[#4D5C60]'} 
                                ${tab.name === 'Settings' ? 'relative' : ''}`}
                            onClick={() => {
                                if (tab.name !== 'Settings') {
                                    setActiveTab(tab.name); // Set activeTab if it's not 'Settings'
                                } else {
                                    handleSettingsClick(); // Handle click for 'Settings'
                                }
                            }}
                            onMouseEnter={() => tab.name === 'Settings' && handleSettingsHover(true)} // Show dropdown on hover
                            onMouseLeave={() => tab.name === 'Settings' && handleSettingsHover(false)} // Hide dropdown on hover leave
                        >
                            {tab.name}

                            {/* Nested Dropdown for Settings */}
                            {tab.name === 'Settings' && isSettingsOpen && (
                                <ul className="absolute left-0 top-full mt-2 bg-[#3E4752] text-white rounded-lg shadow-lg w-full">
                                    <li
                                        className={`p-3 cursor-pointer hover:bg-[#4D5C60]`}
                                        onClick={() => handleTabClick('Change Password')}
                                    >
                                        Change Password
                                    </li>
                                    <li
                                        className={`p-3 cursor-pointer hover:bg-[#4D5C60]`}
                                        onClick={() => handleTabClick('Delete Account')}
                                    >
                                        Delete Account
                                    </li>
                                    {/* Added Logout button */}
                                    <li
                                        className={`p-3 cursor-pointer hover:bg-[#4D5C60]`}
                                        onClick={() => handleTabClick('Logout')}
                                    >
                                        Logout
                                    </li>
                                </ul>
                            )}

                            {/* Dropdown for Settings when hovered */}
                            {tab.name === 'Settings' && !isSettingsOpen && hovered && (
                                <ul className="absolute left-0 top-full mt-2 bg-[#3E4752] text-white rounded-lg shadow-lg w-full">
                                    <li
                                        className={`p-3 cursor-pointer hover:bg-[#4D5C60]`}
                                        onClick={() => handleTabClick('Change Password')}
                                    >
                                        Change Password
                                    </li>
                                    <li
                                        className={`p-3 cursor-pointer hover:bg-[#4D5C60]`}
                                        onClick={() => handleTabClick('Delete Account')}
                                    >
                                        Delete Account
                                    </li>
                                    {/* Added Logout button */}
                                    <li
                                        className={`p-3 cursor-pointer hover:bg-[#4D5C60]`}
                                        onClick={() => handleTabClick('Logout')}
                                    >
                                        Logout
                                    </li>
                                </ul>
                            )}
                        </li>
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
                        <MyTickets /> // Render MyTickets component for the "My Tickets" tab
                    ) : (
                        <p>Currently viewing the {activeTab} section.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccountDashboard;
