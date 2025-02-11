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
        <div className="p-5 bg-white text-gray-900">
            <h1 className="text-3xl font-bold mb-5">Ticket Management - Edit Ticket</h1>
            <form onSubmit={handleSubmit}>
                {/* Ticket details fields */}
                <div className="mb-4">
                    <label className="block mb-2">Ticket ID: {ticket.ticketId}</label>
                    <p>{ticket.ticketId}</p>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">User ID: {ticket.userId}</label>
                    <p>{ticket.userId}</p>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Staff ID: {ticket.staffId || 'Not assigned'}</label>
                    <p>{ticket.staffId || 'Not assigned'}</p>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Subject: {ticket.subject}</label>
                    <p>{ticket.subject}</p>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Category: {ticket.category}</label>
                    <p>{ticket.category}</p>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Details: {ticket.details}</label>
                    <p>{ticket.details}</p>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Priority</label>
                    <select
                        name="priority"
                        value={updatedTicket.priority}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-600 rounded bg-gray-100 text-gray-900"
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Status</label>
                    <select
                        name="status"
                        value={updatedTicket.status}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-600 rounded bg-gray-100 text-gray-900"
                    >
                        <option value="Unassigned">Unassigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label className="block mb-2">Created At: {new Date(ticket.createdAt).toLocaleString()}</label>
                    <p>{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>

                {/* Show Resolved At input only if status is Resolved */}
                {updatedTicket.status === "Resolved" && (
                    <div className="mb-4">
                        <label className="block mb-2">Resolved At</label>
                        <input
                            type="datetime-local"
                            name="resolvedAt"
                            value={updatedTicket.resolvedAt || ''}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-600 rounded bg-gray-100 text-gray-900"
                            required // Only required if status is "Resolved"
                        />
                    </div>
                )}

                <div className="flex justify-between">
                    <button
                        type="button"
                        onClick={() => navigate(`/staff/support`)}
                        className="bg-gray-600 text-white p-2 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-2 rounded"
                    >
                        Save Changes
                    </button>
                </div>
            </form>

            {/* Chat Section */}
            <div className="mt-8">
                <h2 className="text-xl font-bold">Chat with the user</h2>
                <Chat userId={ticket.userId} staffId={ticket.staffId} ticketId={ticketId} isStaff={true} />
            </div>
        </div>
    );
};

export default TicketManagement;
