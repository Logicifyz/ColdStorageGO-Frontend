import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown, FaReply } from "react-icons/fa";
import { formatDistanceToNow, parseISO, format } from "date-fns";


const CommentsSection = ({ postId, postType }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchComments();
        fetchUserId();
    }, [postId, postType]);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch("http://localhost:5135/api/Account/profile", {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            if (response.ok) {
                setUserId(data.userId);
                setUsername(data.username);
            }
        } catch (err) {
            console.error("[ERROR] Fetching User Profile:", err);
        }
    };

    const fetchUserId = async () => {
        try {
            const response = await fetch("http://localhost:5135/api/Auth/check-session", {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            if (data.sessionValid) {
                setUserId(data.userId);
            }
        } catch (err) {
            console.error("[ERROR] Fetching UserId:", err);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:5135/api/Comments?${postType}Id=${postId}`, {
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to fetch comments");
            const data = await response.json();

            // ? Ensure that UserVote is stored correctly
            setComments(data.map(comment => ({
                ...comment,
                userVote: comment.userVote // Preserve vote state on refresh
            })));
        } catch (err) {
            console.error("[ERROR] Fetching Comments:", err);
        } finally {
            setLoading(false);
        }
    };


    const postComment = async (parentCommentId = null) => {
        if (!newComment.trim() || !userId) {
            alert("You must be logged in to comment.");
            return;
        }

        const payload = {
            userId,
            [`${postType}Id`]: postId,
            postType,
            content: newComment,
            parentCommentId
        };

        console.log("[DEBUG] Sending Comment Payload:", payload);

        const response = await fetch("http://localhost:5135/api/Comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload),
        });

        const responseData = await response.json();
        console.log("[DEBUG] API Response:", responseData);

        if (response.ok) {
            setNewComment("");
            setReplyingTo(null);
            fetchComments();
        } else {
            console.error("[ERROR] Failed to post comment:", responseData);
        }
    };

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
                // ? Recursive function to update votes in nested structure
                const updateComments = (commentsList) => {
                    return commentsList.map(comment => {
                        if (comment.commentId === commentId) {
                            let newUserVote = voteType;

                            // Toggle vote if the same button is clicked
                            if (comment.userVote === voteType) {
                                newUserVote = 0; // Reset vote
                            }

                            return {
                                ...comment,
                                upvotes: data.upvotes,
                                downvotes: data.downvotes,
                                userVote: newUserVote,
                            };
                        } else if (comment.replies && comment.replies.length > 0) {
                            return {
                                ...comment,
                                replies: updateComments(comment.replies), // Recursively update replies
                            };
                        }
                        return comment;
                    });
                };

                setComments(prevComments => updateComments(prevComments));
            } else {
                console.error("[ERROR] Voting Failed:", data);
            }
        } catch (err) {
            console.error("[ERROR] Voting Request Failed:", err);
        }
    };







    const renderComments = (comments, level = 0) => {
        return comments.map((comment) => (
            <div key={comment.commentId} className={`border-l-4 pl-4 mt-4 ${level > 0 ? 'ml-6' : ''}`}>
                <div className="flex items-center">
                    {/* ? Display Profile Picture */}
                    {comment.profilePicture ? (
                        <img src={`data:image/png;base64,${comment.profilePicture}`} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-500 mr-3"></div> // Default Avatar
                    )}

                    <p className="text-gray-300 font-semibold">
                        {comment.username} {comment.username === username ? "(You)" : ""}
                        <span className="text-gray-500 text-sm"> • {formatTimestamp(comment.createdAt)}</span>
                    </p>
                </div>

                <p className="text-gray-300 ml-12">{comment.content}</p>
                {/* ? Voting and Reply Actions */}
                <div className="flex space-x-4 text-gray-400 ml-12 items-center">
                    {/* ? Upvote Button */}
                    <button className={`flex items-center ${comment.userVote === 1 ? "text-blue-500" : ""}`} onClick={() => handleVote(comment.commentId, 1)}>
                        <FaArrowUp className="mr-1" />
                    </button>

                    {/* ? Vote Count (Upvotes - Downvotes) */}
                    <span className="text-gray-300 font-bold">{comment.upvotes}</span>

                    {/* ? Downvote Button */}
                    <button className={`flex items-center ${comment.userVote === -1 ? "text-red-500" : ""}`} onClick={() => handleVote(comment.commentId, -1)}>
                        <FaArrowDown className="mr-1" />
                    </button>

                    {/* ? Reply Button */}
                    <button className="flex items-center text-gray-400 ml-4" onClick={() => setReplyingTo(comment.commentId)}>
                        <FaReply className="mr-1 text-[#ff6b6b]" /> Reply
                    </button>
                </div>

                {/* Render Reply Box */}
                {replyingTo === comment.commentId && (
                    <div className="ml-16 mt-2">
                        <textarea
                            className="w-full p-2 rounded-lg bg-[#2f2f2f] text-gray-300"
                            placeholder="Write a reply..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button onClick={() => postComment(comment.commentId)} className="bg-[#ff6b6b] text-white px-4 py-2 mt-2 rounded-lg">
                            Reply
                        </button>
                    </div>
                )}

                {/* Render Nested Replies */}
                {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
            </div>
        ));
    };

    const formatTimestamp = (createdAt) => {
        const date = new Date(createdAt + "Z"); // Ensure UTC is parsed correctly
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        if (diffInHours < 24) return `${diffInHours} hours ago`;

        return format(date, "dd/MM/yyyy"); // Shows the date if older than 24 hours
    };

    return (
        <div className="mt-10">
            <h2 className="text-3xl font-semibold text-[#ff6b6b]">Comments</h2>

            {loading ? (
                <p className="text-gray-400">Loading comments...</p>
            ) : (
                <div>{comments.length === 0 ? <p className="text-gray-400">No comments yet.</p> : renderComments(comments)}</div>
            )}

            {/* Add New Comment */}
            <div className="mt-6">
                <textarea
                    className="w-full p-3 rounded-lg bg-[#2f2f2f] text-gray-300"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={() => postComment(null)} className="bg-[#ff6b6b] text-white px-4 py-2 mt-2 rounded-lg">
                    Post
                </button>
            </div>
        </div>
    );
};

export default CommentsSection;
