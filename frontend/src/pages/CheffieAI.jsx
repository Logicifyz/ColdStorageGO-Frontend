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
        servings: "",
    });
    const [recipeResponse, setRecipeResponse] = useState(null); // State for recipe response
    const [loading, setLoading] = useState(false); // State for loading
    const [followUpPrompt, setFollowUpPrompt] = useState(null);
    const [redirectMessage, setRedirectMessage] = useState(null); // State for Redirect response

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
        setLoading(true);
        setRecipeResponse(null);
        setFollowUpPrompt(null);
        setRecipeResponse(null);
        setFollowUpPrompt(null);
        setRedirectMessage(null);

        try {
            const requestBody = {
                freeText: formData.freeText,
                ingredientsInclude: formData.ingredientsInclude.split(",").map((i) => i.trim()),
                ingredientsExclude: formData.ingredientsExclude.split(",").map((i) => i.trim()),
                maxIngredients: formData.maxIngredients === "Any" ? null : parseInt(formData.maxIngredients),
                dietaryPreferences: formData.dietaryPreferences,
                cuisine: formData.cuisine,
                cookingTime: formData.cookingTime,
                servings: formData.servings ? parseInt(formData.servings) : null,
            };

            // ? Submit request to backend
            const aiResponse = await fetch("http://localhost:5135/api/AIRecommendations/Recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ? Ensures session authentication
                body: JSON.stringify(requestBody),
            });

            if (!aiResponse.ok) {
                throw new Error("Failed to fetch AI response.");
            }

            const aiResult = await aiResponse.json();
            console.log("AI Response:", aiResult);

            // ? Ensure responseType is present before processing
            if (!aiResult.responseType) {
                console.error("Error: Missing responseType in AI response", aiResult);
                setRedirectMessage("Unexpected response. Please try again.");
                return;
            }

            if (aiResult.responseType === "Recipe") {
                console.log("Fetching latest stored recipe...");

                const recipeResponse = await fetch("http://localhost:5135/api/AIRecommendations/GetLatestRecipe", {
                    method: "GET",
                    credentials: "include", // ? Ensures session authentication
                });

                if (!recipeResponse.ok) {
                    throw new Error("Failed to fetch latest recipe.");
                }

                const finalDish = await recipeResponse.json();
                console.log("Fetched FinalDish from API:", finalDish);

                setRecipeResponse({
                    ...finalDish,
                    dishId: finalDish.dishId, // ? Ensure ID is stored
                    userPrompt: formData.freeText // ? Store User's Original Prompt
                });
            }
            else if (aiResult.responseType === "FollowUp") {
                setFollowUpPrompt(aiResult.message || "Can you refine your request?");
            }
            else if (aiResult.responseType === "Redirect") {
                setRedirectMessage(aiResult.message || "I'm sorry, I can only help with food-related requests.");
            }
            else {
                setRedirectMessage("Unexpected response. Please try again.");
            }

        } catch (error) {
            console.error("Error fetching AI recommendation:", error);
            setRedirectMessage("An error occurred while processing your request.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen p-8 bg-[#f0f0e0] text-[#355E3B]">
            <h1 className="text-3xl font-semibold text-center mb-8">Generate a New Recipe</h1>
            <form
                onSubmit={handleSubmit}
                className="max-w-3xl mx-auto bg-[#e0e0d0] p-8 rounded-lg shadow-lg text-[#355E3B] border border-[#355E3B]"
            >
                <div className="mb-6">
                    <label className="block mb-2">Idea or Ingredients</label>
                    <input
                        type="text"
                        placeholder="Enter a brief idea or leftover ingredients..."
                        value={formData.freeText}
                        onChange={(e) => handleInputChange("freeText", e.target.value)}
                        className="w-full p-3 border border-[#355E3B] rounded bg-[#f0f0e0] focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
                    />
                </div>

                <button
                    type="button"
                    onClick={handleToggleAdvancedControls}
                    className="text-sm text-[#355E3B] hover:text-[#204037] hover:underline mb-6"
                >
                    {advancedControlsVisible ? "Hide Advanced Controls" : "Show Advanced Controls"}
                </button>

                {advancedControlsVisible && (
                    <div className="space-y-6">
                        <div>
                            <label className="block mb-2">Custom Ingredients (optional)</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    placeholder="Ingredients to Include (comma-separated)"
                                    value={formData.ingredientsInclude}
                                    onChange={(e) => handleInputChange("ingredientsInclude", e.target.value)}
                                    className="w-1/2 p-3 border border-[#355E3B] rounded bg-[#f0f0e0] focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
                                />
                                <input
                                    type="text"
                                    placeholder="Ingredients to Exclude (comma-separated)"
                                    value={formData.ingredientsExclude}
                                    onChange={(e) => handleInputChange("ingredientsExclude", e.target.value)}
                                    className="w-1/2 p-3 border border-[#355E3B] rounded bg-[#f0f0e0] focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2">Max Ingredients</label>
                            <select
                                value={formData.maxIngredients}
                                onChange={(e) => handleInputChange("maxIngredients", e.target.value)}
                                className="w-full p-3 border border-[#355E3B] rounded bg-[#f0f0e0] focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
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
                            <label className="block mb-2">Dietary Preferences</label>
                            <div className="flex flex-wrap gap-4">
                                {["Vegan", "Vegetarian", "Gluten-Free", "Keto", "Dairy-Free", "Nut-Free"].map(
                                    (preference) => (
                                        <label key={preference} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.dietaryPreferences.includes(preference)}
                                                onChange={() => handleCheckboxChange(preference)}
                                                className="h-4 w-4 text-[#355E3B] border-[#355E3B] rounded focus:ring-2 focus:ring-[#355E3B]"
                                            />
                                            <span>{preference}</span>
                                        </label>
                                    )
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2">Preferred Cuisine</label>
                            <input
                                type="text"
                                placeholder="Preferred cuisine (e.g., Italian, Mexican)"
                                value={formData.cuisine}
                                onChange={(e) => handleInputChange("cuisine", e.target.value)}
                                className="w-full p-3 border border-[#355E3B] rounded bg-[#f0f0e0] focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Cooking Time (optional)</label>
                            <input
                                type="text"
                                placeholder="Cooking time limit (e.g., 30 minutes)"
                                value={formData.cookingTime}
                                onChange={(e) => handleInputChange("cookingTime", e.target.value)}
                                className="w-full p-3 border border-[#355E3B] rounded bg-[#f0f0e0] focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Servings</label>
                            <input
                                type="number"
                                placeholder="Number of servings"
                                value={formData.servings}
                                onChange={(e) => handleInputChange("servings", e.target.value)}
                                className="w-full p-3 border border-[#355E3B] rounded bg-[#f0f0e0] focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
                            />
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-[#355E3B] text-white p-3 rounded-lg mt-6 hover:bg-[#204037] focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-colors duration-200"
                    disabled={loading} // Disable button during loading
                >
                    {loading ? "Generating..." : "Generate"}
                </button>
            </form>

            {loading && <p className="text-center mt-4 text-[#355E3B]">Fetching your recipe... Please wait.</p>}

            {/* FOLLOWUP RESPONSE UI */}
            {followUpPrompt && (
                <div className="flex justify-center items-center w-full mt-12">
                    <div className="w-full max-w-4xl bg-[#e0e0d0] text-[#355E3B] p-8 rounded-lg shadow-lg text-center border border-[#355E3B]">
                        <h2 className="text-2xl font-bold">Follow-Up Needed</h2>
                        <p className="mt-2">{followUpPrompt}</p>

                        <input
                            type="text"
                            placeholder="Refine your request..."
                            value={formData.freeText}
                            onChange={(e) => handleInputChange("freeText", e.target.value)}
                            className="w-full p-3 border border-[#355E3B] rounded bg-[#f0f0e0] focus:outline-none focus:ring-2 focus:ring-[#355E3B] mt-4"
                        />
                        <button
                            type="submit"
                            className="w-full bg-[#355E3B] text-white p-3 rounded-lg mt-4 hover:bg-[#204037] focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-colors duration-200"
                            onClick={handleSubmit}
                        >
                            Resubmit
                        </button>
                    </div>
                </div>
            )}

            {/* REDIRECT RESPONSE UI */}
            {redirectMessage && (
                <div className="flex justify-center items-center w-full mt-12">
                    <div className="w-full max-w-4xl bg-[#e0e0d0] text-[#355E3B] p-8 rounded-lg shadow-lg text-center border border-[#355E3B]">
                        <h2 className="text-2xl font-bold">Invalid Request</h2>
                        <p className="mt-2">{redirectMessage}</p>
                    </div>
                </div>
            )}

            {/* ? Display structured recipe */}
            {recipeResponse && (
                <div className="flex justify-center items-center w-full mt-12">
                    <div className="w-full max-w-4xl bg-[#e0e0d0] text-[#355E3B] p-8 rounded-lg shadow-lg text-center border border-[#355E3B]">
                        <h2 className="text-3xl font-bold">{recipeResponse.title || "Recipe Title Not Found"}</h2>
                        <p className="text-lg mt-2">{recipeResponse.description || "No description available"}</p>
                        {/* ? View Full Recipe Button */}
                        <div className="mt-6">
                            <a href={`/ai-recipe/${recipeResponse.dishId}`}
                                className="bg-[#355E3B] text-white px-6 py-2 rounded-lg hover:bg-[#204037] transition-colors duration-200">
                                View Full Recipe
                            </a>
                        </div>
                        {/* ? Use Your PNG Icons */}
                        <div className="flex justify-center gap-12 mt-6">
                            <div className="flex flex-col items-center">
                                <img src="/Icons/servings-icon.png" alt="Serving Size" className="w-8 h-8" />
                                <span className="text-lg font-semibold mt-2">Serves</span>
                                <p className="text-xl">{recipeResponse.servings ?? "N/A"}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <img src="/Icons/cookingtime-icon.png" alt="Cooking Time" className="w-8 h-8" />
                                <span className="text-lg font-semibold mt-2">Cooking Time</span>
                                <p className="text-xl">{recipeResponse.cookingTime ?? "N/A"}</p>
                            </div>
                            <div className="flex flex-col items-center">
                                <img src="/Icons/spatula-icon.png" alt="Difficulty" className="w-8 h-8" />
                                <span className="text-lg font-semibold mt-2">Difficulty</span>
                                <p className="text-xl">{recipeResponse.difficulty ?? "N/A"}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-left">
                            <div>
                                <h3 className="text-xl font-semibold">Ingredients:</h3>
                                <ul className="list-disc pl-8 space-y-3">
                                    {recipeResponse.ingredients && Array.isArray(recipeResponse.ingredients) ? (
                                        recipeResponse.ingredients.map((item, index) => <li key={index}>{item}</li>)
                                    ) : (
                                        <li>No ingredients provided</li>
                                    )}
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-semibold">Steps:</h3>
                                <ol className="list-decimal pl-8 space-y-6">
                                    {recipeResponse.steps && Array.isArray(recipeResponse.steps) ? (
                                        recipeResponse.steps.map((step, index) => <li key={index}>{step}</li>)
                                    ) : (
                                        <li>No steps provided</li>
                                    )}
                                </ol>
                            </div>
                        </div>

                        <h3 className="text-xl font-semibold mt-8">Nutrition Facts:</h3>
                        <div className="flex justify-between text-lg">
                            <p>Calories: <span>{recipeResponse.nutrition?.calories ?? "N/A"} kcal</span></p>
                            <p>Protein: <span>{recipeResponse.nutrition?.protein ?? "N/A"} g</span></p>
                            <p>Carbs: <span>{recipeResponse.nutrition?.carbs ?? "N/A"} g</span></p>
                            <p>Fats: <span>{recipeResponse.nutrition?.fats ?? "N/A"} g</span></p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheffieAI;