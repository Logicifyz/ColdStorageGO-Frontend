import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DisplayFullAIRecipe = () => {
    const { id } = useParams(); // Get AI recipe ID from URL
    const [recipe, setRecipe] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`http://localhost:5135/api/AIRecommendations/GetRecipe/${id}`, {
                    method: "GET",
                    credentials: "include", // Ensures session authentication
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch AI-generated recipe.");
                }

                const data = await response.json();
                setRecipe(data);

                if (data.images && data.images.length > 0) {
                    setImagePreview(`data:image/png;base64,${data.images[0]}`); // Use first image
                }

            } catch (error) {
                console.error("Error fetching AI recipe:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const handleSaveToggle = async () => {
        const endpoint = isSaved
            ? "http://localhost:5135/api/AIRecommendations/UnsaveRecipe"
            : "http://localhost:5135/api/AIRecommendations/SaveRecipe";

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(id),
            });

            if (!response.ok) {
                throw new Error("Failed to update save status.");
            }

            setIsSaved(!isSaved); // ? Toggle save state
        } catch (error) {
            console.error("Error updating save status:", error);
        }
    };

    // ? Handle Image Selection
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // ? Handle Image Upload
    const handleUpload = async () => {
        if (!image) {
            alert("Please select an image before uploading.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("dishId", id);
        formData.append("imageFile", image);

        try {
            const response = await fetch("http://localhost:5135/api/AIRecommendations/UploadRecipeImage", {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload image.");
            }

            alert("Image uploaded successfully!");
            const reader = new FileReader();
            reader.readAsDataURL(image);
            reader.onloadend = () => {
                setImagePreview(reader.result); // ? Update image preview without reloading
            };
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("An error occurred while uploading the image.");
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-8 text-[#355E3B]">Loading recipe details...</p>;
    }

    if (!recipe) {
        return <p className="text-center mt-8 text-red-500">Recipe not found.</p>;
    }

    return (
        <div className="min-h-screen p-8 bg-[#f0f0e0] text-[#355E3B]">
            {/* ? Recipe Title & Description */}
            <h1 className="text-4xl font-bold text-center mb-4">{recipe.title}</h1>
            <p className="text-lg text-center mb-6">{recipe.description}</p>

            {/* ? Recipe Info Section */}
            <div className="max-w-4xl mx-auto bg-[#e0e0d0] p-6 rounded-lg shadow-lg border border-[#355E3B]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* ? Left Side: Recipe Image or Upload */}
                    <div className="flex flex-col items-center">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Uploaded Recipe"
                                className="w-full h-64 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-64 bg-[#f0f0e0] flex items-center justify-center rounded-lg border border-[#355E3B]">
                                <span className="text-[#355E3B]">No Image Uploaded</span>
                            </div>
                        )}

                        {/* ? Image Upload Button */}
                        <label className="mt-4 bg-[#355E3B] px-4 py-2 rounded-lg text-white hover:bg-[#204037] cursor-pointer transition-colors duration-200">
                            {uploading ? "Uploading..." : "+ Add Photo"}
                            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>

                        {/* ? Upload Button */}
                        {image && (
                            <button
                                onClick={handleUpload}
                                className="mt-2 bg-[#355E3B] px-4 py-2 rounded-lg text-white hover:bg-[#204037] transition-colors duration-200"
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Upload Image"}
                            </button>
                        )}
                    </div>

                    {/* ? Right Side: Recipe Details */}
                    <div className="flex flex-col justify-center">
                        {/* ? User's Original Prompt */}
                        <div className="bg-[#f0f0e0] p-4 rounded-lg mb-4 border border-[#355E3B]">
                            <h3 className="text-lg font-semibold">Prompt</h3>
                            <p className="mt-2 italic">"{recipe.userPrompt}"</p>
                        </div>

                        {/* ? Recipe Meta Info with Icons */}
                        <div className="flex justify-center gap-12 mt-6">
                            {/* Servings */}
                            <div className="flex flex-col items-center">
                                <img src="/Icons/servings-icon.png" alt="Serving Size" className="w-8 h-8" />
                                <span className="text-lg font-semibold mt-2">Serves</span>
                                <p className="text-xl">{recipe.servings || "N/A"}</p>
                            </div>

                            {/* Cooking Time */}
                            <div className="flex flex-col items-center">
                                <img src="/Icons/cookingtime-icon.png" alt="Cooking Time" className="w-8 h-8" />
                                <span className="text-lg font-semibold mt-2">Cooking Time</span>
                                <p className="text-xl">{recipe.cookingTime || "N/A"} mins</p>
                            </div>

                            {/* Difficulty */}
                            <div className="flex flex-col items-center">
                                <img src="/Icons/spatula-icon.png" alt="Difficulty" className="w-8 h-8" />
                                <span className="text-lg font-semibold mt-2">Difficulty</span>
                                <p className="text-xl">{recipe.difficulty || "N/A"}</p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ? Save Recipe Button */}
                <div className="text-center mt-6">
                    <button
                        onClick={handleSaveToggle}
                        className={`px-6 py-2 rounded-lg text-white ${isSaved ? "bg-red-500 hover:bg-red-600" : "bg-[#355E3B] hover:bg-[#204037]"
                            } transition-colors duration-200`}
                    >
                        {isSaved ? "Unsave Recipe" : "Save This Recipe"}
                    </button>
                </div>
            </div>

            {/* ? Ingredients & Steps Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
                {/* ? Ingredients List */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Ingredients:</h2>
                    <ul className="list-disc ml-6 space-y-2">
                        {recipe.ingredients && recipe.ingredients.length > 0 ? (
                            recipe.ingredients.map((item, index) => <li key={index}>{item}</li>)
                        ) : (
                            <li>No ingredients available</li>
                        )}
                    </ul>
                </div>

                {/* ? Steps List */}
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Steps:</h2>
                    <ol className="list-decimal ml-6 space-y-4">
                        {recipe.steps && recipe.steps.length > 0 ? (
                            recipe.steps.map((step, index) => (
                                <li key={index} className="bg-[#e0e0d0] p-4 rounded-lg border border-[#355E3B]">
                                    {step}
                                </li>
                            ))
                        ) : (
                            <li>No steps provided</li>
                        )}
                    </ol>
                </div>
            </div>

            {/* ? Nutrition Facts Section */}
            <div className="max-w-3xl mx-auto bg-[#e0e0d0] p-6 rounded-lg shadow-lg text-center mt-10 border border-[#355E3B]">
                <h2 className="text-2xl font-semibold mb-4">Nutrition Facts:</h2>
                <div className="flex justify-around text-lg">
                    <p>Calories: <span>{recipe.nutrition?.calories ?? "N/A"} kcal</span></p>
                    <p>Protein: <span>{recipe.nutrition?.protein ?? "N/A"} g</span></p>
                    <p>Carbs: <span>{recipe.nutrition?.carbs ?? "N/A"} g</span></p>
                    <p>Fats: <span>{recipe.nutrition?.fats ?? "N/A"} g</span></p>
                </div>
            </div>
        </div>
    );
};

export default DisplayFullAIRecipe;