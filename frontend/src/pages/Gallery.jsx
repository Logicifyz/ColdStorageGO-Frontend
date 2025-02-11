import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Gallery = () => {
  const [mealKits, setMealKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

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

  const addToCart = async (mealKitId, price, quantity = 1) => {
    try {
      await api.post(
        "/api/Cart",
        { mealKitId, price, quantity },
        {
          headers: {
            SessionId: localStorage.getItem("sessionId"),
          },
          withCredentials: true,
        }
      );
      toast.success("🎉 Added to cart successfully!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(
        error.response?.data || "❌ Failed to add to cart. Please try again."
      );
    }
  };

  const filteredMealKits = mealKits.filter((mealKit) =>
    mealKit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-3xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] bg-clip-text text-transparent animate-pulse">
          Sizzling up your choices...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] relative overflow-hidden p-8">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-[40%] h-[60%] bg-[#ff6b6b10] rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-[#ff8e5310] rounded-full blur-3xl" />
      
      <ToastContainer theme="dark" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] bg-clip-text text-transparent">
            Culinary Gallery
          </h1>
          <div className="w-full md:max-w-xl relative">
            <input
              type="text"
              placeholder="Search gastronomic experiences..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-[#ffffff08] backdrop-blur-sm border border-[#ffffff15] text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all"
            />
            <svg
              className="absolute right-4 top-4 text-gray-400 h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Meal Kits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredMealKits.map((mealKit) => (
            <div
              key={mealKit.mealKitId}
              className="group relative transform hover:-translate-y-2 transition-transform duration-300"
              onClick={() => navigate(`/listing/${mealKit.mealKitId}`)}
            >
              {/* Card Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e53] rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
              
              <div className="h-full flex flex-col bg-[#ffffff05] backdrop-blur-sm rounded-3xl p-6 border border-[#ffffff10] hover:border-[#ffffff20] transition-all cursor-pointer">
                {/* Image Container */}
                <div className="relative overflow-hidden rounded-2xl aspect-square">
                  <img
                    src={`data:image/jpeg;base64,${mealKit.listingImage}`}
                    alt={mealKit.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#000000dd] via-transparent to-transparent" />
                </div>

                {/* Content Section */}
                <div className="mt-6 flex-1 flex flex-col">
                  <h2 className="text-xl font-bold text-gray-200 mb-3 line-clamp-2">
                    {mealKit.name}
                  </h2>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {mealKit.tags?.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-[#ffffff10] text-sm rounded-full border border-[#ffffff15] text-gray-300 hover:bg-[#ffffff20] transition-colors"
                      >
                        #{tag.toLowerCase()}
                      </span>
                    ))}
                  </div>

                  {/* Price and CTA */}
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-bold text-[#ff8e53]">
                      ${mealKit.price.toFixed(2)}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(mealKit.mealKitId, mealKit.price);
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] rounded-xl font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-xl hover:shadow-[#ff6b6b30]"
                    >
                      + Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredMealKits.length === 0 && (
          <div className="text-center py-20">
            <div className="text-3xl text-gray-400 mb-4">🍳 No recipes found</div>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Gallery;