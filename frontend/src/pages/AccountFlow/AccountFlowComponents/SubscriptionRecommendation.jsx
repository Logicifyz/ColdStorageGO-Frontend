import React, { useState, useEffect } from 'react';
import api from '../../../api';

const SubscriptionRecommendation = ({ userId }) => {
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                const response = await api.get(`/api/subscriptions/recommendation/${userId}`);
                console.log('Recommendation Response:', response.data);
                setRecommendation(response.data);
            } catch (error) {
                console.error('Error fetching recommendation:', error);
                setRecommendation(null);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendation();
    }, [userId]);

    if (loading) return <p className="text-gray-600 text-center animate-pulse">Loading recommendations...</p>;
    if (!recommendation || !recommendation.recommendedChoice) return null;

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-green-300 mt-6">
            <h3 className="text-xl font-semibold text-green-700 mb-4">Smart Recommendation</h3>
            <div className="space-y-2">
                <p className="text-gray-700">
                    <strong>Recommended Plan:</strong>{" "}
                    <span className="text-green-600 font-medium">{recommendation.recommendedChoice}</span>
                </p>
                <p className="text-gray-600 italic">"{recommendation.reason}"</p>
            </div>
        </div>
    );
};

export default SubscriptionRecommendation;