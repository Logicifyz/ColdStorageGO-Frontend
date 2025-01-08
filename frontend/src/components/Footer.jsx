import React from "react";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#383838] text-white py-6 mt-auto">
            <div className="container mx-auto px-6 flex flex-wrap justify-between items-start">
                {/* Logo Section */}
                <div className="mb-6">
                    <div className="flex items-center space-x-2">
                        <img src="/CSGO.PNG" alt="Cold Storage Go" className="h-8 w-auto" />
                  
                    </div>
                </div>

                {/* Opening Hours */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Opening Hours</h3>
                    <p>Weekdays: Mon - Sun</p>
                    <p>Saturday, Sunday: 9AM - 9AM</p>
                </div>

                {/* Address */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Address</h3>
                    <p>Level 1, 12 Yishun St, Singapore</p>
                    <p>NSW 2000</p>
                </div>

                {/* Contact */}
                <div className="mb-6">
                    <h3 className="font-semibold mb-2">Contact</h3>
                    <p>
                        <a href="mailto:ColdStorageGoInfo@gmail.com" className="hover:underline">
                            ColdStorageGoInfo@gmail.com
                        </a>
                    </p>
                    <p>
                        <a href="tel:+6565556117" className="hover:underline">
                            (65) 6555-6117
                        </a>
                    </p>
                </div>
            </div>
            <hr className="border-gray-600 my-6" />
            <div className="container mx-auto px-6 flex flex-wrap justify-between items-center">
                <p>©2022, All right reserved.</p>
                <div className="flex space-x-4">
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                        <FaFacebook size={24} />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                        <FaInstagram size={24} />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                        <FaTwitter size={24} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                        <FaLinkedin size={24} />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
