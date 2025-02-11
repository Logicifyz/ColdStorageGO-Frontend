import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import api from '../../api';
import { FaTruck, FaCreditCard, FaUndoAlt, FaUserCog, FaTools, FaComments, FaTrophy, FaUtensils } from 'react-icons/fa'; // Import icons

const HelpCentre = () => {
    const [faqs, setFaqs] = useState([]);
    const [resources] = useState([
        "User Guide",
        "Privacy Policy",
        "Terms of Service",
        "Refund Policy",
    ]);

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
        // Fetch top 5 FAQs by view count
        const fetchFaqs = async () => {
            try {
                const response = await api.get('/api/HelpCentre', {
                    params: { faq: true } // Fetch the top 5 most viewed FAQs
                });
                setFaqs(response.data);
            } catch (error) {
                console.error("Error fetching FAQs:", error);
            }
        };

        fetchFaqs();
    }, []);

    return (
        <div className="flex flex-col items-center bg-[#383838] min-h-screen p-8 text-white">
            {/* Help Centre Sections */}
            <div className="flex w-full max-w-6xl space-x-8">
                {/* Left - FAQs */}
                <div className="w-1/2 bg-[#4D5C60] p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Top FAQs</h2>
                    <ul className="space-y-2">
                        {faqs.map((faq, index) => (
                            <li key={index} className="text-lg">- {faq.title}</li>
                        ))}
                    </ul>
                </div>

                {/* Right - Help Centre Resources */}
                <div className="w-1/2 bg-[#2B2E4A] p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Help Centre Resources</h2>
                    <ul className="space-y-2">
                        {resources.map((resource, index) => (
                            <li key={index} className="text-lg">- {resource}</li>
                        ))}
                    </ul>
                    <button className="mt-6 w-full bg-[#B4C14A] text-black p-3 rounded-lg font-bold">Contact Us</button>
                </div>
            </div>

            {/* Categories Section */}
            <div className="mt-8 grid grid-cols-4 gap-4 max-w-6xl">
                {categories.map((category, index) => (
                    <Link key={index} to={`/Help-Centre/${category.name}`} className="bg-[#4D5C60] p-6 rounded-lg text-center font-bold aspect-square flex flex-col justify-center items-center">
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <div>{category.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default HelpCentre;
