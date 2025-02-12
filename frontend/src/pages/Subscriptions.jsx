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

    const progressPercentage = (step / 3) * 100;

    return (
        <div className="min-h-screen bg-[#0b0b1a] text-gray-100 relative overflow-hidden p-8">
            <BackgroundBlobs />
            <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center h-full">
                {/* Progress Bar */}
                <div className="w-full max-w-2xl mb-8 relative">
                    <div className="h-2 bg-[#555555] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-500 transition-all duration-700"
                            style={{ width: `${progressPercentage}%` }}
                        />
                    </div>
                    <div className="absolute top-0 left-0 w-full flex justify-between">
                        {[1, 2, 3].map((checkpoint) => (
                            <div
                                key={checkpoint}
                                className={`w-6 h-6 rounded-full flex items-center justify-center 
                  ${step >= checkpoint ? 'bg-purple-500' : 'bg-[#555555]'
                                    } transition-all duration-300`}
                            >
                                {step > checkpoint ? (
                                    <span className="text-white text-sm">✓</span>
                                ) : (
                                    <span className="text-gray-200 text-sm">{checkpoint}</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <p className="text-center mt-2 text-lg text-gray-300">{`Step ${step} of 3`}</p>
                </div>

                {/* Header Section */}
                <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                    {renderQuestion()}
                </h1>

                {/* Dynamic Description Box */}
                <p className="text-lg text-gray-400 text-center mb-8 max-w-2xl">
                    {renderDescription()}
                </p>

                {/* Options Section */}
                <div className="w-full max-w-2xl">{renderOptions()}</div>

                {/* Button Section */}
                <div className="flex justify-center w-full max-w-md mt-12 space-x-6">
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
                </div>
            </div>
        </div>
    );
};

export default SubscriptionForm;