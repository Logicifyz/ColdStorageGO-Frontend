import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const DisplayForumRecipe = () => {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`http://localhost:5135/api/Recipes/${recipeId}`);
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched Recipe Data:", data); // Log response for debugging
                    setRecipe(data);
                } else {
                    console.error("Failed to fetch recipe details.");
                    alert("Recipe not found!");
                    navigate("/");
                }
            } catch (error) {
                console.error("Error fetching recipe:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecipe();
    }, [recipeId, navigate]);

    if (isLoading) {
        return <p className="text-center text-white">Loading...</p>;
    }

    if (!recipe) {
        return <p className="text-center text-white">Recipe not found.</p>;
    }

    return (
        <div className="p-8 bg-[#2F2F2F] min-h-screen text-white">
            <h1 className="text-3xl font-bold mb-6">{recipe.name}</h1>

            <div className="grid grid-cols-3 gap-6 mb-8">
                {recipe.mediaUrls.map((url, index) => (
                    <img
                        key={index}
                        src={`http://localhost:5135/${url}`}
                        alt={`Recipe Image ${index + 1}`}
                        className="w-full h-auto rounded-md object-cover"
                    />
                ))}
            </div>

            <div className="mb-8">
                <p className="text-gray-300 mb-2">{recipe.description}</p>
                <p><strong>Time Taken:</strong> {recipe.timeTaken} minutes</p>
                <p><strong>Tags:</strong> {recipe.tags || "None"}</p>
            </div>

            <h3 className="text-2xl font-bold mb-4">Ingredients</h3>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
                <ul className="list-disc ml-6 space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-lg">
                            {ingredient.quantity} {ingredient.unit} {ingredient.name}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400">No ingredients available.</p>
            )}

            <h3 className="text-2xl font-bold mt-8 mb-4">Instructions</h3>
            {recipe.instructions && recipe.instructions.length > 0 ? (
                <ol className="list-decimal ml-6 space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                        <li key={index} className="text-lg">
                            {instruction.step || instruction}
                        </li>
                    ))}
                </ol>
            ) : (
                <p className="text-gray-400">No instructions available.</p>
            )}
        </div>
    );
};

export default DisplayForumRecipe;
