import React, { useState, useEffect } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const VoteButton = ({ id, upvotes, downvotes, userVote, type, onVoteUpdate }) => {
    const [voteState, setVoteState] = useState({ upvotes, downvotes, userVote });

    // Fetch the user's vote state when the component mounts
    useEffect(() => {
        setVoteState({ upvotes, downvotes, userVote });
    }, [upvotes, downvotes, userVote]);

    const handleVote = async (voteType) => {
        try {
            console.log(`?? [DEBUG] Sending vote request: `, { id, voteType });

            const endpoint = type === "recipe"
                ? `http://localhost:5135/api/Recipes/${id}/vote`
                : `http://localhost:5135/api/Discussions/${id}/vote`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // Include session cookies
                body: JSON.stringify(voteType),
            });

            if (!response.ok) throw new Error(`? [ERROR] Voting Failed: ${response.status}`);

            const data = await response.json();
            console.log("? [API RESPONSE] Updated Vote Data:", data);

            setVoteState({
                upvotes: data.upvotes,
                downvotes: data.downvotes,
                userVote: data.userVote, // Update the user's vote state
            });

            onVoteUpdate(data); // Trigger parent update to persist state

        } catch (error) {
            console.error("[ERROR] Voting Request Failed:", error);
        }
    };

    return (
        <div className="flex items-center space-x-2 text-gray-400">
            <button
                className={`flex items-center space-x-1 transition-colors ${voteState.userVote === 1 ? "text-blue-500" : "text-gray-400 hover:text-white"
                    }`}
                onClick={(e) => {
                    e.stopPropagation(); 
                    handleVote(1);
                }}
            >
                <FaArrowUp />
                <span>{voteState.upvotes}</span>
            </button>

            <button
                className={`flex items-center transition-colors ${voteState.userVote === -1 ? "text-red-500" : "text-gray-400 hover:text-white"
                    }`}
                onClick={(e) => {
                    e.stopPropagation();
                    handleVote(-1);
                }}
            >
                <FaArrowDown />
            </button>
        </div>
    );
};

export default VoteButton;