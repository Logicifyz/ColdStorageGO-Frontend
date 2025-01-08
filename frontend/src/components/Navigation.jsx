import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";

const Navigation = () => {
    return (
        <nav className="bg-[#383838] text-white sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-6">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <img src="/CSGO.PNG" alt="Cold Storage Go" className="h-14 w-auto" />

                </div>

                {/* Links */}
                <div className="flex space-x-6">
                    <Link to="/" className="hover:text-gray-300">Home</Link>
                    <Link to="/mealkits" className="hover:text-gray-300">Mealkits</Link>
                    <Link to="/subscribe" className="hover:text-gray-300">Subscribe</Link>
                    <Link to="/rewards" className="hover:text-gray-300">Rewards</Link>
                    <Link to="/help" className="hover:text-gray-300">Help Centre</Link>
                    <Link to="/forum" className="hover:text-gray-300">Forum</Link>
                </div>

                {/* Login and Cart */}
                <div className="flex items-center space-x-4">
                    <button className="border border-white px-4 py-2 rounded hover:bg-white hover:text-[#383838]">Login</button>
                    <div className="relative">
                        <AiOutlineShoppingCart className="w-6 h-6" />
                        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">3</span>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
