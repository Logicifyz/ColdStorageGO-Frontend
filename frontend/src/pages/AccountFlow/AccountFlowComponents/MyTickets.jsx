import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';

const MyTickets = () => {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [filteredTickets, setFilteredTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');

    useEffect(() => {
        // Fetch tickets when the component mounts
        const fetchTickets = async () => {
            try {
                const response = await api.get('/api/support/GetTickets', {
                    withCredentials: true, // Ensures that cookies/credentials are sent with the request
                });
                console.log('API Response:', response.data); // Log the response

                setTickets(response.data);
                setFilteredTickets(response.data); // Initially, show all tickets
            } catch (err) {
                setError('Error fetching tickets');
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    // Function to categorize ticket status
    const getTicketStatus = (status) => {
        if (status === "Resolved") {
            return "Resolved";
        } else if (status === "In Progress") {
            return "In Progress";
        } else {
            return "Open"; // Unassigned or any other status defaults to Open
        }
    };

    // Handle the status filter chip click
    const handleChipClick = (status) => {
        setSelectedStatus(status);

        // Filter tickets based on the selected status
        if (status === "All") {
            setFilteredTickets(tickets); // Show all tickets
        } else {
            const filtered = tickets.filter(
                (ticket) => getTicketStatus(ticket.status) === status
            );
            setFilteredTickets(filtered);
        }
    };

    // Handle ticket click to navigate to ticket details page
    const handleTicketClick = (ticketId) => {
        // Navigate to the ticket details page using the ticket ID
        navigate(`/account-dashboard/${ticketId}`);
    };

    return (
        <div className="container mx-auto p-6 bg-[#F0EAD6] min-h-screen relative">

            {/* Background Circles */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-[#E2F2E6] rounded-full blur-3xl z-0" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-[#E2F2E6] rounded-full blur-3xl z-0" />
            </div>

            <h2 className="text-5xl font-bold text-center text-[#355E3B] mb-8 z-10 relative">My Tickets</h2>

            {/* Filter bar with chips */}
            <div className="flex justify-center gap-4 mb-8 z-10 relative">
                {['All', 'Open', 'In Progress', 'Resolved'].map((status) => (
                    <button
                        key={status}
                        onClick={() => handleChipClick(status)}
                        className={`px-6 py-2 text-lg font-semibold rounded-full transition-all duration-200 
                            ${selectedStatus === status
                                ? 'bg-[#2D4B33] text-white border-2 border-[#2D4B33] hover:bg-[#233928]'  // Selected chip with high contrast
                                : 'bg-white text-[#355E3B] border-2 border-[#355E3B] hover:bg-[#F0EAD6]' // Unselected chip with bold border
                            }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Loading and Error States */}
            {loading && (
                <div className="flex justify-center items-center h-64">
                    <div className="text-[#355E3B] text-2xl">Loading...</div>
                </div>
            )}
            {error && error !== "No tickets found for this user" && (
                <div className="text-center text-red-500 text-xl">{error}</div>
            )}
            {!loading && filteredTickets.length === 0 && (
                <div className="flex justify-center items-center h-64">
                    <div className="text-[#355E3B] text-2xl">No tickets found</div>
                </div>
            )}

            {filteredTickets.length > 0 && (
                <div className="flex justify-center">
                    <div className="w-full max-w-4xl">
                        {filteredTickets.map((ticket) => (
                            <div
                                key={ticket.ticketId}
                                className="bg-white p-6 rounded-lg shadow-lg cursor-pointer transition-transform transform hover:scale-105 relative mb-6 z-10"
                                onClick={() => handleTicketClick(ticket.ticketId)}
                            >
                                {/* Status Badge */}
                                <span
                                    className={`absolute top-4 right-4 px-3 py-1 text-sm font-semibold rounded-lg 
                            ${getTicketStatus(ticket.status) === 'Resolved'
                                            ? 'bg-green-500 text-white'
                                            : getTicketStatus(ticket.status) === 'In Progress'
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-red-500 text-white'
                                        }`}
                                >
                                    {getTicketStatus(ticket.status)}
                                </span>

                                {/* Subject as a Header */}
                                <h3 className="text-2xl font-bold text-[#355E3B] mb-4">
                                    {ticket.subject}
                                </h3>

                                {/* Details */}
                                <p className="text-gray-700 mb-4 line-clamp-3">
                                    {ticket.details}
                                </p>

                                {/* Created At */}
                                <p className="text-sm text-gray-500">
                                    Created: {ticket.createdAt ? new Date(ticket.createdAt.split('.')[0]).toLocaleString() : "N/A"}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default MyTickets;
