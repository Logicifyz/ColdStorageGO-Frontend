import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesIcon, GiftIcon, CurrencyDollarIcon, XMarkIcon, PhotoIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QfdWdBwKaF4UCL2U5tt4GMubmDduDxy50PaDfVW0PKkb9bWlpYl7SIxDvxpjkIxUYrKPGdvBsCAvALCYshj8rOZ00HIxcZmFn');

const BackgroundBlobs = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-to-r from-[#302b63] to-[#24243e] opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-[#4b379c] to-[#1a1a2e] opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
);

const GlowingButton = ({ children, onClick, className = "", type = "button" }) => (
    <motion.button
        type={type}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative overflow-hidden px-6 py-3 rounded-2xl font-medium ${className}`}
    >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] opacity-20 blur-md" />
    </motion.button>
);

const FloatingCard = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 backdrop-blur-xl rounded-3xl p-6 border border-[#ffffff10] shadow-2xl"
    >
        {children}
    </motion.div>
);

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
        <div className="min-h-screen bg-[#0b0b1a] text-gray-100 relative overflow-hidden p-8">
            <BackgroundBlobs />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                    >
                        <BookOpenIcon className="w-12 h-12 mr-4 inline-block" />
                        Meal Kit Subscription
                    </motion.h1>
                </header>

                <div className="flex items-center justify-center space-x-8 relative z-10">
                    <button
                        onClick={handlePrev}
                        className="text-white text-4xl hover:text-purple-400 transition-all duration-300"
                    >
                        &#10094;
                    </button>
                    <div className="flex space-x-8">
                        {getVisibleCards().map((meal, index) => (
                            <motion.div
                                key={meal.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`relative p-8 rounded-2xl shadow-lg border-2 cursor-pointer flex flex-col justify-between transform transition-all duration-500 
                  ${index === 1 ? 'scale-110 bg-gradient-to-br from-[#444444] to-[#2E2E2E] border-purple-500' : 'scale-90 bg-[#444444] border-[#555555]'}`}
                                style={{ width: '300px', height: '500px' }} // Tall, vertical rectangle cards
                                onClick={() => handleSelect(meal)}
                            >
                                <div className="text-6xl mb-6 text-purple-400">{meal.icon}</div>
                                <h3 className="text-4xl font-bold mb-6 text-purple-400">{meal.title}</h3>
                                <p className="text-lg opacity-90 mb-6 text-gray-300">{meal.description}</p>
                                <p className="text-2xl font-semibold text-purple-400">${calculatePrice(meal.basePrice)} / {formData.subscriptionType}</p>
                            </motion.div>
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
                <AnimatePresence>
                    {showPopup && selectedChoice && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
                        >
                            <FloatingCard>
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold">Confirm Your Choice</h2>
                                    <button
                                        onClick={handleCancel}
                                        className="p-2 hover:bg-[#ffffff10] rounded-lg"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </button>
                                </div>
                                <p className="text-lg mb-4">You selected: <span className="font-semibold text-purple-400">{selectedChoice.title}</span></p>
                                <p className="text-xl mb-4 font-semibold">Total Price: <span className="text-purple-400">${calculatePrice(selectedChoice.basePrice)}</span></p>
                                <div className="flex justify-end gap-4">
                                    <GlowingButton
                                        onClick={handleConfirm}
                                        className="bg-green-600 hover:bg-green-500"
                                    >
                                        Confirm & Pay
                                    </GlowingButton>
                                    <GlowingButton
                                        onClick={handleCancel}
                                        className="bg-red-600 hover:bg-red-500"
                                    >
                                        Cancel
                                    </GlowingButton>
                                </div>
                            </FloatingCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SubscriptionChoicePage;
