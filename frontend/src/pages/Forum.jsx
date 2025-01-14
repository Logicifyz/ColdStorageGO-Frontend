import React, { useState, useEffect } from "react";
import ForumPopup from "../components/ForumPopup";
import ImageUploader from "../components/ImageUploader"; // Import the ImageUploader component
import { FaArrowUp, FaArrowDown, FaCommentAlt, FaBookmark } from "react-icons/fa";

const Forum = ({ popupType, onClosePopup }) => {
    const [recipeForm, setRecipeForm] = useState({
        userId: "", // Do not modify this
        dishId: "",
        name: "",
        description: "",
        timeTaken: "",
        ingredients: [{ quantity: "", unit: "", name: "" }], // Dynamic ingredients structure
        instructions: [{ step: "", mediaFile: null }], // Dynamic instructions structure
        tags: "",
        mediaFiles: [], // Allows multiple image uploads
        visibility: "public",
    });

    const [previewImages, setPreviewImages] = useState([]); // Array for image previews
    const [recipes, setRecipes] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch recipes and discussions
    useEffect(() => {
        const fetchData = async () => {
            try {
                const recipesResponse = await fetch("http://localhost:5135/api/Recipes");
                const discussionsResponse = await fetch("http://localhost:5135/api/Discussions");

                if (recipesResponse.ok) {
                    setRecipes(await recipesResponse.json());
                }
                if (discussionsResponse.ok) {
                    setDiscussions(await discussionsResponse.json());
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Handle media file changes
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const updatedFiles = [...recipeForm.mediaFiles, ...files];
        setRecipeForm({ ...recipeForm, mediaFiles: updatedFiles });

        const updatedPreviews = files.map((file) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onload = () => resolve(reader.result);
            });
        });

        Promise.all(updatedPreviews).then((previews) => {
            setPreviewImages([...previewImages, ...previews]);
        });
    };

    const handleRemoveImage = (index) => {
        const updatedFiles = recipeForm.mediaFiles.filter((_, i) => i !== index);
        const updatedPreviews = previewImages.filter((_, i) => i !== index);
        setRecipeForm({ ...recipeForm, mediaFiles: updatedFiles });
        setPreviewImages(updatedPreviews);
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...recipeForm.ingredients];
        updatedIngredients[index][field] = value;
        setRecipeForm({ ...recipeForm, ingredients: updatedIngredients });
    };

    const addIngredient = () => {
        setRecipeForm({
            ...recipeForm,
            ingredients: [...recipeForm.ingredients, { quantity: "", unit: "", name: "" }],
        });
    };

    const removeIngredient = (index) => {
        const updatedIngredients = recipeForm.ingredients.filter((_, i) => i !== index);
        setRecipeForm({ ...recipeForm, ingredients: updatedIngredients });
    };

    const handleInstructionChange = (index, field, value) => {
        const updatedInstructions = [...recipeForm.instructions];
        updatedInstructions[index][field] = value;
        setRecipeForm({ ...recipeForm, instructions: updatedInstructions });
    };

    const addInstruction = () => {
        setRecipeForm({
            ...recipeForm,
            instructions: [...recipeForm.instructions, { step: "", mediaFile: null }],
        });
    };

    const removeInstruction = (index) => {
        const updatedInstructions = recipeForm.instructions.filter((_, i) => i !== index);
        setRecipeForm({ ...recipeForm, instructions: updatedInstructions });
    };

    const handleInstructionMediaUpload = (index, file) => {
        const updatedInstructions = [...recipeForm.instructions];
        updatedInstructions[index].mediaFile = file;
        setRecipeForm({ ...recipeForm, instructions: updatedInstructions });
    };

    // Submit recipe
    const handleSubmitRecipe = async () => {
        try {
            // Validation for required fields
            if (!recipeForm.userId || !recipeForm.dishId || !recipeForm.name || !recipeForm.description || !recipeForm.tags) {
                alert("Please fill in all required fields.");
                return;
            }

            const formData = new FormData();
            for (const key in recipeForm) {
                if (key === "mediaFiles" && recipeForm.mediaFiles.length > 0) {
                    recipeForm.mediaFiles.forEach((file) => formData.append("mediaFiles", file));
                } else if (key === "ingredients" || key === "instructions") {
                    formData.append(key, JSON.stringify(recipeForm[key]));
                } else {
                    formData.append(key, recipeForm[key]);
                }
            }

            const response = await fetch("http://localhost:5135/api/Recipes", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setRecipes([...recipes, await response.json()]);
                onClosePopup();
            } else {
                const error = await response.json();
                console.error("Failed to submit recipe:", error);
                alert("Failed to submit recipe. Please check your input.");
            }
        } catch (error) {
            console.error("Error submitting recipe:", error);
            alert("An error occurred while submitting the recipe.");
        }
    };

    return (
        <div className="p-6 bg-[#383838] text-white min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-8">Forum</h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search Forum"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-2 rounded bg-[#282828] text-white border border-gray-500"
                />
            </div>

            <div className="flex">
                <div className="w-1/4 pr-4">
                    <h3 className="text-lg font-bold mb-4">Saved Recipes</h3>
                    <ul className="mb-8">
                        {recipes.slice(0, 5).map((recipe) => (
                            <li key={recipe.recipeId} className="mb-2">
                                {recipe.name}
                            </li>
                        ))}
                    </ul>
                    <h3 className="text-lg font-bold mb-4">Top Discussions</h3>
                    <ul>
                        {discussions.slice(0, 5).map((discussion) => (
                            <li key={discussion.discussionId} className="mb-2">
                                {discussion.title}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="w-3/4">
                    <h3 className="text-lg font-bold mb-4">Recent Posts</h3>
                    <div className="grid grid-cols-1 gap-4">
                        {recipes.map((recipe) => (
                            <div
                                key={recipe.recipeId}
                                className="bg-[#2f2f2f] p-4 rounded shadow-lg flex items-start space-x-4 border border-gray-700"
                            >
                                <img
                                    src={recipe.mediaUrls?.[0] || "/placeholder-image.png"}
                                    alt={recipe.name}
                                    className="w-24 h-24 rounded-md object-cover"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <p className="text-white font-bold">{recipe.name}</p>
                                        <p className="text-gray-400 text-sm">
                                            {new Date(recipe.date || Date.now()).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-2">{recipe.description}</p>
                                    <div className="flex items-center space-x-4 text-gray-400">
                                        <button className="flex items-center space-x-1 hover:text-white">
                                            <FaArrowUp />
                                            <span>{recipe.upvotes || 0}</span>
                                        </button>
                                        <button className="flex items-center space-x-1 hover:text-white">
                                            <FaArrowDown />
                                            <span>{recipe.downvotes || 0}</span>
                                        </button>
                                        <button className="hover:text-white">
                                            <FaCommentAlt />
                                        </button>
                                        <button className="hover:text-white">
                                            <FaBookmark />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <ForumPopup
                isOpen={popupType === "createRecipe"}
                onClose={onClosePopup}
                onSubmit={handleSubmitRecipe}
                recipeForm={recipeForm}
                setRecipeForm={setRecipeForm}
                handleIngredientChange={handleIngredientChange}
                addIngredient={addIngredient}
                removeIngredient={removeIngredient}
                handleInstructionChange={handleInstructionChange}
                addInstruction={addInstruction}
                removeInstruction={removeInstruction}
                handleInstructionMediaUpload={handleInstructionMediaUpload}
            />
        </div>
    );
};

export default Forum;