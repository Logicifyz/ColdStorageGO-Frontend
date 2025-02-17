import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

const AddArticle = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [highlighted, setHighlighted] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categories = [
        "Order and Delivery",
        "Payments and Pricing",
        "Returns and Refunds",
        "Account and Membership",
        "Technical Support",
        "Community and Forum",
        "Rewards and Redemptions",
        "Recipes and Cooking",
        "Resources",
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const articleData = {
            Title: title,
            Content: content, // TinyMCE's HTML content
            Category: category,
            Highlighted: highlighted,
        };

        try {
            const response = await api.post("/api/StaffArticle/articles", articleData);

            if (response.status === 200) {
                navigate("/staff/help-centre");
            }
        } catch (err) {
            setError("Failed to create article. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Article</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-900">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded bg-gray-100 w-full text-gray-900"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-900">Content:</label>
                    <Editor
                        apiKey="lgphqzixngekfoy75fvkupwl5350so0jovf1j1fnxedk8c1f" // Get a free API key from TinyMCE
                        value={content}
                        onEditorChange={(newContent) => setContent(newContent)}
                        init={{
                            height: 500,
                            menubar: true,
                            plugins: "link image table code",
                            toolbar: "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | table | link image | code",
                        }}
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-900">Category:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="border p-2 rounded bg-gray-100 w-full text-gray-900"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat, index) => (
                            <option key={index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="flex items-center text-sm text-gray-900">
                        <input
                            type="checkbox"
                            checked={highlighted}
                            onChange={() => setHighlighted((prev) => !prev)}
                            className="mr-2"
                        />
                        Highlighted
                    </label>
                </div>

                <div>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Article"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddArticle;