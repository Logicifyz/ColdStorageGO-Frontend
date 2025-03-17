import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
    return (
        <>
            <style>{`
        @keyframes blob {
          0% { transform: scale(1); }
          33% { transform: scale(1.1); }
          66% { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
            <div className="relative flex items-center justify-center min-h-screen bg-[#F0EAD6] overflow-hidden">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#2D4B33] to-[#E2F2E6] opacity-30 rounded-full filter blur-3xl animate-blob"></div>
                <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#355E3B] to-[#E2F2E6] opacity-30 rounded-full filter blur-3xl animate-blob animation-delay-2000"></div>

                <div className="relative z-10 text-center p-8">
                    <h1 className="text-4xl md:text-6xl font-bold text-[#2D4B33] mb-4">
                        Order Success!
                    </h1>
                    <p className="text-xl text-gray-700 mb-8">
                        Your order has been successfully placed. View this in{" "}
                        <span className="font-bold text-[#2D4B33]">My Orders</span>!
                    </p>
                    <div className="flex justify-center">
                        <Link
                            to="/"
                            className="px-6 py-3 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] hover:from-[#355E3B] hover:to-[#2D4B33] transition text-white font-semibold rounded-lg"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrderSuccess;
