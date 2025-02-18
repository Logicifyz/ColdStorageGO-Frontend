import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaBookmark } from "react-icons/fa";
import VoteButton from "../components/VoteButton"; 
import SearchDropdown from "../components/SearchDropdown";

const Forum = () => {
    const [recipes, setRecipes] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
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



    const filterResults = (items) => {
        return items.filter((item) => {
            const lowerQuery = searchQuery.toLowerCase();
            return (
                (item.name && item.name.toLowerCase().includes(lowerQuery)) ||
                (item.title && item.title.toLowerCase().includes(lowerQuery)) ||
                (item.description && item.description.toLowerCase().includes(lowerQuery)) ||
                (item.content && item.content.toLowerCase().includes(lowerQuery)) ||
                (item.user?.username && item.user.username.toLowerCase().includes(lowerQuery))
            );
        });
    };

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
        <div className="p-6 bg-[#f0f0e0] text-[#123524] min-h-screen">
            {/* Hero Section */}
            <div className="relative w-full bg-[#e0e0d0] overflow-hidden mb-12">
                {/* Background Image with Fade-In Animation */}
                <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center">
                    <img
                        src="/forumpic.jpg"
                        alt="Featured Recipe"
                        className="w-full h-full object-cover opacity-0 animate-fade-in"
                    />
                </div>

                {/* Overlay Content with Pop-In Animation */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-40 p-6">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 opacity-0 animate-pop-in animate-delay-500">
                        Join the Conversation!
                    </h1>
                    <p className="text-lg md:text-xl text-white mb-6 opacity-0 animate-pop-in animate-delay-700">
                        Explore trending discussions, share your thoughts, and connect with fellow food lovers.
                    </p>
                </div>
            </div>


            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
                <input
                    type="text"
                    placeholder="Search for recipes or discussions..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowDropdown(e.target.value.trim() !== "");
                    }}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    className="w-full p-3 rounded-lg bg-[#e0e0d0] text-[#123524] border border-[#204037] focus:outline-none focus:ring-2 focus:ring-[#2a5246] focus:border-transparent"
                />
                {showDropdown && (
                    <SearchDropdown
                        searchQuery={searchQuery}
                        recipes={recipes}
                        discussions={discussions}
                        closeDropdown={() => setShowDropdown(false)}
                    />
                )}
            </div>

            {/* Recipes Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#204037] to-[#2a5246] bg-clip-text text-transparent">
                    Recipes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterResults(recipes).length > 0 ? (
                        filterResults(recipes).map((recipe) => (
                            <div key={recipe.recipeId}
                                className="bg-[#e0e0d0] overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                onClick={() => navigate(`/forum/recipe/${recipe.recipeId}`)}
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
                                                className="w-10 h-10 rounded-full bg-[#204037] cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    recipe.user?.username && navigate(`/profile/${recipe.user.username}`);
                                                }}
                                            ></div>
                                        )}
                                        <span
                                            className="text-[#123524] font-semibold cursor-pointer hover:underline"
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
                                        <div className="flex justify-between items-center">
                                            <p className="text-xl font-bold text-[#123524]">{recipe.name}</p>
                                            <p className="text-sm text-[#2a5246]">
                                                {new Date(recipe.date || Date.now()).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <p className="text-sm text-[#204037] mt-2 line-clamp-2">{recipe.description}</p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="p-4 border-t border-[#204037] flex items-center justify-between">
                                        <VoteButton
                                            id={recipe.recipeId}
                                            upvotes={recipe.upvotes}
                                            downvotes={recipe.downvotes}
                                            userVote={recipe.userVote}
                                            type="recipe"
                                            onVoteUpdate={(data) => handleVoteUpdate(data, recipe.recipeId)}
                                            className="no-navigation"
                                        />
                                        <div className="flex space-x-4 text-[#204037]">
                                            <button className="hover:text-[#2a5246]">
                                                <FaCommentAlt />
                                            </button>
                                            <button className="hover:text-[#2a5246]">
                                                <FaBookmark />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                        ))
                    ) : (
                        <p className="text-[#204037]">No recipes found.</p>
                    )}
                </div>
            </div>


            {/* Discussions Section */}
            <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#204037] to-[#2a5246] bg-clip-text text-transparent">
                    Discussions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterResults(discussions).length > 0 ? (
                        filterResults(discussions).map((discussion) => (
                            <div
                                key={discussion.discussionId}
                                className="bg-[#e0e0d0] overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                onClick={() => navigate(`/forum/discussion/${discussion.discussionId}`)}
                            >
                                {/* Discussion Image (if available) */}
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
                                <div className="flex items-center space-x-3 p-4">
                                    {discussion.user?.profilePicture ? (
                                        <img
                                            src={`data:image/jpeg;base64,${discussion.user.profilePicture}`}
                                            alt={`${discussion.user?.username || "User"}'s profile`}
                                            className="w-10 h-10 rounded-full object-cover cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                discussion.user?.username &&
                                                    navigate(`/profile/${discussion.user.username}`);
                                            }}
                                        />
                                    ) : (
                                        <div
                                            className="w-10 h-10 rounded-full bg-[#204037] cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                discussion.user?.username &&
                                                    navigate(`/profile/${discussion.user.username}`);
                                            }}
                                        ></div>
                                    )}
                                    <span
                                        className="text-[#123524] font-semibold cursor-pointer hover:underline"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            discussion.user?.username &&
                                                navigate(`/profile/${discussion.user.username}`);
                                        }}
                                    >
                                        {discussion.user?.username ? discussion.user.username : "Deleted User"}
                                    </span>
                                </div>

                                {/* Discussion Content */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xl font-bold text-[#123524]">{discussion.title}</p>
                                        <p className="text-sm text-[#2a5246]">
                                            {new Date(discussion.date || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    {/* Render Quill content properly */}
                                    <div
                                        className="text-sm text-[#204037] mt-2 line-clamp-2"
                                        dangerouslySetInnerHTML={{ __html: discussion.content }}
                                    />
                                </div>

                                {/* Action Buttons */}
                                <div className="p-4 border-t border-[#204037] flex items-center justify-between">
                                    <VoteButton
                                        id={discussion.discussionId}
                                        upvotes={discussion.upvotes}
                                        downvotes={discussion.downvotes}
                                        userVote={discussion.userVote}
                                        type="discussion"
                                        onVoteUpdate={(data) =>
                                            handleVoteUpdate(data, discussion.discussionId)
                                        }
                                    />
                                    <div className="flex space-x-4 text-[#204037]">
                                        <button className="hover:text-[#2a5246]">
                                            <FaCommentAlt />
                                        </button>
                                        <button className="hover:text-[#2a5246]">
                                            <FaBookmark />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-[#204037]">No discussions found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Forum;
