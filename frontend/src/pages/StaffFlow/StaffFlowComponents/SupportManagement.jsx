import React, { useEffect, useState } from "react";
import api from '../../../api';

const SupportManagement = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const sessionId = localStorage.getItem("sessionId");

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const response = await api.get("/api/StaffSupport/tickets", {
                headers: { SessionId: sessionId },
            });
            setTickets(response.data);
        } catch (err) {
            setError("Failed to fetch tickets");
        } finally {
            setLoading(false);
        }
    };

    const updateTicket = async (ticketId, updateData) => {
        try {
            const response = await api.put(`/api/StaffSupport/tickets/${ticketId}`, updateData, {
                headers: { SessionId: sessionId },
            });
            setTickets((prev) => prev.map((t) => (t.TicketId === ticketId ? response.data : t)));
        } catch (err) {
            setError("Failed to update ticket");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

    return (
        <div>
            <h1>Support Tickets</h1>
            {tickets.length === 0 ? (
                <p>No tickets found.</p>
            ) : (
                <ul>
                    {tickets.map((ticket) => (
                        <li key={ticket.TicketId}>
                            <strong>{ticket.Subject}</strong> - {ticket.Status}
                            <button onClick={() => updateTicket(ticket.TicketId, { Status: "Resolved" })}>
                                Mark as Resolved
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SupportManagement;
