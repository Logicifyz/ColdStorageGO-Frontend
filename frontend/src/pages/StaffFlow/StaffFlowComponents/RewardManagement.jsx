import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api";
import { SparklesIcon, GiftIcon, CurrencyDollarIcon, XMarkIcon, PhotoIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BackgroundBlobs = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-to-r from-[#302b63] to-[#24243e] opacity-20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-[#4b379c] to-[#1a1a2e] opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
  </div>
);

const GlowingButton = ({ children, onClick, className = "", type = "button" }) => (
  <motion.button
    type={type}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative overflow-hidden px-6 py-3 rounded-2xl font-medium ${className}`}
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] opacity-20 blur-md" />
  </motion.button>
);

const FloatingCard = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 backdrop-blur-xl rounded-3xl p-6 border border-[#ffffff10] shadow-2xl"
  >
    {children}
  </motion.div>
);

const RewardManagement = () => {
  // States for rewards, form, and editing
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
  const [pointsFormData, setPointsFormData] = useState({ userId: "", action: "Add", coins: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dishFormOpen, setDishFormOpen] = useState(false);
  const [newDish, setNewDish] = useState({ name: "", instructions: "" });
  const [notification, setNotification] = useState({ message: "", type: "" });
  
  const dietaryOptions = [
    "Vegan", "Vegetarian", "Pescatarian",
    "Dairy-Free", "Gluten-Free", "Halal"
  ];

  // File input ref for the Featured Image upload
  const fileInputRef = useRef();

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        const response = await api.get("/api/Rewards");
        setRewards(response.data);
      } catch (error) {
        toast.error("Error fetching rewards");
      }
    };
    fetchRewards();
  }, []);

  // Show notification using toast
  const showNotification = (message, type) => {
    if (type === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePointsFormChange = (e) => {
    const { name, value } = e.target;
    setPointsFormData(prev => ({
      ...prev,
      [name]: name === "coins" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, listingImage: file }));
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFormData(prev => ({ ...prev, previewImage: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      tags: checked ? [...prev.tags, value] : prev.tags.filter(tag => tag !== value)
    }));
  };

  // Open form for new or editing reward
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
        rewardType: "Vouchers",
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

    try {
      if (isEditing) {
        await api.put(`/api/Rewards/${editId}`, payload);
        showNotification("Reward updated successfully!", "success");
      } else {
        await api.post("/api/Rewards", payload);
        showNotification("Reward created successfully!", "success");
      }
      const res = await api.get("/api/Rewards");
      setRewards(res.data);
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
    const payload = {
      userId: pointsFormData.userId,
      coins: parseInt(pointsFormData.coins, 10),
    };

    const endpoint = pointsFormData.action === "Add"
      ? `/api/Wallet/earn?coins=${payload.coins}`
      : `/api/Wallet/deduct?coins=${payload.coins}`;

    try {
      await api.post(endpoint, payload);
      showNotification(`${pointsFormData.action} coins successful!`, "success");
      setIsPointsFormOpen(false);
      setPointsFormData({ userId: "", action: "Add", coins: 0 });
    } catch (error) {
      console.error("Error updating points:", error);
      showNotification("Failed to update points", "error");
    }
  };

  const handleDishSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/Dish", newDish);
      // Assuming there's additional state for dishes if needed
      showNotification("Dish added!", "success");
      setDishFormOpen(false);
      setNewDish({ name: "", instructions: "" });
    } catch (error) {
      showNotification("Failed to add dish", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reward?")) return;
    try {
      await api.delete(`/api/Rewards/${id}`);
      const res = await api.get("/api/Rewards");
      setRewards(res.data);
      showNotification("Reward deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting reward:", error);
      showNotification("Failed to delete reward", "error");
    }
  };

  // For filtering rewards
  const filteredRewards = rewards.filter(reward =>
    reward.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0b1a] text-gray-100 relative overflow-hidden p-8">
      <BackgroundBlobs />
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
        theme="dark"
      />
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            <BookOpenIcon className="w-12 h-12 mr-4 inline-block" />
            Reward Nexus
          </motion.h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search rewards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 px-4 rounded-lg bg-[#ffffff05] border border-[#ffffff15] text-white focus:ring-2 focus:ring-cyan-500 w-64"
            />
            <GlowingButton 
              onClick={() => setIsFormOpen(true)}
              className="bg-[#4f46e5] hover:bg-[#6366f1] text-white"
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

        <AnimatePresence>
          {dishFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <FloatingCard>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">New Culinary Creation</h2>
                  <button 
                    onClick={() => setDishFormOpen(false)}
                    className="p-2 hover:bg-[#ffffff10] rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleDishSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Dish Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newDish.name}
                      onChange={(e) => setNewDish({ ...newDish, name: e.target.value })}
                      className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Instructions</label>
                    <textarea
                      name="instructions"
                      value={newDish.instructions}
                      onChange={(e) => setNewDish({ ...newDish, instructions: e.target.value })}
                      className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3 h-32 resize-none"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <GlowingButton type="submit" className="bg-green-600 hover:bg-green-500">
                      Create Dish
                    </GlowingButton>
                  </div>
                </form>
              </FloatingCard>
            </motion.div>
          )}
        </AnimatePresence>

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
                  <h2 className="text-2xl font-bold">{isEditing ? "Edit Reward" : "New Reward"}</h2>
                  <button 
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 hover:bg-[#ffffff10] rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Reward Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Coins Cost</label>
                      <input
                        type="number"
                        name="coinsCost"
                        value={formData.coinsCost}
                        onChange={handleFormChange}
                        className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Availability</label>
                      <select
                        name="availabilityStatus"
                        value={formData.availabilityStatus}
                        onChange={handleFormChange}
                        className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3"
                      >
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="date"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleFormChange}
                        className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Reward Type</label>
                      <select
                        name="rewardType"
                        value={formData.rewardType}
                        onChange={handleFormChange}
                        className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3"
                      >
                        <option value="Vouchers">Digital Voucher</option>
                        <option value="Gifts">Physical Gift</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end gap-4">
                    <GlowingButton type="submit" className="bg-purple-600 hover:bg-purple-500">
                      {isEditing ? "Update Reward" : "Create Reward"}
                    </GlowingButton>
                  </div>
                </form>
              </FloatingCard>
            </motion.div>
          )}
        </AnimatePresence>

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
                    className="p-2 hover:bg-[#ffffff10] rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handlePointsSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">User ID</label>
                    <input
                      type="text"
                      name="userId"
                      value={pointsFormData.userId}
                      onChange={handlePointsFormChange}
                      className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Action</label>
                    <select
                      name="action"
                      value={pointsFormData.action}
                      onChange={handlePointsFormChange}
                      className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3"
                    >
                      <option value="Add">Add Points</option>
                      <option value="Deduct">Deduct Points</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount</label>
                    <input
                      type="number"
                      name="coins"
                      value={pointsFormData.coins}
                      onChange={handlePointsFormChange}
                      className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-4">
                    <GlowingButton type="submit" className="bg-green-600 hover:bg-green-500">
                      Confirm
                    </GlowingButton>
                  </div>
                </form>
              </FloatingCard>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          <AnimatePresence>
            {filteredRewards.map((reward) => (
              <motion.div
                key={reward.rewardId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#161622]/80 backdrop-blur-sm rounded-3xl p-6 border border-[#ffffff10] hover:border-[#ffffff30] transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <GiftIcon className="w-8 h-8 text-purple-400" />
                    <span className={`px-3 py-1 rounded-full text-sm ${reward.availabilityStatus === 'Available' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {reward.availabilityStatus}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{reward.name}</h3>
                  <p className="text-gray-400 mb-4">{reward.description}</p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <span className="text-sm text-gray-500">Cost</span>
                      <p className="text-2xl font-bold text-cyan-400">{reward.coinsCost} ⭐</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Expires</span>
                      <p className="text-purple-400">{new Date(reward.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <GlowingButton
                      onClick={() => {
                        // Open edit form with the reward data
                        openForm(reward);
                      }}
                      className="bg-[#ffffff10] hover:bg-[#ffffff20] text-sm"
                    >
                      Edit
                    </GlowingButton>
                    <GlowingButton
                      onClick={() => handleDelete(reward.rewardId)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm"
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
    </div>
  );
};

export default RewardManagement;
