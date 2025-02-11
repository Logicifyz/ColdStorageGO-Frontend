import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon, TruckIcon, ClockIcon, CurrencyDollarIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../../api";

const BackgroundBlobs = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-to-r from-[#1a2a3a] to-[#0d1a26] opacity-20 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-[#2d3a4d] to-[#1a2633] opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
  </div>
);

const GlowingButton = ({ children, onClick, className = "" }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative overflow-hidden px-6 py-3 rounded-2xl font-medium ${className}`}
  >
    <span className="relative z-10">{children}</span>
    <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#6366f1] opacity-20 blur-md" />
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

const StatusBadge = ({ status }) => {
  const statusColors = {
    Pending: "bg-yellow-500/20 text-yellow-400",
    Processing: "bg-blue-500/20 text-blue-400",
    Shipped: "bg-purple-500/20 text-purple-400",
    Delivered: "bg-green-500/20 text-green-400",
    Cancelled: "bg-red-500/20 text-red-400"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm ${statusColors[status]}`}>
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
                return { ...item, mealKit: { name: "Unknown Meal Kit", listingImage: "/default-image.png" } };
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

  const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleString() : "";

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        OrderStatus: statusToUpdate,
        DeliveryAddress: selectedOrder.deliveryAddress || selectedOrder.DeliveryAddress,
        ShipTime: selectedOrder.shipTime || selectedOrder.ShipTime
      };

      const orderId = selectedOrder.id || selectedOrder.Id;
      const response = await api.put(`/api/order/${orderId}`, payload);
      
      setOrders(prev => prev.map(o => 
        (o.id || o.Id) === (response.data.id || response.data.Id) ? response.data : o
      ));
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
        setOrders(prev => prev.filter(o => (o.id || o.Id) !== orderId));
        setSelectedOrder(null);
        toast.success("Order deleted successfully");
      } catch (err) {
        console.error("Error deleting order", err);
        toast.error("Failed to delete order");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1f] relative overflow-hidden p-8">
      <BackgroundBlobs />
      <ToastContainer position="top-right" theme="dark" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-12">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
          >
            <TruckIcon className="w-12 h-12 mr-4 inline-block" />
            Orders Nexus
          </motion.h1>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <ChartBarIcon className="w-24 h-24 mx-auto mb-4" />
            <p className="text-xl">No orders found</p>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-6">
            {orders.map((order) => (
              <motion.div
                key={order.id || order.Id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#161622]/80 backdrop-blur-sm rounded-3xl p-6 border border-[#ffffff10] hover:border-[#ffffff30] transition-all">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="bg-[#ffffff10] p-3 rounded-xl">
                          <ClockIcon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold">
                            Order #{(order.id || order.Id)?.slice(-6)}
                          </h2>
                          <p className="text-gray-400 text-sm">
                            {formatDate(order.orderTime || order.OrderTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 items-center">
                        <StatusBadge status={order.orderStatus || order.OrderStatus} />
                        <div className="flex items-center gap-2 text-cyan-400">
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
                        className="bg-[#ffffff10] hover:bg-[#ffffff20] text-sm"
                      >
                        Details
                      </GlowingButton>
                      <GlowingButton
                        onClick={() => {
                          setSelectedOrder(order);
                          setStatusToUpdate(order.orderStatus || order.OrderStatus);
                          setUpdateModalOpen(true);
                        }}
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400 text-sm"
                      >
                        Update
                      </GlowingButton>
                      <GlowingButton
                        onClick={() => handleDelete(order.id || order.Id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm"
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

        <AnimatePresence>
          {selectedOrder && !updateModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <FloatingCard>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    Order #{(selectedOrder.id || selectedOrder.Id)?.slice(-6)}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="p-2 hover:bg-[#ffffff10] rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#ffffff05] p-4 rounded-xl">
                      <p className="text-sm text-gray-400">Order Date</p>
                      <p className="font-medium">
                        {formatDate(selectedOrder.orderTime || selectedOrder.OrderTime)}
                      </p>
                    </div>
                    <div className="bg-[#ffffff05] p-4 rounded-xl">
                      <p className="text-sm text-gray-400">Status</p>
                      <StatusBadge status={selectedOrder.orderStatus || selectedOrder.OrderStatus} />
                    </div>
                    <div className="bg-[#ffffff05] p-4 rounded-xl col-span-2">
                      <p className="text-sm text-gray-400">Delivery Address</p>
                      <p className="font-medium">
                        {selectedOrder.deliveryAddress || selectedOrder.DeliveryAddress}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#ffffff10] pt-4">
                    <h3 className="text-xl font-bold mb-4">Order Items</h3>
                    <div className="space-y-4">
                      {(selectedOrder.orderItems || selectedOrder.OrderItems || []).map((item, index) => (
                        <div key={index} className="flex items-center gap-4 bg-[#ffffff05] p-4 rounded-xl">
                          <img
                            src={item.mealKit?.listingImage}
                            alt={item.mealKit?.name}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.mealKit?.name || "Unknown Meal Kit"}</p>
                            <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              ${((item.unitPrice || 0) * item.quantity).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-400">
                              ${(item.unitPrice || 0).toFixed(2)} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-[#ffffff10] pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>${Number(selectedOrder.subtotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span>${Number(selectedOrder.shippingCost || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>${Number(selectedOrder.tax || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2">
                      <span>Total:</span>
                      <span>${Number(selectedOrder.totalAmount || 0).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </FloatingCard>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {updateModalOpen && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <FloatingCard>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Update Order Status</h2>
                  <button
                    onClick={() => setUpdateModalOpen(false)}
                    className="p-2 hover:bg-[#ffffff10] rounded-lg"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleUpdate} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <select
                      value={statusToUpdate}
                      onChange={(e) => setStatusToUpdate(e.target.value)}
                      className="w-full bg-[#ffffff05] border border-[#ffffff15] rounded-xl px-4 py-3"
                    >
                      {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <GlowingButton type="submit" className="w-full bg-green-600 hover:bg-green-500">
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