import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaBookmark } from "react-icons/fa";
import VoteButton from "../components/VoteButton"; 

const Forum = () => {
    const [recipes, setRecipes] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate(); // For navigation
    const loggedInUsername = localStorage.getItem("loggedInUsername");

    // Fetch recipes and discussions
    useEffect(() => {
        const fetchData = async () => {
            try {
                // ? Fetch Recipes (Public Only)
                const recipesResponse = await fetch("http://localhost:5135/api/Recipes", {
                    credentials: "include",
                });
                if (!recipesResponse.ok) throw new Error(`Failed to fetch recipes: ${recipesResponse.status}`);
                const recipesData = await recipesResponse.json();

                // ? Filter out private recipes (extra safety in case API fails)
                const publicRecipes = recipesData.filter(recipe => recipe.visibility === "public");
                setRecipes(publicRecipes);

                // ? Fetch Discussions (Public Only)
                const discussionsResponse = await fetch("http://localhost:5135/api/Discussions", {
                    credentials: "include",
                });
                if (!discussionsResponse.ok) throw new Error(`Failed to fetch discussions: ${discussionsResponse.status}`);
                const discussionsData = await discussionsResponse.json();

                console.log("? [DEBUG] Discussions API Response:", discussionsData);

                // ? Filter out private discussions (extra safety in case API fails)
                const publicDiscussions = discussionsData.filter(discussion => discussion.visibility === "public");
                setDiscussions(publicDiscussions);

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
        return "/placeholder-image.png"; 
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
    <div className="p-6 bg-gradient-to-br from-[#1a1a1a] to-[#1e1e2f] text-white min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-[#6bffa0] to-[#a86bff] bg-clip-text text-transparent">
            Forum
        </h1>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
            <input
                type="text"
                placeholder="Search for recipes or discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#2a2a2a] text-white border border-[#444] focus:outline-none focus:ring-2 focus:ring-[#6bffa0] focus:border-transparent"
            />
        </div>
            {/* Recipes Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6bffa0] to-[#a86bff] bg-clip-text text-transparent">
                    Trending Recipes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recipes.length > 0 ? (
                        recipes.map((recipe) => {
                            return (
                                <div
                                    key={recipe.recipeId}
                                    className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                    onClick={(e) => {
                                        if (!e.target.closest(".no-navigation")) {
                                            navigate(`/forum/recipe/${recipe.RecipeId || recipe.recipeId}`);
                                        }
                                    }}
                                >
                                    {/* Image */}
                                    <div className="w-full h-48 overflow-hidden">
                                        <img
                                            src={getCoverImageUrl(recipe)}
                                            alt={recipe.name || "Recipe Image"}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform"
                                        />
                                    </div>

                                    {/* Profile Picture & Username */}
                                    <div className="flex items-center space-x-3 p-4">
                                        {recipe.user?.profilePicture ? (
                                            <img
                                                src={`data:image/jpeg;base64,${recipe.user.profilePicture}`}
                                                alt={`${recipe.user?.username || "User"}'s profile`}
                                                className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    recipe.user?.username && navigate(`/profile/${recipe.user.username}`);
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="w-10 h-10 rounded-full bg-gray-500 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        recipe.user?.username && navigate(`/profile/${recipe.user.username}`);
                                                    }}
                                            ></div>
                                        )}
                                        <span
                                            className="text-white font-semibold cursor-pointer hover:underline"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                recipe.user?.username && navigate(`/profile/${recipe.user.username}`);
                                            }}
                                        >
                                            {recipe.user?.username ? recipe.user.username : "Deleted User"}
                                        </span>
                                    </div>


                                    {/* Recipe Details */}
                                    <div className="p-4">
                                        <p className="text-xl font-bold mb-2 text-white">{recipe.name}</p>
                                        <p className="text-sm text-gray-400 mb-4">
                                            {new Date(recipe.date || Date.now()).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-300 line-clamp-2">{recipe.description}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-4 border-t border-[#444] flex items-center justify-between">
                                        <VoteButton
                                            id={recipe.recipeId}
                                            upvotes={recipe.upvotes}
                                            downvotes={recipe.downvotes}
                                            userVote={recipe.userVote}
                                            type="recipe"
                                            onVoteUpdate={(data) => handleVoteUpdate(data, recipe.recipeId)}
                                            className="no-navigation"
                                        />
                                        <div className="flex space-x-4 text-gray-400">
                                            <button className="hover:text-[#6bffa0]">
                                                <FaCommentAlt />
                                            </button>
                                            <button className="hover:text-[#a86bff]">
                                                <FaBookmark />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-gray-400">No recipes found.</p>
                    )}
                </div>
            </div>


            {/* Discussions Section */}
            <div>
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6bffa0] to-[#a86bff] bg-clip-text text-transparent">
                    Latest Discussions
                </h2>
                <div className="space-y-6">
                    {filterResults(discussions).map((discussion) => {
                        return (
                            <div
                                key={discussion.discussionId}
                                className="bg-[#2a2a2a] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                onClick={() => navigate(`/forum/discussion/${discussion.discussionId}`)}
                            >
                                {/* Discussion Image */}
                                {discussion.coverImages && discussion.coverImages.length > 0 && (
                                    <div className="w-full h-48 overflow-hidden">
                                        <img
                                            src={getCoverImageUrl(discussion)}
                                            alt="Discussion Cover"
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform"
                                        />
                                    </div>
                                )}

                                {/* Profile Picture & Username */}
                                <div className="flex items-center space-x-3">
                                    {discussion.user?.profilePicture ? (
                                        <img
                                            src={`data:image/jpeg;base64,${discussion.user.profilePicture}`}
                                            alt={`${discussion.user?.username || "User"}'s profile`}
                                            className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                discussion.user?.username && navigate(`/profile/${discussion.user.username}`);
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="w-10 h-10 rounded-full bg-gray-500 cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    discussion.user?.username && navigate(`/profile/${discussion.user.username}`);
                                                }}
                                        ></div>
                                    )}
                                    <span
                                        className="text-white font-semibold cursor-pointer hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            discussion.user?.username && navigate(`/profile/${discussion.user.username}`);
                                        }}
                                    >
                                        {discussion.user?.username ? discussion.user.username : "Deleted User"}
                                    </span>
                                </div>

                                {/* Discussion Content */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <p className="text-xl font-bold text-white">{discussion.title}</p>
                                        <p className="text-sm text-gray-400">
                                            {new Date(discussion.date || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-300 line-clamp-3">{discussion.content}</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="p-4 border-t border-[#444] flex items-center justify-between">
                                    <VoteButton
                                        id={discussion.discussionId}
                                        upvotes={discussion.upvotes}
                                        downvotes={discussion.downvotes}
                                        userVote={discussion.userVote}
                                        type="discussion"
                                        onVoteUpdate={(data) => handleVoteUpdate(data, discussion.discussionId)}
                                    />
                                    <div className="flex space-x-4 text-gray-400">
                                        <button className="hover:text-[#6bffa0]">
                                            <FaCommentAlt />
                                        </button>
                                        <button className="hover:text-[#a86bff]">
                                            <FaBookmark />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
       </div>
    );
};

export default Forum;
