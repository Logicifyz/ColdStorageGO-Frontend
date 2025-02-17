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

    return (
        <div className="p-6 bg-white min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Account Management</h1>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder="Search by email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={isActive}
                    onChange={(e) => setIsActive(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Statuses</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                </select>
            </div>

            {/* User List */}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border-b px-6 py-3 text-left text-gray-700">Full Name</th>
                            <th className="border-b px-6 py-3 text-left text-gray-700">Email</th>
                            <th className="border-b px-6 py-3 text-left text-gray-700">Username</th>
                            <th className="border-b px-6 py-3 text-left text-gray-700">Phone Number</th>
                            <th className="border-b px-6 py-3 text-left text-gray-700">Active</th>
                            <th className="border-b px-6 py-3 text-left text-gray-700">Verified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr
                                key={user.UserId}
                                className="hover:bg-gray-100 cursor-pointer"
                                onClick={() => navigate(`/staff/account-management/${user.userId}`)}
                            >
                                <td className="border-b px-6 py-4 text-gray-800">{user.fullName}</td>
                                <td className="border-b px-6 py-4 text-gray-800">{user.email}</td>
                                <td className="border-b px-6 py-4 text-gray-800">{user.username}</td>
                                <td className="border-b px-6 py-4 text-gray-800">{user.phoneNumber}</td>
                                <td className="border-b px-6 py-4 text-gray-800">
                                    {user.isActive ? "Active" : "Inactive"}
                                </td>
                                <td className="border-b px-6 py-4 text-gray-800">
                                    {user.verified ? "Yes" : "No"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AccountManagement;
