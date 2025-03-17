import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations
import { FiFilter, FiSearch, FiAlertCircle, FiCheckCircle, FiClock, FiUser } from "react-icons/fi"; // Icons for flair

const SupportManagement = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        status: "",
        priority: "",
        staffId: "",
        category: "",
        subject: "",
        ticketId: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchTickets();
    }, [filters]);

    const fetchTickets = async () => {
        try {
            const { status, priority, staffId, category, subject, ticketId } = filters;
            const response = await api.get("/api/StaffSupport/tickets", {
                params: { status, priority, staffId, category, subject, ticketId },
            });

            setTickets(response.data);
        } catch (err) {
            setError("Failed to fetch tickets");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleTicketClick = (ticketId) => {
        navigate(`/staff/support/${ticketId}`); // Navigate to the ticket details page with the ticket ID in the URL
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
                    Support Tickets
                </motion.h1>

                {/* Filters Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white p-6 rounded-xl shadow-lg mb-6"
                >
                    <h2 className="text-2xl font-semibold text-[#355E3B] mb-4 flex items-center gap-2">
                        <FiFilter className="text-[#355E3B]" /> Filters
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700">Status:</label>
                            <select
                                name="status"
                                onChange={handleFilterChange}
                                className="w-full border p-2 rounded bg-gray-100 text-gray-800"
                            >
                                <option value="">All</option>
                                <option value="Unassigned">Unassigned</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Priority:</label>
                            <select
                                name="priority"
                                onChange={handleFilterChange}
                                className="w-full border p-2 rounded bg-gray-100 text-gray-800"
                            >
                                <option value="">All</option>
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Staff ID:</label>
                            <input
                                type="text"
                                name="staffId"
                                onChange={handleFilterChange}
                                className="w-full border p-2 rounded bg-gray-100 text-gray-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Category:</label>
                            <select
                                name="category"
                                onChange={handleFilterChange}
                                className="w-full border p-2 rounded bg-gray-100 text-gray-800"
                            >
                                <option value="">All</option>
                                <option value="Technical">Technical</option>
                                <option value="Billing">Billing</option>
                                <option value="General">General</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Subject:</label>
                            <input
                                type="text"
                                name="subject"
                                onChange={handleFilterChange}
                                className="w-full border p-2 rounded bg-gray-100 text-gray-800"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Ticket ID:</label>
                            <input
                                type="text"
                                name="ticketId"
                                onChange={handleFilterChange}
                                className="w-full border p-2 rounded bg-gray-100 text-gray-800"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Tickets List */}
                {tickets.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-[#355E3B] text-2xl"
                    >
                        No tickets found.
                    </motion.div>
                ) : (
                    <motion.ul
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="space-y-4"
                    >
                        {tickets.map((ticket) => (
                            <motion.li
                                key={ticket.ticketId}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                onClick={() => handleTicketClick(ticket.ticketId)}
                            >
                                <div className="flex justify-between items-center">
                                    <strong className="text-xl text-[#355E3B]">{ticket.subject}</strong>
                                    <span
                                        className={`font-semibold text-sm ${ticket.status === "Unassigned"
                                            ? "text-red-500"
                                            : ticket.status === "In Progress"
                                                ? "text-blue-500"
                                                : "text-green-500"
                                            }`}
                                    >
                                        {ticket.status}
                                    </span>
                                </div>
                                <div className="mt-2 text-sm text-gray-700">
                                    <p>Priority: {ticket.priority}</p>
                                    <p>Category: {ticket.category}</p>
                                    <p>Staff ID: {ticket.staffId ?? "Unassigned"}</p>
                                    <p>Ticket ID: {ticket.ticketId}</p>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </div>
        </div>
    );
};

export default SupportManagement;