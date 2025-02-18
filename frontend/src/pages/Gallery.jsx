import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Gallery = () => {
    const [mealKits, setMealKits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [tagFilter, setTagFilter] = useState("all");
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
            await api.post(
                "/api/Cart",
                { mealKitId, price, quantity },
                {
                    headers: {
                        SessionId: localStorage.getItem("sessionId"),
                    },
                    withCredentials: true,
                }
            );
            toast.success("🎉 Added to cart successfully!");
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error(
                error.response?.data || "❌ Failed to add to cart. Please try again."
            );
        }
    };

    // Compute unique tags (in lowercase) from mealKits
    const uniqueTags = Array.from(
        new Set(
            mealKits.flatMap((kit) =>
                kit.tags ? kit.tags.map((t) => t.toLowerCase()) : []
            )
        )
    ).sort();

    // Filter meal kits by name and tag filter
    const filteredMealKits = mealKits.filter((mealKit) => {
        const nameMatches = mealKit.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const tagMatches =
            tagFilter === "all" ||
            (mealKit.tags &&
                mealKit.tags.some((tag) => tag.toLowerCase() === tagFilter));
        return nameMatches && tagMatches;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F0EAD6] flex items-center justify-center">
                <div className="text-3xl font-bold text-[#355E3B] animate-pulse">
                    Loading your culinary delights...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F0EAD6] relative overflow-hidden p-8">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-[30%] h-[40%] bg-[#E2F2E6] rounded-full opacity-70 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-[40%] h-[50%] bg-[#E2F2E6] rounded-full opacity-70 blur-3xl"></div>

            <ToastContainer theme="light" />

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <h1 className="text-5xl font-bold text-[#355E3B]">
                        Culinary Gallery
                    </h1>
                    <div className="flex flex-col md:flex-row gap-4 w-full md:max-w-xl">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search gastronomic experiences..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-4 rounded-full bg-white border border-gray-300 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#355E3B] shadow-sm transition"
                            />
                            <svg
                                className="absolute right-4 top-4 text-gray-400 h-6 w-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <select
                            value={tagFilter}
                            onChange={(e) => setTagFilter(e.target.value)}
                            className="w-full px-6 py-4 rounded-full bg-white border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#355E3B] shadow-sm transition"
                        >
                            <option value="all">All Tags</option>
                            {uniqueTags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Meal Kits Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredMealKits.map((mealKit) => (
                        <div
                            key={mealKit.mealKitId}
                            className="group relative transform hover:-translate-y-1 transition-transform duration-300 cursor-pointer"
                            onClick={() => navigate(`/listing/${mealKit.mealKitId}`)}
                        >
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                {/* Image Container */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={`data:image/jpeg;base64,${mealKit.listingImage}`}
                                        alt={mealKit.name}
                                        className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>

                                {/* Content Section */}
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-[#355E3B] mb-2 line-clamp-2">
                                        {mealKit.name}
                                    </h2>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {mealKit.tags?.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-gray-200 text-sm text-[#355E3B] rounded-full"
                                            >
                                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Price and CTA */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-[#355E3B]">
                                            ${mealKit.price.toFixed(2)}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(mealKit.mealKitId, mealKit.price);
                                            }}
                                            className="px-6 py-2 bg-[#355E3B] hover:bg-[#2D4B33] text-white rounded-full font-semibold shadow transition-transform transform hover:scale-105"
                                        >
                                            + Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {!loading && filteredMealKits.length === 0 && (
                    <div className="text-center py-20">
                        <div className="text-3xl text-gray-500 mb-4">🍳 No recipes found</div>
                        <p className="text-gray-400">Try adjusting your search terms</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;
