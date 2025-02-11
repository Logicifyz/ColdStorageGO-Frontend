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
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!ticket) {
        return <div>Ticket not found</div>;
    }

    return (
        <div className="ticket-details container mx-auto p-4">
            <h2 className="text-2xl font-bold">Ticket Details</h2>
            <div className="ticket-info mt-4">
                <p><strong>Subject:</strong> {ticket.subject}</p>
                <p><strong>Category:</strong> {ticket.category}</p>
                <p><strong>Priority:</strong> {ticket.priority}</p>
                <p><strong>Status:</strong> {ticket.status}</p>
                <p><strong>Created At:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                {ticket.resolvedAt && <p><strong>Resolved At:</strong> {new Date(ticket.resolvedAt).toLocaleString()}</p>}
                <p><strong>Details:</strong> {ticket.details}</p>
            </div>

            {/* Display images if available */}
            {ticket.images && ticket.images.length > 0 && (
                <div className="ticket-images mt-4">
                    <h3 className="text-xl">Ticket Images</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        {ticket.images.map((img) => (
                            <div key={img.imageId} className="image-item">
                                <img
                                    src={`data:image/jpeg;base64,${img.ImageData}`}
                                    alt="Ticket Image"
                                    className="w-full h-auto rounded"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="chat-container mt-4">
                <Chat
                    userId={userId}
                    staffId={staffId}
                    ticketId={ticketId}
                    isStaff={false}
                />
            </div>

            <div className="back-button mt-4">
                <button
                    onClick={() => navigate("/account-dashboard")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
};

export default TicketDetails;
