import React, { useEffect, useState } from "react";
import api from "../../../api";
import "tailwindcss/tailwind.css";
import MyOrderDetail from "./MyOrderDetail";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Retrieve orders based on the session cookie.
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

  // Helper to format ISO date strings into a more readable format.
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  // If an order is selected, render the detail view.
  if (selectedOrderId) {
    return (
      <MyOrderDetail 
        orderId={selectedOrderId} 
        onBack={() => setSelectedOrderId(null)} 
      />
    );
  }

  // Otherwise, render the orders list.
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-inter">
      <h1 className="text-4xl font-bold mb-8">My Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id || order.Id}
              className="bg-gray-800 border border-gray-700 rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-center cursor-pointer hover:bg-gray-700 transition"
              onClick={() => setSelectedOrderId(order.id || order.Id)}
            >
              {/* Order details */}
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
              {/* Order summary amounts */}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
