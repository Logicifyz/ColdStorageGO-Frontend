import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

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
    const sessionId = localStorage.getItem("sessionId");
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

    if (loading) return <p className="text-gray-800">Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Support Tickets</h1>
            <div className="flex space-x-4 mb-6">
                <div>
                    <label className="block text-sm text-gray-700">Filter by Status:</label>
                    <select
                        name="status"
                        onChange={handleFilterChange}
                        className="bg-gray-100 border p-2 rounded text-gray-800"
                    >
                        <option value="">All</option>
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm text-gray-700">Priority:</label>
                    <select
                        name="priority"
                        onChange={handleFilterChange}
                        className="bg-gray-100 border p-2 rounded text-gray-800"
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
                        name="staffid"
                        onChange={handleFilterChange}
                        className="border p-2 rounded bg-gray-100 text-gray-800"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700">Category:</label>
                    <select
                        name="category"
                        onChange={handleFilterChange}
                        className="bg-gray-100 border p-2 rounded text-gray-800"
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
                        className="border p-2 rounded bg-gray-100 text-gray-800"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700">Ticket ID:</label>
                    <input
                        type="text"
                        name="ticketId"
                        onChange={handleFilterChange}
                        className="border p-2 rounded bg-gray-100 text-gray-800"
                    />
                </div>
            </div>

            {tickets.length === 0 ? (
                <p className="text-gray-800">No tickets found.</p>
            ) : (
                <ul className="space-y-4">
                    {tickets.map((ticket) => (
                        <li
                            key={ticket.ticketId} // Use ticketId for the key here, which is consistent with the ticket object
                            className="border p-4 rounded shadow-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleTicketClick(ticket.ticketId)} // Handle click to navigate
                        >
                            <div className="flex justify-between items-center">
                                <strong className="text-xl text-gray-800">{ticket.subject}</strong> {/* Use ticket.subject */}
                                <span
                                    className={`font-semibold text-sm ${ticket.status === "Unassigned"
                                        ? "text-red-500" // Red for Unassigned
                                        : ticket.status === "In Progress"
                                            ? "text-blue-500" // Blue for In Progress
                                            : "text-green-500" // Green for Resolved
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
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SupportManagement;
