import React, { useEffect, useState } from "react";
import api from "../api";

const Gallery = () => {
    const [mealKits, setMealKits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMealKits = async () => {
            try {
                const response = await api.get("/api/MealKit");
                setMealKits(response.data);
            } catch (error) {
                console.error("Error fetching meal kits:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMealKits();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-500">Loading meal kits...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <h1 className="text-3xl font-bold text-center text-green-700 mb-5">
                Meal Kit Gallery
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mealKits.map((mealKit) => (
                    <div
                        key={mealKit.mealKitId}
                        className="bg-white shadow-md rounded-lg p-4"
                    >
                        <h2 className="text-xl font-semibold text-green-800">
                            {mealKit.name}
                        </h2>
                        <p className="text-gray-600">Price: {mealKit.price}</p>
                        <p className="text-gray-500">
                            Expires on: {new Date(mealKit.expiryDate).toLocaleDateString()}
                        </p>
                        {mealKit.listingImage && (
                            <img
                                src={`data:image/jpeg;base64,${mealKit.listingImage}`}
                                alt={mealKit.name}
                                className="mt-3 w-full h-48 object-cover rounded-lg"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
