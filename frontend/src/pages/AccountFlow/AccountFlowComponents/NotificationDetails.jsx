import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../api';

const NotificationDetails = () => {
    const { notificationId } = useParams();
    const navigate = useNavigate();
    const [notification, setNotification] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotificationDetails = async () => {
            try {
                // Adjust API request to match the backend endpoint
                const response = await api.get(`/api/Notification/`, {
                    params: {
                        notificationId: notificationId,  // Pass the notificationId to the query string
                    },
                    withCredentials: true,  // Ensure credentials are included for authentication
                });

                // Assuming the API returns a single notification in the response
                if (response.data && response.data.length > 0) {
                    setNotification(response.data[0]);  // Set the first notification from the response
                } else {
                    setError('Notification not found');
                }
            } catch (err) {
                setError('Error fetching notification details');
            } finally {
                setLoading(false);
            }
        };

        fetchNotificationDetails();
    }, [notificationId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    if (!notification) return <div>No notification found.</div>;

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold">Notification Details</h2>
            <div className="bg-white p-6 rounded-lg shadow-md mt-4">
                <h3 className="text-lg font-bold">{notification.title}</h3>
                <p className="mt-2">{notification.message}</p>
                <div className="mt-4 text-sm text-gray-500">
                    <p><strong>Type:</strong> {notification.type}</p>
                    <p><strong>Created At:</strong> {new Date(notification.createdAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> {notification.isRead ? 'Read' : 'Unread'}</p>
                </div>
                <button
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                    onClick={() => navigate('/account-dashboard/notifications')}
                >
                    Back to Notifications
                </button>
            </div>
        </div>
    );
};

export default NotificationDetails;
