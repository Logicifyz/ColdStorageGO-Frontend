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
import { useSpring, animated } from "react-spring"; // For animated icons

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
        <div className="min-h-screen bg-[#F0EAD6] text-[#355E3B] p-8 relative overflow-hidden">
            {/* Decorative Background Shapes */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                {/* Hero Section */}
                <div className="bg-gradient-to-r from-[#355E3B] to-[#2D4B33] p-8 rounded-xl text-white mb-8">
                    <h1 className="text-5xl font-bold text-center mb-4">
                        Welcome to the Help Centre
                    </h1>
                    <p className="text-lg text-center">
                        Find answers to your questions, explore resources, and get support.
                    </p>
                </div>

                {/* Contact Us Button */}
                <div className="flex justify-center mb-8">
                    <Link
                        to="/contact-us"
                        className="bg-[#355E3B] text-white font-semibold py-3 px-6 rounded-lg shadow-sm hover:bg-[#2D4B33] transition transform hover:scale-105"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Top Section: FAQs (Left) & Resources (Right) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {/* FAQs Section */}
                    <div className="bg-white p-6 rounded-xl border border-[#E2F2E6] hover:shadow-lg transition-all">
                        <h2 className="text-xl font-semibold mb-4">Top FAQs</h2>
                        <ul className="space-y-4">
                            {faqs.map((faq, index) => (
                                <li
                                    key={index}
                                    className="text-gray-500 hover:text-[#355E3B] transition-colors cursor-pointer"
                                >
                                    <Link to={`/help-centre/${faq.category}/${faq.articleId}`} className="text-gray-500 hover:text-[#355E3B]">
                                        {faq.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Help Resources Section */}
                    <div className="bg-white p-6 rounded-xl border border-[#E2F2E6] hover:shadow-lg transition-all">
                        <h2 className="text-xl font-semibold mb-4">Resources</h2>
                        <ul className="space-y-2">
                            {resources.length > 0 ? (
                                resources.map((resource, index) => (
                                    <li
                                        key={index}
                                        className="text-gray-500 hover:text-[#355E3B] transition-colors cursor-pointer"
                                    >
                                        <Link to={`/help-centre/${resource.category}/${resource.articleId}`} className="text-gray-500 hover:text-[#355E3B]">
                                            {resource.title}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500">No resources available.</p>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Help Categories (8 squares) */}
                <div className="bg-white p-6 rounded-xl border border-[#E2F2E6] hover:shadow-lg transition-all">
                    <h2 className="text-xl font-semibold mb-4">Help Categories</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {categories.map((category, index) => {
                            const AnimatedIcon = animated('div'); // Wrap div with animated
                            return (
                                <Link
                                    key={index}
                                    to={`/help-centre/${category.name}`}
                                    className="bg-[#E2F2E6] p-6 rounded-lg text-center font-bold aspect-square flex flex-col justify-center items-center border border-[#E2F2E6] hover:bg-[#F0EAD6] hover:border-[#355E3B] transition-all transform hover:scale-105"
                                >
                                    <AnimatedIcon>
                                        <div className="text-[#355E3B] text-3xl mb-2">{category.icon}</div>
                                    </AnimatedIcon>
                                    <div className="text-gray-500 text-sm">{category.name}</div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HelpCentre;
