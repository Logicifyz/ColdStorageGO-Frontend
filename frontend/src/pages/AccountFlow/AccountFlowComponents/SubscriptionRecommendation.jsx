import React, { useState, useEffect } from 'react';
import api from '../../../api';

const SubscriptionRecommendation = ({ userId }) => {
    const [recommendation, setRecommendation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendation = async () => {
            try {
                const response = await api.get(`/api/subscriptions/recommendation/${userId}`);
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

    if (loading) return <p className="text-gray-400 text-center">Loading recommendations...</p>;
    if (!recommendation || !recommendation.recommendedPlan) return null;

    return (
        <div className="bg-gray-700 p-6 rounded-lg shadow-md mt-4">
            <h3 className="text-lg font-semibold mb-2">Smart Recommendation</h3>
            <p className="text-gray-300">
                <strong>Recommended Plans:</strong> {recommendation.recommendedPlan}
            </p>
            <p className="text-gray-400">{recommendation.reason}</p>
        </div>
    );
};

export default SubscriptionRecommendation;
