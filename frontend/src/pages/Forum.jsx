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
                const recipesResponse = await fetch("http://localhost:5135/api/Recipes");
                const discussionsResponse = await fetch("http://localhost:5135/api/Discussions");

                if (recipesResponse.ok) {
                    setRecipes(await recipesResponse.json());
                }
                if (discussionsResponse.ok) {
                    setDiscussions(await discussionsResponse.json());
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const filterResults = (items) =>
        items.filter(
            (item) =>
                item.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.content?.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const getMediaUrl = (url) => {
        const baseUrl = "http://localhost:5135/";
        if (url && url.startsWith("MediaFiles/")) {
            return `${baseUrl}${url.replace(/\\/g, "/")}`; // Ensure proper URL formatting
        }
        return url || "/placeholder-image.png";
    };


    return (
        <div className="p-6 bg-[#383838] text-white min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">Forum</h1>

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
                    <div className="grid grid-cols-1 gap-4">
                        {filterResults(recipes).map((recipe) => (
                            <div
                                key={recipe.recipeId}
                                className="bg-[#2f2f2f] p-4 rounded shadow-lg flex items-start space-x-4 border border-gray-700 cursor-pointer"
                                onClick={() => navigate(`/forum/recipe/${recipe.recipeId}`)} // Navigate to recipe page
                            >
                                <img
                                    src={getMediaUrl(recipe.mediaUrls?.[0])}
                                    alt={recipe.name || "Recipe Image"}
                                    className="w-24 h-24 rounded-md object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-bold">{recipe.name}</p>
                                        <p className="text-gray-400 text-sm">
                                            {new Date(recipe.date || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-2">{recipe.description}</p>
                                    <div className="flex items-center space-x-4 text-gray-400">
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
                            </div>
                        ))}
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
