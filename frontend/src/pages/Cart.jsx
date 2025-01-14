import React, { useEffect, useState } from "react";
import api from "../api";
import "tailwindcss/tailwind.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const subtotal = totalPrice - 0.4; // Total minus shipping
    const [shippingCost, setShippingCost] = useState(0.4);
    const [taxes, setTaxes] = useState(2.24);
    const total = subtotal + shippingCost + taxes;


    useEffect(() => {
        console.log("Updated cartItems:", cartItems);
    }, [cartItems]);

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await api.get("/api/cart/view-cart");
            const items = await Promise.all(
                response.data.map(async (item) => {
                    try {
                        const mealKitResponse = await api.get(`/api/MealKit/${item.mealKitId}`);
                        const MealKit = mealKitResponse.data;

                        const base64Image = MealKit.listingImage
                            ? `data:image/jpeg;base64,${MealKit.listingImage}`
                            : "/default-image.png";

                        return {
                            ...item,
                            MealKit: {
                                ...MealKit,
                                ListingImage: base64Image,
                            },
                        };
                    } catch (error) {
                        return {
                            ...item,
                            MealKit: {
                                Name: "Unknown Meal Kit",
                                ListingImage: "/default-image.png",
                                Price: 0,
                            },
                        };
                    }
                })
            );
            setCartItems(items);
            const newSubtotal = calculateSubtotal(items);
            setTotalPrice(newSubtotal + shippingCost + taxes);
        } catch (error) {
            console.error("Failed to fetch cart items", error);
        }
    };


    const calculateSubtotal = (items) => {
        return items.reduce((sum, item) => {
            const price = item.MealKit.price || 0; // Fallback to 0 if price is not available
            const quantity = item.quantity || 0;
            return sum + price * quantity;
        }, 0);
    };

    const updateQuantity = async (mealKitId, newQuantity) => {
        if (newQuantity < 1) {
            console.warn("Quantity cannot be less than 1.");
            return;
        }

        try {
            // Update quantity in the backend
            await api.post("/api/Cart", {
                mealKitId,
                quantity: newQuantity,
            });

            // Fetch updated cart items
            const updatedCart = cartItems.map((item) =>
                item.mealKitId === mealKitId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
            setCartItems(updatedCart);

            // Recalculate total price
            const newSubtotal = calculateSubtotal(updatedCart);
            setTotalPrice(newSubtotal + shippingCost + taxes);
        } catch (error) {
            console.error("Failed to update quantity:", error);
        }
    };


    return (
        <div className="bg-[#282828] text-white min-h-screen p-6 font-inter">
            <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
            <div className="divide-y divide-gray-700">
                <div>
                    {cartItems.map((item, index) => {
                        console.log("Rendering cart item:", item);

                        return (
                            <div key={index} className="flex items-center py-4">
                                <img
                                    src={item.MealKit.ListingImage}
                                    alt={item.MealKit.Name || "Default Meal Kit"}
                                    className="w-16 h-16 rounded object-cover mr-4"
                                />
                                <div className="flex-1">
                                    <h2 className="text-lg font-semibold">{item.MealKit.name || "Unknown Meal Kit"}</h2>
                                    <p className="text-sm text-gray-400">
                                        Fresh until {item.MealKit.expiryDate ? new Date(item.MealKit.expiryDate).toLocaleDateString() : "N/A"}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-semibold">
                                        ${item.MealKit.price ? item.MealKit.price.toFixed(2) : "0.00"}
                                    </p>
                                    <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                                    <button
                                        className="text-blue-400 underline mt-2"
                                        onClick={() => updateQuantity(item.mealKitId, item.quantity - 1)}
                                    >
                                        -
                                    </button>
                                    <button
                                        className="text-blue-400 underline mt-2 ml-2"
                                        onClick={() => updateQuantity(item.mealKitId, item.quantity + 1)}
                                    >
                                        +
                                    </button>

                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-4 border-t border-gray-700 pt-4">
                <div className="flex justify-between text-gray-400 text-sm mb-1">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm mb-1">
                    <span>Shipping</span>
                    <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 text-sm mb-1">
                    <span>Including taxes</span>
                    <span>${taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold mt-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>

            <button
                className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
            >
                Next
            </button>
        </div>
    );
};

export default Cart;
