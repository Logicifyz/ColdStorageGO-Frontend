import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionSuccessPage = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center text-center bg-charcoal text-white">
            <div>
                <h1 className="text-5xl font-bold mb-6">🎉 Subscription Confirmed!</h1>
                <p className="text-lg mb-8">Thank you for subscribing to our meal plans!</p>
                <button
                    onClick={() => navigate('/')}
                    className="p-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition duration-300"
                >
                    Return to Home
                </button>
            </div>
        </div>
    );
};

export default SubscriptionSuccessPage;
