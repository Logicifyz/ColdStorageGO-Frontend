import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import api from '../api';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QfdWdBwKaF4UCL2U5tt4GMubmDduDxy50PaDfVW0PKkb9bWlpYl7SIxDvxpjkIxUYrKPGdvBsCAvALCYshj8rOZ00HIxcZmFn');

const SubscriptionChoicePage = () => {
    const { state: formData } = useLocation();
    const [selectedChoice, setSelectedChoice] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const SubChoice = [
        {
            title: "Vegetarian",
            basePrice: 6,
            description: "A variety of plant-based meals packed with fresh vegetables, grains, and protein alternatives for a healthy lifestyle.",
        },
        {
            title: "Pescetarian",
            basePrice: 7,
            description: "Delicious seafood-based dishes combined with fresh vegetables, whole grains, and nutrient-packed meals.",
        },
        {
            title: "Halal",
            basePrice: 6,
            description: "Halal-certified meals with ethically sourced ingredients, focusing on balanced nutrition and cultural preferences.",
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
            // ✅ Ensure the session cookie exists before the API call
            const sessionId = document.cookie
                .split('; ')
                .find(row => row.startsWith('SessionId'))
                ?.split('=')[1];


            const sessionResponse = await api.get('/api/account/profile', { withCredentials: true });
            const userId = sessionResponse.data.userId;

            const response = await api.post('/api/stripe/create-checkout-session', {
                userId: userId,
                mealKitId: "543e4567-e89b-12d3-a456-426614174001",
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
            alert('Error with payment process');
        }
    };


    const handleCancel = () => {
        setShowPopup(false);
        setSelectedChoice(null);
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8">
            <h2 className="text-4xl font-bold mb-8">Select Your Meal Kit</h2>

            {/* Card Layout Section */}
            <div className="grid grid-cols-3 gap-12 max-w-5xl">
                {SubChoice.map((meal, index) => (
                    <div
                        key={index}
                        className={`p-8 rounded-lg shadow-lg border-2 cursor-pointer transform transition-all flex flex-col justify-between
                        ${selectedChoice?.title === meal.title ? 'border-yellow-500 scale-105' : 'border-gray-700'}`}
                        onClick={() => handleSelect(meal)}
                    >
                        <h3 className="text-2xl font-bold mb-4">{meal.title}</h3>
                        <p className="text-lg mb-4">{meal.description}</p>
                        <p className="text-lg font-semibold">${calculatePrice(meal.basePrice)} / {formData.subscriptionType}</p>
                    </div>
                ))}
            </div>

            {/* Popup Modal Section */}
            {showPopup && selectedChoice && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
                    <div className="bg-gray-800 text-white p-12 rounded-lg shadow-lg text-center max-w-2xl space-y-6">
                        <h3 className="text-3xl font-bold mb-6">Confirm Your Choice</h3>
                        <p className="text-lg mb-4">You selected: {selectedChoice.title}</p>
                        <p className="text-lg mb-4">Total Price: ${calculatePrice(selectedChoice.basePrice)}</p>
                        <button
                            onClick={handleConfirm}
                            className="px-8 py-4 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition duration-300"
                        >
                            Proceed to Payment
                        </button>
                        <button
                            onClick={handleCancel}
                            className="px-8 py-4 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition duration-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionChoicePage;
