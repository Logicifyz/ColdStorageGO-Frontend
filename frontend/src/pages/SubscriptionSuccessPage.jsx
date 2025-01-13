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
                    onClick={navigate("/")}
                    type="submit"
                    className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold inline-block mt-4"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #4D5C60, #2B2E4A)',
                    }}
                >
                    Return To Home
                </button>

            </div>
        </div>
    );
};

export default SubscriptionSuccessPage;
