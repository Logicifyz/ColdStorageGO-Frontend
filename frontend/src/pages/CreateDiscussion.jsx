import React, { useState } from "react";

const CreateDiscussions = () => {
    const [discussionForm, setDiscussionForm] = useState({
        userId: "", // Replace dynamically with a valid User ID
        title: "",
        content: "",
        category: "",
        visibility: "public",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Ensure required fields are filled
            if (!discussionForm.userId || !discussionForm.title || !discussionForm.content || !discussionForm.category) {
                alert("Please fill in all required fields.");
                return;
            }

            // Prepare the payload as JSON
            const payload = {
                userId: discussionForm.userId,
                title: discussionForm.title,
                content: discussionForm.content,
                category: discussionForm.category,
                visibility: discussionForm.visibility,
            };

            // Send the POST request to the backend
            const response = await fetch("http://localhost:5135/api/Discussions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // Ensure JSON payload
                },
                body: JSON.stringify(payload), // Convert payload to JSON string
            });

            if (response.ok) {
                alert("Discussion created successfully!");
                setDiscussionForm({
                    userId: "",
                    title: "",
                    content: "",
                    category: "",
                    visibility: "public",
                });
            } else {
                const error = await response.json();
                console.error("Failed to create discussion:", error);
                alert(
                    `Failed to create discussion: ${Object.entries(error.errors || {})
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(", ")}`
                );
            }
        } catch (error) {
            console.error("Error submitting discussion:", error);
            alert("An error occurred while creating the discussion.");
        }
    };


    return (
        <div className="p-8 bg-[#2F2F2F] min-h-screen text-white">
            <h1 className="text-3xl font-bold text-center mb-8">Create Discussion</h1>
            <form onSubmit={handleSubmit} className="bg-[#383838] p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
                {/* User ID */}
                <input
                    type="text"
                    placeholder="User ID"
                    value={discussionForm.userId}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, userId: e.target.value })}
                    className="p-3 border border-gray-500 rounded bg-[#444] text-white w-full mb-6"
                    required
                />

                {/* Title */}
                <input
                    type="text"
                    placeholder="Discussion Title (max 100 chars)"
                    value={discussionForm.title}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, title: e.target.value })}
                    className="p-3 border border-gray-500 rounded bg-[#444] text-white w-full mb-6"
                    maxLength="100"
                    required
                />

                {/* Content */}
                <textarea
                    placeholder="Discussion Content (max 1000 chars)"
                    value={discussionForm.content}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, content: e.target.value })}
                    className="p-3 border border-gray-500 rounded bg-[#444] text-white w-full mb-6"
                    rows="6"
                    maxLength="1000"
                    required
                ></textarea>

                {/* Category */}
                <input
                    type="text"
                    placeholder="Category (max 50 chars)"
                    value={discussionForm.category}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, category: e.target.value })}
                    className="p-3 border border-gray-500 rounded bg-[#444] text-white w-full mb-6"
                    maxLength="50"
                    required
                />

                {/* Visibility */}
                <select
                    value={discussionForm.visibility}
                    onChange={(e) => setDiscussionForm({ ...discussionForm, visibility: e.target.value })}
                    className="p-3 border border-gray-500 rounded bg-[#444] text-white w-full mb-6"
                    required
                >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="friends-only">Friends Only</option>
                </select>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="px-6 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 w-full"
                >
                    Post Discussion
                </button>
            </form>
        </div>
    );
};

export default CreateDiscussions;
