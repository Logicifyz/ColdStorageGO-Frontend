import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const BackgroundBlobs = () => (
    <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-to-r from-[#302b63] to-[#24243e] opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-[#4b379c] to-[#1a1a2e] opacity-20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>
);

const GlowingButton = ({ children, onClick, className = "", type = "button", disabled = false }) => (
    <motion.button
        type={type}
        whileHover={{ scale: disabled ? 1 : 1.05 }}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={onClick}
        disabled={disabled}
        className={`relative overflow-hidden px-6 py-3 rounded-2xl font-medium ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
    >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#4f46e5] to-[#8b5cf6] opacity-20 blur-md" />
    </motion.button>
);

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
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (step < 3) {
            setStep(step + 1);
        } else {
            navigate('/subscription-choices', { state: formData });
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const renderQuestion = () => {
        switch (step) {
            case 1:
                return "What's Your Daily Appetite?";
            case 2:
                return "When Should Your Meals Arrive?";
            case 3:
                return "Choose Your Subscription Plan.";
            default:
                return "Create Your Subscription";
        }
    };

    const renderDescription = () => {
        if (step === 1) {
            return "Select how many meals you want per day. More meals mean better discounts!";
        }

        if (step === 2) {
            return "Choose your preferred delivery time slot. You can cancel or reschedule anytime!";
        }

        if (step === 3) {
            return "Pick a subscription plan that suits your lifestyle. Monthly plans offer discounts!";
        }

        return "Select an option to see more details!";
    };

    const renderOptions = () => {
        if (step === 1) {
            return (
                <div className="grid grid-cols-3 gap-6">
                    {['1 Meal', '2 Meals', '3 Meals'].map((value) => (
                        <motion.div
                            key={value}
                            onClick={() => handleSelect('frequency', value.split(' ')[0])}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`cursor-pointer p-6 flex flex-col justify-center items-center 
                rounded-lg border-2 transition-all duration-300 
                bg-[#1a1a2e] text-gray-200 shadow-md hover:shadow-lg hover:scale-105
                ${formData.frequency === value.split(' ')[0]
                                    ? 'border-purple-500 scale-110 shadow-lg'
                                    : 'border-[#555555]'
                                }`}
                        >
                            <p className="text-2xl font-bold text-purple-400">{value.split(' ')[0]}</p>
                            <p className="text-lg text-gray-300">{value.split(' ')[1]}</p>
                        </motion.div>
                    ))}
                </div>
            );
        }

        if (step === 2) {
            return (
                <div className="grid grid-cols-3 gap-4">
                    {[
                        '7-8AM',
                        '8-9AM',
                        '9-10AM',
                        '10-11AM',
                        '11-12PM',
                        '12-1PM',
                        '1-2PM',
                        '2-3PM',
                        '3-4PM',
                        '4-5PM',
                        '5-6PM',
                        '6-7PM',
                        '7-8PM',
                        '8-9PM',
                        '9-10PM',
                    ].map((time) => (
                        <motion.div
                            key={time}
                            onClick={() => handleSelect('deliveryTimeSlot', time)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`cursor-pointer p-4 flex flex-col justify-center items-center 
                rounded-lg border-2 transition-all duration-300 
                bg-[#1a1a2e] text-gray-200 shadow-md hover:shadow-lg hover:scale-105
                ${formData.deliveryTimeSlot === time
                                    ? 'border-purple-500 scale-110 shadow-lg'
                                    : 'border-[#555555]'
                                }`}
                        >
                            <p className="text-xl font-bold text-purple-400">{time}</p>
                        </motion.div>
                    ))}
                </div>
            );
        }

        if (step === 3) {
            return (
                <div className="grid grid-cols-2 gap-6">
                    {['Monthly', 'Weekly'].map((type) => (
                        <motion.div
                            key={type}
                            onClick={() => handleSelect('subscriptionType', type)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`cursor-pointer p-6 flex flex-col justify-center items-center 
                rounded-lg border-2 transition-all duration-300 
                bg-[#1a1a2e] text-gray-200 shadow-md hover:shadow-lg hover:scale-105
                ${formData.subscriptionType === type
                                    ? 'border-purple-500 scale-110 shadow-lg'
                                    : 'border-[#555555]'
                                }`}
                        >
                            <p className="text-2xl font-bold text-purple-400">{type}</p>
                        </motion.div>
                    ))}
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#0b0b1a] text-gray-100 relative overflow-hidden p-8">
            <BackgroundBlobs />
            <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center h-full">
                {/* Progress Bar */}
                <div className="w-full max-w-2xl mb-8 flex justify-center items-center text-center">
                    <motion.ol
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex items-center w-full text-sm font-medium text-center text-gray-400 sm:text-base"
                    >
                        {[1, 2, 3].map((checkpoint, index) => (
                            <motion.li
                                key={checkpoint}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: checkpoint * 0.2 }}
                                className={`flex md:w-full items-center ${step >= checkpoint ? 'text-purple-500' : 'text-gray-400'
                                    } ${index < 2 ? 'sm:after:content-[""] after:w-full after:h-1 after:border-b after:border-gray-600 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10' : ''}`} // Only add the line for the first two steps
                            >
                                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-600">
                                    {step > checkpoint ? (
                                        <svg
                                            className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                        </svg>
                                    ) : (
                                        <span className="me-2">{checkpoint}</span>
                                    )}
                                    {checkpoint === 1 && 'Appetite'}
                                    {checkpoint === 2 && 'Delivery'}
                                    {checkpoint === 3 && 'Plan'}
                                </span>
                            </motion.li>
                        ))}
                    </motion.ol>
                </div>

                {/* Header Section */}
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                >
                    {renderQuestion()}
                </motion.h1>

                {/* Dynamic Description Box */}
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-lg text-gray-400 text-center mb-8 max-w-2xl"
                >
                    {renderDescription()}
                </motion.p>

                {/* Options Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="w-full max-w-2xl"
                >
                    {renderOptions()}
                </motion.div>

                {/* Button Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex justify-center w-full max-w-md mt-12 space-x-6"
                >
                    {step > 1 && (
                        <GlowingButton
                            onClick={handleBack}
                            className="bg-[#444444] hover:bg-[#555555] text-white"
                        >
                            Back
                        </GlowingButton>
                    )}

                    <GlowingButton
                        onClick={handleNext}
                        disabled={
                            (!formData.frequency && step === 1) ||
                            (!formData.deliveryTimeSlot && step === 2) ||
                            (!formData.subscriptionType && step === 3)
                        }
                        className="bg-purple-500 hover:bg-purple-600 text-white"
                    >
                        {step === 3 ? 'Confirm & Next' : 'Next'}
                    </GlowingButton>
                </motion.div>
            </div>
        </div>
    );
};

export default SubscriptionForm;