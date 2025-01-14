import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

const Gallery = () => {
    const [mealKits, setMealKits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMealKits = async () => {
            try {
                const response = await api.get("/api/MealKit");
                setMealKits(response.data);
            } catch (error) {
                console.error("Error fetching meal kits:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMealKits();
    }, []);

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


    const filteredMealKits = mealKits.filter((mealKit) =>
        mealKit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center text-gray-400">Loading meal kits...</div>;
    }

    return (
        <div className="min-h-screen bg-[#383838] px-16 py-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl font-bold text-left text-gray-200">
                    Meal Kit Gallery
                </h1>
                <div className="w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search meal kits..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-[#292929] text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-900"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredMealKits.map((mealKit) => (
                    <div
                        key={mealKit.mealKitId}
                        className="bg-[#383838] p-4 w-full cursor-pointer"
                        onClick={() => navigate(`/listing/${mealKit.mealKitId}`)}
                    >
                        <img
                            src={`data:image/jpeg;base64,${mealKit.listingImage}`}
                            alt={mealKit.name}
                            className="w-full h-[250px] object-cover rounded-lg"
                        />
                        <div className="mt-4">
                            <h2
                                className="text-lg font-bold text-gray-200"
                                style={{ height: "48px", lineHeight: "1.5" }}
                            >
                                {mealKit.name}
                            </h2>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {mealKit.tags?.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-[#2B2E4A] text-white text-sm font-medium rounded-full border border-gray-500"
                                >
                                    {tag.toUpperCase()}
                                </span>
                            ))}
                        </div>
                        <div className="mt-4">
                            <p className="text-lg font-bold text-gray-200 text-right">
                                ${mealKit.price.toFixed(2)}
                            </p>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    addToCart(mealKit.mealKitId, mealKit.price);
                                }}
                                className="mt-2 w-full bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
