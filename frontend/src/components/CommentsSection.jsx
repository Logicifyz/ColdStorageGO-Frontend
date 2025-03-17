import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown, FaReply } from "react-icons/fa";
import { format, parseISO } from "date-fns";

const CommentsSection = ({ postId, postType }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [replyingTo, setReplyingTo] = useState(null);
    const [userId, setUserId] = useState(null);
    const [username, setUsername] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchComments();
        fetchUserId();
    }, [postId, postType]);

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

            setComments(data.map(comment => ({
                ...comment,
                userVote: comment.userVote
            })));
        } catch (err) {
            console.error("[ERROR] Fetching Comments:", err);
        } finally {
            setLoading(false);
        }
    };

    const postComment = async () => {
        if (!newComment.trim() || !userId) {
            alert("You must be logged in to comment.");
            return;
        }

        const payload = {
            userId,
            [`${postType}Id`]: postId,
            postType,
            content: newComment,
            parentCommentId: replyingTo ? replyingTo.commentId : null // ? Extract `commentId`
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
                const updateComments = (commentsList) => {
                    return commentsList.map(comment => {
                        if (comment.commentId === commentId) {
                            let newUserVote = voteType;

                            if (comment.userVote === voteType) {
                                newUserVote = 0;
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
                                replies: updateComments(comment.replies),
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
                    {comment.profilePicture ? (
                        <img src={`data:image/png;base64,${comment.profilePicture}`} alt="Profile" className="w-10 h-10 rounded-full mr-3" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[#355E3B] mr-3"></div>
                    )}

                    <p className="text-[#355E3B] font-semibold">
                        {comment.username} {comment.username === username ? "(You)" : ""}
                        <span className="text-[#355E3B] text-sm"> {formatTimestamp(comment.createdAt)}</span>
                    </p>
                </div>

                <p className="text-[#355E3B] ml-12">{comment.content}</p>

                <div className="flex space-x-4 text-[#355E3B] ml-12 items-center">
                    <button className={`flex items-center ${comment.userVote === 1 ? "text-[#204037]" : ""}`} onClick={() => handleVote(comment.commentId, 1)}>
                        <FaArrowUp className="mr-1" />
                    </button>
                    <span className="text-[#355E3B] font-bold">{comment.upvotes}</span>
                    <button className={`flex items-center ${comment.userVote === -1 ? "text-[#204037]" : ""}`} onClick={() => handleVote(comment.commentId, -1)}>
                        <FaArrowDown className="mr-1" />
                    </button>

                    <button
                        className="flex items-center text-[#355E3B] ml-4"
                        onClick={() => setReplyingTo({ commentId: comment.commentId, username: comment.username })}
                    >
                        <FaReply className="mr-1" /> Reply
                    </button>

                </div>

                {comment.replies && comment.replies.length > 0 && renderComments(comment.replies, level + 1)}
            </div>
        ));
    };

    const formatTimestamp = (createdAt) => {
        const date = new Date(createdAt + "Z");
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / 60000);
        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
        return format(date, "dd/MM/yyyy");
    };

    return (
        <div className="mt-10">
            <h2 className="text-3xl font-semibold text-[#355E3B]">Comments</h2>

            {loading ? (
                <p className="text-[#355E3B]">Loading comments...</p>
            ) : (
                <div>{comments.length === 0 ? <p className="text-[#355E3B]">No comments yet.</p> : renderComments(comments)}</div>
            )}

            {/* Add New Comment or Reply (Single Input for Both) */}
            <div className="mt-6">
                {replyingTo && (
                    <p className="text-sm text-gray-500 mb-2">
                        Replying to <strong>{replyingTo.username || "Unknown"}</strong>
                        <button className="ml-2 text-red-500" onClick={() => setReplyingTo(null)}>Cancel</button>
                    </p>
                )}

                <textarea
                    className="w-full p-3 rounded-lg bg-[#e0e0d0] text-[#355E3B]"
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button onClick={postComment} className="bg-[#355E3B] text-white px-4 py-2 mt-2 rounded-lg">
                    {replyingTo ? "Reply" : "Post"}
                </button>
            </div>
        </div>
    );
};

export default CommentsSection;
