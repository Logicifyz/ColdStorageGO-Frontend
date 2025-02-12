import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaClock, FaTags, FaThumbsUp, FaThumbsDown } from "react-icons/fa";

const DisplayForumRecipe = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!recipeId || recipeId === "undefined") {
            setError("Invalid Recipe ID.");
            setLoading(false);
            return;
        }

        const fetchRecipe = async () => {
            try {
                const response = await fetch(`http://localhost:5135/api/Recipes/${recipeId}`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch recipe: ${response.status}`);
                }
                const data = await response.json();
                setRecipe(data);
            } catch (err) {
                setError("Failed to load recipe.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    if (loading) return <p className="text-center text-gray-300 text-xl">Loading...</p>;
    if (error) return <p className="text-center text-red-500 text-xl">{error}</p>;
    if (!recipe) return <p className="text-center text-gray-400 text-xl">Recipe not found.</p>;

    return (
        <div className="p-6 bg-[#1e1e1e] text-white min-h-screen">
            {/* Recipe Title */}
            <h1 className="text-5xl font-bold text-center mb-4 text-[#ff6b6b]">{recipe.Name}</h1>
            <p className="text-center text-gray-400 text-lg mb-8">{recipe.Description}</p>

            {/* Recipe Cover Image */}
            <div className="flex justify-center my-8">
                {recipe.CoverImages && recipe.CoverImages.length > 0 ? (
                    <img
                        src={`data:image/jpeg;base64,${recipe.CoverImages[0]}`}
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
                    <p><strong>Time Taken:</strong> {recipe.TimeTaken} mins</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaTags className="text-[#ff6b6b]" />
                    <p><strong>Tags:</strong> {recipe.Tags}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaThumbsUp className="text-[#ff6b6b]" />
                    <p><strong>Upvotes:</strong> {recipe.Upvotes}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <FaThumbsDown className="text-[#ff6b6b]" />
                    <p><strong>Downvotes:</strong> {recipe.Downvotes}</p>
                </div>
            </div>

            {/* Ingredients Section */}
            <div className="mt-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-[#ff6b6b]">Ingredients</h2>
                <ul className="list-disc pl-8 text-gray-300 space-y-3">
                    {recipe.Ingredients && recipe.Ingredients.length > 0 ? (
                        recipe.Ingredients.map((ingredient) => (
                            <li key={ingredient.IngredientId} className="text-lg">
                                {`${ingredient.Quantity} ${ingredient.Unit} - ${ingredient.Name}`}
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-400 text-lg">No ingredients listed.</p>
                    )}
                </ul>
            </div>

            {/* Instructions Section */}
            <div className="mt-10 max-w-2xl mx-auto">
                <h2 className="text-3xl font-semibold mb-6 text-[#ff6b6b]">Instructions</h2>
                <ol className="list-decimal pl-8 text-gray-300 space-y-6">
                    {recipe.Instructions && recipe.Instructions.length > 0 ? (
                        recipe.Instructions.map((step) => (
                            <li key={step.InstructionId} className="text-lg">
                                <p>{step.Step}</p>
                                {step.StepImage && step.StepImage !== "" && (
                                    <div className="mt-4">
                                        <img
                                            src={`data:image/jpeg;base64,${step.StepImage}`}
                                            alt={`Step ${step.StepNumber}`}
                                            className="w-full h-96 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                                        />
                                    </div>
                                )}
                            </li>
                        ))
                    ) : (
                        <p className="text-gray-400 text-lg">No instructions provided.</p>
                    )}
                </ol>
            </div>
        </div>
    );
};

export default DisplayForumRecipe;