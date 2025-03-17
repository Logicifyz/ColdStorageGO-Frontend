import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";

const AccountManagement = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isActive, setIsActive] = useState("");
    const navigate = useNavigate();

    // Fetch users from the API
    const fetchUsers = async () => {
        try {
            const response = await api.get("/api/StaffAccount/GetAllUsers", {
                params: {
                    name: name || undefined,
                    email: email || undefined,
                    isActive: isActive !== "" ? isActive : undefined,
                },
                withCredentials: true, // Include cookies (for sessionId)
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };

    // Fetch users on component mount and when filters change
    useEffect(() => {
        fetchUsers();
    }, [name, email, isActive]);
    const getValueOrNA = (value) => value || "N/A";

    return (
        <div className="p-6 bg-[#F0EAD6] min-h-screen relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header */}
                <h1 className="text-5xl font-bold mb-6 text-[#355E3B] text-center">
                    Account Management
                </h1>

                {/* Filters */}
                <div className="mb-8 flex flex-wrap gap-4 justify-center">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border border-gray-300 rounded-xl px-6 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition bg-white shadow-sm hover:shadow-md"
                    />
                    <input
                        type="text"
                        placeholder="Search by email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-xl px-6 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition bg-white shadow-sm hover:shadow-md"
                    />
                    <select
                        value={isActive}
                        onChange={(e) => setIsActive(e.target.value)}
                        className="border border-gray-300 rounded-xl px-6 py-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition bg-white shadow-sm hover:shadow-md"
                    >
                        <option value="">All Statuses</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>
                </div>

                {/* User List */}
                <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-[#E2F2E6]">
                                <th className="px-6 py-4 text-left text-[#355E3B] font-semibold">Full Name</th>
                                <th className="px-6 py-4 text-left text-[#355E3B] font-semibold">Email</th>
                                <th className="px-6 py-4 text-left text-[#355E3B] font-semibold">Username</th>
                                <th className="px-6 py-4 text-left text-[#355E3B] font-semibold">Phone Number</th>
                                <th className="px-6 py-4 text-left text-[#355E3B] font-semibold">Active</th>
                                <th className="px-6 py-4 text-left text-[#355E3B] font-semibold">Verified</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr
                                    key={user.UserId}
                                    className="hover:bg-[#F0EAD6] cursor-pointer transition-colors"
                                    onClick={() => navigate(`/staff/account-management/${user.userId}`)}
                                >
                                    <td className="px-6 py-4 text-gray-800 border-b border-gray-200">{getValueOrNA(user.fullName)}</td>
                                    <td className="px-6 py-4 text-gray-800 border-b border-gray-200">{getValueOrNA(user.email)}</td>
                                    <td className="px-6 py-4 text-gray-800 border-b border-gray-200">{getValueOrNA(user.username)}</td>
                                    <td className="px-6 py-4 text-gray-800 border-b border-gray-200">{getValueOrNA(user.phoneNumber)}</td>
                                    <td className="px-6 py-4 text-gray-800 border-b border-gray-200">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                        >
                                            {user.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 border-b border-gray-200">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-semibold ${user.verified ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                        >
                                            {user.verified ? "Yes" : "No"}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AccountManagement;