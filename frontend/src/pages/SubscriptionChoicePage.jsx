import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QfdWdBwKaF4UCL2U5tt4GMubmDduDxy50PaDfVW0PKkb9bWlpYl7SIxDvxpjkIxUYrKPGdvBsCAvALCYshj8rOZ00HIxcZmFn');

const BackgroundLeaves = () => {
    const leaves = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        delay: Math.random() * 3,
        left: `${Math.random() * 100}vw`,
        rotate: Math.random() * 360,
        size: Math.random() * 1.2 + 0.8,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {leaves.map((leaf) => (
                <motion.div
                    key={leaf.id}
                    initial={{ opacity: 0, y: -50, rotate: leaf.rotate }}
                    animate={{ opacity: 1, y: "100vh", rotate: leaf.rotate + 180 }}
                    transition={{
                        duration: 10 + Math.random() * 5,
                        delay: leaf.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute w-6 h-6 text-4xl"
                    style={{ left: leaf.left, fontSize: `${leaf.size}rem` }}
                >
                    🍃
                </motion.div>
            ))}
        </div>
    );
};


const GlowingButton = ({ children, onClick, className = "", type = "button" }) => (
    <motion.button
        type={type}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative overflow-hidden px-6 py-3 rounded-2xl font-medium ${className}`}
    >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] opacity-20 blur-md" />
    </motion.button>
);

const FloatingCard = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#A8E6CF] to-[#DCEDC1] backdrop-blur-xl rounded-3xl p-6 border border-[#2D4B33]/30 shadow-2xl"
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
    // Discount code fields
    const [discountCode, setDiscountCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [discountApplied, setDiscountApplied] = useState(false);
    const [success, setSuccess] = useState("");

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
        if (formData.subscriptionType === "Annually") pricePerMeal *= 0.90;
        const mealsPerDay = parseInt(formData.frequency);
        let totalDays = 7;
        if (formData.subscriptionType === "Monthly") totalDays = 30;
        if (formData.subscriptionType === "Annually") totalDays = 365;
        const totalMeals = mealsPerDay * totalDays;
        const subtotal = (pricePerMeal * totalMeals).toFixed(2);
        const effectiveSubtotal = discountApplied ? Math.max(subtotal - discount, 0) : subtotal;
        return Math.round((effectiveSubtotal)*100)/100;
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
                toast.error("You already have an active subscription. Please cancel it before creating a new one.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: "dark",
                });
                return;
            }

            const response = await api.post('/api/stripe/create-checkout-session', {
                userId: userId,
                frequency: formData.frequency,
                deliveryTimeSlot: formData.deliveryTimeSlot,
                subscriptionType: formData.subscriptionType,
                subscriptionChoice: selectedChoice.title,
                price: calculatePrice(selectedChoice.basePrice),
                discountCode: discountApplied ? discountCode : null
            });

            const { id } = response.data;
            await stripe.redirectToCheckout({ sessionId: id });
        } catch (error) {
            console.error('Error confirming subscription:', error.response?.data);
            toast.error("Error with payment process. Please try again later.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
            });
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

    const applyDiscount = async () => {
        setError("");
        setSuccess("");
        try {
            const response = await api.get("/api/wallet/redemptions");
            const redemptions = response.data;
            const redemption = redemptions.find(
                (r) => r.redemptionId.toLowerCase() === discountCode.trim().toLowerCase()
            );
            if (!redemption) {
                setError("Invalid discount code.");
                return;
            }
            if (!redemption.rewardUsable) {
                setError("Discount code has already been used.");
                return;
            }
            const rewardResponse = await api.get(`/api/rewards/${redemption.rewardId}`);
            const reward = rewardResponse.data;
            let discountAmount = 0;
            switch (reward.rewardType) {
                case "Voucher5":
                    discountAmount = 5;
                    break;
                case "Voucher10":
                    discountAmount = 10;
                    break;
                case "Voucher15":
                    discountAmount = 15;
                    break;
                case "Voucher20":
                    discountAmount = 20;
                    break;
                default:
                    discountAmount = 0;
                    break;
            }
            setDiscount(discountAmount);
            setDiscountApplied(true);
            setSuccess(`Discount code applied: -$${discountAmount}`);
        } catch (err) {
            console.error(err);
            setError("Error applying discount code.");
        }
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
        <div className="min-h-screen bg-[#F5F5DC] p-8 relative overflow-hidden">
            <BackgroundLeaves />
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
                theme="light"
            />
            <div className="relative z-10 max-w-7xl mx-auto">
                <header className="flex items-center justify-between mb-12">
                    <motion.h1
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="text-4xl font-bold bg-gradient-to-r from-[#2D4B33] to-[#355E3B] bg-clip-text text-transparent"
                    >
                        <BookOpenIcon className="w-12 h-12 mr-4 inline-block" />
                        Meal Kit Subscription
                    </motion.h1>
                </header>

                {/* Discount Code Input */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-[#2D4B33]">Discount Code</h2>
                    <div className="flex">
                        <input
                            type="text"
                            placeholder="Enter discount code"
                            value={discountCode}
                            onChange={(e) => setDiscountCode(e.target.value)}
                            className="w-full px-6 py-4 rounded-2xl bg-[#ffffff08] border border-[#2D4B33] text-[#2D4B33] placeholder-[#2D4B33] focus:outline-none focus:ring-2 focus:ring-[#355E3B] transition-all"
                        />
                        <button
                            type="button"
                            onClick={applyDiscount}
                            className="ml-4 px-6 py-4 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] text-white rounded-2xl"
                        >
                            Apply
                        </button>
                    </div>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                    {success && <div className="text-green-500 mt-2">{success}</div>}
                </div>

                <div className="flex items-center justify-center space-x-6 relative z-10">
                    <button
                        onClick={handlePrev}
                        className="text-[#2D4B33] text-4xl hover:text-[#355E3B] transition-all duration-300"
                    >
                        &#10094;
                    </button>

                    <div className="flex space-x-6">
                        {getVisibleCards().map((meal, index) => (
                            <motion.div
                                key={meal.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className={`relative p-8 rounded-2xl shadow-lg border-2 cursor-pointer flex flex-col justify-between transform transition-all duration-500 
                  bg-gradient-to-br from-[#A8E6CF] to-[#DCEDC1] border-[#2D4B33] shadow-xl`}
                                style={{ width: '300px', height: '500px' }}
                                onClick={() => handleSelect(meal)}
                            >
                                <div className="text-6xl mb-6 text-[#2D4B33]">{meal.icon}</div>
                                <h3 className="text-4xl font-bold mb-6 text-[#2D4B33]">{meal.title}</h3>
                                <p className="text-lg opacity-90 mb-6 text-[#2D4B33]">{meal.description}</p>
                                <p className="text-2xl font-semibold text-[#2D4B33]">${calculatePrice(meal.basePrice)} / {formData.subscriptionType}</p>
                            </motion.div>
                        ))}
                    </div>

                    <button
                        onClick={handleNext}
                        className="text-[#2D4B33] text-4xl hover:text-[#355E3B] transition-all duration-300"
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
                                    <h2 className="text-2xl font-bold text-[#2D4B33]">Confirm Your Choice</h2>
                                    <button
                                        onClick={handleCancel}
                                        className="p-2 hover:bg-[#ffffff10] rounded-lg"
                                    >
                                        <XMarkIcon className="w-6 h-6 text-[#2D4B33]" />
                                    </button>
                                </div>
                                <p className="text-lg mb-4 text-[#2D4B33]">You selected: <span className="font-semibold">{selectedChoice.title}</span></p>
                                <p className="text-xl mb-4 font-semibold text-[#2D4B33]">Total Price: <span>${calculatePrice(selectedChoice.basePrice)}</span></p>
                                <div className="flex justify-end gap-4">
                                    <GlowingButton
                                        onClick={handleConfirm}
                                        className="bg-[#2D4B33] hover:bg-[#355E3B] text-white"
                                    >
                                        Confirm & Pay
                                    </GlowingButton>
                                    <GlowingButton
                                        onClick={handleCancel}
                                        className="bg-red-600 hover:bg-red-500 text-white"
                                    >
                                        Cancel
                                    </GlowingButton>
                                </div>
                            </FloatingCard>
                        </motion.div>
                    )}
                </AnimatePresence>;
            </div>
        </div>
    );
};

export default SubscriptionChoicePage;