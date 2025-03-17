import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations
import { FiPlus, FiSearch, FiFilter, FiBookOpen, FiStar, FiEye } from "react-icons/fi"; // Icons for flair

const HelpCentreManagement = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: "",
        title: "",
        staffId: "",
        highlighted: false,
        minViews: "",
        articleId: "",
    });
    const sessionId = localStorage.getItem("sessionId");
    const navigate = useNavigate();

    useEffect(() => {
        fetchArticles();
    }, [filters]);

    const fetchArticles = async () => {
        try {
            const { category, title, staffId, highlighted, minViews, articleId } = filters;
            const response = await api.get("/api/StaffArticle/articles", {
                headers: { SessionId: sessionId },
                params: { category, title, staffId, highlighted, minViews, articleId },
            });
            setArticles(response.data);
        } catch (err) {
            setError("Failed to fetch articles");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCheckboxChange = (e) => {
        setFilters((prev) => ({
            ...prev,
            highlighted: e.target.checked,
        }));
    };

    const handleArticleClick = (articleId) => {
        navigate(`/staff/help-centre/edit-article/${articleId}`);
    };

    const handleAddArticleClick = () => {
        navigate("/staff/help-centre/add-article");
    };

    const categories = [
        "Order and Delivery",
        "Payments and Pricing",
        "Returns and Refunds",
        "Account and Membership",
        "Technical Support",
        "Community and Forum",
        "Rewards and Redemptions",
        "Recipes and Cooking"
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-[#355E3B] text-2xl"
                >
                    Loading...
                </motion.div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-red-800 font-bold text-2xl"
                >
                    {error}
                </motion.div>
            </div>
        );
    }

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
                    Help Centre Articles
                </motion.h1>

                {/* Add New Article Button */}
                <motion.button
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    onClick={handleAddArticleClick}
                    className="absolute top-4 right-4 bg-[#355E3B] text-white p-3 rounded-lg hover:bg-[#2D4B33] transition flex items-center gap-2"
                >
                    <FiPlus /> Add New Article
                </motion.button>

                {/* Filters Section */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="bg-white p-6 rounded-xl shadow-lg mb-6"
                >
                    <h2 className="text-2xl font-semibold text-[#355E3B] mb-4 flex items-center gap-2">
                        <FiFilter /> Filters
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700">Category:</label>
                            <select
                                name="category"
                                onChange={handleFilterChange}
                                className="w-full border p-2 rounded bg-gray-100 text-gray-800"
                            >
                                <option value="">All</option>
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Title:</label>
                            <input
                                type="text"
                                name="title"
                                onChange={handleFilterChange}
                                className="w-full border p-2 rounded bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Staff ID:</label>
                            <input
                                type="text"
                                name="staffId"
                                onChange={handleFilterChange}
                                className="w-full border p-2 rounded bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Highlighted:</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="highlighted"
                                    checked={filters.highlighted}
                                    onChange={handleCheckboxChange}
                                />
                                <span className="text-sm">Highlighted</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Min Views:</label>
                            <input
                                type="number"
                                name="minViews"
                                onChange={handleFilterChange}
                                className="w-full border p-2 rounded bg-gray-100"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700">Article ID:</label>
                            <input
                                type="text"
                                name="articleId"
                                onChange={handleFilterChange}
                                className="w-full border p-2 rounded bg-gray-100"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Filter Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mb-4"
                >
                    <h3 className="text-sm text-gray-600">Applied Filters:</h3>
                    <p className="text-sm text-gray-500">
                        {Object.keys(filters).map(
                            (key) =>
                                filters[key] && (
                                    <span key={key} className="inline-block mr-2">
                                        {key}: {filters[key]}{" "}
                                    </span>
                                )
                        )}
                    </p>
                </motion.div>

                {/* Articles List */}
                {articles.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center text-[#355E3B] text-2xl"
                    >
                        No articles found.
                    </motion.div>
                ) : (
                    <motion.ul
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="space-y-4"
                    >
                        {articles.map((article) => (
                            <motion.li
                                key={article.articleId}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                                onClick={() => handleArticleClick(article.articleId)}
                            >
                                <div className="flex justify-between items-center">
                                    <strong className="text-xl text-[#355E3B]">{article.title}</strong>
                                    {article.highlighted && (
                                        <FiStar className="text-yellow-500" />
                                    )}
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    <p>Category: {article.category}</p>
                                    <p>Staff ID: {article.staffId ?? "Unassigned"}</p>
                                    <p>Article ID: {article.articleId}</p>
                                    <p>{article.content.substring(0, 150)}...</p>
                                </div>
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </div>
        </div>
    );
};

export default HelpCentreManagement;