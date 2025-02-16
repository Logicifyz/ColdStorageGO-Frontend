import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaBookmark } from "react-icons/fa";
import VoteButton from "../components/VoteButton"; 

const Forum = () => {
    const [recipes, setRecipes] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate(); // For navigation

    // Fetch recipes and discussions
    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipesResponse = await fetch("http://localhost:5135/api/Recipes", {
                    credentials: "include",
                });
                if (!recipesResponse.ok) throw new Error(`Failed to fetch recipes: ${recipesResponse.status}`);
                const recipesData = await recipesResponse.json();
                setRecipes(Array.isArray(recipesData) ? recipesData : []);

                const discussionsResponse = await fetch("http://localhost:5135/api/Discussions", {
                    credentials: "include",
                });
                if (!discussionsResponse.ok) throw new Error(`Failed to fetch discussions: ${discussionsResponse.status}`);
                const discussionsData = await discussionsResponse.json();
                setDiscussions(Array.isArray(discussionsData) ? discussionsData : []);
            } catch (error) {
                console.error("Error fetching data:", error);
                setRecipes([]);
                setDiscussions([]);
            }
        };

        fetchData();
    }, []);



    const getCoverImageUrl = (item) => {
        console.log("?? [IMAGE CHECK] Processing Item ID:", item.recipeId || item.discussionId);
        console.log("?? [IMAGE DATA] Cover Images Array:", item.coverImages);

        if (Array.isArray(item.coverImages) && item.coverImages.length > 0) {
            console.log("? [IMAGE FOUND] Using first cover image.");
            return `data:image/jpeg;base64,${item.coverImages[0]}`;
        }

        console.warn("?? [NO IMAGE] Using default placeholder.");
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

    const handleVoteUpdate = (updatedData, discussionId) => {
        setDiscussions((prevDiscussions) =>
            prevDiscussions.map((discussion) =>
                discussion.discussionId === discussionId
                    ? {
                        ...discussion,
                        upvotes: updatedData.upvotes,
                        downvotes: updatedData.downvotes,
                        voteScore: updatedData.voteScore,
                        userVote: updatedData.userVote,
                    }
                    : discussion
            )
        );
    };


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
                                        {/* Replaced Upvote/Downvote Buttons with VoteButton */}
                                        <VoteButton
                                            id={recipe.recipeId}
                                            upvotes={recipe.upvotes}
                                            downvotes={recipe.downvotes}
                                            userVote={recipe.userVote}
                                            type="recipe"
                                            onVoteUpdate={(data) => handleVoteUpdate(data, recipe.recipeId)}
                                        />
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
                                className="bg-[#2f2f2f] p-4 rounded shadow-lg flex items-start space-x-4 border border-gray-700 cursor-pointer hover:bg-[#444]"
                                onClick={() => {
                                    console.log("?? [NAVIGATING] Navigating to discussion:", discussion.discussionId);
                                    if (discussion.discussionId) {
                                        navigate(`/forum/discussion/${discussion.discussionId}`);
                                    } else {
                                        console.error("? Discussion ID is missing in Forum.jsx");
                                    }
                                }}

                            >
                                {/* ? Display Cover Image (If Exists) */}
                                {discussion.coverImages && discussion.coverImages.length > 0 && (
                                    <div className="w-20 h-20 overflow-hidden rounded-md">
                                        <img
                                            src={getCoverImageUrl(discussion)}
                                            alt="Discussion Cover"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-bold">{discussion.title}</p>
                                        <p className="text-gray-400 text-sm">
                                            {new Date(discussion.date || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-2">{discussion.content}</p>
                                    <div className="flex items-center space-x-4 text-gray-400">
                                        <VoteButton
                                            key={discussion.discussionId}
                                            id={discussion.discussionId}
                                            upvotes={discussion.upvotes}
                                            downvotes={discussion.downvotes}
                                            userVote={discussion.userVote}
                                            type="discussion"
                                            onVoteUpdate={(data) => handleVoteUpdate(data, discussion.discussionId)}
                                        />
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
