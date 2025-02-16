import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaClock, FaTags, FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import CommentsSection from "../components/CommentsSection";

const DisplayForumRecipe = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log("?? [DEBUG] useParams() returned recipeId:", recipeId);

        if (!recipeId || recipeId === "undefined") {
            console.error("? [ERROR] Invalid Recipe ID detected.");
            setError("Invalid Recipe ID.");
            setLoading(false);
            return;
        }

        const fetchRecipe = async () => {
            console.log("?? [FETCHING] Attempting to fetch recipe with ID:", recipeId);
            try {
                const response = await fetch(`http://localhost:5135/api/Recipes/${recipeId}`);

                if (!response.ok) {
                    throw new Error(`? [API ERROR] Failed to fetch recipe: ${response.status}`);
                }

                const data = await response.json();
                console.log("? [API RESPONSE] Fetched Recipe Data:", data);
                setRecipe(data);
            } catch (err) {
                console.error("? [FETCH ERROR] Failed to load recipe:", err);
                setError("Failed to load recipe.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    if (loading) {
        console.log("? [LOADING] Displaying loading message...");
        return <p className="text-center text-gray-300 text-xl">Loading...</p>;
    }

    if (error) {
        console.error("? [ERROR] Displaying error message:", error);
        return <p className="text-center text-red-500 text-xl">{error}</p>;
    }

    if (!recipe) {
        console.warn("?? [WARNING] Recipe not found.");
        return <p className="text-center text-gray-400 text-xl">Recipe not found.</p>;
    }

    console.log("?? [DEBUG] Rendering Recipe:", recipe);

    return (
        <div className="p-6 bg-[#1e1e1e] text-white min-h-screen">
            {/* Recipe Title */}
            <h1 className="text-5xl font-bold text-center mb-4 text-[#ff6b6b]">{recipe.name}</h1>
            <p className="text-center text-gray-400 text-lg mb-8">{recipe.description}</p>

            {/* Recipe Cover Image */}
            <div className="flex justify-center my-8">
                {recipe.coverImages && recipe.coverImages.length > 0 ? (
                    <img
                        src={`data:image/jpeg;base64,${recipe.coverImages[0]}`}
                        alt="Recipe Cover"
                        className="w-full max-w-2xl h-[400px] object-cover rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="w-full max-w-2xl h-[400px] bg-gray-700 rounded-lg flex items-center justify-center">
                        <p className="text-gray-400 text-xl">No Image Available</p>
                    </div>
                )}
            </div>

            {/* Recipe Metadata */}
            <div className="flex justify-center space-x-12 text-gray-400 my-8 border-b border-gray-600 pb-6">
                <div className="flex items-center space-x-2">
                    <FaClock className="text-[#ff6b6b]" />
                    <p><strong>Time Taken:</strong> {recipe.timeTaken} mins</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaTags className="text-[#ff6b6b]" />
                    <p><strong>Tags:</strong> {recipe.tags || "No tags"}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaThumbsUp className="text-[#ff6b6b]" />
                    <p><strong>Upvotes:</strong> {recipe.upvotes || 0}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaThumbsDown className="text-[#ff6b6b]" />
                    <p><strong>Downvotes:</strong> {recipe.downvotes || 0}</p>
                </div>
            </div>

            {/* Ingredients Section */}
            <div className="mt-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-[#ff6b6b]">Ingredients</h2>
                {recipe.ingredients && Array.isArray(recipe.ingredients) ? (
                    recipe.ingredients.length > 0 ? (
                        <ul className="list-disc pl-8 text-gray-300 space-y-3">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="text-lg">
                                    {`${ingredient.quantity} ${ingredient.unit} - ${ingredient.name}`}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-lg">No ingredients listed.</p>
                    )
                ) : (
                    <p className="text-red-400">?? Ingredients data is not an array!</p>
                )}
            </div>

            {/* Instructions Section */}
            <div className="mt-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-[#ff6b6b]">Instructions</h2>
                {recipe.instructions && Array.isArray(recipe.instructions) ? (
                    recipe.instructions.length > 0 ? (
                        <ol className="list-decimal pl-8 text-gray-300 space-y-6">
                            {recipe.instructions.map((step, index) => (
                                <li key={index} className="text-lg">
                                    <p>{step.step}</p>
                                    {step.stepImage && step.stepImage !== "" && (
                                        <div className="mt-4">
                                            <img
                                                src={`data:image/jpeg;base64,${step.stepImage}`}
                                                alt={`Step ${step.stepNumber}`}
                                                className="w-full h-96 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-gray-400 text-lg">No instructions provided.</p>
                    )
                ) : (
                    <p className="text-red-400">?? Instructions data is not an array!</p>
                )}
            </div>

            {/* ? Comments Section */}
            <div className="mt-10 max-w-2xl mx-auto">
                <CommentsSection postId={recipeId} postType="recipe" />
            </div>
        </div>
    );
};

export default DisplayForumRecipe;
