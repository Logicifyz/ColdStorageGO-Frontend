import React, { useState } from 'react';
import API from '../api';  // Ensure your API endpoint setup is correct.

const SubscriptionForm = () => {
    const [formData, setFormData] = useState({
        frequency: '',
        deliveryTimeSlot: '',
        subscriptionChoice: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await API.post('/subscriptions', formData);
            alert('Subscription Created Successfully!');
        } catch (error) {
            alert('Error creating subscription');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="p-8 bg-white rounded-lg shadow-lg space-y-4 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-center mb-6">Create Your Subscription</h2>

                {/* Frequency of Delivery */}
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Frequency of Delivery
                </label>
                <select
                    name="frequency"
                    onChange={handleChange}
                    required
                    className="block w-full p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Select Frequency</option>
                    <option value="1">1 Meal per day</option>
                    <option value="2">2 Meals per day</option>
                    <option value="3">3 Meals per day</option>
                </select>

                {/* Delivery Timeslot */}
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Delivery Timeslot
                </label>
                <select
                    name="deliveryTimeSlot"
                    onChange={handleChange}
                    required
                    className="block w-full p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Select Time Slot</option>
                    <option value="8-9AM">8-9 AM</option>
                    <option value="9-10AM">9-10 AM</option>
                </select>

                {/* Subscription Choice */}
                <label className="block mb-2 text-sm font-medium text-gray-700">
                    Subscription Choice
                </label>
                <select
                    name="subscriptionChoice"
                    onChange={handleChange}
                    required
                    className="block w-full p-2 border border-gray-300 rounded-lg"
                >
                    <option value="">Select Subscription</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                </select>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="mt-4 w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default SubscriptionForm;