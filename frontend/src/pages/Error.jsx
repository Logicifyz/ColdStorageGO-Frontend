import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    const handleHomeRedirect = () => {
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-[#F0EAD6] p-8 relative overflow-hidden flex items-center justify-center">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-[#2D4B3310] rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#355E3B10] rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 text-center">
                <h1 className="text-8xl font-bold bg-gradient-to-r from-[#2D4B33] to-[#355E3B] bg-clip-text text-transparent">
                    404
                </h1>
                <h2 className="text-3xl font-bold text-[#2D4B33] mt-4">
                    Page Not Found
                </h2>
                <p className="text-lg text-gray-700 mt-4">
                    Oops! The page you are looking for does not exist.
                </p>
                <button
                    onClick={handleHomeRedirect}
                    className="mt-8 px-6 py-3 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] rounded-xl font-bold text-white hover:opacity-90 transition"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
};

export default NotFound;
