import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import {
    FaTruck,
    FaCreditCard,
    FaUndoAlt,
    FaUserCog,
    FaTools,
    FaComments,
    FaTrophy,
    FaUtensils,
} from "react-icons/fa";

const HelpCentre = () => {
    const [faqs, setFaqs] = useState([]);
    const [resources, setResources] = useState([]); // Added state for resources

    const categories = [
        { name: "Order and Delivery", icon: <FaTruck /> },
        { name: "Payments and Pricing", icon: <FaCreditCard /> },
        { name: "Returns and Refunds", icon: <FaUndoAlt /> },
        { name: "Account and Membership", icon: <FaUserCog /> },
        { name: "Technical Support", icon: <FaTools /> },
        { name: "Community and Forum", icon: <FaComments /> },
        { name: "Rewards and Redemptions", icon: <FaTrophy /> },
        { name: "Recipes and Cooking", icon: <FaUtensils /> },
    ];

    useEffect(() => {
        const fetchFaqsAndResources = async () => {
            try {
                // Fetch FAQs
                const faqResponse = await api.get("/api/HelpCentre", { params: { faq: true } });
                setFaqs(faqResponse.data);

                // Fetch Resources articles
                const resourcesResponse = await api.get("/api/HelpCentre", { params: { category: 'Resources' } });
                setResources(resourcesResponse.data);
            } catch (error) {
                console.error("Error fetching FAQs and resources:", error);
            }
        };

        fetchFaqsAndResources();
    }, []); // Run on component mount

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2c2c2c] text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] bg-clip-text text-transparent text-center mb-8">
                    Help Centre
                </h1>

                {/* Contact Us Button */}
                <div className="flex justify-center mb-8">
                    <Link
                        to="/contact-us"
                        className="bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:opacity-90 transition"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Top Section: FAQs (Left) & Resources (Right) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* FAQs Section */}
                    <div className="bg-[#ffffff08] backdrop-blur-lg p-6 rounded-xl border border-[#ffffff15] hover:border-[#ffffff30] transition-all">
                        <h2 className="text-2xl font-semibold mb-4">Top FAQs</h2>
                        <ul className="space-y-4">
                            {faqs.map((faq, index) => (
                                <li
                                    key={index}
                                    className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    <Link to={`/help-centre/${faq.category}/${faq.articleId}`} className="text-gray-300 hover:text-white">
                                        {faq.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help Resources Section */}
                    <div className="bg-[#ffffff08] backdrop-blur-lg p-6 rounded-xl border border-[#ffffff15] hover:border-[#ffffff30] transition-all">
                        <h2 className="text-2xl font-semibold mb-4">Resources</h2>
                        <ul className="space-y-2">
                            {resources.length > 0 ? (
                                resources.map((resource, index) => (
                                    <li
                                        key={index}
                                        className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                                    >
                                        <Link to={`/help-centre/${resource.category}/${resource.articleId}`} className="text-gray-300 hover:text-white">
                                            {resource.title}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-300">No resources available.</p>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Help Categories (8 squares) */}
                <div className="bg-[#ffffff08] backdrop-blur-lg p-6 rounded-xl border border-[#ffffff15] hover:border-[#ffffff30] transition-all">
                    <h2 className="text-2xl font-semibold mb-4">Help Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                to={`/help-centre/${category.name}`}
                                className="bg-[#ffffff10] p-6 rounded-lg text-center font-bold aspect-square flex flex-col justify-center items-center border border-[#ffffff15] hover:bg-[#ffffff20] hover:border-[#ffffff30] transition-all"
                            >
                                <div className="text-[#ff8e53] text-3xl mb-2">{category.icon}</div>
                                <div className="text-gray-300 text-sm">{category.name}</div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCentre;
