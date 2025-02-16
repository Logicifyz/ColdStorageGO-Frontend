import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useParams, useNavigate } from 'react-router-dom';
import Chat from '../../../components/Chat'; // Import the Chat component

const TicketDetails = () => {
    const { ticketId } = useParams(); // Get ticketId from the URL
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null); // Assuming userId is stored or fetched from the user context
    const [staffId, setStaffId] = useState(null); // Assuming staffId is fetched from the ticket details or another source

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const response = await api.get(`/api/Support/GetTickets`, {
                    params: { ticketId }
                });
                const ticketData = response.data[0]; // Assuming the response is an array with one ticket
                setTicket(ticketData);
                setStaffId(ticketData.staffId); // Set the staffId from the ticket data
                setUserId(ticketData.userId); // Set the userId from the ticket data
                setLoading(false);
            } catch (err) {
                setError('Error fetching ticket details');
                setLoading(false);
            }
        };

        fetchTicketDetails();
    }, [ticketId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold text-red-500">{error}</div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold">Ticket not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-7xl">
            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8">
                {/* Left Column: Ticket Details (40%) */}
                <div className="space-y-6">
                    {/* Ticket Header */}
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Ticket Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Subject</label>
                                <p className="mt-1 text-lg font-semibold text-gray-800">{ticket.subject}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Category</label>
                                <p className="mt-1 text-lg font-semibold text-gray-800">{ticket.category}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Priority</label>
                                <p className="mt-1 text-lg font-semibold text-gray-800">{ticket.priority}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Status</label>
                                <p className="mt-1 text-lg font-semibold text-gray-800">{ticket.status}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Created At</label>
                                <p className="mt-1 text-lg font-semibold text-gray-800">{new Date(ticket.createdAt).toLocaleString()}</p>
                            </div>
                            {ticket.resolvedAt && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Resolved At</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-800">{new Date(ticket.resolvedAt).toLocaleString()}</p>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Details</label>
                                <p className="mt-1 text-lg text-gray-800">{ticket.details}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Images */}
                    {ticket.images && ticket.images.length > 0 && (
                        <div className="bg-white shadow-lg rounded-lg p-6">
                            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ticket Images</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {ticket.images.map((img) => (
                                    <div key={img.imageId} className="image-item">
                                        <img
                                            src={`data:image/jpeg;base64,${img.imageData}`} // Corrected field name
                                            alt="Ticket Image"
                                            className="w-full h-auto rounded-lg shadow-sm"
                                            style={{ objectFit: 'cover', maxWidth: '100%', maxHeight: '400px' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Chat Section (60%) */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-6">Chat</h3>
                    <Chat
                        userId={userId}
                        staffId={staffId}
                        ticketId={ticketId}
                        isStaff={false}
                    />
                </div>
            </div>

            {/* Back Button */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={() => navigate("/account-dashboard")}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default TicketDetails;