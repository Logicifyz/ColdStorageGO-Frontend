import React, { useState, useEffect } from "react";
import { Notebook, Utensils, MessageCircle, MessageSquareText, CornerDownRight } from "lucide-react";
import VoteButton from "../../../components/VoteButton"; 
import { useNavigate } from "react-router-dom";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const MyForumActivity = () => {
    const [activeTab, setActiveTab] = useState("Discussions"); 
    const [discussions, setDiscussions] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleVote = async (commentId, voteType) => {
        try {
            const response = await fetch(`http://localhost:5135/api/Comments/${commentId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(voteType),
            });

            const data = await response.json();
            if (response.ok) {
         
                setComments((prevComments) =>
                    prevComments.map((comment) =>
                        comment.commentId === commentId
                            ? {
                                ...comment,
                                upvotes: data.upvotes,
                                downvotes: data.downvotes,
                                userVote: comment.userVote === voteType ? 0 : voteType, 
                            }
                            : comment
                    )
                );
            } else {
                console.error("[ERROR] Voting Failed:", data);
            }
        } catch (err) {
            console.error("[ERROR] Voting Request Failed:", err);
        }
    };


    // Fetch data based on active tab
    useEffect(() => {
        if (activeTab === "Discussions") fetchDiscussions();
        if (activeTab === "Recipes") fetchRecipes();
        if (activeTab === "Comments") fetchComments();
    }, [activeTab]);

    /** ? Fetch Discussions */
    const fetchDiscussions = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5135/api/Discussions/my-discussions", { credentials: "include" });
            if (!response.ok) throw new Error(`Failed to fetch discussions: ${response.status}`);
            const data = await response.json();
            console.log("? [DEBUG] Fetched Discussions:", data);
            setDiscussions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("? [ERROR] Fetching Discussions:", error);
            setDiscussions([]);
        } finally {
            setLoading(false);
        }
    };

    /** ? Fetch Recipes */
    const fetchRecipes = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5135/api/Recipes/my-recipes", { credentials: "include" });
            if (!response.ok) throw new Error(`Failed to fetch recipes: ${response.status}`);
            const data = await response.json();
            console.log("? [DEBUG] Fetched Recipes:", data);
            setRecipes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("? [ERROR] Fetching Recipes:", error);
            setRecipes([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5135/api/Comments/my-comments", { credentials: "include" });
            if (!response.ok) throw new Error(`Failed to fetch comments: ${response.status}`);
            const data = await response.json();
            console.log("? [DEBUG] Fetched Comments:", data);
            setComments(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("? [ERROR] Fetching Comments:", error);
            setComments([]);
        } finally {
            setLoading(false);
        }
    };

    /** ? Render Discussions */
    const renderDiscussions = () => {
        if (loading) return <p className="text-gray-400">Loading discussions...</p>;
        if (error) return <p className="text-red-500">Error: {error}</p>;
        if (!Array.isArray(discussions) || discussions.length === 0) return <p className="text-gray-400">No discussions found.</p>;

        return (
            <div className="space-y-6">
                {discussions.map((discussion) => {
                    const coverImages = discussion.coverImages || [];
                    const firstImage = coverImages.length > 0 ? coverImages[0] : null;

                    return (
                        <div
                            key={discussion.discussionId}
                            className="p-6 bg-[#1a1a1a] rounded-lg border border-[#444] cursor-pointer hover:shadow-lg transition"
                            onClick={() => navigate(`/forum/discussion/${discussion.discussionId}`)}
                        >
                            {/* Discussion Title & Visibility */}
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-semibold text-[#6bffa0]">{discussion.title}</h2>
                                <span className={`px-3 py-1 text-sm rounded-full ${discussion.visibility === "public" ? "bg-green-500 text-white" : "bg-purple-500 text-white"}`}>
                                    {discussion.visibility}
                                </span>
                            </div>

                            {/* Discussion Content */}
                            <p className="mt-2 text-gray-300">{discussion.content}</p>

                            {/* Display Cover Image */}
                            {firstImage ? (
                                <div className="mt-4">
                                    <img
                                        src={`data:image/jpeg;base64,${firstImage}`}
                                        alt="Discussion Cover"
                                        className="w-full h-48 object-cover rounded-lg"
                                        onError={(e) => (e.target.style.display = "none")}
                                    />
                                </div>
                            ) : (
                                <div className="mt-4 text-gray-400">No cover images available.</div>
                            )}

                            {/* Vote and Comments */}
                            <div className="mt-4 flex items-center justify-between">
                                <VoteButton id={discussion.discussionId} upvotes={discussion.upvotes} downvotes={discussion.downvotes} userVote={discussion.userVote || 0} type="discussion" />
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MessageSquareText size={16} />
                                    <span>Comments (Placeholder)</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    /** ? Render Recipes */
    const renderRecipes = () => {
        if (loading) return <p className="text-gray-400">Loading recipes...</p>;
        if (error) return <p className="text-red-500">Error: {error}</p>;
        if (!Array.isArray(recipes) || recipes.length === 0) return <p className="text-gray-400">No recipes found.</p>;

        return (
            <div className="space-y-6">
                {recipes.map((recipe) => {
                    const coverImages = recipe.coverImages || [];
                    const firstImage = coverImages.length > 0 ? coverImages[0] : null;

                    return (
                        <div
                            key={recipe.recipeId}
                            className="p-6 bg-[#1a1a1a] rounded-lg border border-[#444] cursor-pointer hover:shadow-lg transition"
                            onClick={() => navigate(`/forum/recipe/${recipe.recipeId}`)}
                        >
                            {/* Recipe Title & Visibility */}
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-semibold text-[#6bffa0]">{recipe.name}</h2>
                                <span className={`px-3 py-1 text-sm rounded-full ${recipe.visibility === "public" ? "bg-green-500 text-white" : "bg-purple-500 text-white"}`}>
                                    {recipe.visibility}
                                </span>
                            </div>

                            {/* Recipe Description */}
                            <p className="mt-2 text-gray-300">{recipe.description}</p>

                            {/* Display Cover Image */}
                            {firstImage ? (
                                <div className="mt-4">
                                    <img
                                        src={`data:image/jpeg;base64,${firstImage}`}
                                        alt="Recipe Cover"
                                        className="w-full h-48 object-cover rounded-lg"
                                        onError={(e) => (e.target.style.display = "none")}
                                    />
                                </div>
                            ) : (
                                <div className="mt-4 text-gray-400">No cover images available.</div>
                            )}

                            {/* Vote and Comments */}
                            <div className="mt-4 flex items-center justify-between">
                                <VoteButton id={recipe.recipeId} upvotes={recipe.upvotes} downvotes={recipe.downvotes} userVote={recipe.userVote || 0} type="recipe" />
                                <div className="flex items-center gap-2 text-gray-400">
                                    <MessageSquareText size={16} />
                                    <span>Comments (Placeholder)</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderComments = () => {
        if (loading) return <p className="text-gray-400">Loading comments...</p>;
        if (error) return <p className="text-red-500">Error: {error}</p>;
        if (!Array.isArray(comments) || comments.length === 0) return <p className="text-gray-400">No comments found.</p>;

        return (
            <div className="space-y-6">
                {comments.map((comment) => {
                    // ? Extract Parent Comment & Context Data
                    const parentUsername = comment?.parentComment?.username || null;
                    const parentContent = comment?.parentComment?.content || null;
                    const postedIn = comment.discussionTitle || comment.recipeTitle || "Unknown Context";
                    const postId = comment.discussionId || comment.recipeId;
                    const postType = comment.discussionId ? "discussion" : "recipe";

                    return (
                        <div
                            key={comment.commentId}
                            className="p-4 bg-[#1a1a1a] rounded-lg border border-[#444] cursor-pointer hover:shadow-lg transition"
                            onClick={() => {
                                if (postId) {
                                    navigate(`/forum/${postType}/${postId}`);
                                }
                            }}
                        >
                            {/* ? Discussion or Recipe Context */}
                            <div className="text-sm text-gray-400 mb-1">
                                <span>Posted in <strong>{postedIn}</strong></span>
                            </div>

                            {/* ? Parent Comment Reference (If Exists) */}
                            {parentUsername ? (
                                <div className="text-sm text-gray-400 mb-2 flex items-center">
                                    <CornerDownRight size={14} className="mr-2 text-gray-500" />
                                    <span>
                                        Replied to <strong>{parentUsername}</strong>: "{parentContent}"
                                    </span>
                                </div>
                            ) : null}

                            {/* ? Comment Content */}
                            <p className="text-gray-300">{comment.content}</p>

                            {/* ? Voting System */}
                            <div className="mt-2 flex items-center space-x-4 text-gray-400">
                                {/* Upvote Button */}
                                <button
                                    className={`flex items-center ${comment.userVote === 1 ? "text-blue-500" : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVote(comment.commentId, 1);
                                    }}
                                >
                                    <FaArrowUp className="mr-1" />
                                </button>

                                {/* Vote Count */}
                                <span className="text-gray-300 font-bold">{comment.upvotes}</span>

                                {/* Downvote Button */}
                                <button
                                    className={`flex items-center ${comment.userVote === -1 ? "text-red-500" : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleVote(comment.commentId, -1);
                                    }}
                                >
                                    <FaArrowDown className="mr-1" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };




    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8">
            {/* Page Header */}
            <div className="flex items-center gap-4 mb-8">
                <Notebook size={48} className="text-[#6bffa0]" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#6bffa0] to-[#a86bff] bg-clip-text text-transparent">
                    My Forum Activity
                </h1>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-[#444] flex">
                {["Recipes", "Discussions", "Comments"].map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 text-lg font-semibold transition ${activeTab === tab ? "border-b-4 border-[#6bffa0] text-[#6bffa0]" : "text-gray-400 hover:text-white"}`}>
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Sections */}
            <div className="mt-6">
               {activeTab === "Recipes" ? renderRecipes() :
                activeTab === "Discussions" ? renderDiscussions() :
                activeTab === "Comments" ? renderComments() : null}
            </div>
        </div>
    );
};

export default MyForumActivity;
