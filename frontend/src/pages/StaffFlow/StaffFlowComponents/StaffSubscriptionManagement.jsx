import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api";
import { CheckCircleIcon, ExclamationCircleIcon, CalendarIcon, UserIcon, XMarkIcon } from "@heroicons/react/24/outline";
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

const StaffSubscriptionManagement = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [modal, setModal] = useState({ isOpen: false, action: null, subscription: null });

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await api.get("/api/subscriptions/all");
        setSubscriptions(response.data);
      } catch (error) {
        toast.error("Error fetching subscriptions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const openModal = (action, subscription) => {
    setModal({ isOpen: true, action, subscription });
  };

  const closeModal = () => {
    setModal({ isOpen: false, action: null, subscription: null });
  };

  const executeAction = async () => {
    if (!modal.action || !modal.subscription) return;
    closeModal();

    try {
      let endpoint = "";
      let successMessage = "";

      if (modal.action === "cancel") {
        endpoint = `/api/subscriptions/cancel/${modal.subscription.subscriptionId}`;
        successMessage = "Subscription canceled successfully.";
      } else if (modal.action === "freeze") {
        endpoint = `/api/subscriptions/freeze/${modal.subscription.subscriptionId}`;
        successMessage = "Subscription frozen.";
      } else if (modal.action === "unfreeze") {
        endpoint = `/api/subscriptions/unfreeze/${modal.subscription.subscriptionId}`;
        successMessage = "Subscription unfrozen.";
      }

      await api.put(endpoint);
      toast.success(successMessage);

      // Refresh subscriptions after action
      const response = await api.get("/api/subscriptions/all");
      setSubscriptions(response.data);
    } catch (error) {
      toast.error("Failed to update subscription.");
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subscriptionType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0b0b1a] text-gray-100 relative overflow-hidden p-8">
      <BackgroundBlobs />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
          >
            <UserIcon className="w-12 h-12 mr-4 inline-block" />
            Subscription Management
          </motion.h1>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search by user or plan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="py-2 px-4 rounded-lg bg-[#ffffff05] border border-[#ffffff15] text-white focus:ring-2 focus:ring-cyan-500 w-64"
            />
          </div>
        </header>

        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          <AnimatePresence>
            {filteredSubscriptions.map((subscription) => (
              <motion.div
                key={subscription.subscriptionId}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative"
              >
                <FloatingCard>
                  <h3 className="text-xl font-bold">{subscription.subscriptionType} Plan</h3>
                  <p className="text-gray-400 mb-4">User ID: {subscription.userId}</p>
                  <p>Status: <span className={`text-${subscription.status === "Active" ? "green" : "red"}-400`}>{subscription.status}</span></p>
                  <p>Auto-Renew: {subscription.autoRenewal ? "Yes" : "No"}</p>

                  <div className="flex gap-3 mt-4">
                    {subscription.status === "Active" && (
                      <GlowingButton onClick={() => openModal("freeze", subscription)} className="bg-blue-600 hover:bg-blue-500 text-white">
                        Freeze
                      </GlowingButton>
                    )}
                    {subscription.status === "Frozen" && (
                      <GlowingButton onClick={() => openModal("unfreeze", subscription)} className="bg-green-600 hover:bg-green-500 text-white">
                        Unfreeze
                      </GlowingButton>
                    )}
                    <GlowingButton onClick={() => openModal("cancel", subscription)} className="bg-red-600 hover:bg-red-500 text-white">
                      Cancel
                    </GlowingButton>
                  </div>
                </FloatingCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default StaffSubscriptionManagement;