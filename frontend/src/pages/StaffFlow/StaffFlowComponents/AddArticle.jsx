import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations
import { FiSave, FiEdit, FiBookOpen, FiStar, FiArrowLeft } from "react-icons/fi"; // Icons for flair

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
        <div className="p-6 bg-[#F0EAD6] min-h-screen relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Header with Animation */}
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-5xl font-bold mb-6 text-[#355E3B] text-center"
                >
                    Add New Article
                </motion.h1>

                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    onClick={() => navigate("/staff/help-centre")}
                    className="absolute top-4 left-4 bg-[#355E3B] text-white p-3 rounded-lg hover:bg-[#2D4B33] transition flex items-center gap-2"
                >
                    <FiArrowLeft /> Back to Articles
                </motion.button>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-red-500 mb-4 text-center"
                    >
                        {error}
                    </motion.div>
                )}

                {/* Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="bg-white p-6 rounded-xl shadow-lg space-y-6"
                >
                    {/* Title */}
                    <div>
                        <label className="block text-sm text-[#355E3B] font-medium">Title:</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border p-2 rounded bg-gray-100 w-full text-[#355E3B] focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block text-sm text-[#355E3B] font-medium">Content:</label>
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

                    {/* Category */}
                    <div>
                        <label className="block text-sm text-[#355E3B] font-medium">Category:</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="border p-2 rounded bg-gray-100 w-full text-[#355E3B] focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
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

                    {/* Highlighted */}
                    <div>
                        <label className="flex items-center text-sm text-[#355E3B] font-medium">
                            <input
                                type="checkbox"
                                checked={highlighted}
                                onChange={() => setHighlighted((prev) => !prev)}
                                className="mr-2"
                            />
                            Highlighted
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="bg-[#355E3B] text-white px-4 py-2 rounded-lg hover:bg-[#2D4B33] transition flex items-center gap-2"
                            disabled={loading}
                        >
                            <FiSave /> {loading ? "Saving..." : "Save Article"}
                        </button>
                    </div>
                </motion.form>
            </div>
        </div>
    );
};

export default AddArticle;