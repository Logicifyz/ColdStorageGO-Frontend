import React, { useState } from "react";
import ImageUploader from "../components/ImageUploader";

const CreateRecipe = () => {
    const [recipeForm, setRecipeForm] = useState({
        userId: "",
        dishId: "",
        name: "",
        description: "",
        timeTaken: "",
        ingredients: [{ quantity: "", unit: "", name: "" }],
        instructions: [{ stepNumber: 1, step: "", mediaUrl: "" }],
        tags: "",
        visibility: "public",
    });

    const [showImageUploader, setShowImageUploader] = useState(false);
    const [coverImages, setCoverImages] = useState([]);
    const [instructionImages, setInstructionImages] = useState({});

    const handleSaveImages = (images) => {
        setCoverImages(images);
        setShowImageUploader(false);
    };

    const handleInstructionImageUpload = (index, file) => {
        setInstructionImages({ ...instructionImages, [index]: file });
    };

    const handleRemoveCoverImage = (index) => {
        const updatedImages = coverImages.filter((_, i) => i !== index);
        setCoverImages(updatedImages);
    };

    const handleAddIngredient = () => {
        setRecipeForm({
            ...recipeForm,
            ingredients: [...recipeForm.ingredients, { quantity: "", unit: "", name: "" }],
        });
    };

    const handleRemoveIngredient = (index) => {
        const updatedIngredients = recipeForm.ingredients.filter((_, i) => i !== index);
        setRecipeForm({ ...recipeForm, ingredients: updatedIngredients });
    };

    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = recipeForm.ingredients.map((ingredient, i) =>
            i === index ? { ...ingredient, [field]: value } : ingredient
        );
        setRecipeForm({ ...recipeForm, ingredients: updatedIngredients });
    };

    const handleAddInstruction = () => {
        setRecipeForm({
            ...recipeForm,
            instructions: [
                ...recipeForm.instructions,
                { stepNumber: recipeForm.instructions.length + 1, step: "" },
            ],
        });
    };

    const handleRemoveInstruction = (index) => {
        const updatedInstructions = recipeForm.instructions.filter((_, i) => i !== index);
        setRecipeForm({
            ...recipeForm,
            instructions: updatedInstructions.map((instr, i) => ({
                ...instr,
                stepNumber: i + 1,
            })),
        });

        // Remove associated instruction image if exists
        const updatedInstructionImages = { ...instructionImages };
        delete updatedInstructionImages[index];
        setInstructionImages(updatedInstructionImages);
    };


    const handleInstructionChange = (index, field, value) => {
        const updatedInstructions = recipeForm.instructions.map((instruction, i) =>
            i === index ? { ...instruction, [field]: value } : instruction
        );
        setRecipeForm({ ...recipeForm, instructions: updatedInstructions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formattedIngredients = recipeForm.ingredients.map(ing => ({
            quantity: ing.quantity.trim(),
            unit: ing.unit.trim(),
            name: ing.name.trim()
        }));

        const formattedInstructions = recipeForm.instructions.map((instr, index) => ({
            stepNumber: index + 1, // Ensure step number consistency
            step: instr.step.trim()
        }));

        const formData = new FormData();

        // ? Log before sending to ensure correctness
        console.log("?? Submitting Recipe Data:", {
            ...recipeForm,
            ingredients: formattedIngredients,
            instructions: formattedInstructions
        });

        formData.append("ingredients", JSON.stringify(formattedIngredients));
        formData.append("instructions", JSON.stringify(formattedInstructions));

        // ? Append Cover Images
        coverImages.forEach((file) => formData.append("coverImages", file));

        // ? Append Instruction Images (Fixing Issue #1)
        Object.keys(instructionImages).forEach((index) => {
            formData.append("instructionImages", instructionImages[index]);
        });

        // ? Append other text fields
        Object.keys(recipeForm).forEach((key) => {
            if (!["ingredients", "instructions"].includes(key)) {
                formData.append(key, recipeForm[key]);
            }
        });

        try {
            const response = await fetch("http://localhost:5135/api/Recipes", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("? Failed to create recipe");
            }

            const data = await response.json();
            console.log("? Recipe Created Successfully:", data);
        } catch (error) {
            console.error("? Error creating recipe:", error);
        }
    };





    return (
        <div className="p-8 bg-[#2F2F2F] min-h-screen text-white">
            <h1 className="text-3xl font-bold text-center mb-8">Create Recipe</h1>
            <form onSubmit={handleSubmit} className="bg-[#383838] p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
                {/* Image Uploader */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => setShowImageUploader(true)}
                        className="w-full p-4 border-2 border-dashed text-gray-300 rounded-md hover:bg-[#444]"
                    >
                        {coverImages.length > 0 ? "Edit Uploaded Images" : "Upload Cover Photo"}
                    </button>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {coverImages.map((file, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt={`Preview ${index}`}
                                    className="w-full h-24 object-cover rounded-md"
                                />
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                    onClick={() => handleRemoveCoverImage(index)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <input
                        type="text"
                        placeholder="User ID"
                        value={recipeForm.userId}
                        onChange={(e) => setRecipeForm({ ...recipeForm, userId: e.target.value })}
                        className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                        required
                    />
                    <input
                        type="text"
                        placeholder="MealKit Used"
                        value={recipeForm.dishId}
                        onChange={(e) => setRecipeForm({ ...recipeForm, dishId: e.target.value })}
                        className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                    />
                    <input
                        type="text"
                        placeholder="Recipe Title"
                        value={recipeForm.name}
                        onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })}
                        className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                        required
                    />
                    <textarea
                        placeholder="Overview of Recipe"
                        value={recipeForm.description}
                        onChange={(e) => setRecipeForm({ ...recipeForm, description: e.target.value })}
                        className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                        rows="4"
                        required
                    ></textarea>
                    <input
                        type="number"
                        placeholder="Time Taken (in minutes)"
                        value={recipeForm.timeTaken}
                        onChange={(e) => setRecipeForm({ ...recipeForm, timeTaken: e.target.value })}
                        className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                    />
                </div>

                {/* Ingredients */}
                <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                {recipeForm.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-4 items-center mb-4">
                        <input
                            type="text"
                            placeholder="Quantity"
                            value={ingredient.quantity}
                            onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                            className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                        />
                        <input
                            type="text"
                            placeholder="Unit"
                            value={ingredient.unit}
                            onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                            className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                        />
                        <input
                            type="text"
                            placeholder="Ingredient"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                            className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveIngredient(index)}
                            className="text-red-400 font-bold"
                        >
                            X
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddIngredient}
                    className="text-blue-400 font-semibold mb-6"
                >
                    + Add Ingredient
                </button>

                {/* Instructions */}
                <h3 className="text-xl font-semibold mb-4">Instructions</h3>
                {recipeForm.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-4 items-center mb-4">
                        <textarea
                            placeholder="Instruction Step"
                            value={instruction.step}
                            onChange={(e) => handleInstructionChange(index, "step", e.target.value)}
                            className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                            rows="2"
                        ></textarea>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleInstructionImageUpload(index, e.target.files[0])}
                            className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                        />
                        <button
                            type="button"
                            onClick={() => handleRemoveInstruction(index)}
                            className="text-red-400 font-bold"
                        >
                            X
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddInstruction}
                    className="text-blue-400 font-semibold mb-6"
                >
                    + Add Instruction
                </button>

                {/* Tags, Visibility, and Submit */}
                <div className="flex justify-between items-center mt-8">
                    <input
                        type="text"
                        placeholder="Tags"
                        value={recipeForm.tags}
                        onChange={(e) => setRecipeForm({ ...recipeForm, tags: e.target.value })}
                        className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                        required
                    />
                    <select
                        value={recipeForm.visibility}
                        onChange={(e) =>
                            setRecipeForm({ ...recipeForm, visibility: e.target.value })
                        }
                        className="p-3 border border-gray-500 rounded bg-[#444] text-white"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                        <option value="friends-only">Friends Only</option>
                    </select>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-500 text-white font-bold rounded hover:bg-blue-700"
                    >
                        Post Recipe
                    </button>
                </div>
            </form>

            {showImageUploader && (
                <ImageUploader maxImages={10} onSave={handleSaveImages} onClose={() => setShowImageUploader(false)} />
            )}
        </div>
    );
};

export default CreateRecipe;
