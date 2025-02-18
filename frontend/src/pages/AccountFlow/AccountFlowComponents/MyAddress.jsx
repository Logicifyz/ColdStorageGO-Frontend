import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GlowingButton = ({ children, onClick, className = "", type = "button" }) => (
    <motion.button
        type={type}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
        className={`relative overflow-hidden px-6 py-4 rounded-2xl font-semibold text-white transition-all duration-300 ${className}`}
    >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D4B33] to-[#355E3B] opacity-20 blur-md" />
    </motion.button>
);

const MyAddress = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ StreetAddress: "", PostalCode: "" });
    const [originalData, setOriginalData] = useState({ StreetAddress: "", PostalCode: "" });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await api.get("/api/Account/profile", { withCredentials: true });
                if (response.status === 200) {
                    setFormData({
                        StreetAddress: response.data.streetAddress || "",
                        PostalCode: response.data.postalCode || "",
                    });
                    setOriginalData({
                        StreetAddress: response.data.streetAddress || "",
                        PostalCode: response.data.postalCode || "",
                    });
                }
            } catch (error) {
                toast.error("Failed to fetch address details.", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    theme: "dark",
                });
            }
        };

        fetchAddress();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("StreetAddress", formData.StreetAddress);
            formDataToSend.append("PostalCode", formData.PostalCode);

            const response = await api.put("/api/Account/update-profile", formDataToSend, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.status === 200) {
                toast.success("Address updated successfully!", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    theme: "light",
                });
                setIsEditing(false);
                setOriginalData({ ...formData });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while updating the address.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                theme: "dark",
            });
        }
    };

    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
        toast.info("Changes discarded.", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: true,
            theme: "dark",
        });
    };

    return (
        <div className="min-h-screen bg-[#F5F5DC] text-[#2D4B33] relative overflow-hidden p-8">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

            <div className="relative z-10 max-w-4xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-5xl font-bold bg-gradient-to-r from-[#2D4B33] to-[#355E3B] bg-clip-text text-transparent mb-12 text-center px-4 py-2"
                >
                    Manage Address
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-br from-[#2D4B33]/10 to-[#355E3B]/10 backdrop-blur-xl rounded-3xl border border-[#2D4B33]/20 shadow-2xl p-8"
                >
                    {!isEditing ? (
                        <div className="space-y-6">
                            <div className="bg-green-100/50 p-6 rounded-xl border border-green-300">
                                <p className="text-xl font-semibold text-green-800 mb-2">Street Address</p>
                                <p className="text-lg text-green-700">{formData.StreetAddress || "Not set"}</p>
                            </div>
                            <div className="bg-green-100/50 p-6 rounded-xl border border-green-300">
                                <p className="text-xl font-semibold text-green-800 mb-2">Postal Code</p>
                                <p className="text-lg text-green-700">{formData.PostalCode || "Not set"}</p>
                            </div>
                            <GlowingButton
                                onClick={() => setIsEditing(true)}
                                className="w-full bg-[#2D4B33] hover:bg-[#355E3B]"
                            >
                                Edit Address
                            </GlowingButton>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-green-100/50 p-6 rounded-xl border border-green-300">
                                <label htmlFor="StreetAddress" className="text-xl font-semibold text-green-800 mb-2">Street Address</label>
                                <input
                                    type="text"
                                    id="StreetAddress"
                                    name="StreetAddress"
                                    value={formData.StreetAddress}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 text-black rounded-lg border border-[#2D4B33] bg-white focus:ring-2 focus:ring-[#355E3B] focus:outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="bg-green-100/50 p-6 rounded-xl border border-green-300">
                                <label htmlFor="PostalCode" className="text-xl font-semibold text-green-800 mb-2">Postal Code</label>
                                <input
                                    type="text"
                                    id="PostalCode"
                                    name="PostalCode"
                                    value={formData.PostalCode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 text-black rounded-lg border border-[#2D4B33] bg-white focus:ring-2 focus:ring-[#355E3B] focus:outline-none transition-all"
                                    required
                                />
                            </div>

                            <div className="flex gap-4">
                                <GlowingButton
                                    type="submit"
                                    className="w-full bg-[#2D4B33] hover:bg-[#355E3B]"
                                >
                                    Save Changes
                                </GlowingButton>
                                <GlowingButton
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full bg-red-600 hover:bg-red-500"
                                >
                                    Cancel
                                </GlowingButton>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default MyAddress;