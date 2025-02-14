import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaBookmark } from "react-icons/fa";

const Forum = () => {
    const [recipes, setRecipes] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate(); // For navigation

    // Fetch recipes and discussions
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:5135/api/Recipes");

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                console.log("API Response (Recipes):", data);

                if (Array.isArray(data)) {
                    setRecipes(data); // Ensure recipes are stored as an array
                } else {
                    console.error("Unexpected API response structure", data);
                    setRecipes([]);
                }
            } catch (error) {
                console.error("Error fetching recipes:", error);
                setRecipes([]);
            }
        };

        fetchData();
    }, []);



    const getCoverImageUrl = (recipe) => {
        if (recipe.CoverImages && recipe.CoverImages.length > 0) {
            return `data:image/jpeg;base64,${recipe.CoverImages[0]}`; // Convert Base64 properly
        }
        return "/placeholder-image.png"; // Default image
    };


    const filterResults = (items) =>
        items.filter(
            (item) =>
                item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.content?.toLowerCase().includes(searchQuery.toLowerCase())
        );


    return (
        <div className="p-6 bg-[#383838] text-white min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">Forum</h1>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search Forum"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 rounded bg-[#282828] text-white border border-gray-500"
                />
            </div>

            <h3 className="text-lg font-bold mb-4">Recently Added</h3>
            <div className="space-y-8">

                {/* Recipes Section */}
                <div>
                    <h4 className="text-md font-bold mb-4">Recipes</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recipes.length > 0 ? (
                            recipes.map((recipe) => (
                                <div
                                    key={recipe.recipeId}
                                    className="bg-[#2f2f2f] p-4 rounded shadow-lg border border-gray-700 cursor-pointer hover:bg-[#444]"
                                    onClick={() => {
                                        console.log("Navigating to recipe:", recipe.RecipeId || recipe.recipeId);
                                        if (recipe.RecipeId || recipe.recipeId) {
                                            navigate(`/forum/recipe/${recipe.RecipeId || recipe.recipeId}`);
                                        } else {
                                            console.error("Recipe ID is missing in Forum.jsx");
                                        }
                                    }}
                                >

                                    {/* Image Handling */}
                                    <div className="w-full h-32 overflow-hidden rounded-md">
                                        <img
                                            src={getCoverImageUrl(recipe)}
                                            alt={recipe.name || "Recipe Image"}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Recipe Details */}
                                    <div className="mt-2">
                                        <p className="text-white font-bold text-lg">{recipe.name}</p>
                                        <p className="text-gray-400 text-sm mb-2">
                                            {new Date(recipe.date || Date.now()).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-300 text-sm">{recipe.description}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center space-x-4 text-gray-400 mt-3">
                                        <button className="flex items-center space-x-1 hover:text-white">
                                            <FaArrowUp />
                                            <span>{recipe.upvotes || 0}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 hover:text-white">
                                            <FaArrowDown />
                                            <span>{recipe.downvotes || 0}</span>
                                        </button>
                                        <button className="hover:text-white">
                                            <FaCommentAlt />
                                        </button>
                                        <button className="hover:text-white">
                                            <FaBookmark />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No recipes found.</p>
                        )}
                    </div>
                </div>


                {/* Discussions Section */}
                <div>
                    <h4 className="text-md font-bold mb-4">Discussions</h4>
                    <div className="grid grid-cols-1 gap-4">
                        {filterResults(discussions).map((discussion) => (
                            <div
                                key={discussion.discussionId}
                                className="bg-[#2f2f2f] p-4 rounded shadow-lg flex items-start space-x-4 border border-gray-700 cursor-pointer"
                                onClick={() => navigate(`/forum/discussion/${discussion.discussionId}`)} // Navigate to discussion page
                            >
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-bold">{discussion.title}</p>
                                        <p className="text-gray-400 text-sm">
                                            {new Date(discussion.date || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-2">{discussion.content}</p>
                                    <div className="flex items-center space-x-4 text-gray-400">
                                        <button className="flex items-center space-x-1 hover:text-white">
                                            <FaArrowUp />
                                            <span>{discussion.upvotes || 0}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 hover:text-white">
                                            <FaArrowDown />
                                            <span>{discussion.downvotes || 0}</span>
                                        </button>
                                        <button className="hover:text-white">
                                            <FaCommentAlt />
                                        </button>
                                        <button className="hover:text-white">
                                            <FaBookmark />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Forum;
