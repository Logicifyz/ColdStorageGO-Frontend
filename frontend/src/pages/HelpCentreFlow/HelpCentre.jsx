import React from 'react';

const HelpCentre = () => {
    const faqs = [
        "How do I reset my password?",
        "How can I contact support?",
        "Where can I find my account settings?",
        "How do I delete my account?",
    ];

    const resources = [
        "User Guide",
        "Privacy Policy",
        "Terms of Service",
        "Refund Policy",
    ];

    const categories = [
        "Account",
        "Billing",
        "Technical Support",
        "Orders & Refunds",
        "Security",
        "Privacy",
        "General Inquiries",
        "Other",
    ];

    return (
        <div className="flex flex-col items-center bg-[#383838] min-h-screen p-8 text-white">
            {/* Help Centre Sections */}
            <div className="flex w-full max-w-6xl space-x-8">
                {/* Left - FAQs */}
                <div className="w-1/2 bg-[#4D5C60] p-6 rounded-lg">
                    <h2 className="text-2xl font-bold mb-4">Top FAQs</h2>
                    <ul className="space-y-2">
                        {faqs.map((faq, index) => (
                            <li key={index} className="text-lg">- {faq}</li>
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
                    <div key={index} className="bg-[#4D5C60] p-6 rounded-lg text-center font-bold">
                        {category}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HelpCentre;
