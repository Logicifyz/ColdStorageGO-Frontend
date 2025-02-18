import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations
import { FiLogIn, FiAlertCircle } from "react-icons/fi"; // Icons for flair

const PleaseLogin = () => {
    const navigate = useNavigate();

    const handleGoToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-[#F0EAD6] relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-[#E2F2E6] rounded-full blur-3xl opacity-50" />
            </div>

            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-xl shadow-lg text-center relative z-10"
            >
                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <FiAlertCircle className="text-[#355E3B] text-6xl" />
                </div>

                {/* Heading */}
                <h1 className="text-3xl font-bold text-[#355E3B] mb-4">Session Not Found</h1>

                {/* Message */}
                <p className="text-gray-600 mb-6">
                    You are not logged in. Please log in to continue.
                </p>

                {/* Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGoToLogin}
                    className="bg-[#355E3B] text-white px-6 py-3 rounded-lg hover:bg-[#2D4B33] transition flex items-center gap-2 mx-auto"
                >
                    <FiLogIn /> Go to Login
                </motion.button>
            </motion.div>
        </div>
    );
};

export default PleaseLogin;