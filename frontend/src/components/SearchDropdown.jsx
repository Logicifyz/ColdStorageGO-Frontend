import React from "react";
import { useNavigate } from "react-router-dom";

const SearchDropdown = ({ searchQuery, recipes, discussions, closeDropdown }) => {
    const navigate = useNavigate();

    if (!searchQuery.trim()) return null; // Hide when empty

    // Highlight search term in text
    const highlightText = (text, query) => {
        if (!text || !query) return text;

        const regex = new RegExp(`(${query})`, "gi"); // Match any part of the text
        return text.replace(regex, `<span class="text-yellow-400 font-bold">$1</span>`);
    };

    // Filter Results
    const filteredRecipes = recipes.filter((recipe) =>
        recipe.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDiscussions = discussions.filter((discussion) =>
        discussion.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        discussion.user?.username?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Function to get the image URL
    const getImageUrl = (item) => {
        if (Array.isArray(item.coverImages) && item.coverImages.length > 0) {
            return `data:image/jpeg;base64,${item.coverImages[0]}`;
        }
        return "/placeholder-image.png"; // Fallback image
    };

    return (
        <div className="absolute left-0 w-full max-w-md bg-[#1a1a1a] text-white shadow-lg rounded-lg overflow-hidden z-50 top-full">
            <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold">Top Results</h3>
            </div>

            <div className="p-3 space-y-4">
                {filteredRecipes.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-400">Recipes</h4>
                        {filteredRecipes.map((recipe) => (
                            <div key={recipe.recipeId}
                                className="flex items-center p-2 hover:bg-gray-800 cursor-pointer rounded-lg"
                                onClick={() => { navigate(`/forum/recipe/${recipe.recipeId}`); closeDropdown(); }}>
                                <img src={getImageUrl(recipe)}
                                    alt="Recipe"
                                    className="w-10 h-10 rounded-md object-cover mr-3" />
                                <div>
                                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: highlightText(recipe.name, searchQuery) }}></p>
                                    <p className="text-xs text-gray-400">by {recipe.user?.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredDiscussions.length > 0 && (
                    <div>
                        <h4 className="text-sm font-semibold text-gray-400">Discussions</h4>
                        {filteredDiscussions.map((discussion) => (
                            <div key={discussion.discussionId}
                                className="flex items-center p-2 hover:bg-gray-800 cursor-pointer rounded-lg"
                                onClick={() => { navigate(`/forum/discussion/${discussion.discussionId}`); closeDropdown(); }}>
                                <img src={getImageUrl(discussion)} // Use the same function for discussions
                                    alt="Discussion"
                                    className="w-10 h-10 rounded-md object-cover mr-3" />
                                <div>
                                    <p className="text-sm" dangerouslySetInnerHTML={{ __html: highlightText(discussion.title, searchQuery) }}></p>
                                    <p className="text-xs text-gray-400">by {discussion.user?.username}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filteredRecipes.length === 0 && filteredDiscussions.length === 0 && (
                    <p className="text-gray-500 text-sm">No results found.</p>
                )}
            </div>
        </div>
    );
};

export default SearchDropdown;