import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api';

const CategoryPage = () => {
    const { category } = useParams(); // Get category from URL params
    const [articles, setArticles] = useState([]);
    const [selectedArticle, setSelectedArticle] = useState(null);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await api.get('/api/HelpCentre', {
                    params: { category: category } // Pass the category to the API
                });
                setArticles(response.data);
                if (response.data.length > 0) {
                    setSelectedArticle(response.data[0]); // Set the first article by default
                }
            } catch (error) {
                console.error("Error fetching articles:", error);
            }
        };

        fetchArticles();
    }, [category]); // Fetch articles when category changes

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
        <div className="category-page flex">
            {/* Sidebar - List of article titles */}
            <div className="sidebar w-1/4 bg-[#4D5C60] p-6 text-white">
                <h2 className="text-xl font-bold mb-4">Articles</h2>
                <ul>
                    {articles.map((article) => (
                        <li
                            key={article.id}
                            className="mb-4 cursor-pointer hover:text-[#B4C14A]"
                            onClick={() => handleArticleSelect(article)} // Change selected article
                        >
                            {article.title}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Article Content - Title and Content */}
            <div className="article-content w-3/4 p-6">
                {selectedArticle ? (
                    <div>
                        <h1 className="text-3xl font-bold mb-4">{selectedArticle.title}</h1>
                        <p>{selectedArticle.content}</p>
                    </div>
                ) : (
                    <p className="text-lg">Select an article to read.</p>
                )}
            </div>
        </div>
    );
};

export default CategoryPage;
