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

                setNotifications(response.data);
                setFilteredNotifications(response.data);

                // Get unique types for the top bar
                const types = ['All', ...new Set(response.data.map(n => n.type))];
                setNotificationTypes(types);
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

    // Handle deleting read notifications
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

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-center">Notifications</h2>

            {/* Push Notification Status */}
            {/* Push Notification Status */}
            <div className="mt-4 text-center">
                <span className="text-lg font-semibold">
                    {pushNotificationStatus === null
                        ? "Loading Push Notification Status..."
                        : pushNotificationStatus
                            ? "Push Notifications Enabled"
                            : "Push Notifications Disabled"}
                </span>
                <button
                    className={`ml-4 px-4 py-2 rounded-md text-white ${pushNotificationStatus ? 'bg-red-600' : 'bg-green-600'}`}
                    onClick={togglePushNotifications}
                >
                    {pushNotificationStatus ? 'Disable' : 'Enable'}
                </button>
            </div>


            {/* Type Bar */}
            <div className="mt-4 mb-6 flex justify-center space-x-4">
                {notificationTypes.map((type) => (
                    <button
                        key={type}
                        className={`px-4 py-2 rounded-md text-white ${selectedType === type ? 'bg-blue-600' : 'bg-gray-600'}`}
                        onClick={() => handleTypeChange(type)}
                    >
                        {type}
                    </button>
                ))}
            </div>

            {/* Delete Read Button */}
            <div className="mb-6 flex justify-end">
                <button
                    className="px-4 py-2 bg-red-600 text-white rounded-md"
                    onClick={deleteReadNotifications}
                >
                    Delete Read
                </button>
            </div>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && filteredNotifications.length === 0 && <div>No notifications found.</div>}

            {filteredNotifications.length > 0 && (
                <div className="space-y-4 mt-4">
                    {filteredNotifications.map((notification) => (
                        <div
                            key={notification.notificationId}
                            className={`bg-white p-4 rounded-lg shadow-md cursor-pointer ${notification.isRead ? 'opacity-70' : 'opacity-100'}`}
                            onClick={() => handleNotificationClick(notification)}
                        >
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold">{notification.title}</h3>
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
                            <p className="mt-2 text-sm text-gray-600">{notification.message}</p>
                            <div className="mt-2 text-sm text-gray-500">
                                <p><strong>Type:</strong> {notification.type}</p>
                                <p><strong>Created At:</strong>
                                    {notification.createdAt ? new Date(notification.createdAt.split('.')[0]).toLocaleString() : "N/A"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
