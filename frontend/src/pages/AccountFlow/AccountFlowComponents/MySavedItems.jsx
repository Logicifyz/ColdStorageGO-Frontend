import React, { useState, useEffect } from "react";
import { Utensils, Book, MessageSquare, Bookmark } from "lucide-react"; // Icons for different saved items
import { useNavigate } from "react-router-dom";

const MySavedItems = () => {
    const [savedAIRecipes, setSavedAIRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchSavedItems();
    }, []);

    const fetchSavedItems = async () => {
        try {
            const response = await fetch("http://localhost:5135/api/AIRecommendations/GetAllSavedRecipes", {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch saved recipes.");
            }

            const data = await response.json();
            console.log("API RESPONSE DATAAATAT:", data)
            setSavedAIRecipes(data); // ? Store AI recipes in state
        } catch (error) {
            console.error("Error fetching saved recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    const SavedRecipes = ({ data, type, navigate }) => {
        if (!data || data.length === 0) {
            return <p className="text-gray-400">No saved {type === "ai" ? "AI-generated" : "forum"} recipes found.</p>;
        }

        console.log("Rendering SavedRecipes with data:", data); // Debugging log

        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {data.map((recipe) => {
                    console.log(`??? Rendering Recipe Card: ${recipe.title}, Image Exists: ${recipe.image ? "Yes" : "No"}`);
                    return (
                        <div
                            key={recipe.dishId} // ? Corrected key prop
                            className="p-4 bg-[#1a1a1a] rounded-lg border border-[#444] cursor-pointer hover:shadow-lg transition"
                            onClick={() => navigate(`/ai-recipe/${recipe.dishId}`)}
                        >
                            {/* ? Display Image if Available */}
                            {recipe.image ? (
                                <img
                                    src={`data:image/png;base64,${recipe.image}`} // ? Corrected image reference
                                    alt={recipe.title}
                                    className="w-full h-40 object-cover rounded-md mb-3"
                                />
                            ) : (
                                <div className="w-full h-40 bg-gray-700 flex items-center justify-center rounded-md mb-3">
                                    <span className="text-gray-400">No Image</span>
                                </div>
                            )}

                            {/* ? Recipe Details */}
                            <h2 className="text-lg font-semibold text-[#ffcc00] truncate">{recipe.title}</h2>
                            <p className="text-gray-300 text-sm line-clamp-2">{recipe.description}</p>
                            <p className="text-gray-400 text-xs mt-2">
                                {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : "Unknown Date"}
                            </p>
                        </div>
                    );
                })}
            </div>
        );
    };



    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8">
            {/* ? Page Header */}
            <div className="flex items-center gap-4 mb-8">
                <Bookmark size={48} className="text-[#ffcc00]" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                    Saved AI Recipes
                </h1>
            </div>

            {/* ? Content Section */}
            <div className="mt-6">
                {loading ? (
                    <p className="text-center text-gray-400">Loading saved AI recipes...</p>
                ) : (
                    <SavedRecipes data={savedAIRecipes} navigate={navigate} />
                )}
            </div>
        </div>
    );
};



export default MySavedItems;
