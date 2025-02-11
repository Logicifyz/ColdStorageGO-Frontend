import React, { useEffect, useState } from "react";
import api from "../../../api";
import { useNavigate } from "react-router-dom";

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

    if (loading) return <p className="text-gray-600">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg relative">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Help Centre Articles</h1>

            {/* Add new article button */}
            <button
                onClick={handleAddArticleClick}
                className="absolute top-4 right-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
                Add New Article
            </button>

            <div className="flex space-x-4 mb-6">
                <div>
                    <label className="block text-sm text-gray-700">Category:</label>
                    <select
                        name="category"
                        onChange={handleFilterChange}
                        className="bg-gray-100 border p-2 rounded text-gray-800"
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
                        className="border p-2 rounded bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700">Staff ID:</label>
                    <input
                        type="text"
                        name="staffId"
                        onChange={handleFilterChange}
                        className="border p-2 rounded bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700">Highlighted:</label>
                    <input
                        type="checkbox"
                        name="highlighted"
                        checked={filters.highlighted}
                        onChange={handleCheckboxChange}
                    />
                    Highlighted Articles
                </div>

                <div>
                    <label className="block text-sm text-gray-700">Min Views:</label>
                    <input
                        type="number"
                        name="minViews"
                        onChange={handleFilterChange}
                        className="border p-2 rounded bg-gray-100"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-700">Article ID:</label>
                    <input
                        type="text"
                        name="articleId"
                        onChange={handleFilterChange}
                        className="border p-2 rounded bg-gray-100"
                    />
                </div>
            </div>

            {/* Filter summary */}
            <div className="mb-4">
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
            </div>

            {articles.length === 0 ? (
                <p className="text-gray-600">No articles found.</p>
            ) : (
                <ul className="space-y-4">
                    {articles.map((article) => (
                        <li
                            key={article.articleId}
                            className="border p-4 rounded shadow-lg bg-gray-50 hover:bg-gray-100 cursor-pointer"
                            onClick={() => handleArticleClick(article.articleId)}
                        >
                            <div className="flex justify-between items-center">
                                <strong className="text-xl text-gray-800">{article.title}</strong>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                <p>Category: {article.category}</p>
                                <p>Staff ID: {article.staffId ?? "Unassigned"}</p>
                                <p>Article ID: {article.articleId}</p>
                                <p>{article.content.substring(0, 150)}...</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HelpCentreManagement;
