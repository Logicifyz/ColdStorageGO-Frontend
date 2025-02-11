import React, { useEffect, useState } from "react";
import api from "../../../api";
import "tailwindcss/tailwind.css";

const MyOrderDetail = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Helper to format ISO date strings into a more readable format.
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleString();
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        // Get the complete order details using the order ID.
        const response = await api.get(`/api/order/${orderId}`);
        const orderData = response.data;
        setOrder(orderData);
        // Enrich each order item with its MealKit details.
        const items = orderData.orderItems || orderData.OrderItems || [];
        const enrichedItems = await Promise.all(
          items.map(async (item) => {
            try {
              const mealKitResponse = await api.get(`/api/MealKit/${item.mealKitId}`);
              const mealKit = mealKitResponse.data;
              const base64Image = mealKit.listingImage
                ? `data:image/jpeg;base64,${mealKit.listingImage}`
                : "/default-image.png";
              return {
                ...item,
                mealKit: {
                  ...mealKit,
                  listingImage: base64Image,
                },
              };
            } catch (error) {
              return {
                ...item,
                mealKit: {
                  name: "Unknown Meal Kit",
                  listingImage: "/default-image.png",
                  price: 0,
                },
              };
            }
          })
        );
        setOrderItems(enrichedItems);
      } catch (err) {
        console.error("Error fetching order detail", err);
        setError("Failed to load order details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-inter">
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-inter">
        <p className="text-red-500">{error}</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 font-inter">
        <p>Order not found.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-inter">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
      >
        Back to Orders
      </button>
      <h1 className="text-4xl font-bold mb-4">
        Order #{(order.id || order.Id)?.slice(-6)}
      </h1>
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
      {(order.shipTime || order.ShipTime) && (
        <p className="mt-2 text-gray-400">
          Ship Time: {formatDate(order.shipTime || order.ShipTime)}
        </p>
      )}

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {orderItems.map((item, index) => (
            <div
              key={index}
              className="bg-gray-800 p-4 rounded-lg flex flex-col sm:flex-row items-center"
            >
              <img
                src={item.mealKit.listingImage}
                alt={item.mealKit.name || "Meal Kit"}
                className="w-16 h-16 rounded object-cover mr-4 mb-2 sm:mb-0"
              />
              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  {item.mealKit.name || "Unknown Meal Kit"}
                </h3>
                <p className="text-gray-400">Quantity: {item.quantity}</p>
                <p className="text-gray-400">
                  Unit Price: $
                  {item.unitPrice || item.UnitPrice
                    ? (item.unitPrice || item.UnitPrice).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <p className="text-lg font-semibold">
                  ${((item.unitPrice || item.UnitPrice) * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 border-t border-gray-700 pt-4">
        <div className="flex justify-between text-lg">
          <span>Subtotal:</span>
          <span>
            $
            {order.subtotal
              ? order.subtotal.toFixed(2)
              : "0.00"}
          </span>
        </div>
        <div className="flex justify-between text-lg">
          <span>Shipping:</span>
          <span>
            $
            {order.shippingCost
              ? order.shippingCost.toFixed(2)
              : "0.00"}
          </span>
        </div>
        <div className="flex justify-between text-lg">
          <span>Tax:</span>
          <span>
            $
            {order.tax
              ? order.tax.toFixed(2)
              : "0.00"}
          </span>
        </div>
        <div className="flex justify-between text-xl font-bold mt-4">
          <span>Total:</span>
          <span>
            $
            {order.totalAmount
              ? order.totalAmount.toFixed(2)
              : "0.00"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyOrderDetail;
