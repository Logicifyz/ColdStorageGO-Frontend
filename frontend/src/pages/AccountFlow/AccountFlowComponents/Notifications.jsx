import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [notificationTypes, setNotificationTypes] = useState([]);
    const [pushNotificationStatus, setPushNotificationStatus] = useState(null);

    // Fetch notifications and push notification status when the component mounts
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get('/api/Notification', {
                    withCredentials: true,
                });

                if (response.data.message && response.data.message === 'No notifications found.') {
                    setNotifications([]);
                    setFilteredNotifications([]);
                } else {
                    setNotifications(response.data);
                    setFilteredNotifications(response.data);

                    // Get unique types for the top bar
                    const types = ['All', ...new Set(response.data.map(n => n.type))];
                    setNotificationTypes(types);
                }
            } catch (err) {
                setError('Error fetching notifications');
            } finally {
                setLoading(false);
            }
        };

        const fetchPushNotificationStatus = async () => {
            try {
                const response = await api.get('/api/Notification/PushNotificationStatus', {
                    withCredentials: true,
                });

                setPushNotificationStatus(response.data.PushNotifications);
            } catch (err) {
                console.error('Error fetching push notification status:', err);
            }
        };

        fetchNotifications();
        fetchPushNotificationStatus();
    }, []);
    // Handle toggling push notifications
    const togglePushNotifications = async () => {
        try {
            if (pushNotificationStatus) {
                await api.put('/api/Notification/DisablePushNotifications', {}, {
                    withCredentials: true,
                });
                setPushNotificationStatus(false);
            } else {
                await api.put('/api/Notification/EnablePushNotifications', {}, {
                    withCredentials: true,
                });
                setPushNotificationStatus(true);
            }
        } catch (err) {
            console.error('Error toggling push notifications:', err);
        }
    };

    // Handle the type filter change
    const handleTypeChange = (type) => {
        setSelectedType(type);

        if (type === 'All') {
            setFilteredNotifications(notifications);
        } else {
            const filtered = notifications.filter(n => n.type === type);
            setFilteredNotifications(filtered);
        }
    };

    // Handle notification click to navigate to the related page
    const handleNotificationClick = (notification) => {
        navigate(`/account-dashboard/notification-details/${notification.notificationId}`);
    };

    // Handle marking a notification as read
    const markAsRead = async (notificationId) => {
        try {
            await api.put(`/api/Notification/MarkAsRead/${notificationId}`, {}, {
                withCredentials: true,
            });

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.notificationId === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
            setFilteredNotifications((prevFiltered) =>
                prevFiltered.map((notification) =>
                    notification.notificationId === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const deleteReadNotifications = async () => {
        try {
            await api.delete('/api/Notification/DeleteRead', {
                withCredentials: true,
            });

            const updatedNotifications = notifications.filter(n => !n.isRead);
            setNotifications(updatedNotifications);
            setFilteredNotifications(updatedNotifications);
        } catch (err) {
            console.error('Error deleting read notifications:', err);
        }
    };


    const markAllAsRead = async () => {
        try {
            await api.put('/api/Notification/MarkAllAsRead', {}, {
                withCredentials: true,
            });

            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );
            setFilteredNotifications((prevFiltered) =>
                prevFiltered.map((notification) => ({
                    ...notification,
                    isRead: true
                }))
            );
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };


    return (
        <div className="container mx-auto p-6 bg-[#F0EAD6] min-h-screen relative">
            {/* Background Circles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-[#E2F2E6] rounded-full blur-3xl z-0" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-[#E2F2E6] rounded-full blur-3xl z-0" />
            </div>

            <h2 className="text-5xl font-bold text-center text-[#355E3B] mb-8 z-10 relative">Notifications</h2>

            {/* Type Bar */}
            <div className="flex justify-center gap-4 mb-8 z-10 relative">
                {notificationTypes.map((type) => (
                    <button
                        key={type}
                        onClick={() => handleTypeChange(type)}
                        className={`px-6 py-2 text-lg font-semibold rounded-full transition-all duration-200 
                    ${selectedType === type
                                ? 'bg-[#2D4B33] text-white border-2 border-[#2D4B33] hover:bg-[#233928]'  // Selected chip with high contrast
                                : 'bg-white text-[#355E3B] border-2 border-[#355E3B] hover:bg-[#F0EAD6]' // Unselected chip with bold border
                            }`}
                    >
                        {type}
                    </button>
                ))}

                {/* Push Notification Status */}
                <div className="ml-auto flex items-center gap-4 z-10 relative">
                    <span className={`text-lg font-semibold ${pushNotificationStatus === null ? 'text-gray-500' : pushNotificationStatus ? 'text-green-600' : 'text-red-600'}`}>
                        {pushNotificationStatus === null
                            ? "Loading Push Notification Status..."
                            : pushNotificationStatus
                                ? "Push Notifications Enabled"
                                : "Push Notifications Disabled"}
                    </span>
                    <label className="flex items-center cursor-pointer">
                        <div className="relative">
                            <input
                                type="checkbox"
                                checked={pushNotificationStatus || false}
                                onChange={togglePushNotifications}
                                className="sr-only"
                            />
                            <div
                                className={`w-16 h-8 bg-gradient-to-r ${pushNotificationStatus ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'} rounded-full transition-all duration-300`}
                            >
                                <div
                                    className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${pushNotificationStatus ? 'translate-x-8' : 'translate-x-0'}`}
                                ></div>
                            </div>
                        </div>
                    </label>
                </div>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && filteredNotifications.length === 0 && !error && (
                <div className="text-xl font-medium text-center text-[#355E3B] p-6 rounded-lg mb-8 z-10 relative">
                    No new notifications
                </div>
            )}



            {filteredNotifications.length > 0 && (
                <div className="flex justify-center z-10 relative">
                    <div className="w-full max-w-4xl">
                        {/* Container for notifications with scrollable behavior */}
                        <div className="max-h-[500px] overflow-y-auto">
                            {filteredNotifications.length > 5 && (
                                <div className="mb-4 text-center text-sm text-gray-500">Scroll to see more notifications</div>
                            )}
                            {filteredNotifications.map((notification) => (
                                <div
                                    key={notification.notificationId}
                                    className={`bg-white p-4 rounded-lg shadow-md cursor-pointer mb-4 ${notification.isRead ? 'opacity-70' : 'opacity-100'}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-2xl font-bold text-[#355E3B] mb-4">
                                            {notification.title}
                                        </h3>
                                        <button
                                            className={`px-3 py-1 text-white text-sm rounded-lg ${notification.isRead ? 'bg-gray-500' : 'bg-blue-500'}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                markAsRead(notification.notificationId);
                                            }}
                                            disabled={notification.isRead}
                                        >
                                            {notification.isRead ? 'Already Read' : 'Mark as Read'}
                                        </button>
                                    </div>

                                    <p className="mb-4 text-[#355E3B] line-clamp-3">
                                        {notification.content}
                                    </p>
                                </div>
                            )

                            )}

                           

                        </div>
                        <div className="flex justify-between mt-4 mb-8">
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded-md"
                                onClick={markAllAsRead}
                            >
                                Mark All as Read
                            </button>
                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-md"
                                onClick={deleteReadNotifications}
                            >
                                Delete Read
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

            

    );
};

export default Notifications;
