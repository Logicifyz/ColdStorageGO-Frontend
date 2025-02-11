import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QfdWdBwKaF4UCL2U5tt4GMubmDduDxy50PaDfVW0PKkb9bWlpYl7SIxDvxpjkIxUYrKPGdvBsCAvALCYshj8rOZ00HIxcZmFn');

const SubscriptionChoicePage = () => {
    const { state: formData } = useLocation();
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [subscriptionExists, setSubscriptionExists] = useState(false);
    const [error, setError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const checkSubscriptionStatus = async () => {
            try {
                const response = await api.get('/api/subscriptions/user-has-active', { withCredentials: true });
                setSubscriptionExists(response.data.hasActiveSubscription);
            } catch (error) {
                console.error('Error checking subscription status:', error);
            }
        };
        checkSubscriptionStatus();
    }, []);

    const SubChoice = [
        {
            title: "Vegetarian",
            basePrice: 6,
            description: "A variety of plant-based meals packed with fresh vegetables, grains, and protein alternatives for a healthy lifestyle.",
            icon: "🌱",
        },
        {
            title: "Pescetarian",
            basePrice: 7,
            description: "Delicious seafood-based dishes combined with fresh vegetables, whole grains, and nutrient-packed meals.",
            icon: "🐟",
        },
        {
            title: "Halal",
            basePrice: 6,
            description: "Halal-certified meals with ethically sourced ingredients, focusing on balanced nutrition and cultural preferences.",
            icon: "🕌",
        },
        {
            title: "Keto",
            basePrice: 8,
            description: "Low-carb, high-fat meals designed to support ketosis and weight management.",
            icon: "🥑",
        },
        {
            title: "Vegan",
            basePrice: 6,
            description: "100% plant-based meals with no animal products, perfect for a cruelty-free lifestyle.",
            icon: "🌿",
        },
        {
            title: "Gluten-Free",
            basePrice: 7,
            description: "Meals free from gluten, ideal for those with gluten intolerance or celiac disease.",
            icon: "🍞",
        }
    ];

    const calculatePrice = (basePrice) => {
        let pricePerMeal = basePrice;
        if (formData.frequency === "2") pricePerMeal *= 0.95;
        if (formData.frequency === "3") pricePerMeal *= 0.90;
        if (formData.subscriptionType === "Monthly") pricePerMeal *= 0.95;
        const mealsPerDay = parseInt(formData.frequency);
        const daysPerWeek = 7;
        const totalMeals = mealsPerDay * daysPerWeek;
        return (pricePerMeal * totalMeals).toFixed(2);
    };

    const handleSelect = (choice) => {
        setSelectedChoice(choice);
        setShowPopup(true);
    };

    const handleConfirm = async () => {
        const stripe = await stripePromise;
        try {
            const sessionResponse = await api.get('/api/account/profile', { withCredentials: true });
            const userId = sessionResponse.data.userId;

            const subscriptionCheckResponse = await api.get(`/api/subscriptions/active/${userId}`, { withCredentials: true });
            if (subscriptionCheckResponse.data.hasActiveSubscription) {
                alert('You already have an active subscription. Please cancel your existing subscription before creating a new one.');
                return;
            }

            const response = await api.post('/api/stripe/create-checkout-session', {
                userId: userId,
                frequency: formData.frequency,
                deliveryTimeSlot: formData.deliveryTimeSlot,
                subscriptionType: formData.subscriptionType,
                subscriptionChoice: selectedChoice.title,
                price: calculatePrice(selectedChoice.basePrice)
            });

            const { id } = response.data;
            await stripe.redirectToCheckout({ sessionId: id });
        } catch (error) {
            console.error('Error confirming subscription:', error.response?.data);
            alert('Error with payment process.');
        }
    };

    const handleCancel = () => {
        setShowPopup(false);
        setSelectedChoice(null);
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % SubChoice.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + SubChoice.length) % SubChoice.length);
    };

    const getVisibleCards = () => {
        const cards = [];
        for (let i = -1; i <= 1; i++) {
            const index = (currentIndex + i + SubChoice.length) % SubChoice.length;
            cards.push(SubChoice[index]);
        }
        return cards;
    };

    return (
        <div className="min-h-screen bg-[#383838] text-gray-200 flex flex-col items-center justify-center p-12 space-y-12 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0 z-0">
                <div className="absolute w-64 h-64 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl opacity-20 animate-float"></div>
                <div className="absolute w-64 h-64 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full blur-3xl opacity-20 animate-float animation-delay-2000"></div>
                <div className="absolute w-64 h-64 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-3xl opacity-20 animate-float animation-delay-4000"></div>
            </div>

            {/* Header Section */}
            <h2 className="text-5xl font-extrabold mb-8 text-center tracking-wide text-white relative z-10">
                Choose Your Perfect Meal Kit
            </h2>

            {/* Carousel Section */}
            <div className="flex items-center justify-center space-x-8 relative z-10">
                <button
                    onClick={handlePrev}
                    className="text-white text-4xl hover:text-purple-400 transition-all duration-300"
                >
                    &#10094;
                </button>
                <div className="flex space-x-8">
                    {getVisibleCards().map((meal, index) => (
                        <div
                            key={meal.title}
                            className={`relative p-8 rounded-2xl shadow-lg border-2 cursor-pointer flex flex-col justify-between transform transition-all duration-500 
                                ${index === 1 ? 'scale-110 bg-gradient-to-br from-[#444444] to-[#2E2E2E] border-purple-500' : 'scale-90 bg-[#444444] border-[#555555]'}`}
                            style={{ width: '300px', height: '500px' }} // Tall, vertical rectangle cards
                            onClick={() => handleSelect(meal)}
                        >
                            <div className="text-6xl mb-6 text-purple-400">{meal.icon}</div>
                            <h3 className="text-4xl font-bold mb-6 text-purple-400">{meal.title}</h3>
                            <p className="text-lg opacity-90 mb-6 text-gray-300">{meal.description}</p>
                            <p className="text-2xl font-semibold text-purple-400">${calculatePrice(meal.basePrice)} / {formData.subscriptionType}</p>
                        </div>
                    ))}
                </div>
                <button
                    onClick={handleNext}
                    className="text-white text-4xl hover:text-purple-400 transition-all duration-300"
                >
                    &#10095;
                </button>
            </div>

            {/* Confirmation Popup */}
            {showPopup && selectedChoice && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                    <div className="bg-[#444444] text-white p-12 rounded-xl shadow-2xl text-center max-w-lg space-y-6 transform scale-105 transition-all">
                        <h3 className="text-4xl font-bold mb-6 text-white-400">Confirm Your Choice</h3>
                        <p className="text-lg mb-4">You selected: <span className="font-semibold text-white-400">{selectedChoice.title}</span></p>
                        <p className="text-xl mb-4 font-semibold">Total Price: <span className="text-white-400">${calculatePrice(selectedChoice.basePrice)}</span></p>
                        <button
                            onClick={handleConfirm}
                            className="px-6 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-purple-600 transition-all transform hover:scale-105"
                        >
                            Confirm & Pay
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-all transform hover:scale-105"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* CSS Animations */}
            <style>
                {`
                .gradient-text {
                    background: linear-gradient(45deg, #FFC107, #FF8C00, #FF0080);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                @keyframes float {
                    0% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                    100% { transform: translateY(0) rotate(0deg); }
                }

                .animate-float {
                    animation: float 6s infinite ease-in-out;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                .hover:scale-110:hover {
                    animation: glow 1.2s infinite alternate;
                }

                @keyframes glow {
                    0% { box-shadow: 0 0 5px #FFC107; }
                    100% { box-shadow: 0 0 20px #FFC107; }
                }
                `}
            </style>
        </div>
    );
};

export default SubscriptionChoicePage;