import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
                return "How many meals do you want in a day?";
            case 2:
                return "What time would you prefer delivery?";
            case 3:
                return "Choose your subscription type.";
            default:
                return "Create Your Subscription";
        }
    };

    const renderOptions = () => {
        const optionClass = `cursor-pointer p-6 w-48 h-48 flex flex-col justify-center items-center rounded-lg shadow-lg transition-all bg-gradient-to-br from-gray-700 to-gray-800 text-white border-2 transform 
        hover:scale-110 hover:shadow-2xl hover:border-yellow-400 fade-in`;

        if (step === 1) {
            return ['1', '2', '3'].map((value, index) => (
                <div
                    key={value}
                    onClick={() => handleSelect('frequency', value)}
                    className={`${optionClass} ${formData.frequency === value ? 'border-yellow-500 scale-105' : 'border-gray-700'}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                >
                    <p className="text-2xl font-bold">{value} Meal(s)</p>
                </div>
            ));
        }

        if (step === 2) {
            return (
                <div className="grid grid-cols-7 gap-6 justify-center animate-slide-in">
                    {["8-9AM", "9-10AM", "10-11AM", "11-12PM",
                        "12-1PM", "1-2PM", "2-3PM", "3-4PM", "4-5PM",
                        "5-6PM", "6-7PM", "7-8PM", "8-9PM", "9-10PM"
                    ].map((time, index) => (
                        <div
                            key={time}
                            onClick={() => handleSelect('deliveryTimeSlot', time)}
                            className={`${optionClass} ${formData.deliveryTimeSlot === time ? 'border-yellow-500 scale-105' : 'border-gray-700'}`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <p className="text-lg font-bold">{time}</p>
                        </div>
                    ))}
                </div>
            );
        }

        if (step === 3) {
            return ['Monthly', 'Weekly'].map((type, index) => (
                <div
                    key={type}
                    onClick={() => handleSelect('subscriptionType', type)}
                    className={`${optionClass} ${formData.subscriptionType === type ? 'border-yellow-500 scale-105' : 'border-gray-700'}`}
                    style={{ animationDelay: `${index * 0.2}s` }}
                >
                    <p className="text-2xl font-bold">{type}</p>
                </div>
            ));
        }
    };

    return (
        <div className="h-screen bg-charcoal text-white flex flex-col justify-center items-center p-12 overflow-hidden">
            {/* Dynamic Header */}
            <h1 className="text-6xl font-extrabold mb-12 text-center animate-fade-in">
                {renderQuestion()}
            </h1>

            {/* Options Rendering */}
            <div className="flex flex-wrap justify-center gap-8 animate-slide-in">
                {renderOptions()}
            </div>

            {/* Back and Next Buttons Section */}
            <div className="flex justify-center w-full max-w-md mt-12 gap-6">
                {step > 1 && (
                    <button
                        onClick={handleBack}
                        className="w-[45%] h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold inline-block 
                        transform transition-all duration-500 hover:scale-105 hover:shadow-lg fade-up"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #2B2E4A, #4D5C60)',
                        }}
                    >
                        Back
                    </button>
                )}

                <button
                    onClick={handleNext}
                    disabled={!formData.frequency && step === 1 || !formData.deliveryTimeSlot && step === 2 || !formData.subscriptionType && step === 3}
                    className={`w-[45%] h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold inline-block 
                    transform transition-all duration-500 hover:scale-105 hover:shadow-lg fade-up
                    ${step === 3 && formData.subscriptionType ? '' : 'opacity-50'}`}
                    style={{
                        backgroundImage: 'linear-gradient(to right, #4D5C60, #2B2E4A)',
                    }}
                >
                    {step === 3 ? "Confirm & Next" : "Next"}
                </button>
            </div>

            {/* CSS for Animations */}
            <style>
                {`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                @keyframes slide-in {
                    from { opacity: 0; transform: translateX(-30px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slide-in {
                    animation: slide-in 0.8s ease-out forwards;
                }

                @keyframes fade-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .fade-up {
                    animation: fade-up 1s ease-in-out forwards;
                }
                `}
            </style>
        </div>
    );
};

export default SubscriptionForm;
