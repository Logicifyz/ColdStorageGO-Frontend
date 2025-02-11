import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Listing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mealKit, setMealKit] = useState(null);
  const [otherMealKits, setOtherMealKits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [currentResponse, othersResponse] = await Promise.all([
          api.get(`/api/MealKit/${id}`),
          api.get(`/api/MealKit?exclude=${id}`)
        ]);
        setMealKit(currentResponse.data);
        setOtherMealKits(othersResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
        <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] bg-clip-text animate-pulse">
          Sizzling up your meal...
        </div>
      </div>
    );
  }

  if (!mealKit) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d]">
        <div className="text-2xl font-bold text-red-400">
          🔍 Meal kit not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at center, #ffffff 10%, transparent 20%)`,
        backgroundSize: '30px 30px'
      }} />
      
      <ToastContainer theme="dark" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 relative z-10">
          {/* Image Section */}
          <div className="lg:w-1/2 transform hover:rotate-1 transition-transform duration-300">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e53] rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
              <img
                src={`data:image/jpeg;base64,${mealKit.listingImage}`}
                alt={mealKit.name}
                className="w-full h-[600px] object-cover rounded-3xl shadow-2xl border-4 border-[#ffffff10] transform hover:scale-101 transition-transform"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 space-y-8 backdrop-blur-sm bg-[#ffffff05] p-8 rounded-3xl border border-[#ffffff10]">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] bg-clip-text text-transparent">
                {mealKit.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#ff6b6b]">
                  ${mealKit.price.toFixed(2)}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-[#ffffff20] to-transparent" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {mealKit.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#ffffff10] rounded-full text-sm font-medium backdrop-blur-sm border border-[#ffffff15] hover:bg-[#ffffff20] transition-colors"
                >
                  #{tag.toLowerCase()}
                </span>
              ))}
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-[#ff8e53]">Ingredients</h2>
              <p className="text-lg leading-relaxed text-gray-300">
                {mealKit.ingredients}
              </p>
            </div>

            <button
              onClick={() => addToCart(mealKit.mealKitId, mealKit.price)}
              className="w-full py-5 px-8 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] rounded-2xl font-bold text-lg transform hover:scale-[1.02] transition-transform shadow-lg hover:shadow-xl hover:shadow-[#ff6b6b30]"
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>

        {/* Other Meal Kits Section */}
        <div className="mt-24">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] bg-clip-text text-transparent mb-12">
            More Culinary Adventures
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherMealKits.map((kit) => (
              <div 
                key={kit.mealKitId}
                className="group relative transform hover:-translate-y-2 transition-transform duration-300"
                onClick={() => navigate(`/listing/${kit.mealKitId}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e53] rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="h-full flex flex-col bg-[#ffffff05] backdrop-blur-sm rounded-3xl p-6 border border-[#ffffff10] hover:border-[#ffffff20] transition-all cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl aspect-square">
                    <img
                      src={`data:image/jpeg;base64,${kit.listingImage}`}
                      alt={kit.name}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="mt-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-200 line-clamp-2">
                      {kit.name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {kit.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-[#ffffff10] text-sm rounded-full border border-[#ffffff15]"
                        >
                          #{tag.toLowerCase()}
                        </span>
                      ))}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-2xl font-bold text-[#ff8e53]">
                        ${kit.price.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(kit.mealKitId, kit.price);
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] rounded-xl font-bold hover:scale-105 transition-transform"
                      >
                        + Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;