import React, { useState, useEffect } from "react";
import ImageUploader from "../components/ImageUploader";
import Select from "react-select";

const CreateRecipe = () => {
    const [dishes, setDishes] = useState([]);
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

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch("http://localhost:5135/api/Auth/check-session", {
                    method: "GET",
                    credentials: "include",
                });

                const data = await response.json();
                if (data.sessionValid) {
                    setRecipeForm((prev) => ({ ...prev, userId: data.userId }));
                }
            } catch (error) {
                console.error("Error fetching user session:", error);
            }
        };

        const fetchDishes = async () => {
            try {
                const response = await fetch("http://localhost:5135/api/Dish");
                if (!response.ok) throw new Error("Failed to fetch dishes");
                const data = await response.json();
                setDishes(data.map(dish => ({ value: dish.dishId, label: dish.name })));
            } catch (error) {
                console.error("Error fetching dishes:", error);
            }
        };

        fetchUser();
        fetchDishes();
    }, []);

    const handleMealKitChange = (selectedOption) => {
        console.log("🔹 Selected Dish:", selectedOption); // Log selected dish
        setRecipeForm({ ...recipeForm, dishId: selectedOption ? selectedOption.value : "" });
    };

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

        // 🔹 Ensure User ID is Available
        if (!recipeForm.userId) {
            alert("You must be logged in to create a recipe.");
            return;
        }

        if (!recipeForm.dishId) {
            alert("You must select a MealKit (Dish).");
            return;
        }

        const formattedIngredients = recipeForm.ingredients.map(ing => ({
            quantity: ing.quantity.trim() || "N/A",  // ? Ensure No Empty Values
            unit: ing.unit.trim() || "N/A",
            name: ing.name.trim() || "Unnamed Ingredient"
        }));

        const formattedInstructions = recipeForm.instructions.map((instr, index) => ({
            stepNumber: index + 1,
            step: instr.step.trim() || "Step details missing"  // ? Ensure Step is Always Assigned
        }));

        // 🔹 Create FormData to Handle Images & Recipe Data
        const formData = new FormData();
        formData.append("userId", recipeForm.userId);
        formData.append("dishId", recipeForm.dishId);
        formData.append("name", recipeForm.name);
        formData.append("description", recipeForm.description);
        formData.append("timeTaken", recipeForm.timeTaken);
        formData.append("tags", recipeForm.tags);
        formData.append("visibility", recipeForm.visibility);
        formData.append("ingredients", JSON.stringify(formattedIngredients));
        formData.append("instructions", JSON.stringify(formattedInstructions));

        // 🔹 Append Cover Images
        coverImages.forEach((file) => formData.append("coverImages", file));

        // 🔹 Append Instruction Images
        Object.keys(instructionImages).forEach((index) => {
            formData.append("instructionImages", instructionImages[index]);
        });

        try {
            const response = await fetch("http://localhost:5135/api/Recipes", {
                method: "POST",
                credentials: "include",
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
        <div className="p-8 bg-[#f0f0e0] min-h-screen text-[#355E3B]">
            <h1 className="text-3xl font-bold text-center mb-8">Create Recipe</h1>
            <form onSubmit={handleSubmit} className="bg-[#e0e0d0] p-8 rounded-lg shadow-lg max-w-5xl mx-auto">
                {/* Image Uploader */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => setShowImageUploader(true)}
                        className="w-full p-4 border-2 border-dashed border-[#355E3B] text-[#355E3B] rounded-md hover:bg-[#d0d0c0]"
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
                    <Select
                        options={dishes}
                        isSearchable
                        placeholder="Select a MealKit..."
                        onChange={handleMealKitChange}
                        className="text-[#355E3B]"
                        styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: "#e0e0d0", // ✅ Match form background
                                borderColor: "#355E3B", // ✅ Match form border
                                color: "#355E3B", // ✅ Match text color
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: "#e0e0d0", // ✅ Match dropdown menu background
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: "#355E3B", // ✅ Match selected text color
                            }),
                            option: (base, { isSelected }) => ({
                                ...base,
                                backgroundColor: isSelected ? "#d0d0c0" : "#e0e0d0", // ✅ Slightly darker for selected
                                color: "#355E3B",
                                "&:hover": { backgroundColor: "#d0d0c0" }, // ✅ Match hover color
                            }),
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Recipe Title"
                        value={recipeForm.name}
                        onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })}
                        className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
                        required
                    />
                    <textarea
                        placeholder="Overview of Recipe"
                        value={recipeForm.description}
                        onChange={(e) => setRecipeForm({ ...recipeForm, description: e.target.value })}
                        className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
                        rows="4"
                        required
                    ></textarea>
                    <input
                        type="number"
                        placeholder="Time Taken (in minutes)"
                        value={recipeForm.timeTaken}
                        onChange={(e) => setRecipeForm({ ...recipeForm, timeTaken: e.target.value })}
                        className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
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
                            className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
                        />
                        <input
                            type="text"
                            placeholder="Unit"
                            value={ingredient.unit}
                            onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                            className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
                        />
                        <input
                            type="text"
                            placeholder="Ingredient"
                            value={ingredient.name}
                            onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                            className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
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
                    className="text-[#355E3B] font-semibold mb-6"
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
                            className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
                            rows="2"
                        ></textarea>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleInstructionImageUpload(index, e.target.files[0])}
                            className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
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
                    className="text-[#355E3B] font-semibold mb-6"
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
                        className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
                        required
                    />
                    <select
                        value={recipeForm.visibility}
                        onChange={(e) =>
                            setRecipeForm({ ...recipeForm, visibility: e.target.value })
                        }
                        className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
                    >
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    <button
                        type="submit"
                        className="px-6 py-3 bg-[#355E3B] text-white font-bold rounded hover:bg-[#204037]"
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