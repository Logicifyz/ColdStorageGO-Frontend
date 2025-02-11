import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DisplayForumRecipe = () => {
    const { recipeId } = useParams();
    console.log("?? Extracted recipeId from URL:", recipeId);

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!recipeId || recipeId === "undefined") {
            console.error("?? Recipe ID is missing.");
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
                console.log("? Fetched Recipe Data:", data);
                setRecipe(data);
            } catch (err) {
                console.error("? Failed to fetch recipe details:", err);
                setError("Failed to load recipe.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [recipeId]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!recipe) return <p>No recipe found.</p>;

    return (
        <div className="p-6 bg-[#383838] text-white min-h-screen">
            <h1 className="text-3xl font-bold text-center mb-4">{recipe?.name}</h1>
            <p className="text-gray-300 text-center">{recipe?.description}</p>

            {/* ? Display Cover Image */}
            {recipe?.coverImages?.length > 0 && (
                <div className="flex justify-center my-6">
                    <img
                        src={`data:image/jpeg;base64,${recipe.coverImages[0]}`}
                        alt="Recipe Cover"
                        className="w-80 h-80 object-cover rounded-lg shadow-lg"
                    />
                </div>
            )}

            {/* ? Recipe Metadata */}
            <div className="text-center text-gray-400">
                <p><strong>Time Taken:</strong> {recipe?.timeTaken} mins</p>
                <p><strong>Visibility:</strong> {recipe?.visibility}</p>
                <p><strong>Tags:</strong> {recipe?.tags || "No tags provided"}</p>
                <p><strong>Votes:</strong> ?? {recipe?.upvotes || 0} | ?? {recipe?.downvotes || 0}</p>
            </div>

            {/* ? Ingredients Section */}
            <h2 className="text-xl font-semibold mt-6">Ingredients</h2>
            <ul className="list-disc pl-6 text-gray-300">
                {recipe?.ingredients?.length > 0 ? (
                    recipe.ingredients.map((ingredient, index) => (
                        <li key={index}>
                            {`${ingredient.quantity} ${ingredient.unit} - ${ingredient.name}`}
                        </li>
                    ))
                ) : (
                    <p>No ingredients listed.</p>
                )}
            </ul>

            {/* ? Instructions Section */}
            <h2 className="text-xl font-semibold mt-6">Instructions</h2>
            <ol className="list-decimal pl-6 text-gray-300">
                {recipe?.instructions?.length > 0 ? (
                    recipe.instructions.map((step, index) => (
                        <li key={index}>{step.step}</li>
                    ))
                ) : (
                    <p>No instructions provided.</p>
                )}
            </ol>
        </div>
    );
};

export default DisplayForumRecipe;
