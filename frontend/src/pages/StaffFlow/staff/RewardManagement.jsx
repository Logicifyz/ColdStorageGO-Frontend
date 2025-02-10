import React, { useState, useEffect } from "react";
import api from "../../api";

const RewardManagement = () => {
    const [rewards, setRewards] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isPointsFormOpen, setIsPointsFormOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        coinsCost: 0,
        availabilityStatus: "Available",
        expiryDate: "",
        rewardType: "Vouchers",
    });
    const [pointsFormData, setPointsFormData] = useState({
        userId: "",
        action: "Add",
        coins: 0,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchRewards = async () => {
        try {
            const response = await api.get("/api/Rewards");
            setRewards(response.data);
        } catch (error) {
            console.error("Error fetching rewards:", error);
        }
    };

    useEffect(() => {
        fetchRewards();
    }, []);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePointsFormChange = (e) => {
        const { name, value } = e.target;

        setPointsFormData((prevState) => ({
            ...prevState,
            [name]: name === "coins" ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...formData,
            coinsCost: parseInt(formData.coinsCost),
        };

        try {
            if (isEditing) {
                await api.put(`/api/Rewards/${editId}`, payload);
                setIsEditing(false);
                setEditId(null);
            } else {
                await api.post("/api/Rewards", payload);
            }

            fetchRewards();
            setFormData({
                name: "",
                description: "",
                coinsCost: 0,
                availabilityStatus: "Available",
                expiryDate: "",
                rewardType: "Vouchers",
            });
            setIsFormOpen(false);
        } catch (error) {
            console.error("Error submitting reward:", error);
        }
    };

    const handlePointsSubmit = async (e) => {
        e.preventDefault();

        // Create the payload from pointsFormData
        const payload = {
            userId: pointsFormData.userId,
            coins: parseInt(pointsFormData.coins, 10), // Ensure coins is an integer
        };

        const endpoint = pointsFormData.action === "Add"
            ? `/api/Wallet/earn?coins=${payload.coins}`
            : `/api/Wallet/deduct?coins=${payload.coins}`;

        try {
            await api.post(endpoint, payload);
            alert(`${pointsFormData.action} coins successful!`);
            setIsPointsFormOpen(false);
            setPointsFormData({ userId: "", action: "Add", coins: 0 });
        } catch (error) {
            console.error("Error updating points:", error);
            alert("Failed to update points.");
        }
    };


    const handleEdit = (reward) => {
        setFormData(reward);
        setIsEditing(true);
        setEditId(reward.rewardId);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/Rewards/${id}`);
            fetchRewards();
        } catch (error) {
            console.error("Error deleting reward:", error);
        }
    };

    return (
        <div className="bg-[#282828] min-h-screen p-8 text-gray-300">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Rewards Management</h1>
                <div className="flex space-x-4">
                    <button
                        className="button bg-[#302b63] text-white px-4 py-2 rounded relative overflow-hidden"
                        onClick={() => {
                            setIsFormOpen(true);
                            setIsEditing(false);
                            setFormData({
                                name: "",
                                description: "",
                                coinsCost: 0,
                                availabilityStatus: "Available",
                                expiryDate: "",
                                rewardType: "Vouchers",
                            });
                        }}
                    >
                        Add Reward
                    </button>
                    <button
                        className="button bg-blue-600 text-white px-4 py-2 rounded"
                        onClick={() => setIsPointsFormOpen(true)}
                    >
                        Points
                    </button>
                </div>
            </div>

            {isFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-[#383838] p-6 rounded-lg shadow-lg w-full max-w-md"
                    >
                        <h2 className="text-xl font-bold mb-4">
                            {isEditing ? "Edit Reward" : "Add New Reward"}
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <input
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Coins Cost</label>
                                <input
                                    type="number"
                                    name="coinsCost"
                                    value={formData.coinsCost}
                                    onChange={handleFormChange}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Availability</label>
                                <select
                                    name="availabilityStatus"
                                    value={formData.availabilityStatus}
                                    onChange={handleFormChange}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                >
                                    <option value="Available">Available</option>
                                    <option value="Unavailable">Unavailable</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Expiry Date</label>
                                <input
                                    type="date"
                                    name="expiryDate"
                                    value={formData.expiryDate}
                                    onChange={handleFormChange}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Reward Type</label>
                                <select
                                    name="rewardType"
                                    value={formData.rewardType}
                                    onChange={handleFormChange}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                >
                                    <option value="Vouchers">Vouchers</option>
                                    <option value="Gifts">Gifts</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="button bg-green-600 text-white px-4 py-2 rounded"
                            >
                                {isEditing ? "Update" : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isPointsFormOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-[#282828] p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Manage User Points</h2>
                        <form onSubmit={handlePointsSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">User ID</label>
                                <input
                                    type="text"
                                    name="userId"
                                    value={pointsFormData.userId}
                                    onChange={handlePointsFormChange}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                    placeholder="Enter User ID"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Action</label>
                                <select
                                    name="action"
                                    value={pointsFormData.action}
                                    onChange={handlePointsFormChange}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                >
                                    <option value="Add">Add Points</option>
                                    <option value="Deduct">Deduct Points</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2">Coins</label>
                                <input
                                    type="number"
                                    name="coins"
                                    value={pointsFormData.coins}
                                    onChange={handlePointsFormChange}
                                    className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                                    placeholder="Enter Points Amount"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4 mt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsPointsFormOpen(false)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => (
                    <div key={reward.rewardId} className="bg-[#383838] p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-bold mb-2">{reward.name}</h3>
                        <p className="mb-2">{reward.description}</p>
                        <p className="mb-2">Coins Cost: {reward.coinsCost}</p>
                        <p className="mb-2">Availability: {reward.availabilityStatus}</p>
                        <p className="mb-2">Expiry Date: {new Date(reward.expiryDate).toLocaleDateString()}</p>
                        <p className="mb-2">Reward Type: {reward.rewardType}</p>
                        <div className="flex justify-end space-x-4 mt-4">
                            <button
                                onClick={() => handleEdit(reward)}
                                className="button bg-[#FF8C00] hover:bg-orange-600 text-white px-4 py-2 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(reward.rewardId)}
                                className="button bg-[rgb(255,65,65)] hover:bg-red-600 text-white px-4 py-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};
export default RewardManagement;