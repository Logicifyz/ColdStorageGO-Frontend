import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaCommentAlt } from "react-icons/fa";

const DisplayForumDiscussion = () => {
    const { discussionId } = useParams();
    console.log("?? [DEBUG] Extracted discussionId from URL:", discussionId);

    const [discussion, setDiscussion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        console.log("?? [DEBUG] useParams() returned discussionId:", discussionId);

        if (!discussionId || discussionId === "undefined") {
            console.error("? [ERROR] Invalid Discussion ID detected.");
            setError("Invalid Discussion ID.");
            setLoading(false);
            return;
        }

        const fetchDiscussion = async () => {
            console.log("?? [FETCHING] Attempting to fetch discussion with ID:", discussionId);
            try {
                const response = await fetch(`http://localhost:5135/api/Discussions/${discussionId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include"
                });


                if (!response.ok) {
                    throw new Error(`? [API ERROR] Failed to fetch discussion: ${response.status}`);
                }

                const data = await response.json();
                console.log("? [API RESPONSE] Fetched Discussion Data:", data);
                setDiscussion(data);
            } catch (err) {
                console.error("? [FETCH ERROR] Failed to load discussion:", err);
                setError("Failed to load discussion.");
            } finally {
                setLoading(false);
            }
        };

        fetchDiscussion();
    }, [discussionId]);

    if (loading) {
        console.log("? [LOADING] Displaying loading message...");
        return <p className="text-center text-gray-300 text-xl">Loading...</p>;
    }

    if (error) {
        console.error("? [ERROR] Displaying error message:", error);
        return <p className="text-center text-red-500 text-xl">{error}</p>;
    }

    if (!discussion) {
        console.warn("?? [WARNING] Discussion not found.");
        return <p className="text-center text-gray-400 text-xl">Discussion not found.</p>;
    }

    console.log("?? [DEBUG] Rendering Discussion:", discussion);

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
                <button className="flex items-center space-x-2 hover:text-white">
                    <FaThumbsUp className="text-[#ff6b6b]" />
                    <span>{discussion.upvotes || 0} Upvotes</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <FaThumbsDown className="text-[#ff6b6b]" />
                    <span>{discussion.downvotes || 0} Downvotes</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-white">
                    <FaCommentAlt className="text-[#ff6b6b]" />
                    <span>Add Comment</span>
                </button>
            </div>

            {/* TODO: Comments Section (To Be Added Later) */}
            <div className="mt-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-[#ff6b6b]">Comments</h2>
                <p className="text-gray-400 text-lg">Commenting feature coming soon...</p>
            </div>
        </div>
    );
};

export default DisplayForumDiscussion;
