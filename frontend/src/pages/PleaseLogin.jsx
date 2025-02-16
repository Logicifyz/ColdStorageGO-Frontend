import React from "react";
import { useNavigate } from "react-router-dom";

const PleaseLogin = () => {
    const navigate = useNavigate();

    const handleGoToLogin = () => {
        navigate("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold mb-4">Session Not Found</h1>
                <p className="text-gray-600 mb-4">
                    You are not logged in. Please log in to continue.
                </p>
                <button
                    onClick={handleGoToLogin}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Go to Login
                </button>
            </div>
        </div>
    );
};

export default PleaseLogin;
