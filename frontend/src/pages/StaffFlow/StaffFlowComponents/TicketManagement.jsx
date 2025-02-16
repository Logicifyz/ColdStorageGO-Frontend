import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { useParams, useNavigate } from 'react-router-dom';
import Chat from '../../../components/Chat'; // Import the Chat component

const TicketManagement = () => {
    const { ticketId } = useParams();  // Retrieve ticketId from route parameters
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatedTicket, setUpdatedTicket] = useState({
        status: '',
        priority: '',
        resolvedAt: '',
    });

    useEffect(() => {
        fetchTicketDetails();
    }, []);

    const fetchTicketDetails = async () => {
        try {
            const response = await api.get(`/api/StaffSupport/tickets`, {
                params: { ticketId }
            });
            if (response.data.length > 0) {
                const ticketDetails = response.data[0];
                setTicket(ticketDetails);
                setUpdatedTicket({
                    status: ticketDetails.status,
                    priority: ticketDetails.priority,
                    resolvedAt: ticketDetails.resolvedAt || '', // Initialize as empty string if null
                });
            } else {
                setError('Ticket not found.');
            }
        } catch (err) {
            setError('Failed to fetch ticket details.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedTicket((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure resolvedAt is set if status is 'Resolved'
        if (updatedTicket.status === "Resolved" && !updatedTicket.resolvedAt) {
            setError("Resolved At date is required when the status is 'Resolved'.");
            return;
        }

        // Prepare the payload

        const payload = {
            status: updatedTicket.status,
            priority: updatedTicket.priority,
            resolvedAt: updatedTicket.status === "Resolved" ? updatedTicket.resolvedAt : null, // Set resolvedAt only if status is "Resolved"
        };

        try {
            const response = await api.put(`/api/StaffSupport/tickets/${ticketId}`, payload);
            alert('Ticket updated successfully!');
            navigate(`/staff/support`);
        } catch (err) {
            setError('Failed to update ticket');
        }
    };

    if (loading) return <p className="text-gray-900">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-5 bg-white text-gray-900 flex flex-col md:flex-row gap-8">
            {/* Left Section: Ticket Details */}
            <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-6 text-blue-600">Ticket Management - Edit Ticket</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Ticket details fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Ticket ID</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{ticket.ticketId}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">User ID</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{ticket.userId}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Staff ID</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{ticket.staffId || 'Not assigned'}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subject</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{ticket.subject}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Category</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{ticket.category}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Details</label>
                            <p className="mt-1 text-lg text-gray-900">{ticket.details}</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Priority</label>
                            <select
                                name="priority"
                                value={updatedTicket.priority}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                name="status"
                                value={updatedTicket.status}
                                onChange={handleInputChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Unassigned">Unassigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Created At</label>
                            <p className="mt-1 text-lg font-semibold text-gray-900">{new Date(ticket.createdAt).toLocaleString()}</p>
                        </div>

                        {/* Show Resolved At input only if status is Resolved */}
                        {updatedTicket.status === "Resolved" && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Resolved At</label>
                                <input
                                    type="datetime-local"
                                    name="resolvedAt"
                                    value={updatedTicket.resolvedAt || ''}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required // Only required if status is "Resolved"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/staff/support`)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>

                {ticket.images && ticket.images.length > 0 && (
                    <div className="mt-8">
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

            {/* Right Section: Chat */}
            <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-blue-600 mb-6">Chat with the User</h2>
                <Chat userId={ticket.userId} staffId={ticket.staffId} ticketId={ticketId} isStaff={true} />
            </div>
        </div>
    );
};

export default TicketManagement;