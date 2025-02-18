import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api';
import { ArrowLeft } from 'lucide-react';

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
        <div className="category-page min-h-screen bg-[#F0EAD6] p-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto bg-white overflow-hidden flex flex-col">
                {/* Back Button */}
                <div className="pt-8 flex items-center  bg-[#F0EAD6] space-x-2 text-[#355E3B] hover:text-[#2D4B33] transition duration-200">
                    <span
                        className="cursor-pointer flex items-center space-x-2"
                        onClick={() => navigate(-1)} // Handle navigation on click
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="text-lg font-semibold">Back to help centre</span>
                    </span>
                </div>

                <div className="flex">
                    {/* Sidebar - List of article titles */}
                    <div className="sidebar w-1/4 bg-[#F0EAD6] p-6">
                        <h2 className="text-2xl font-bold mb-6 text-[#355E3B]">Articles</h2>
                        {articles.length === 0 ? (
                            <p className="text-lg text-gray-500">No articles available for this category.</p> // Message when no articles are available
                        ) : (
                            <ul className="space-y-3">
                                {articles.map((article) => (
                                    <li
                                        key={article.articleId}
                                        className={`p-3 rounded-lg cursor-pointer transition-all duration-300 ${selectedArticle?.articleId === article.articleId
                                            ? 'bg-[#355E3B] text-white shadow-lg'
                                            : 'text-black hover:bg-[#D9D9D9] hover:text-[#2C3E50] hover:shadow-md'
                                            }`}
                                        onClick={() => handleArticleSelect(article)} // Change selected article
                                    >
                                        <span className="font-medium">{article.title}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Article Content - Title and Content */}
                    <div className="article-content w-3/4 p-8 bg-white">
                        {selectedArticle ? (
                            <div className="space-y-6">
                                <h1 className="text-4xl font-bold text-[#355E3B] mb-6">
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
                                    <p className="text-xl text-gray-500">No articles available for this category.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default CategoryPage;