import React, { useState } from "react";

const CheffieAI = () => {
    const [advancedControlsVisible, setAdvancedControlsVisible] = useState(false);
    const [formData, setFormData] = useState({
        freeText: "",
        ingredientsInclude: "",
        ingredientsExclude: "",
        maxIngredients: "Any",
        dietaryPreferences: [],
        cuisine: "",
        cookingTime: "",
    });
    const [recipeResponse, setRecipeResponse] = useState(null); // State for recipe response
    const [loading, setLoading] = useState(false); // State for loading

    const handleToggleAdvancedControls = () => {
        setAdvancedControlsVisible(!advancedControlsVisible);
    };

    const handleInputChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleCheckboxChange = (preference) => {
        const updatedPreferences = formData.dietaryPreferences.includes(preference)
            ? formData.dietaryPreferences.filter((item) => item !== preference)
            : [...formData.dietaryPreferences, preference];

        setFormData({ ...formData, dietaryPreferences: updatedPreferences });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading
        setRecipeResponse(null); // Clear previous response
        try {
            const response = await fetch("http://localhost:5135/api/AIRecommendations/Recommend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    freeText: formData.freeText,
                    ingredientsInclude: formData.ingredientsInclude.split(",").map((i) => i.trim()),
                    ingredientsExclude: formData.ingredientsExclude.split(",").map((i) => i.trim()),
                    maxIngredients: formData.maxIngredients === "Any" ? null : parseInt(formData.maxIngredients),
                    dietaryPreferences: formData.dietaryPreferences,
                    cuisine: formData.cuisine,
                    cookingTime: formData.cookingTime,
                }),
            });

            const result = await response.json();
            console.log("Response from API:", result);

            if (
                result.recommendation.toLowerCase().includes("let me know") ||
                result.recommendation.toLowerCase().includes("more details")
            ) {
                alert(result.recommendation); // Show clarifying question as an alert
            } else {
                setRecipeResponse(result); // Set the full recipe to display at the bottom
            }
        } catch (error) {
            console.error("Error fetching AI recommendation:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <div className="min-h-screen p-8 bg-gray-900 text-gray-200">
            <h1 className="text-3xl font-semibold text-center mb-8">Generate a New Recipe</h1>
            <form
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg text-gray-300"
            >
                <div className="mb-6">
                    <label className="block mb-2 text-gray-400">Idea or Ingredients</label>
                    <input
                        type="text"
                        placeholder="Enter a brief idea or leftover ingredients..."
                        value={formData.freeText}
                        onChange={(e) => handleInputChange("freeText", e.target.value)}
                        className="w-full p-3 border border-gray-700 rounded bg-gray-700 focus:outline-none focus:ring focus:ring-purple-500"
                    />
                </div>

                <button
                    type="button"
                    onClick={handleToggleAdvancedControls}
                    className="text-sm text-purple-400 hover:underline mb-6"
                >
                    {advancedControlsVisible ? "Hide Advanced Controls" : "Show Advanced Controls"}
                </button>

                {advancedControlsVisible && (
                    <div className="space-y-6">
                        <div>
                            <label className="block mb-2 text-gray-400">Custom Ingredients (optional)</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Ingredients to Include (comma-separated)"
                                    value={formData.ingredientsInclude}
                                    onChange={(e) => handleInputChange("ingredientsInclude", e.target.value)}
                                    className="w-1/2 p-3 border border-gray-700 rounded bg-gray-700 focus:outline-none focus:ring focus:ring-purple-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Ingredients to Exclude (comma-separated)"
                                    value={formData.ingredientsExclude}
                                    onChange={(e) => handleInputChange("ingredientsExclude", e.target.value)}
                                    className="w-1/2 p-3 border border-gray-700 rounded bg-gray-700 focus:outline-none focus:ring focus:ring-purple-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-400">Max Ingredients</label>
                            <select
                                value={formData.maxIngredients}
                                onChange={(e) => handleInputChange("maxIngredients", e.target.value)}
                                className="w-full p-3 border border-gray-700 rounded bg-gray-700 focus:outline-none focus:ring focus:ring-purple-500"
                            >
                                <option value="Any">Any</option>
                                {[...Array(10).keys()].map((i) => (
                                    <option key={i + 1} value={i + 1}>
                                        {i + 1}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-400">Dietary Preferences</label>
                            <div className="flex flex-wrap gap-4">
                                {["Vegan", "Vegetarian", "Gluten-Free", "Keto", "Dairy-Free", "Nut-Free"].map(
                                    (preference) => (
                                        <label key={preference} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.dietaryPreferences.includes(preference)}
                                                onChange={() => handleCheckboxChange(preference)}
                                                className="h-4 w-4 text-purple-500 border-gray-700 rounded"
                                            />
                                            <span>{preference}</span>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-400">Preferred Cuisine</label>
                            <input
                                type="text"
                                placeholder="Preferred cuisine (e.g., Italian, Mexican)"
                                value={formData.cuisine}
                                onChange={(e) => handleInputChange("cuisine", e.target.value)}
                                className="w-full p-3 border border-gray-700 rounded bg-gray-700 focus:outline-none focus:ring focus:ring-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-gray-400">Cooking Time (optional)</label>
                            <input
                                type="text"
                                placeholder="Cooking time limit (e.g., 30 minutes)"
                                value={formData.cookingTime}
                                onChange={(e) => handleInputChange("cookingTime", e.target.value)}
                                className="w-full p-3 border border-gray-700 rounded bg-gray-700 focus:outline-none focus:ring focus:ring-purple-500"
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-purple-600 text-white p-3 rounded-lg mt-6 hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-500"
                    disabled={loading} // Disable button during loading
                >
                    {loading ? "Generating..." : "Generate"}
                </button>
            </form>

            {loading && <p className="text-center mt-4 text-gray-400">Fetching your recipe... Please wait.</p>}

            {recipeResponse && (
                <div className="mt-8 p-6 bg-gray-800 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-center text-purple-400">{recipeResponse.recommendation}</h2>
                    <p className="text-center text-gray-300">Generated by Cheffie AI</p>
                </div>
            )}
        </div>
    );
};

export default CheffieAI;
