import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaClock, FaTags } from "react-icons/fa";
import CommentsSection from "../components/CommentsSection";
import VoteButton from "../components/VoteButton";

const DisplayForumRecipe = () => {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchRecipe = async () => {
        console.log("?? [FETCHING] Attempting to fetch recipe with ID:", recipeId);
        try {
            const response = await fetch(`http://localhost:5135/api/Recipes/${recipeId}`, {
                credentials: "include", // Include session cookies
            });
            if (!response.ok) throw new Error(`? [API ERROR] Failed to fetch recipe: ${response.status}`);

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

    useEffect(() => {
        if (!recipeId || recipeId === "undefined") {
            console.error("? [ERROR] Invalid Recipe ID detected.");
            setError("Invalid Recipe ID.");
            setLoading(false);
            return;
        }
        fetchRecipe();
    }, [recipeId]);

    const handleVoteUpdate = (updatedData) => {
        console.log("?? [DEBUG] Updating Recipe Vote Data:", updatedData);
        setRecipe((prevRecipe) => ({
            ...prevRecipe,
            upvotes: updatedData.upvotes,
            downvotes: updatedData.downvotes,
            voteScore: updatedData.voteScore,
            userVote: updatedData.userVote,
        }));
    };

    if (loading) return <p className="text-center text-[#355E3B] text-xl">Loading...</p>;
    if (error) return <p className="text-center text-red-500 text-xl">{error}</p>;
    if (!recipe) return <p className="text-center text-[#355E3B] text-xl">Recipe not found.</p>;

    return (
        <div className="p-6 bg-[#f0f0e0] min-h-screen">
            {/* Centered Profile Picture, Username & Upvote/Downvote */}
            <div className="flex justify-center items-center space-x-4 mb-6">
                {/* Profile Picture & Username */}
                <div className="flex items-center space-x-2">
                    {recipe.user?.profilePicture ? (
                        <img
                            src={`data:image/jpeg;base64,${recipe.user.profilePicture}`}
                            alt={`${recipe.user?.username || "User"}'s profile`}
                            className="w-10 h-10 rounded-full object-cover cursor-pointer"
                            onClick={() => recipe.user?.username && navigate(`/profile/${recipe.user.username}`)}
                        />
                    ) : (
                        <div
                            className="w-10 h-10 rounded-full bg-[#204037] cursor-pointer"
                            onClick={() => recipe.user?.username && navigate(`/profile/${recipe.user.username}`)}
                        ></div>
                    )}
                    <span
                        className="text-[#123524] font-semibold cursor-pointer hover:underline"
                        onClick={() => recipe.user?.username && navigate(`/profile/${recipe.user.username}`)}
                    >
                        {recipe.user?.username ? recipe.user.username : "Deleted User"}
                    </span>
                </div>

                {/* Upvote/Downvote Button (Now Centered with Profile) */}
                <VoteButton
                    id={recipe.recipeId}
                    upvotes={recipe.upvotes}
                    downvotes={recipe.downvotes}
                    userVote={recipe.userVote}
                    type="recipe"
                    onVoteUpdate={handleVoteUpdate}
                />
            </div>



            {/* Recipe Title and Description */}
            <div className="text-center mb-8">
                <h1 className="text-5xl font-bold text-[#355E3B] mb-4">{recipe.name}</h1>
                <p className="text-[#355E3B] text-lg">{recipe.description}</p>
            </div>

            {/* Recipe Cover Image */}
            <div className="flex justify-center mb-8">
                {recipe.coverImages && recipe.coverImages.length > 0 ? (
                    <img
                        src={`data:image/jpeg;base64,${recipe.coverImages[0]}`}
                        alt="Recipe Cover"
                        className="w-full max-w-2xl h-[300px] object-cover rounded-lg shadow-2xl transition-transform duration-300 hover:scale-105"
                    />
                ) : (
                    <div className="w-full max-w-2xl h-[300px] bg-[#e0e0d0] rounded-lg flex items-center justify-center">
                        <p className="text-[#355E3B] text-xl">No Image Available</p>
                    </div>
                )}
            </div>

            {/* Recipe Metadata (MealKit Used, Time, Tags) */}
            <div className="flex justify-center space-x-12 text-[#355E3B] mb-8 border-b border-[#355E3B] pb-6">
                {/* MealKit Used */}
                {recipe.dishName && (
                    <div className="flex items-center space-x-2">
                        <p><strong>MealKit Used:</strong> {recipe.dishName}</p>
                    </div>
                )}

                {/* Time Taken */}
                <div className="flex items-center space-x-2">
                    <FaClock className="text-[#355E3B]" />
                    <p><strong>Time Taken:</strong> {recipe.timeTaken} mins</p>
                </div>

                {/* Tags */}
                <div className="flex items-center space-x-2">
                    <FaTags className="text-[#355E3B]" />
                    <p><strong>Tags:</strong> {recipe.tags || "No tags"}</p>
                </div>
            </div>

            {/* Ingredients and Instructions Side-by-Side */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Ingredients Section */}
                <div>
                    <h2 className="text-3xl font-semibold mb-6 text-[#355E3B]">Ingredients</h2>
                    {recipe.ingredients?.length > 0 ? (
                        <ul className="list-disc pl-8 text-[#355E3B] space-y-3">
                            {recipe.ingredients.map((ingredient, index) => (
                                <li key={index} className="text-lg">
                                    {`${ingredient.quantity} ${ingredient.unit} - ${ingredient.name}`}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[#355E3B] text-lg">No ingredients listed.</p>
                    )}
                </div>

                {/* Instructions Section */}
                <div>
                    <h2 className="text-3xl font-semibold mb-6 text-[#355E3B]">Instructions</h2>
                    {recipe.instructions?.length > 0 ? (
                        <ol className="list-decimal pl-8 text-[#355E3B] space-y-6">
                            {recipe.instructions.map((step, index) => (
                                <li key={index} className="text-lg">
                                    <p>{step.step}</p>
                                    {step.stepImage && step.stepImage !== "" && (
                                        <div className="mt-4">
                                            <img
                                                src={`data:image/jpeg;base64,${step.stepImage}`}
                                                alt={`Step ${step.stepNumber}`}
                                                className="w-full h-48 object-cover rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                                            />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-[#355E3B] text-lg">No instructions provided.</p>
                    )}
                </div>
            </div>

            {/* Comments Section */}
            <div className="mt-10 max-w-2xl mx-auto">
                <CommentsSection postId={recipeId} postType="recipe" />
            </div>
        </div>
    );
};

export default DisplayForumRecipe;