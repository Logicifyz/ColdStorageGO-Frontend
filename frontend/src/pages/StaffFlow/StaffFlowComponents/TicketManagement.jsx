import React, { useState, useEffect } from 'react';
import api from '../../../api';
import { useParams, useNavigate } from 'react-router-dom';
import Chat from '../../../components/Chat'; // Import the Chat component
import { motion } from 'framer-motion'; // For animations
import { FiEdit, FiSave, FiXCircle, FiMessageCircle, FiImage, FiClock, FiUser, FiAlertCircle } from 'react-icons/fi'; // Icons for flair

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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-[#355E3B] text-2xl"
                >
                    Loading...
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-red-800 font-bold text-2xl"
                >
                    {error}
                </motion.div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-[#F0EAD6] min-h-screen relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header with Animation */}
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl font-bold mb-6 text-[#355E3B] text-center"
                >
                    Ticket Management - Edit Ticket
                </motion.h1>

                {/* Left Section: Ticket Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white p-6 rounded-xl shadow-lg"
                    >
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
                                        className="mt-1 block w-full text-gray-700 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Unassigned">Unassigned</option>
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
                                        className="mt-1 block w-full text-gray-700 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition duration-200 flex items-center gap-2"
                                >
                                    <FiXCircle /> Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 flex items-center gap-2"
                                >
                                    <FiSave /> Save Changes
                                </button>
                            </div>
                        </form>

                        {ticket.images && ticket.images.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <FiImage /> Ticket Images
                                </h3>
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
                    </motion.div>

                    {/* Right Section: Chat */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white p-6 rounded-xl shadow-lg"
                    >
                        <h2 className="text-2xl font-bold text-[#355E3B] mb-6 flex items-center gap-2">
                            <FiMessageCircle /> Chat with the User
                        </h2>
                        <Chat userId={ticket.userId} staffId={ticket.staffId} ticketId={ticketId} isStaff={true} />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default TicketManagement;