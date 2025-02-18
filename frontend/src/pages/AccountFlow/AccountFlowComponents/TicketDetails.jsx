import React, { useEffect, useState } from 'react';
import api from '../../../api';
import { useParams, useNavigate } from 'react-router-dom';
import Chat from '../../../components/Chat';
import { ArrowLeft } from 'lucide-react';

const TicketDetails = () => {
    const { ticketId } = useParams();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null);
    const [staffId, setStaffId] = useState(null);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const response = await api.get(`/api/Support/GetTickets`, {
                    params: { ticketId }
                });
                const ticketData = response.data[0];
                setTicket(ticketData);
                setStaffId(ticketData.staffId);
                setUserId(ticketData.userId);
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
            <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
                <div className="text-xl font-semibold text-[#355E3B]">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
                <div className="text-xl font-semibold text-red-500">{error}</div>
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
                <div className="text-xl font-semibold text-[#355E3B]">Ticket not found</div>
            </div>
        );
    }

    return (
        <div className="bg-[#F0EAD6] min-h-screen">
         
            <div className="container mx-auto max-w-7xl">
                <div className="pt-8  mt-4 flex items-center space-x-2 cursor-pointer text-[#355E3B] hover:text-[#2D4B33] transition duration-200" onClick={() => navigate("/account-dashboard/my-tickets")}>
                    <ArrowLeft className="w-5 h-5" />
                    <span className="text-lg font-semibold">See All Tickets</span>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-8">
                    {/* Left Column: Ticket Details (40%) */}
                    <div className="space-y-6">
                        <div className="bg-[#F0EAD6] shadow-none rounded-lg p-6">
                            <h2 className="text-3xl font-bold text-[#355E3B] mb-6">Ticket Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Ticket ID</label>
                                    <p className="mt-1 text-lg font-semibold text-[#355E3B]">{ticket.ticketId}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Category</label>
                                    <p className="mt-1 text-lg font-semibold text-[#355E3B]">{ticket.category}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Priority</label>
                                    <p className="mt-1 text-lg font-semibold text-[#355E3B]">{ticket.priority}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Status</label>
                                    <p className="mt-1 text-lg font-semibold text-[#355E3B]">{ticket.status}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Created At</label>
                                    <p className="mt-1 text-lg font-semibold text-[#355E3B]">{new Date(ticket.createdAt).toLocaleString()}</p>
                                </div>
                                {ticket.resolvedAt && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Resolved At</label>
                                        <p className="mt-1 text-lg font-semibold text-[#355E3B]">{new Date(ticket.resolvedAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Ticket Images */}
                        {ticket.images && ticket.images.length > 0 && (
                            <div className="bg-[#F0EAD6] shadow-none rounded-lg p-6">
                                <h3 className="text-2xl font-bold text-[#355E3B] mb-4">Ticket Images</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {ticket.images.map((img) => (
                                        <div key={img.imageId} className="image-item">
                                            <img
                                                src={`data:image/jpeg;base64,${img.imageData}`}
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
                    <div className="bg-[#F0EAD6] rounded-lg p-6">
                        {/* Subject and Details Above Chat */}
                        <div className="mb-4">
                            <p className="text-2xl font-bold text-[#355E3B]">{ticket.subject}</p>
                        </div>
                        <div className="mb-4">
                            <p className="text-lg text-[#355E3B]">{ticket.details}</p>
                        </div>
                        {/* Line Separator */}
                        <hr className="border-t border-gray-300 my-4" />
                        {/* Chat Component */}
                        <Chat
                            userId={userId}
                            staffId={staffId}
                            ticketId={ticketId}
                            isStaff={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetails;
