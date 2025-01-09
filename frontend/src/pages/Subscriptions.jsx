import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionForm = () => {
    const [formData, setFormData] = useState({
        frequency: '',
        deliveryTimeSlot: '',
        subscriptionType: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNext = async (e) => {
        e.preventDefault();
        // Navigate to the next page with form data passed
        navigate('/subscription-choices', { state: formData });
    };

    return (
        <div className="h-screen flex bg-charcoal text-white items-center justify-center p-12">
            <div className="flex justify-center items-center gap-40 w-full max-w-7xl">
                {/* Left Side - Image Section */}
                <div className="flex justify-center items-center">
                    <img
                        src="https://i.pinimg.com/736x/fb/94/ca/fb94cab6d7c260b8c5952385d5dfee94.jpg"
                        alt="Healthy Food"
                        className="rounded-lg shadow-lg max-h-[700px] object-cover"
                    />
                </div>

                {/* Right Side - Form Section */}
                <div className="w-[500px]">
                    <form onSubmit={handleNext} className="space-y-6 bg-transparent">
                        <h2 className="text-4xl font-bold text-white mb-6 text-center">
                            Create Your Subscription
                        </h2>

                        {/* Frequency Field */}
                        <div>
                            <label className="text-sm mb-2 block">Frequency of Delivery</label>
                            <select name="frequency" onChange={handleChange} required
                                className="w-full p-3 bg-white text-charcoal border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                                <option value="">Select Frequency</option>
                                <option value="1">1 Meal per day</option>
                                <option value="2">2 Meals per day</option>
                                <option value="3">3 Meals per day</option>
                            </select>
                        </div>

                        {/* Delivery Time Slot */}
                        <div>
                            <label className="text-sm mb-2 block">Delivery Time Slot</label>
                            <select name="deliveryTimeSlot" onChange={handleChange} required
                                className="w-full p-3 bg-white text-charcoal border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                                <option value="">Select Delivery Time Slot</option>
                                <option value="8-9AM">8:00-9:00 AM</option>
                                <option value="9-10AM">9:00-10:00 AM</option>
                            </select>
                        </div>

                        {/* Subscription Type */}
                        <div>
                            <label className="text-sm mb-2 block">Subscription Type</label>
                            <select name="subscriptionType" onChange={handleChange} required
                                className="w-full p-3 bg-white text-charcoal border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                                <option value="">Select Subscription Type</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Weekly">Weekly</option>
                            </select>
                        </div>

                        {/* Next Button */}
                        <button type="submit" className="w-full p-3 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-600 transition duration-300">
                            Next
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionForm;
