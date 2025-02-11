import React from "react";

const Home = () => {
    // The common clipPath for our gradient shapes
    const clipPathPolygon =
        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)";

    return (
        <div className="relative bg-[#1E1E1E] text-white font-sans overflow-hidden">
            {/* Gradient Backgrounds */}
            <div className="absolute inset-0 -z-10">
                {/* Top Gradient Shapes */}
                <div
                    className="absolute inset-x-0 -top-20 transform-gpu overflow-hidden blur-3xl sm:-top-60"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#2e2e2e] to-[#0f9d58] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                        style={{ clipPath: clipPathPolygon }}
                    />
                    <div
                        className="absolute inset-x-0 top-10 transform-gpu overflow-hidden blur-3xl sm:top-40"
                        aria-hidden="true"
                    >
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[70deg] bg-gradient-to-tr from-[#3c3c3c] to-[#00b894] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{ clipPath: clipPathPolygon }}
                        />
                    </div>
                </div>
                {/* Bottom Gradient Shape */}
                <div
                    className="absolute inset-x-0 bottom-[-13rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:bottom-[-30rem]"
                    aria-hidden="true"
                >
                    <div
                        className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#2e2e2e] to-[#08b059] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                        style={{ clipPath: clipPathPolygon }}
                    />
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative text-center py-20 px-6">
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                    From Scraps to Scrumptious.
                </h1>
                <p className="mt-4 text-lg text-gray-300">
                    Offering{" "}
                    <span className="text-green-400">
                        Fresh, Green, Curated &amp; Brilliance
                    </span>{" "}
                    all at <span className="font-bold">once.</span>
                </p>
                <button className="mt-6 px-8 py-3 bg-gray-600 rounded-full hover:bg-gray-500 transition">
                    GET STARTED →
                </button>
            </div>

            {/* About Us Section */}
            <div className="max-w-5xl mx-auto py-16 px-6">
                <h2 className="text-center text-2xl font-bold">About us</h2>

                <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
                    {/* Left Text */}
                    <div>
                        <h3 className="italic text-xl">A Whole New Revolution.</h3>
                        <p className="mt-3 text-gray-400">
                            Dedicated to reducing food waste while making mealtime convenient
                            and affordable.
                        </p>
                        <p className="mt-3 text-gray-400">
                            Specializing in transforming expiring ingredients into thoughtfully
                            curated meal kits, ensuring quality, freshness, and sustainability.
                        </p>
                    </div>
                    {/* Right Image */}
                    <img
                        src="/images/vegetables.jpg"
                        alt="Vegetables"
                        className="rounded-lg shadow-lg"
                    />
                </div>

                <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
                    {/* Left Image */}
                    <img
                        src="../../public/grocery.jpg"
                        alt="Grocery"
                        className="rounded-lg shadow-lg"
                    />
                    {/* Right Text */}
                    <div>
                        <h3 className="italic text-xl">Fresh from the source.</h3>
                        <p className="mt-3 text-gray-400">
                            <span className="font-bold">Cold Storage</span> empowers households
                            to enjoy delicious, ready-to-cook meals delivered right to their
                            doorstep, all while supporting a greener planet and smarter grocery
                            solutions.
                        </p>
                        <p className="mt-3 text-gray-400">
                            At Cold Storage, we source our groceries from a trusted network of local
                            farms, organic suppliers, and eco-conscious producers.
                        </p>
                    </div>
                </div>

                <div className="text-center mt-10">
                    <button className="px-8 py-3 bg-gray-600 rounded-full hover:bg-gray-500 transition">
                        GET STARTED
                    </button>
                </div>
            </div>

            {/* Quote Section */}
            <div className="bg-gray-800 py-10 text-center text-gray-300 italic px-6">
                "Every ingredient has a purpose – at ColdStorage:GO, we turn what others might
                waste into meals that nourish, inspire, and sustain a brighter future."
            </div>

            {/* Back to Top Button */}
            <div className="text-center py-6">
                <button className="px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition">
                    Back To Top
                </button>
            </div>
        </div>
    );
};

export default Home;
