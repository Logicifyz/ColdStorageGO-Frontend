import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../api";
import MyOrderDetail from "./MyOrderDetail";
import "tailwindcss/tailwind.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await api.get(`/api/order/user`);
        setOrders(response.data);
      } catch (err) {
        console.error("Error fetching orders", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Helper to format ISO date strings into a readable format.
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  // If an order is selected, render the detailed view.
  if (selectedOrderId) {
    return (
      <MyOrderDetail 
        orderId={selectedOrderId} 
        onBack={() => setSelectedOrderId(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden p-8">
      {/* Abstract Background Blobs */}
      <motion.div
        className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-to-r from-purple-700/10 to-blue-500/10 rounded-full blur-3xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-pink-700/10 to-cyan-500/10 rounded-full blur-3xl"
        animate={{ rotate: -360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <motion.div
            className="w-12 h-12 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Example Icon (you can replace this SVG with your preferred icon) */}
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h4l3 8 4-16 3 8h4"
              />
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            My Orders
          </h1>
        </div>

        {loading ? (
          <div className="text-center text-white">
            <p>Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-400">
            <p>You have not placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order) => (
                <motion.div
                  key={order.id || order.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 backdrop-blur-xl rounded-2xl border border-[#ffffff10] shadow-2xl p-6 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:bg-[#1f1f2e] transition"
                  onClick={() => setSelectedOrderId(order.id || order.Id)}
                >
                  {/* Order Details */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-2">
                      Order #{(order.id || order.Id)?.slice(-6)}
                    </h2>
                    <p className="text-gray-400">
                      Placed on: {formatDate(order.orderTime || order.OrderTime)}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Status:</span>{" "}
                      {order.orderStatus || order.OrderStatus}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Delivery Address:</span>{" "}
                      {order.deliveryAddress || order.DeliveryAddress}
                    </p>
                  </div>
                  {/* Order Summary Amounts */}
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-xl font-bold">
                      Total: $
                      {order.totalAmount || order.TotalAmount
                        ? (order.totalAmount || order.TotalAmount).toFixed(2)
                        : "0.00"}
                    </p>
                    {(order.shipTime || order.ShipTime) && (
                      <p className="text-gray-400">
                        Ship Time: {formatDate(order.shipTime || order.ShipTime)}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
