import React, { useState, useEffect } from 'react';
import api from '../api';

const DeliveryTracking = () => {
    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        const response = await api.get('/api/deliveries');
        setDeliveries(response.data);
    };

    const updateDeliveryStatus = async (deliveryId, status) => {
        await api.put(`/api/deliveries/${deliveryId}/status`, `"${status}"`, {
            headers: { 'Content-Type': 'application/json' },
        });
        fetchDeliveries();
    };

    return (
        <div className="p-8 text-white bg-gray-900">
            <h1 className="text-4xl font-bold mb-6">Delivery Tracking</h1>
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th>Delivery ID</th>
                        <th>Order ID</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {deliveries.map(delivery => (
                        <tr key={delivery.deliveryId}>
                            <td>{delivery.deliveryId}</td>
                            <td>{delivery.orderId}</td>
                            <td>{delivery.deliveryStatus}</td>
                            <td>
                                <button onClick={() => updateDeliveryStatus(delivery.deliveryId, 'Out for Delivery')} className="text-blue-500 mr-2">Out for Delivery</button>
                                <button onClick={() => updateDeliveryStatus(delivery.deliveryId, 'Delivered')} className="text-green-500">Delivered</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeliveryTracking;
