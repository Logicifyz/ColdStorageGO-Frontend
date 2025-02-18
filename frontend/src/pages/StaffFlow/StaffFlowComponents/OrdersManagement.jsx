import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    XMarkIcon,
    TruckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ChartBarIcon
} from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api";


// A reusable glowing button with calm green gradient
const GlowingButton = ({ children, onClick, className = "", ...props }) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative overflow-hidden px-6 py-3 rounded-2xl font-medium ${className}`}
        {...props}
    >
        <span className="relative z-10">{children}</span>
        {/* Soft glow layer */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#355e3b] to-[#3A5F0B] opacity-20 blur-md" />
    </motion.button>
);

// A floating card with a subtle greenish-beige gradient
const FloatingCard = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="bg-gradient-to-br from-[#E2F2E6] to-[#F0EAD6] backdrop-blur-xl rounded-xl p-6 border border-[#355e3b]/10 shadow-lg"
    >
        {children}
    </motion.div>
);

// Badge component with status-based color classes
const StatusBadge = ({ status }) => {
    const statusColors = {
        Preparing: "bg-yellow-200 text-yellow-700",
        "Out For Delivery": "bg-blue-200 text-blue-700",
        Delivered: "bg-green-200 text-green-700",
        Completed: "bg-purple-200 text-purple-700",
        Cancelled: "bg-red-200 text-red-700"
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-sm ${statusColors[status] || "bg-gray-200 text-gray-700"
                }`}
        >
            {status}
        </span>
    );
};

const OrdersManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState("");
    const [orderUserProfile, setOrderUserProfile] = useState(null);
    const [searchOrderId, setSearchOrderId] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");

    // Valid status options aligned with progress tracker
    const validStatuses = ["Preparing", "Out For Delivery", "Delivered", "Completed"];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get("/api/order");
            const enrichedOrders = await Promise.all(
                response.data.map(async (order) => {
                    const orderItems = order.orderItems || order.OrderItems || [];
                    const enrichedOrderItems = await Promise.all(
                        orderItems.map(async (item) => {
                            try {
                                const mealKitResponse = await api.get(`/api/MealKit/${item.mealKitId}`);
                                return {
                                    ...item,
                                    mealKit: {
                                        ...mealKitResponse.data,
                                        listingImage: mealKitResponse.data.listingImage
                                            ? `data:image/jpeg;base64,${mealKitResponse.data.listingImage}`
                                            : "/default-image.png"
                                    }
                                };
                            } catch (error) {
                                return {
                                    ...item,
                                    mealKit: {
                                        name: "Unknown Meal Kit",
                                        listingImage: "/default-image.png"
                                    }
                                };
                            }
                        })
                    );
                    return { ...order, orderItems: enrichedOrderItems };
                })
            );
            setOrders(enrichedOrders);
        } catch (err) {
            console.error("Error fetching orders", err);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr) =>
        dateStr ? new Date(dateStr).toLocaleString() : "";

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                OrderStatus: statusToUpdate,
                DeliveryAddress:
                    selectedOrder.deliveryAddress || selectedOrder.DeliveryAddress,
                ShipTime: selectedOrder.shipTime || selectedOrder.ShipTime
            };

            const orderId = selectedOrder.id || selectedOrder.Id;
            const response = await api.put(`/api/order/${orderId}`, payload);

            setOrders((prev) =>
                prev.map((o) =>
                    (o.id || o.Id) === (response.data.id || response.data.Id)
                        ? response.data
                        : o
                )
            );
            setSelectedOrder(response.data);
            setUpdateModalOpen(false);
            toast.success("Order updated successfully");
        } catch (err) {
            console.error("Error updating order", err);
            toast.error("Failed to update order");
        }
    };

    const handleDelete = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            try {
                await api.delete(`/api/order/${orderId}`);
                setOrders((prev) => prev.filter((o) => (o.id || o.Id) !== orderId));
                setSelectedOrder(null);
                toast.success("Order deleted successfully");
            } catch (err) {
                console.error("Error deleting order", err);
                toast.error("Failed to delete order");
            }
        }
    };

    // Fetch user profile when a new order is selected
    useEffect(() => {
        if (selectedOrder && selectedOrder.userId) {
            api
                .get(`/api/Account/user/${selectedOrder.userId}`)
                .then((response) => {
                    setOrderUserProfile(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching user profile", error.response);
                    toast.error("Failed to fetch user profile");
                });
        } else {
            setOrderUserProfile(null);
        }
    }, [selectedOrder]);

    // Filter orders by searchOrderId and status
    const filteredOrders = orders.filter((order) => {
        const id = (order.id || order.Id)?.toString() || "";
        const status = order.orderStatus || order.OrderStatus || "";
        const matchesId = id.includes(searchOrderId);
        const matchesStatus = filterStatus === "All" || status === filterStatus;
        return matchesId && matchesStatus;
    });

    return (
        <div className="min-h-screen bg-[#F5F5DC] relative overflow-hidden p-8 text-gray-800">
       
            <ToastContainer position="top-right" theme="light" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="flex flex-col gap-4 mb-12">
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-4xl font-bold bg-gradient-to-r from-[#355e3b] to-[#3A5F0B] bg-clip-text text-transparent"
                    >
                        <TruckIcon className="w-12 h-12 mr-4 inline-block" />
                        Orders Nexus
                    </motion.h1>
                    {/* Search and filter controls */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Search by Order ID"
                            value={searchOrderId}
                            onChange={(e) => setSearchOrderId(e.target.value)}
                            className="py-2 px-4 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#355e3b] w-64"
                        />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="py-2 px-4 rounded-lg bg-white text-gray-900 border border-gray-300 focus:ring-2 focus:ring-[#355e3b]"
                        >
                            <option value="All">All Statuses</option>
                            {validStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#355e3b]"></div>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12 text-gray-700">
                        <ChartBarIcon className="w-24 h-24 mx-auto mb-4" />
                        <p className="text-xl">No orders found</p>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 gap-6">
                        {filteredOrders.map((order) => (
                            <motion.div
                                key={order.id || order.Id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="group relative"
                            >
                                {/* Soft highlight on hover */}
                                <div className="absolute inset-0 bg-gradient-to-br from-[#355e3b]/20 to-[#3A5F0B]/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative bg-white rounded-xl p-6 border border-gray-300 hover:border-[#355e3b] transition-all">
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="bg-[#F5F5DC] p-3 rounded-xl shadow">
                                                    <ClockIcon className="w-6 h-6 text-[#355e3b]" />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-bold text-[#355e3b]">
                                                        Order #{(order.id || order.Id)?.slice(-6)}
                                                    </h2>
                                                    <p className="text-gray-700 text-sm">
                                                        {formatDate(order.orderTime || order.OrderTime)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap gap-4 items-center">
                                                <StatusBadge status={order.orderStatus || order.OrderStatus} />
                                                <div className="flex items-center gap-2 text-[#355e3b]">
                                                    <CurrencyDollarIcon className="w-5 h-5" />
                                                    <span className="font-bold">
                                                        ${Number(order.totalAmount || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 mt-4 md:mt-0">
                                            <GlowingButton
                                                onClick={() => setSelectedOrder(order)}
                                                className="bg-white text-[#355e3b] border border-[#355e3b] hover:bg-[#355e3b] hover:text-white text-sm"
                                            >
                                                Details
                                            </GlowingButton>
                                            <GlowingButton
                                                onClick={() => {
                                                    setSelectedOrder(order);
                                                    setStatusToUpdate(order.orderStatus || order.OrderStatus);
                                                    setUpdateModalOpen(true);
                                                }}
                                                className="bg-[#355e3b] hover:bg-[#3A5F0B] text-white text-sm"
                                            >
                                                Update
                                            </GlowingButton>
                                            <GlowingButton
                                                onClick={() => handleDelete(order.id || order.Id)}
                                                className="bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white text-sm"
                                            >
                                                Delete
                                            </GlowingButton>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {/* Order Details Modal */}
                <AnimatePresence>
                    {selectedOrder && !updateModalOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#355e3b]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        >
                            <FloatingCard>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-[#355e3b]">
                                        Order #{(selectedOrder.id || selectedOrder.Id)?.slice(-6)}
                                    </h2>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="p-2 hover:bg-gray-200 rounded-lg"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white p-4 rounded-xl shadow">
                                            <p className="text-sm text-gray-700">Order Date</p>
                                            <p className="font-medium text-[#355e3b]">
                                                {formatDate(selectedOrder.orderTime || selectedOrder.OrderTime)}
                                            </p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow">
                                            <p className="text-sm text-gray-700">Status</p>
                                            <StatusBadge
                                                status={selectedOrder.orderStatus || selectedOrder.OrderStatus}
                                            />
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow">
                                            <p className="text-sm text-gray-700">Delivery Address</p>
                                            <p className="font-medium text-[#355e3b]">
                                                {selectedOrder.deliveryAddress || selectedOrder.DeliveryAddress}
                                            </p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow">
                                            <p className="text-sm text-gray-700">Customer Name</p>
                                            <p className="font-medium text-[#355e3b]">
                                                {orderUserProfile
                                                    ? orderUserProfile.fullName || "Name not set"
                                                    : "Loading..."}
                                            </p>
                                        </div>
                                        <div className="bg-white p-4 rounded-xl shadow">
                                            <p className="text-sm text-gray-700">Customer Email</p>
                                            <p className="font-medium text-[#355e3b]">
                                                {orderUserProfile ? orderUserProfile.email : "Loading..."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-300 pt-4">
                                        <h3 className="text-xl font-bold mb-4 text-[#355e3b]">Order Items</h3>
                                        <div className="space-y-4">
                                            {(selectedOrder.orderItems || selectedOrder.OrderItems || []).map(
                                                (item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-4 bg-white p-4 rounded-xl shadow"
                                                    >
                                                        <img
                                                            src={item.mealKit?.listingImage}
                                                            alt={item.mealKit?.name}
                                                            className="w-16 h-16 rounded-xl object-cover"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="font-medium text-[#355e3b]">
                                                                {item.mealKit?.name || "Unknown Meal Kit"}
                                                            </p>
                                                            <p className="text-sm text-gray-700">
                                                                Quantity: {item.quantity}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-[#355e3b]">
                                                                ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                                                            </p>
                                                            <p className="text-sm text-gray-700">
                                                                ${(item.unitPrice || 0).toFixed(2)} each
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-300 pt-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Subtotal:</span>
                                            <span className="text-[#355e3b]">
                                                ${Number(selectedOrder.subtotal || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Shipping:</span>
                                            <span className="text-[#355e3b]">
                                                ${Number(selectedOrder.shippingCost || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-700">Tax:</span>
                                            <span className="text-[#355e3b]">
                                                ${Number(selectedOrder.tax || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between font-bold text-lg pt-2">
                                            <span className="text-gray-700">Total:</span>
                                            <span className="text-[#355e3b]">
                                                ${Number(selectedOrder.totalAmount || 0).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </FloatingCard>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Update Status Modal */}
                <AnimatePresence>
                    {updateModalOpen && selectedOrder && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-[#355e3b]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        >
                            <FloatingCard>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-[#355e3b]">
                                        Update Order Status
                                    </h2>
                                    <button
                                        onClick={() => setUpdateModalOpen(false)}
                                        className="p-2 hover:bg-gray-200 rounded-lg"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                                <form onSubmit={handleUpdate} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-gray-700">
                                            Status
                                        </label>
                                        <select
                                            value={statusToUpdate}
                                            onChange={(e) => setStatusToUpdate(e.target.value)}
                                            className="w-full bg-white text-gray-900 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#355e3b] focus:border-transparent"
                                        >
                                            {validStatuses.map((status) => (
                                                <option key={status} value={status} className="bg-white text-gray-900">
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <GlowingButton
                                        type="submit"
                                        className="w-full bg-[#355e3b] hover:bg-[#3A5F0B] text-white"
                                    >
                                        Update Status
                                    </GlowingButton>
                                </form>
                            </FloatingCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default OrdersManagement;
