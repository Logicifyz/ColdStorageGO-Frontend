import React, { useEffect, useState } from "react";
import api from "../api";

const Gallery = () => {
    const [mealKits, setMealKits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

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

    const filteredMealKits = mealKits.filter((mealKit) =>
        mealKit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center text-gray-400">Loading meal kits...</div>;
    }

    return (
        <div className="min-h-screen bg-[#383838] px-5 py-5">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-3xl font-bold text-left text-gray-200">
                    Meal Kit Gallery
                </h1>
                <div className="flex justify-end w-full max-w-md">
                    <input
                        type="text"
                        placeholder="Search meal kits..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg bg-[#292929] text-gray-200 placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-900"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 px-10">
                {filteredMealKits.map((mealKit) => (
                    <div
                        key={mealKit.mealKitId}
                        className="bg-[#383838] p-4 w-[300px] mx-auto"
                    >
                        <img
                            src={`data:image/jpeg;base64,${mealKit.listingImage}`}
                            alt={mealKit.name}
                            className="w-full h-[275px] object-cover rounded-lg"
                            style={{ width: "100%", height: "275px" }}
                        />
                        <div className="mt-4 flex justify-between">
                            <h2 className="text-lg font-bold text-gray-200">{mealKit.name}</h2>
                            <p className="text-lg font-bold text-gray-200">${mealKit.price.toFixed(2)}</p>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {mealKit.tags?.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 bg-[#2B2E4A] text-white text-sm font-medium rounded-full border border-gray-500 flex-shrink-0"
                                    style={{ maxWidth: "calc(100% - 10px)", flexBasis: "auto" }}
                                >
                                    {tag.toUpperCase()}
                                </span>
                            ))}
                        </div>
                        <button
                            className="mt-4 w-full bg-[#FF4B4B] text-white font-bold py-2 rounded-full hover:bg-[#E04343] transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Gallery;
