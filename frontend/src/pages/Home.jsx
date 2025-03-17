﻿import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    useEffect(() => {
        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    return (
        <div className="relative font-sans overflow-hidden min-h-screen bg-[#F0EAD6] text-[#2D4B33]">
            {/* Blob Animation Styles */}
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
          .animation-delay-4000 {
            animation-delay: 4s;
          }
      `}</style>

            {/* Abstract Liquid Gradient Blob Shapes */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#355E3B] to-[#E2F2E6] opacity-30 rounded-full filter blur-3xl animate-blob -z-10"></div>
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-[#355E3B] to-[#E2F2E6] opacity-30 rounded-full filter blur-3xl animate-blob animation-delay-2000 -z-10"></div>
            <div className="absolute -top-10 -left-10 w-72 h-72 bg-gradient-to-br from-[#355E3B] to-[#E2F2E6] opacity-25 rounded-full filter blur-2xl animate-blob animation-delay-4000 -z-10"></div>
            <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-gradient-to-br from-[#355E3B] to-[#E2F2E6] opacity-25 rounded-full filter blur-2xl animate-blob -z-10"></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-[#355E3B] to-[#E2F2E6] opacity-20 rounded-full filter blur-xl animate-blob -translate-x-1/2 -translate-y-1/2 -z-20"></div>

            {/* Circular Gradient Background */}
            <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] bg-[radial-gradient(circle,rgba(45,75,51,0.3)_10%,rgba(53,94,59,0.3)_40%,rgba(226,242,230,0.8)_90%)] rounded-full blur-3xl" />
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center px-6">
                <div className="max-w-4xl text-center space-y-8">
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[#2D4B33] leading-[1.1]">
                        From Scraps to
                        <br className="hidden md:block" /> Scrumptious.
                    </h1>
                    <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                        Transforming <span className="font-semibold">food waste</span> into{" "}
                        <span className="font-semibold">culinary excellence</span> through sustainable innovation and mindful consumption.
                    </p>
                    <Link
                        to="/gallery"
                        className="mt-8 inline-block px-10 py-4 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] rounded-full text-lg font-semibold text-white hover:scale-105 transition-transform duration-300"
                    >
                        Start Your Journey →
                    </Link>
                </div>
            </section>

            {/* About Us Sections */}
            <div className="max-w-7xl mx-auto px-6 space-y-32 py-32">
                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-6 md:pr-12">
                        <h3 className="text-4xl font-bold text-[#2D4B33]">
                            A Whole New Revolution
                        </h3>
                        <p className="text-lg leading-relaxed">
                            We're redefining sustainability in the food industry by converting potential waste into nutritious, chef-curated meal kits. Our process ensures maximum freshness while minimizing environmental impact.
                        </p>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2D4B33]/20 to-[#355E3B]/20 rounded-3xl transform group-hover:rotate-2 transition duration-500" />
                        <img
                            src="/Vegetables.jpg"
                            alt="Fresh vegetables"
                            className="relative rounded-3xl transform group-hover:-rotate-1 transition duration-500"
                        />
                    </div>
                </section>

                <section className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative group md:order-last">
                        <div className="absolute inset-0 bg-gradient-to-l from-[#2D4B33]/20 to-[#355E3B]/20 rounded-3xl transform group-hover:-rotate-2 transition duration-500" />
                        <img
                            src="/Grocery.jpg"
                            alt="Grocery delivery"
                            className="relative rounded-3xl transform group-hover:rotate-1 transition duration-500"
                        />
                    </div>
                    <div className="space-y-6 md:pl-12">
                        <h3 className="text-4xl font-bold text-[#2D4B33]">
                            Farm to Future
                        </h3>
                        <p className="text-lg leading-relaxed">
                            Our network of local farms and eco-conscious suppliers ensures every ingredient tells a story of sustainability. Through innovative cold storage and smart logistics, we maintain freshness from harvest to your kitchen.
                        </p>
                    </div>
                </section>
            </div>

            {/* Mission Statement */}
            <section className="py-32 bg-gradient-to-br from-[#F0EAD6] to-[#E2F2E6]">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <blockquote className="text-3xl md:text-4xl leading-relaxed font-light italic">
                        “At ColdStorage:GO, we believe every ingredient deserves a second chance. Our mission is to transform overlooked resources into extraordinary culinary experiences while nurturing our planet.”
                    </blockquote>
                </div>
            </section>

            {/* Floating Back to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 p-4 bg-gradient-to-br from-[#2D4B33] to-[#355E3B] rounded-full shadow-xl hover:scale-110 transition-transform duration-300 ${isVisible ? "opacity-100" : "opacity-0"
                    }`}
                aria-label="Back to top"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </div>
    );
};

export default Home;
