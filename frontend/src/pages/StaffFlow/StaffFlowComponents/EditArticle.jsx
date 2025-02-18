import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react"; // Import TinyMCE
import api from "../../../api";
import { useNavigate, useParams } from "react-router-dom";

const EditArticle = () => {
    const { articleId } = useParams(); // Get articleId from the URL
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [highlighted, setHighlighted] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Predefined categories
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

    useEffect(() => {
        // Fetch article details by articleId
        const fetchArticle = async () => {
            try {
                const response = await api.get(`/api/StaffArticle/articles`, {
                    params: { articleId },
                });
                if (response.data.length > 0) {
                    const article = response.data[0];
                    setTitle(article.title);
                    setContent(article.content); // Set TinyMCE content
                    setCategory(article.category);
                    setHighlighted(article.highlighted);
                } else {
                    setError("Article not found.");
                }
            } catch (err) {
                setError("Failed to fetch article details.");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [articleId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const updatedArticle = {
            Title: title,
            Content: content, // TinyMCE's HTML content
            Category: category,
            Highlighted: highlighted,
        };

        try {
            const response = await api.put(`/api/StaffArticle/articles/${articleId}`, updatedArticle);

            if (response.status === 200) {
                // Redirect to the article list or details page after successful update
                navigate(`/staff/help-centre`);
            }
        } catch (err) {
            setError("Failed to update article. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await api.delete(`/api/StaffArticle/articles/${articleId}`);
            if (response.status === 200) {
                // Redirect to the article list or a confirmation page after successful delete
                navigate(`/staff/help-centre`);
            }
        } catch (err) {
            setError("Failed to delete article. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Article</h1>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-700">Title:</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border p-2 rounded bg-gray-100 w-full text-gray-900"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700">Content:</label>
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
                    <label className="block text-sm text-gray-700">Category:</label>
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
                    <label className="flex items-center text-sm text-gray-700">
                        <input
                            type="checkbox"
                            checked={highlighted}
                            onChange={() => setHighlighted((prev) => !prev)}
                            className="mr-2"
                        />
                        Highlighted
                    </label>
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Update Article"}
                    </button>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete Article"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditArticle;