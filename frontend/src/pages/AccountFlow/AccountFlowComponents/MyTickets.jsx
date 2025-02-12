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

    // Handle the status filter change
    const handleStatusChange = (event) => {
        const status = event.target.value;
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
        <div className="container mx-auto p-6">
            <h2 className="text-2xl font-bold text-center">My Tickets</h2>

            {/* Filter bar */}
            <div className="mt-4 mb-6">
                <label htmlFor="statusFilter" className="mr-2 text-white">Filter by Status:</label>
                <select
                    id="statusFilter"
                    value={selectedStatus}
                    onChange={handleStatusChange}
                    className="px-4 py-2 border rounded-md text-black"
                >
                    <option value="All" className="text-black">All</option>
                    <option value="Open" className="text-black">Open</option> {/* Unassigned */}
                    <option value="In Progress" className="text-black">In Progress</option> {/* In Progress */}
                    <option value="Resolved" className="text-black">Resolved</option> {/* Resolved */}
                </select>
            </div>


            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}
            {!loading && filteredTickets.length === 0 && <div>No tickets found.</div>}

            {filteredTickets.length > 0 && (
                <div className="space-y-4 mt-4">
                    {filteredTickets.map((ticket) => (
                        <div
                            key={ticket.ticketId}
                            className="bg-white p-4 rounded-lg shadow-md cursor-pointer"
                            onClick={() => handleTicketClick(ticket.ticketId)} // Add click handler here
                        >
                            {/* Status Bar */}
                            <div className="mt-2">
                                <span
                                    className={`px-3 py-1 text-sm font-semibold rounded-lg ${getTicketStatus(ticket.status) === 'Resolved'
                                        ? 'bg-green-500 text-white'
                                        : getTicketStatus(ticket.status) === 'In Progress'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-red-500 text-white'
                                        }`}
                                >
                                    {getTicketStatus(ticket.status)}
                                </span>
                            </div>

                            <div className="mt-2 text-sm text-gray-500">
                                <p><strong>Subject:</strong> {ticket.subject}</p>
                                <p><strong>Details:</strong> {ticket.details}</p>
                                <p><strong>Created At:</strong>
                                    {ticket.createdAt ? new Date(ticket.createdAt.split('.')[0]).toLocaleString() : "N/A"}
                                </p>

                                <p><strong>Resolved At:</strong>
                                    {ticket.resolvedAt ? new Date(ticket.resolvedAt.split('.')[0]).toLocaleString() : "N/A"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyTickets;
