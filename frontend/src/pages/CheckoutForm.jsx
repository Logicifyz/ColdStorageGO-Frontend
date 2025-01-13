import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import api from '../api';  // Your axios setup

const CheckoutForm = ({ onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
        });

        if (error) {
            alert(error.message);
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/api/create-subscription-payment', {
                paymentMethodId: paymentMethod.id,
                amount: 5000, // Example $50.00 charge, adjust as needed
                currency: 'usd',
            });

            if (response.data.success) {
                onSuccess();
            } else {
                alert('Payment failed');
            }
        } catch (error) {
            alert('Error processing payment');
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md bg-gray-800 p-6 rounded-lg">
            <CardElement className="p-4 bg-white rounded-lg" />
            <button
                type="submit"
                disabled={!stripe || loading}
                className={`w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold inline-block
                ${loading ? 'opacity-50' : ''}
                `}
                style={{ backgroundImage: 'linear-gradient(to right, #4D5C60, #2B2E4A)' }}
            >
                {loading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

export default CheckoutForm;
