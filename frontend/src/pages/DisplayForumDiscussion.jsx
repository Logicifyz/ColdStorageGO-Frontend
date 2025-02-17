import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaCommentAlt } from "react-icons/fa";
import CommentsSection from "../components/CommentsSection";
import VoteButton from "../components/VoteButton";

const DisplayForumDiscussion = () => {
    const { discussionId } = useParams();
    const [discussion, setDiscussion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDiscussion = async () => {
        try {
            const response = await fetch(`http://localhost:5135/api/Discussions/${discussionId}`, {
                credentials: "include",
            });
            if (!response.ok) throw new Error(`Failed to fetch discussion: ${response.status}`);
            const data = await response.json();
            setDiscussion(data);
        } catch (err) {
            console.error("Failed to load discussion:", err);
            setError("Failed to load discussion.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!discussionId || discussionId === "undefined") {
            setError("Invalid Discussion ID.");
            setLoading(false);
            return;
        }
        fetchDiscussion();
    }, [discussionId]);

    const handleVoteUpdate = (updatedData) => {
        setDiscussion((prevDiscussion) => ({
            ...prevDiscussion,
            upvotes: updatedData.upvotes,
            downvotes: updatedData.downvotes,
            voteScore: updatedData.voteScore,
            userVote: updatedData.userVote,
        }));
    };

    if (loading) return <p className="text-center text-gray-300 text-xl">Loading...</p>;
    if (error) return <p className="text-center text-red-500 text-xl">{error}</p>;
    if (!discussion) return <p className="text-center text-gray-400 text-xl">Discussion not found.</p>;

    return (
        <div className="p-6 bg-[#1e1e1e] text-white min-h-screen">
            {/* Discussion Title */}
            <h1 className="text-5xl font-bold text-center mb-4 text-[#ff6b6b]">{discussion.title}</h1>

            {/* Metadata */}
            <p className="text-center text-gray-400 text-lg mb-2">
                {new Date(discussion.date || Date.now()).toLocaleDateString()} • Category: {discussion.category}
            </p>

            {/* Cover Image */}
            <div className="flex justify-center my-8">
                {discussion.coverImages && discussion.coverImages.length > 0 ? (
                    <img
                        src={`data:image/jpeg;base64,${discussion.coverImages[0]}`}
                        alt="Discussion Cover"
                        className="w-full max-w-2xl h-[400px] object-cover rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="w-full max-w-2xl h-[400px] bg-gray-700 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400 text-xl">No Image Available</p>
                    </div>
                )}
            </div>

            {/* Discussion Content */}
            <div className="mt-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-[#ff6b6b]">Discussion Content</h2>
                <div
                    className="text-gray-300 text-lg leading-7 bg-[#2f2f2f] p-4 rounded-lg shadow-md"
                    dangerouslySetInnerHTML={{ __html: discussion.content }}
                />
            </div>

            {/* Discussion Actions */}
            <div className="flex justify-center space-x-12 text-gray-400 my-8 border-b border-gray-600 pb-6">
                <VoteButton
                    id={discussion.discussionId}
                    upvotes={discussion.upvotes}
                    downvotes={discussion.downvotes}
                    userVote={discussion.userVote}
                    type="discussion"
                    onVoteUpdate={handleVoteUpdate}
                />
                <button className="flex items-center space-x-2 hover:text-white">
                    <FaCommentAlt className="text-[#ff6b6b]" />
                    <span>Add Comment</span>
                </button>
            </div>

            
            <div className="mt-10 max-w-2xl mx-auto">
                <CommentsSection postId={discussionId} postType="discussion" />
            </div>
        </div>
    );
};

export default DisplayForumDiscussion;
