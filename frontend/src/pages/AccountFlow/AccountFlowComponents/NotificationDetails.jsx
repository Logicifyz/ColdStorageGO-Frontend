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
                const response = await api.get(`/api/Notification/`, {
                    params: { notificationId },
                    withCredentials: true,
                });

                if (response.data && response.data.length > 0) {
                    setNotification(response.data[0]);
                    await api.put(`/api/Notification/MarkAsRead/${notificationId}`, {}, {
                        withCredentials: true,
                    });
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
        <div className="container mx-auto p-6 bg-[#F0EAD6] min-h-screen relative">
            {/* Background Circles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-[#E2F2E6] rounded-full blur-3xl z-0" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-[#E2F2E6] rounded-full blur-3xl z-0" />
            </div>

            <h2 className="text-5xl font-bold text-center text-[#355E3B] mb-8 z-10 relative">Notification Details</h2>

            <div className="bg-white p-6 rounded-lg shadow-md mt-4 z-10 relative">
                <h3 className="text-2xl font-bold text-[#355E3B]">{notification.title}</h3>
                <p className="mt-2 text-[#355E3B]">{notification.content}</p>

                <div className="mt-4 text-sm text-gray-500">
                    <p><strong>Type:</strong> {notification.type}</p>
                    <p><strong>Created At:</strong> {new Date(notification.createdAt).toLocaleString()}</p>
                    <p><strong>Status:</strong> {notification.isRead ? 'Read' : 'Unread'}</p>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded-md"
                        onClick={() => navigate('/account-dashboard/notifications')}
                    >
                        Back to Notifications
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationDetails;
