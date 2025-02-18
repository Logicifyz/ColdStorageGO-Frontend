import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const statusColors = {
    active: "bg-green-500 text-white",
    default: "bg-gray-300 text-gray-700"
};

const SubscriptionForm = () => {
    const [formData, setFormData] = useState({
        frequency: '',
        deliveryTimeSlot: '',
        subscriptionType: '',
    });
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleSelect = (field, value) => {
        setFormData({ ...formData, [field]: value });
        toast.success(`${value} selected!`, { duration: 1500 });
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            toast.success("Redirecting To Subscription Choices", { duration: 2000 });
            setTimeout(() => navigate('/subscription-choices', { state: formData }), 2000);
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5DC] flex items-center justify-center p-8">
            <Toaster position="top-right" />
            <div className="w-full max-w-5xl flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-10"
                >
                    <div className="p-4 bg-gradient-to-br from-[#2D4B33] to-[#355E3B] rounded-xl shadow-lg">
                        <span className="text-3xl">📦</span>
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#2D4B33] to-[#355E3B] bg-clip-text text-transparent">
                        Subscription Setup
                    </h1>
                </motion.div>

                {/* Steps */}
                <div className="flex space-x-6 mb-8">
                    {["Appetite", "Delivery", "Plan"].map((tab, index) => (
                        <button
                            key={tab}
                            className={`px-6 py-3 rounded-full font-semibold border text-lg transition-colors ${step === index + 1
                                    ? `${statusColors.active}`
                                    : `${statusColors.default} hover:bg-green-600 hover:text-white`
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Form Steps */}
                <div className="bg-green-100 p-8 rounded-xl shadow-lg w-full max-w-3xl">
                    <motion.h2 className="text-2xl font-semibold text-green-700 mb-6 text-center">
                        {step === 1 && "How many meals per day?"}
                        {step === 2 && "Preferred Delivery Time?"}
                        {step === 3 && "Choose Your Subscription Plan"}
                    </motion.h2>

                    <AnimatePresence>
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-3 gap-6"
                        >
                            {/* Step 1: Select Frequency */}
                            {step === 1 && ["1 Meal", "2 Meals", "3 Meals"].map((option) => (
                                <motion.div
                                    key={option}
                                    onClick={() => handleSelect("frequency", option.split(" ")[0])}
                                    className={`cursor-pointer p-6 text-center rounded-lg border-2 transition-all text-xl ${formData.frequency === option.split(" ")[0] ? "border-green-600 bg-green-300" : "border-gray-300 bg-green-200"
                                        } hover:shadow-md hover:scale-105`}
                                >
                                    <p className="font-bold text-green-900">{option}</p>
                                </motion.div>
                            ))}

                            {/* Step 2: Select Delivery Time */}
                            {step === 2 && ["7-8 AM", "8-9 AM", "9-10 AM", "10-11 AM", "11-12 PM", "12-1 PM", "1-2 PM", "2-3 PM", "3-4 PM", "4-5 PM", "5-6 PM", "6-7 PM", "7-8 PM", "8-9 PM", "9-10 PM"].map((time) => (
                                <motion.div
                                    key={time}
                                    onClick={() => handleSelect("deliveryTimeSlot", time)}
                                    className={`cursor-pointer p-4 text-center rounded-lg border-2 transition-all ${formData.deliveryTimeSlot === time ? "border-green-600 bg-green-300" : "border-gray-300 bg-green-200"
                                        } hover:shadow-md hover:scale-105`}
                                >
                                    <p className="text-lg font-bold text-green-900">{time}</p>
                                </motion.div>
                            ))}


                            {/* Step 3: Select Subscription Type */}
                            {step === 3 && ["Monthly", "Weekly", "Annually"].map((type) => (
                                <motion.div
                                    key={type}
                                    onClick={() => handleSelect("subscriptionType", type)}
                                    className={`cursor-pointer p-6 text-center rounded-lg border-2 transition-all text-xl ${formData.subscriptionType === type ? "border-green-600 bg-green-300" : "border-gray-300 bg-green-200"
                                        } hover:shadow-md hover:scale-105`}
                                >
                                    <p className="font-bold text-green-900">{type}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-center w-full max-w-lg mt-8 space-x-8">
                    {step > 1 && (
                        <motion.button
                            onClick={handleBack}
                            className="px-8 py-3 text-lg bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                        >
                            Back
                        </motion.button>
                    )}
                    <motion.button
                        onClick={handleNext}
                        disabled={
                            (!formData.frequency && step === 1) ||
                            (!formData.deliveryTimeSlot && step === 2) ||
                            (!formData.subscriptionType && step === 3)
                        }
                        className="px-8 py-3 text-lg bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                    >
                        {step === 3 ? "Confirm & Next" : "Next"}
                    </motion.button>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionForm;
