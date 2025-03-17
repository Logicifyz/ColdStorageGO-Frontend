import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api";
import {
    SparklesIcon,
    GiftIcon,
    CurrencyDollarIcon,
    XMarkIcon,
    PhotoIcon,
    BookOpenIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



// GlowingButton remains unchanged
const GlowingButton = ({ children, onClick, className = "", type = "button" }) => (
    <motion.button
        type={type}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative overflow-hidden px-6 py-3 rounded-2xl font-medium ${className}`}
    >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] opacity-20 blur-md" />
    </motion.button>
);

// FloatingCard now uses a greenish gradient for modals and cards
const FloatingCard = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#A8E6CF] to-[#DCEDC1] backdrop-blur-xl rounded-xl p-6 border-2 border-transparent shadow-lg"
    >
        {children}
    </motion.div>
);

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
        rewardType: "Voucher5",
        tags: [],
    });
    const [pointsFormData, setPointsFormData] = useState({
        selectedUser: null,
        action: "Add",
        coins: 0,
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [dishFormOpen, setDishFormOpen] = useState(false);
    const [newDish, setNewDish] = useState({ name: "", instructions: "" });
    const fileInputRef = useRef();
    const [users, setUsers] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState("");
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [rewardToDelete, setRewardToDelete] = useState(null);

    // Fetch rewards and redemption counts together
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [rewardsResponse, redemptionCountsResponse] = await Promise.all([
                    api.get("/api/Rewards"),
                    api.get("/api/Rewards/redemption-counts"),
                ]);

                const redemptionCountsMap = redemptionCountsResponse.data.reduce(
                    (acc, curr) => {
                        acc[curr.rewardId] = curr.redemptionCount;
                        return acc;
                    },
                    {}
                );

                const rewardsWithCounts = rewardsResponse.data.map((reward) => ({
                    ...reward,
                    redemptionCount: redemptionCountsMap[reward.rewardId] || 0,
                }));

                setRewards(rewardsWithCounts);
            } catch (error) {
                toast.error("Error fetching data");
            }
        };
        fetchData();
    }, []);

    const showNotification = (message, type) => {
        if (type === "success") {
            toast.success(message);
        } else {
            toast.error(message);
        }
    };

    useEffect(() => {
        if (isPointsFormOpen) {
            const fetchUsers = async () => {
                try {
                    const response = await api.get("/api/Account/all-users");
                    setUsers(response.data);
                } catch (error) {
                    toast.error("Error fetching users");
                }
            };
            fetchUsers();
        }
    }, [isPointsFormOpen]);

    // User search handler
    const filteredUsers = users.filter((user) =>
        user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
    );

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePointsFormChange = (e) => {
        const { name, value } = e.target;
        setPointsFormData((prev) => ({
            ...prev,
            [name]: name === "coins" ? parseInt(value, 10) || 0 : value,
        }));
    };

    const handleUserSelect = (user) => {
        setPointsFormData((prev) => ({
            ...prev,
            selectedUser: user,
        }));
        setIsUserDropdownOpen(false);
        setUserSearchTerm("");
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prev) => ({ ...prev, listingImage: file }));
        if (file) {
            const reader = new FileReader();
            reader.onload = () =>
                setFormData((prev) => ({ ...prev, previewImage: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            tags: checked
                ? [...prev.tags, value]
                : prev.tags.filter((tag) => tag !== value),
        }));
    };

    const openForm = (reward = null) => {
        setIsFormOpen(true);
        if (reward) {
            setIsEditing(true);
            setEditId(reward.rewardId);
            setFormData({
                name: reward.name,
                description: reward.description,
                coinsCost: reward.coinsCost,
                availabilityStatus: reward.availabilityStatus,
                expiryDate: reward.expiryDate.split("T")[0],
                rewardType: reward.rewardType,
                tags: reward.tags || [],
            });
        } else {
            setIsEditing(false);
            setEditId(null);
            setFormData({
                name: "",
                description: "",
                coinsCost: 0,
                availabilityStatus: "Available",
                expiryDate: "",
                rewardType: "Voucher5",
                tags: [],
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            coinsCost: parseInt(formData.coinsCost, 10),
        };

        if (isEditing) {
            payload.rewardId = editId;
        }

        try {
            if (isEditing) {
                await api.put(`/api/Rewards/${editId}`, payload);
                showNotification("Reward updated successfully!", "success");
            } else {
                await api.post("/api/Rewards", payload);
                showNotification("Reward created successfully!", "success");
            }
            // Refresh rewards after update
            const [rewardsResponse, redemptionCountsResponse] = await Promise.all([
                api.get("/api/Rewards"),
                api.get("/api/Rewards/redemption-counts"),
            ]);

            const redemptionCountsMap = redemptionCountsResponse.data.reduce(
                (acc, curr) => {
                    acc[curr.rewardId] = curr.redemptionCount;
                    return acc;
                },
                {}
            );

            const rewardsWithCounts = rewardsResponse.data.map((reward) => ({
                ...reward,
                redemptionCount: redemptionCountsMap[reward.rewardId] || 0,
            }));

            setRewards(rewardsWithCounts);
            setIsFormOpen(false);
            setIsEditing(false);
            setEditId(null);
        } catch (error) {
            console.error("Error submitting reward:", error);
            showNotification("Failed to save reward", "error");
        }
    };

    const handlePointsSubmit = async (e) => {
        e.preventDefault();
        if (!pointsFormData.selectedUser) {
            toast.error("Please select a user");
            return;
        }

        const payload = {
            userId: pointsFormData.selectedUser.userId,
            coins: parseInt(pointsFormData.coins, 10),
        };

        const endpoint =
            pointsFormData.action === "Add"
                ? `/api/Wallet/earn?coins=${payload.coins}`
                : `/api/Wallet/deduct?coins=${payload.coins}`;

        try {
            await api.post(endpoint, payload);
            showNotification(`${pointsFormData.action} coins successful!`, "success");
            setIsPointsFormOpen(false);
            setPointsFormData({
                selectedUser: null,
                action: "Add",
                coins: 0,
            });
        } catch (error) {
            console.error("Error updating points:", error);
            showNotification("Failed to update points", "error");
        }
    };

    const handleDishSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/api/Dish", newDish);
            showNotification("Dish added!", "success");
            setDishFormOpen(false);
            setNewDish({ name: "", instructions: "" });
        } catch (error) {
            showNotification("Failed to add dish", "error");
        }
    };

    // Open delete confirmation modal
    const openDeleteModal = (id) => {
        setRewardToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/api/Rewards/${rewardToDelete}`);
            // Refresh rewards after deletion
            const [rewardsResponse, redemptionCountsResponse] = await Promise.all([
                api.get("/api/Rewards"),
                api.get("/api/Rewards/redemption-counts"),
            ]);

            const redemptionCountsMap = redemptionCountsResponse.data.reduce(
                (acc, curr) => {
                    acc[curr.rewardId] = curr.redemptionCount;
                    return acc;
                },
                {}
            );

            const rewardsWithCounts = rewardsResponse.data.map((reward) => ({
                ...reward,
                redemptionCount: redemptionCountsMap[reward.rewardId] || 0,
            }));

            setRewards(rewardsWithCounts);
            showNotification("Reward deleted successfully", "success");
            setIsDeleteModalOpen(false);
            setRewardToDelete(null);
        } catch (error) {
            console.error("Error deleting reward:", error);
            showNotification("Failed to delete reward", "error");
        }
    };

    const filteredRewards = rewards.filter((reward) =>
        reward.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F0EAD6] to-[#E2F2E6] text-gray-900 relative overflow-hidden p-8">
           
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-4xl font-bold bg-gradient-to-r from-[#2D4B33] to-[#355E3B] bg-clip-text text-transparent"
                    >
                        <BookOpenIcon className="w-12 h-12 mr-4 inline-block" />
                        Reward Station
                    </motion.h1>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Search rewards..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="py-2 px-4 rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-2 focus:ring-cyan-500 w-64"
                        />
                        <GlowingButton
                            onClick={() => setIsFormOpen(true)}
                            className="bg-[#2D4B33] hover:bg-[#355E3B] text-white"
                        >
                            + Create Reward
                        </GlowingButton>
                        <GlowingButton
                            onClick={() => setIsPointsFormOpen(true)}
                            className="bg-[#10b981] hover:bg-[#34d399] text-white"
                        >
                            <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                            Manage Coins
                        </GlowingButton>
                    </div>
                </header>

                {/* Reward Form Modal */}
                <AnimatePresence>
                    {isFormOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                        >
                            <FloatingCard>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">
                                        {isEditing ? "Edit Reward" : "New Reward"}
                                    </h2>
                                    <button
                                        onClick={() => setIsFormOpen(false)}
                                        className="p-2 hover:bg-gray-200 rounded-lg"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Reward Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleFormChange}
                                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Description
                                            </label>
                                            <input
                                                type="text"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleFormChange}
                                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Coins Cost
                                            </label>
                                            <input
                                                type="number"
                                                name="coinsCost"
                                                value={formData.coinsCost}
                                                onChange={handleFormChange}
                                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Availability
                                            </label>
                                            <select
                                                name="availabilityStatus"
                                                value={formData.availabilityStatus}
                                                onChange={handleFormChange}
                                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                                            >
                                                <option value="Available">Available</option>
                                                <option value="Unavailable">Unavailable</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Expiry Date
                                            </label>
                                            <input
                                                type="date"
                                                name="expiryDate"
                                                value={formData.expiryDate}
                                                onChange={handleFormChange}
                                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">
                                                Reward Type
                                            </label>
                                            <select
                                                name="rewardType"
                                                value={formData.rewardType}
                                                onChange={handleFormChange}
                                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                                            >
                                                <option value="Voucher5">5$ Discount Voucher</option>
                                                <option value="Voucher10">10$ Discount Voucher</option>
                                                <option value="Voucher15">15$ Discount Voucher</option>
                                                <option value="Voucher20">20$ Discount Voucher</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-span-2 flex justify-end gap-4">
                                        <GlowingButton
                                            type="submit"
                                            className="bg-purple-600 hover:bg-purple-500 text-white"
                                        >
                                            {isEditing ? "Update Reward" : "Create Reward"}
                                        </GlowingButton>
                                    </div>
                                </form>
                            </FloatingCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Points Management Modal */}
                <AnimatePresence>
                    {isPointsFormOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                        >
                            <FloatingCard>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Manage User Points</h2>
                                    <button
                                        onClick={() => setIsPointsFormOpen(false)}
                                        className="p-2 hover:bg-gray-200 rounded-lg"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                                <form onSubmit={handlePointsSubmit} className="space-y-6">
                                    <div className="relative">
                                        <label className="block text-sm font-medium mb-2">
                                            Select User
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search by email..."
                                                value={userSearchTerm}
                                                onChange={(e) => setUserSearchTerm(e.target.value)}
                                                onFocus={() => setIsUserDropdownOpen(true)}
                                                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                                            />
                                            <AnimatePresence>
                                                {isUserDropdownOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -10 }}
                                                        className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg max-h-60 overflow-y-auto"
                                                    >
                                                        {filteredUsers.map((user) => (
                                                            <div
                                                                key={user.userId}
                                                                onClick={() => handleUserSelect(user)}
                                                                className="px-4 py-3 hover:bg-gray-200 cursor-pointer transition-colors"
                                                            >
                                                                <p className="text-gray-900">{user.email}</p>
                                                                <p className="text-xs text-gray-600">
                                                                    ID: {user.userId}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                        {pointsFormData.selectedUser && (
                                            <div className="mt-4 p-3 bg-white rounded-lg shadow">
                                                <p className="text-sm font-medium">Selected User:</p>
                                                <p className="text-cyan-700">
                                                    {pointsFormData.selectedUser.email}
                                                </p>
                                                <p className="text-xs text-gray-600">
                                                    ID: {pointsFormData.selectedUser.userId}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Action
                                        </label>
                                        <select
                                            name="action"
                                            value={pointsFormData.action}
                                            onChange={handlePointsFormChange}
                                            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                                        >
                                            <option value="Add">Add Points</option>
                                            <option value="Deduct">Deduct Points</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Amount
                                        </label>
                                        <input
                                            type="number"
                                            name="coins"
                                            value={pointsFormData.coins}
                                            onChange={handlePointsFormChange}
                                            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900"
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-4">
                                        <GlowingButton
                                            type="submit"
                                            className="bg-green-600 hover:bg-green-500 text-white"
                                        >
                                            Confirm
                                        </GlowingButton>
                                    </div>
                                </form>
                            </FloatingCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Rewards Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
                >
                    <AnimatePresence>
                        {filteredRewards.map((reward) => (
                            <motion.div
                                key={reward.rewardId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                            >
                                <div className="relative bg-gradient-to-br from-[#A8E6CF] to-[#DCEDC1] backdrop-blur-xl rounded-xl p-6 border-2 border-transparent hover:border-[#2D4B33]/30 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <GiftIcon className="w-8 h-8 text-[#2D4B33]" />
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${reward.availabilityStatus === "Available"
                                                    ? "bg-green-200 text-green-700"
                                                    : "bg-red-200 text-red-700"
                                                }`}
                                        >
                                            {reward.availabilityStatus}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 text-[#2D4B33]">
                                        {reward.name}
                                    </h3>
                                    <p className="text-gray-700 mb-4">{reward.description}</p>
                                    <div className="grid grid-cols-3 gap-4 mb-6">
                                        <div>
                                            <span className="text-sm text-gray-600">Cost</span>
                                            <p className="text-2xl font-bold text-cyan-700">
                                                {reward.coinsCost} ⭐
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Expires</span>
                                            <p className="text-purple-700">
                                                {new Date(reward.expiryDate).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-gray-600">Redemptions</span>
                                            <p className="text-2xl font-bold text-green-700">
                                                {reward.redemptionCount}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <GlowingButton
                                            onClick={() => openForm(reward)}
                                            className="bg-white text-[#2D4B33] border border-[#2D4B33] hover:bg-[#2D4B33] hover:text-white text-sm"
                                        >
                                            Edit
                                        </GlowingButton>
                                        <GlowingButton
                                            onClick={() => openDeleteModal(reward.rewardId)}
                                            className="bg-red-200 hover:bg-red-300 text-red-700 text-sm"
                                        >
                                            Delete
                                        </GlowingButton>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-300 w-96"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">
                                Confirm Deletion
                            </h3>
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to delete this reward?
                            </p>
                            <div className="flex justify-end gap-4">
                                <GlowingButton
                                    onClick={() => {
                                        setIsDeleteModalOpen(false);
                                        setRewardToDelete(null);
                                    }}
                                    className="bg-gray-500 hover:bg-gray-400 text-white"
                                >
                                    Cancel
                                </GlowingButton>
                                <GlowingButton
                                    onClick={confirmDelete}
                                    className="bg-red-600 hover:bg-red-500 text-white"
                                >
                                    Delete
                                </GlowingButton>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RewardManagement;
