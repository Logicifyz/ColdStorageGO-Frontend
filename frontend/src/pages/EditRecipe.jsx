import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import ImageUploader from "../components/ImageUploader";

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();

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

    const [dishes, setDishes] = useState([]); // ? Store meal kits
    const [coverImages, setCoverImages] = useState([]); // New images
    const [existingImages, setExistingImages] = useState([]); // Previously uploaded images
    const [instructionImages, setInstructionImages] = useState({});
    const [showImageUploader, setShowImageUploader] = useState(false);

    useEffect(() => {
        fetchRecipe();
        fetchDishes();
    }, [id]);

    // ? Fetch the Recipe Data and Populate Fields
    const fetchRecipe = async () => {
        try {
            const response = await fetch(`http://localhost:5135/api/Recipes/${id}`, {
                method: "GET",
                credentials: "include",
            });

            if (!response.ok) throw new Error("Failed to fetch recipe");

            const data = await response.json();
            console.log("? [DEBUG] Fetched Recipe:", data);

            setRecipeForm({
                userId: data.userId || "",
                dishId: data.dishId || "",
                name: data.name || "",
                description: data.description || "",
                timeTaken: data.timeTaken || "",
                ingredients: data.ingredients.length > 0 ? data.ingredients : [{ name: "", quantity: "", unit: "" }],
                instructions: data.instructions.length > 0 ? data.instructions : [{ stepNumber: 1, step: "", mediaUrl: "" }],
                tags: data.tags || "",
                visibility: data.visibility || "public",
            });

            if (data.coverImages && data.coverImages.length > 0) {
                setExistingImages(data.coverImages);
            }
        } catch (error) {
            console.error("? [ERROR] Fetching recipe:", error);
        }
    };

    // ? Fetch Meal Kits for the Dropdown
    const fetchDishes = async () => {
        try {
            const response = await fetch("http://localhost:5135/api/Dish");
            if (!response.ok) throw new Error("Failed to fetch dishes");
            const data = await response.json();
            setDishes(data.map(dish => ({ value: dish.dishId, label: dish.name })));
        } catch (error) {
            console.error("? [ERROR] Fetching dishes:", error);
        }
    };

    // ? Handle Input Changes
    const handleChange = (e) => {
        setRecipeForm({ ...recipeForm, [e.target.name]: e.target.value });
    };

    const handleMealKitChange = (selectedOption) => {
        console.log("?? Selected Dish:", selectedOption);
        setRecipeForm({ ...recipeForm, dishId: selectedOption ? selectedOption.value : "" });
    };

    // ? Handle Cover Image Selection
    const handleSaveImages = (images) => {
        setCoverImages(images);
        setShowImageUploader(false);
    };

    const handleRemoveCoverImage = (index) => {
        const updatedImages = coverImages.filter((_, i) => i !== index);
        setCoverImages(updatedImages);
    };

    // ? Handle Ingredient Changes
    const handleIngredientChange = (index, field, value) => {
        const updatedIngredients = [...recipeForm.ingredients];
        updatedIngredients[index][field] = value;
        setRecipeForm({ ...recipeForm, ingredients: updatedIngredients });
    };

    const handleRemoveIngredient = (index) => {
        setRecipeForm({
            ...recipeForm,
            ingredients: recipeForm.ingredients.filter((_, i) => i !== index),
        });
    };

    const handleAddIngredient = () => {
        setRecipeForm({
            ...recipeForm,
            ingredients: [...recipeForm.ingredients, { name: "", quantity: "", unit: "" }],
        });
    };

    // ? Handle Instructions Changes
    const handleInstructionChange = (index, field, value) => {
        const updatedInstructions = [...recipeForm.instructions];
        updatedInstructions[index][field] = value;
        setRecipeForm({ ...recipeForm, instructions: updatedInstructions });
    };

    const handleRemoveInstruction = (index) => {
        setRecipeForm({
            ...recipeForm,
            instructions: recipeForm.instructions.filter((_, i) => i !== index),
        });
    };

    const handleAddInstruction = () => {
        setRecipeForm({
            ...recipeForm,
            instructions: [...recipeForm.instructions, { stepNumber: recipeForm.instructions.length + 1, step: "", mediaUrl: "" }],
        });
    };

    const handleInstructionImageUpload = (index, file) => {
        setInstructionImages({ ...instructionImages, [index]: file });
    };

    // ? Handle Recipe Update
    const handleUpdate = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("dishId", recipeForm.dishId);
        formData.append("name", recipeForm.name);
        formData.append("description", recipeForm.description);
        formData.append("timeTaken", recipeForm.timeTaken);
        formData.append("tags", recipeForm.tags);
        formData.append("visibility", recipeForm.visibility);
        formData.append("ingredients", JSON.stringify(recipeForm.ingredients));
        formData.append("instructions", JSON.stringify(recipeForm.instructions));

        coverImages.forEach((file) => formData.append("coverImages", file));

        try {
            const response = await fetch(`http://localhost:5135/api/Recipes/${id}`, {
                method: "PUT",
                credentials: "include",
                body: formData,
            });

            if (response.ok) {
                alert("Recipe updated successfully!");
                navigate(`/forum/recipe/${id}`);
            } else {
                console.error("? Failed to update recipe.");
            }
        } catch (error) {
            console.error("? [ERROR] Updating recipe:", error);
        }
    };

    return (
        <div className="p-8 bg-[#f0f0e0] min-h-screen text-[#355E3B]">
            <h1 className="text-3xl font-bold text-center mb-8">Edit Recipe</h1>
            <form onSubmit={handleUpdate} className="bg-[#e0e0d0] p-8 rounded-lg shadow-lg max-w-5xl mx-auto">

                {/* Image Uploader */}
                <div className="mb-8">
                    <button
                        type="button"
                        onClick={() => setShowImageUploader(true)}
                        className="w-full p-4 border-2 border-dashed border-[#355E3B] text-[#355E3B] rounded-md hover:bg-[#d0d0c0]"
                    >
                        {existingImages.length > 0 ? "Edit Uploaded Images" : "Upload Cover Photo"}
                    </button>
                    <div className="grid grid-cols-4 gap-4 mt-4">
                        {existingImages.map((image, index) => (
                            <img key={index} src={`data:image/jpeg;base64,${image}`} alt={`Cover ${index}`} className="w-full h-24 object-cover rounded-md" />
                        ))}
                    </div>
                </div>

                {/* Recipe Form Fields */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <Select
                        options={dishes}
                        isSearchable
                        placeholder="Select a MealKit..."
                        onChange={handleMealKitChange}
                        styles={{
                            control: (base) => ({
                                ...base,
                                backgroundColor: "#e0e0d0",
                                borderColor: "#355E3B",
                                color: "#355E3B",
                            }),
                            menu: (base) => ({
                                ...base,
                                backgroundColor: "#e0e0d0",
                            }),
                            singleValue: (base) => ({
                                ...base,
                                color: "#355E3B",
                            }),
                            option: (base, { isSelected }) => ({
                                ...base,
                                backgroundColor: isSelected ? "#d0d0c0" : "#e0e0d0",
                                color: "#355E3B",
                                "&:hover": { backgroundColor: "#d0d0c0" },
                            }),
                        }}
                    />
                    <input
                        type="text"
                        name="name"
                        value={recipeForm.name}
                        onChange={handleChange}
                        placeholder="Recipe Title"
                        className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
                        required
                    />
                    <textarea
                        name="description"
                        value={recipeForm.description}
                        onChange={handleChange}
                        placeholder="Overview of Recipe"
                        className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
                        rows="4"
                        required
                    ></textarea>
                    <input
                        type="number"
                        name="timeTaken"
                        value={recipeForm.timeTaken}
                        onChange={handleChange}
                        placeholder="Time Taken (mins)"
                        className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]"
                    />
                </div>

                {/* Ingredients Section */}
                <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                {recipeForm.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-4 items-center mb-4">
                        <input type="text" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)} className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]" />
                        <input type="text" placeholder="Unit" value={ingredient.unit} onChange={(e) => handleIngredientChange(index, "unit", e.target.value)} className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]" />
                        <input type="text" placeholder="Ingredient" value={ingredient.name} onChange={(e) => handleIngredientChange(index, "name", e.target.value)} className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]" />
                        <button type="button" onClick={() => handleRemoveIngredient(index)} className="text-red-500 font-bold">X</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddIngredient} className="text-[#355E3B] font-semibold mb-6">+ Add Ingredient</button>

                {/* Instructions Section */}
                <h3 className="text-xl font-semibold mb-4">Instructions</h3>
                {recipeForm.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-4 items-center mb-4">
                        <textarea placeholder="Instruction Step" value={instruction.step} onChange={(e) => handleInstructionChange(index, "step", e.target.value)} className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]" rows="2"></textarea>
                        <input type="file" accept="image/*" onChange={(e) => handleInstructionImageUpload(index, e.target.files[0])} className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]" />
                        <button type="button" onClick={() => handleRemoveInstruction(index)} className="text-red-500 font-bold">X</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddInstruction} className="text-[#355E3B] font-semibold mb-6">+ Add Instruction</button>

                {/* Tags, Visibility, and Submit */}
                <div className="flex justify-between items-center mt-8">
                    <input type="text" placeholder="Tags" value={recipeForm.tags} onChange={(e) => setRecipeForm({ ...recipeForm, tags: e.target.value })} className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]" required />
                    <select value={recipeForm.visibility} onChange={(e) => setRecipeForm({ ...recipeForm, visibility: e.target.value })} className="p-3 border border-[#355E3B] rounded bg-[#e0e0d0] text-[#355E3B]">
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    <button type="submit" className="px-6 py-3 bg-[#355E3B] text-white font-bold rounded hover:bg-[#204037]">
                        Update Recipe
                    </button>
                </div>
            </form>

            {showImageUploader && <ImageUploader maxImages={10} onSave={handleSaveImages} onClose={() => setShowImageUploader(false)} />}
        </div>
    );


};

export default EditRecipe;
