import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';

const CategoryPage = () => {
    const { category, articleId } = useParams(); // Get both category and ArticleId from URL params
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await api.get('/api/HelpCentre', {
                    params: { category: category } // Pass the category to the API
                });
                setArticles(response.data);
                if (response.data.length > 0) {
                    if (articleId) {
                        // If ArticleId is present, find the article with that ID
                        const article = response.data.find(article => article.articleId === articleId);
                        setSelectedArticle(article || response.data[0]); // If article not found, default to the first one
                    } else {
                        // If no ArticleId, set the first article
                        setSelectedArticle(response.data[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        fetchArticles();
    }, [category, articleId]); // Fetch articles when category or ArticleId changes

    // Function to handle article selection and increment views
    const handleArticleSelect = async (article) => {
        setSelectedArticle(article);

        try {
            // Increment views when article is selected
            await api.post(`/api/HelpCentre/${article.articleId}/increment-views`);
        } catch (error) {
            console.error("Error incrementing views:", error);
        }
    };

    return (
        <div className="category-page min-h-screen bg-gradient-to-br from-[#F0F4F8] to-[#D9E2EC] p-8">
            <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden flex">
                {/* Sidebar - List of article titles */}
                <div className="sidebar w-1/4 bg-gradient-to-b from-[#2C3E50] to-[#4A6FA5] p-6 text-white">
                    <h2 className="text-2xl font-bold mb-6 text-[#FFD700]">Articles</h2>
                    <ul className="space-y-3">
                        {articles.map((article) => (
                            <li
                                key={article.articleId}
                                className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${selectedArticle?.articleId === article.articleId
                                    ? 'bg-[#FFD700] text-[#2C3E50] shadow-lg'
                                    : 'hover:bg-[#4A6FA5] hover:text-white hover:shadow-md'
                                    }`}
                                onClick={() => handleArticleSelect(article)} // Change selected article
                            >
                                <span className="font-medium">{article.title}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Article Content - Title and Content */}
                <div className="article-content w-3/4 p-8 bg-white">
                    {selectedArticle ? (
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold text-[#2C3E50] mb-6">
                                {selectedArticle.title}
                            </h1>
                            {/* Render TinyMCE content */}
                            <div
                                className="prose max-w-none text-black" // Added text-black for black text color
                                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                            />

                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-xl text-gray-500">Select an article to read.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryPage;