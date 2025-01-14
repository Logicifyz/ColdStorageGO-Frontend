import React, { useState } from "react";
import ImageUploader from "./ImageUploader";

const ForumPopup = ({ isOpen, onClose, onSubmit, recipeForm, setRecipeForm, title }) => {
    const [showImageUploader, setShowImageUploader] = useState(false);
    const [uploadedImages, setUploadedImages] = useState([]);

    if (!isOpen) return null;

    const handleSaveImages = (images) => {
        setUploadedImages(images);
        setRecipeForm({ ...recipeForm, mediaFiles: images });
        setShowImageUploader(false);
    };

    const handleRemoveImage = (index) => {
        const updatedImages = uploadedImages.filter((_, i) => i !== index);
        setUploadedImages(updatedImages);
        setRecipeForm({ ...recipeForm, mediaFiles: updatedImages });
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
            instructions: [...recipeForm.instructions, { step: "", mediaFile: null }],
        });
    };

    const handleRemoveInstruction = (index) => {
        const updatedInstructions = recipeForm.instructions.filter((_, i) => i !== index);
        setRecipeForm({ ...recipeForm, instructions: updatedInstructions });
    };

    const handleInstructionChange = (index, field, value) => {
        const updatedInstructions = recipeForm.instructions.map((instruction, i) =>
            i === index ? { ...instruction, [field]: value } : instruction
        );
        setRecipeForm({ ...recipeForm, instructions: updatedInstructions });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(); // Pass control back to parent component
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white text-black rounded-lg shadow-lg p-6 w-full max-w-5xl">
                <h2 className="text-xl font-bold mb-4">{title}</h2>
                <form onSubmit={handleSubmit}>
                    {/* Image Uploader */}
                    <div className="mb-6">
                        <button
                            type="button"
                            onClick={() => setShowImageUploader(true)}
                            className="w-full p-4 border-2 border-dashed text-gray-500 rounded-md hover:bg-gray-100"
                        >
                            {uploadedImages.length > 0
                                ? "Edit Uploaded Images"
                                : "Upload Cover Photo"}
                        </button>
                        <div className="grid grid-cols-5 gap-4 mt-4">
                            {uploadedImages.map((img, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`Preview ${index}`}
                                        className="w-full h-24 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="User ID"
                            value={recipeForm.userId}
                            onChange={(e) => setRecipeForm({ ...recipeForm, userId: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            placeholder="MealKit Used"
                            value={recipeForm.dishId}
                            onChange={(e) => setRecipeForm({ ...recipeForm, dishId: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            placeholder="Recipe Title"
                            value={recipeForm.name}
                            onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <textarea
                            placeholder="Overview of Recipe"
                            value={recipeForm.description}
                            onChange={(e) =>
                                setRecipeForm({ ...recipeForm, description: e.target.value })
                            }
                            className="p-2 border border-gray-300 rounded"
                            rows="4"
                        ></textarea>
                        <input
                            type="number"
                            placeholder="Time Taken (in minutes)"
                            value={recipeForm.timeTaken}
                            onChange={(e) => setRecipeForm({ ...recipeForm, timeTaken: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        />
                    </div>

                    {/* Ingredients */}
                    <h3 className="text-lg font-bold mt-6">Ingredients</h3>
                    {recipeForm.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-2 items-center mt-2">
                            <input
                                type="text"
                                placeholder="Quantity"
                                value={ingredient.quantity}
                                onChange={(e) =>
                                    handleIngredientChange(index, "quantity", e.target.value)
                                }
                                className="p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Unit"
                                value={ingredient.unit}
                                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                                className="p-2 border border-gray-300 rounded"
                            />
                            <input
                                type="text"
                                placeholder="Ingredient"
                                value={ingredient.name}
                                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                className="p-2 border border-gray-300 rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveIngredient(index)}
                                className="text-red-500 font-bold"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddIngredient}
                        className="mt-2 text-blue-500 font-bold"
                    >
                        + Add Ingredient
                    </button>

                    {/* Instructions */}
                    <h3 className="text-lg font-bold mt-6">Instructions</h3>
                    {recipeForm.instructions.map((instruction, index) => (
                        <div key={index} className="flex gap-2 items-center mt-2">
                            <textarea
                                placeholder="Instruction Step"
                                value={instruction.step}
                                onChange={(e) => handleInstructionChange(index, "step", e.target.value)}
                                className="p-2 border border-gray-300 rounded"
                                rows="2"
                            ></textarea>
                            <input
                                type="file"
                                onChange={(e) =>
                                    handleInstructionChange(index, "mediaFile", e.target.files[0])
                                }
                                className="p-2 border border-gray-300 rounded"
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveInstruction(index)}
                                className="text-red-500 font-bold"
                            >
                                X
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddInstruction}
                        className="mt-2 text-blue-500 font-bold"
                    >
                        + Add Instruction
                    </button>

                    {/* Tags, Visibility, and Submit */}
                    <div className="flex justify-between items-center mt-6">
                        <input
                            type="text"
                            placeholder="Tags"
                            value={recipeForm.tags}
                            onChange={(e) => setRecipeForm({ ...recipeForm, tags: e.target.value })}
                            className="p-2 border border-gray-300 rounded"
                        />
                        <select
                            value={recipeForm.visibility}
                            onChange={(e) =>
                                setRecipeForm({ ...recipeForm, visibility: e.target.value })
                            }
                            className="p-2 border border-gray-300 rounded"
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                            <option value="friends-only">Friends Only</option>
                        </select>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
                            onClick={onClose} // Close the popup
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                        >
                            Post Recipe
                        </button>
                    </div>
                </form>
            </div>

            {/* ImageUploader Modal */}
            {showImageUploader && (
                <ImageUploader
                    maxImages={10}
                    onSave={handleSaveImages}
                    onClose={() => setShowImageUploader(false)}
                />
            )}
        </div>
    );
};

export default ForumPopup;
