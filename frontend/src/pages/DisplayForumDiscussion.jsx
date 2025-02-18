import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaCommentAlt } from "react-icons/fa";
import CommentsSection from "../components/CommentsSection";
import VoteButton from "../components/VoteButton";
import { useNavigate } from "react-router-dom";


const DisplayForumDiscussion = () => {
    const { discussionId } = useParams();
    const [discussion, setDiscussion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();


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

    if (loading) return <p className="text-center text-[#355E3B] text-xl">Loading...</p>;
    if (error) return <p className="text-center text-red-500 text-xl">{error}</p>;
    if (!discussion) return <p className="text-center text-[#355E3B] text-xl">Discussion not found.</p>;

    return (
        <div className="p-6 bg-[#f0f0e0] min-h-screen">
            {/* Profile Picture, Username & Upvote/Downvote (Centered Together) */}
            <div className="flex justify-center items-center space-x-4 mb-6">
                {/* Profile Picture & Username */}
                <div className="flex items-center space-x-2">
                    {discussion.user?.profilePicture ? (
                        <img
                            src={`data:image/jpeg;base64,${discussion.user.profilePicture}`}
                            alt={`${discussion.user?.username || "User"}'s profile`}
                            className="w-10 h-10 rounded-full object-cover cursor-pointer"
                            onClick={() => discussion.user?.username && navigate(`/profile/${discussion.user.username}`)}
                        />
                    ) : (
                        <div
                            className="w-10 h-10 rounded-full bg-[#204037] cursor-pointer"
                            onClick={() => discussion.user?.username && navigate(`/profile/${discussion.user.username}`)}
                        ></div>
                    )}
                    <span
                        className="text-[#123524] font-semibold cursor-pointer hover:underline"
                        onClick={() => discussion.user?.username && navigate(`/profile/${discussion.user.username}`)}
                    >
                        {discussion.user?.username ? discussion.user.username : "Deleted User"}
                    </span>
                </div>

                {/* Upvote/Downvote Button (Now Centered with Profile) */}
                <VoteButton
                    id={discussion.discussionId}
                    upvotes={discussion.upvotes}
                    downvotes={discussion.downvotes}
                    userVote={discussion.userVote}
                    type="discussion"
                    onVoteUpdate={handleVoteUpdate}
                />
            </div>

            {/* Discussion Title & Description */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-[#355E3B] mb-4">{discussion.title}</h1>
            </div>

            {/* Discussion Cover Image */}
            <div className="flex justify-center mb-8">
                {discussion.coverImages && discussion.coverImages.length > 0 ? (
                    <img
                        src={`data:image/jpeg;base64,${discussion.coverImages[0]}`}
                        alt="Discussion Cover"
                        className="w-full max-w-2xl h-[300px] object-cover rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="w-full max-w-2xl h-[300px] bg-[#e0e0d0] rounded-lg flex items-center justify-center">
                        <p className="text-[#355E3B] text-xl">No Image Available</p>
                    </div>
                )}
            </div>

            {/* Discussion Metadata (Category) */}
            <div className="flex justify-center space-x-12 text-[#355E3B] mb-8 border-b border-[#355E3B] pb-6">
                <div className="flex items-center space-x-2">
                    <p><strong>Category:</strong> {discussion.category}</p>
                </div>
            </div>

            {/* Discussion Content */}
            <div className="mt-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-[#355E3B]">Discussion Content</h2>
                <div
                    className="text-[#355E3B] text-lg leading-7 bg-[#e0e0d0] p-4 rounded-lg shadow-md"
                    dangerouslySetInnerHTML={{ __html: discussion.content }}
                />
            </div>

            {/* Comments Section */}
            <div className="mt-10 max-w-2xl mx-auto">
                <CommentsSection postId={discussionId} postType="discussion" />
            </div>
        </div>
    );

};

export default DisplayForumDiscussion;