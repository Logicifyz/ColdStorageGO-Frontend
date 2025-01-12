import React, { useState } from "react";
import ForumPopup from "../components/ForumPopup";

const Forum = ({ popupType, onClosePopup }) => {
    const [recipeForm, setRecipeForm] = useState({
        userId: "", // Required
        dishId: "", // Required
        name: "", // Required, MaxLength: 100
        description: "", // Required, MaxLength: 500
        timeTaken: "", // Range: 1-1440
        ingredients: "", // Required, MaxLength: 1000
        instructions: "", // Required, MaxLength: 2000
        tags: "", // MaxLength: 200
        mediaUrl: "", // URL
        visibility: "public", // Required, Valid Values: public/private/friends-only
    });

    const [discussionForm, setDiscussionForm] = useState({
        userId: "",
        title: "",
        content: "",
        category: "",
        visibility: "public",
    });

    const handleSubmitRecipe = async () => {
        try {
            // Validate fields before submitting
            if (
                !recipeForm.userId ||
                !recipeForm.dishId ||
                !recipeForm.name ||
                !recipeForm.description ||
                !recipeForm.ingredients ||
                !recipeForm.instructions ||
                !["public", "private", "friends-only"].includes(recipeForm.visibility)
            ) {
                console.error("Validation failed: Missing or invalid required fields.");
                return;
            }

            if (!Number.isInteger(parseInt(recipeForm.timeTaken)) || recipeForm.timeTaken < 1 || recipeForm.timeTaken > 1440) {
                console.error("Validation failed: Time Taken must be a number between 1 and 1440.");
                return;
            }

            const response = await fetch("http://localhost:5135/api/Recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "SessionId": "mock-session-id", // Adjust/remove as needed
                },
                body: JSON.stringify(recipeForm),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Failed to submit recipe:", errorText);
                return;
            }

            console.log("Recipe submitted successfully.");
            onClosePopup();
        } catch (error) {
            console.error("Error submitting recipe:", error);
        }
    };


    const handleSubmitDiscussion = async () => {
        try {
            await fetch("http://localhost:5135/api/Discussions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "SessionId": "mock-session-id", // Adjust or remove if unnecessary
                },
                body: JSON.stringify(discussionForm),
            });
            onClosePopup();
        } catch (error) {
            console.error("Error submitting discussion:", error);
        }
    };

    return (
        <div className="p-6 bg-[#383838] text-white min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">Forum</h1>

            {/* Recipe Popup */}
            <ForumPopup
                isOpen={popupType === "createRecipe"}
                onClose={onClosePopup}
                onSubmit={handleSubmitRecipe}
                fields={[
                    { type: "text", placeholder: "User ID", value: recipeForm.userId, onChange: (e) => setRecipeForm({ ...recipeForm, userId: e.target.value }) },
                    { type: "text", placeholder: "Dish ID", value: recipeForm.dishId, onChange: (e) => setRecipeForm({ ...recipeForm, dishId: e.target.value }) },
                    { type: "text", placeholder: "Name", value: recipeForm.name, onChange: (e) => setRecipeForm({ ...recipeForm, name: e.target.value }) },
                    { type: "textarea", placeholder: "Description", value: recipeForm.description, onChange: (e) => setRecipeForm({ ...recipeForm, description: e.target.value }) },
                    { type: "number", placeholder: "Time Taken (minutes)", value: recipeForm.timeTaken, onChange: (e) => setRecipeForm({ ...recipeForm, timeTaken: e.target.value }) },
                    { type: "textarea", placeholder: "Ingredients", value: recipeForm.ingredients, onChange: (e) => setRecipeForm({ ...recipeForm, ingredients: e.target.value }) },
                    { type: "textarea", placeholder: "Instructions", value: recipeForm.instructions, onChange: (e) => setRecipeForm({ ...recipeForm, instructions: e.target.value }) },
                    { type: "text", placeholder: "Tags", value: recipeForm.tags, onChange: (e) => setRecipeForm({ ...recipeForm, tags: e.target.value }) },
                    { type: "text", placeholder: "Media URL", value: recipeForm.mediaUrl, onChange: (e) => setRecipeForm({ ...recipeForm, mediaUrl: e.target.value }) },
                    {
                        type: "select",
                        placeholder: "Visibility",
                        value: recipeForm.visibility,
                        onChange: (e) => setRecipeForm({ ...recipeForm, visibility: e.target.value }),
                        options: [
                            { value: "public", label: "Public" },
                            { value: "private", label: "Private" },
                            { value: "friends-only", label: "Friends Only" },
                        ],
                    },
                ]}
                title="Create Recipe"
            />

            {/* Discussion Popup */}
            <ForumPopup
                isOpen={popupType === "createDiscussion"}
                onClose={onClosePopup}
                onSubmit={handleSubmitDiscussion}
                fields={[
                    { type: "text", placeholder: "User ID", value: discussionForm.userId, onChange: (e) => setDiscussionForm({ ...discussionForm, userId: e.target.value }) },
                    { type: "text", placeholder: "Title", value: discussionForm.title, onChange: (e) => setDiscussionForm({ ...discussionForm, title: e.target.value }) },
                    { type: "textarea", placeholder: "Content", value: discussionForm.content, onChange: (e) => setDiscussionForm({ ...discussionForm, content: e.target.value }) },
                    { type: "text", placeholder: "Category", value: discussionForm.category, onChange: (e) => setDiscussionForm({ ...discussionForm, category: e.target.value }) },
                    {
                        type: "select",
                        placeholder: "Visibility",
                        value: discussionForm.visibility,
                        onChange: (e) => setDiscussionForm({ ...discussionForm, visibility: e.target.value }),
                        options: [
                            { value: "public", label: "Public" },
                            { value: "private", label: "Private" },
                            { value: "friends-only", label: "Friends Only" },
                        ],
                    },
                ]}
                title="Create Discussion"
            />
        </div>
    );
};

export default Forum;
