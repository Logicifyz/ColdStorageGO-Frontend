import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const Listing = () => {
    const { id } = useParams(); // Get the MealKitId from URL
    const [mealKit, setMealKit] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMealKit = async () => {
            try {
                const response = await api.get(`/api/MealKit/${id}`);
                setMealKit(response.data);
            } catch (error) {
                console.error("Error fetching meal kit details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMealKit();
    }, [id]);

    const addToCart = async (mealKitId, price, quantity = 1) => {
        try {
            const response = await api.post(
                "/api/Cart",
                { mealKitId, price, quantity }, // Include price in request body
                {
                    headers: {
                        SessionId: localStorage.getItem("sessionId"),
                    },
                    withCredentials: true,
                }
            );
            alert("Added to cart successfully!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert(
                error.response?.data || "Failed to add to cart. Please try again."
            );
        }
    };

    if (loading) {
        return <div className="text-center text-gray-400">Loading meal kit details...</div>;
    }

    if (!mealKit) {
        return <div className="text-center text-gray-400">Meal kit not found.</div>;
    }

    return (
        <div className="min-h-screen bg-[#383838] text-gray-200 px-10 py-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-start">
                {/* Image Section */}
                <div className="w-full sm:w-1/2 flex justify-center">
                    <img
                        src={`data:image/jpeg;base64,${mealKit.listingImage}`}
                        alt={mealKit.name}
                        className="w-[450px] h-[475px] object-cover rounded-lg"
                    />
                </div>

                {/* Details Section */}
                <div className="w-full sm:w-1/2 sm:pl-2 mt-5 sm:mt-0">
                    {/* Title and Price */}
                    <h1 className="text-3xl font-bold text-center sm:text-left">
                        {mealKit.name}
                    </h1>
                    <p className="text-xl font-semibold text-gray-400 mt-2 text-center sm:text-left">
                        ${mealKit.price.toFixed(2)}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
                        {mealKit.tags?.map((tag, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-[#2B2E4A] text-white text-sm font-medium rounded-full border border-gray-500"
                            >
                                {tag.toUpperCase()}
                            </span>
                        ))}
                    </div>

                    {/* Ingredients */}
                    <h2 className="text-lg font-bold mt-6 text-center sm:text-left">
                        Ingredients:
                    </h2>
                    <p className="mt-2 text-center sm:text-left">{mealKit.ingredients}</p>

                    {/* Add to Cart Button */}
                    <button
                        className="mt-48 bg-[#FF4B4B] text-white font-bold py-3 px-4 rounded-full hover:bg-[#E04343] transition-colors w-full"
                        style={{ maxWidth: "650px" }}
                        onClick={() => addToCart(mealKit.mealKitId)}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Listing;
