import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaBookmark } from "react-icons/fa";

const Forum = () => {
    const [recipes, setRecipes] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

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

            <div className="flex">
                <div className="w-1/4 pr-4">
                    <h3 className="text-lg font-bold mb-4">Saved Recipes</h3>
                    <ul className="mb-8">
                        {recipes.slice(0, 5).map((recipe) => (
                            <li key={recipe.recipeId} className="mb-2">
                                {recipe.name}
                            </li>
                        ))}
                    </ul>
                    <h3 className="text-lg font-bold mb-4">Top Discussions</h3>
                    <ul>
                        {discussions.slice(0, 5).map((discussion) => (
                            <li key={discussion.discussionId} className="mb-2">
                                {discussion.title}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-3/4">
                    <h3 className="text-lg font-bold mb-4">Recent Posts</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {recipes.map((recipe) => (
                            <div
                                key={recipe.recipeId}
                                className="bg-[#2f2f2f] p-4 rounded shadow-lg flex items-start space-x-4 border border-gray-700"
                            >
                                <img
                                    src={recipe.mediaUrls?.[0] || "/placeholder-image.png"}
                                    alt={recipe.name}
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
            </div>
        </div>
    );
};

export default Forum;
