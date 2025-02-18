import React, { useState } from 'react';
import { FiFileText, FiTag, FiImage, FiX } from 'react-icons/fi';
import { FaTruck, FaCreditCard, FaUndoAlt, FaUserCog, FaTools, FaComments, FaTrophy, FaUtensils } from 'react-icons/fa';
import api from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const categories = [
    { name: "Order and Delivery", icon: <FaTruck /> },
    { name: "Payments and Pricing", icon: <FaCreditCard /> },
    { name: "Returns and Refunds", icon: <FaUndoAlt /> },
    { name: "Account and Membership", icon: <FaUserCog /> },
    { name: "Technical Support", icon: <FaTools /> },
    { name: "Community and Forum", icon: <FaComments /> },
    { name: "Rewards and Redemptions", icon: <FaTrophy /> },
    { name: "Recipes and Cooking", icon: <FaUtensils /> },
];

const ContactUs = () => {
    const navigate = useNavigate();
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [details, setDetails] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const maxFiles = 5;

    // Handle image file change
    const addNewFileInput = () => {
        if (images.filter(img => img === null).length > 0) {
            setImages(images.map(img => img === null ? null : img)); // Make sure to add a new empty slot if there are null slots
        } else if (images.length < maxFiles) {
            setImages([...images, null]); // Add a new slot if less than maxFiles
        }
    };

    const handleImageChange = (e, index) => {
        const file = e.target.files[0];

        // Check if the file is an image (JPEG or PNG)
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
            const newImages = [...images];
            newImages[index] = file; // Update the image at the given index
            setImages(newImages);
        } else {
            toast.error('Only JPEG and PNG images are allowed.');
        }
    };


    // Handle removing a file
    const removeFile = (index) => {
        const newImages = [...images];
        newImages.splice(index, 1); // Remove the image at the given index
        setImages(newImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('Subject', subject);
        formData.append('Category', category);
        formData.append('Details', details);

        // Append images to form data
        images.forEach(image => {
            if (image) formData.append('Images', image);
        });

        try {
            const response = await api.post('/api/support/OpenTicket', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success('Ticket opened successfully!');
                setSubject('');
                setCategory('');
                setDetails('');
                setImages([]);
            }
        } catch (error) {
            toast.error('Error opening ticket. Please try again later.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F0EAD6] p-8 overflow-x-hidden">
            {/* Background Elements */}
            <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-[#355E3B40] rounded-full blur-3xl" />
            <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-[#2D4B3340] rounded-full blur-3xl" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-[#355E3B] to-[#2D4B33] bg-clip-text text-transparent">
                        Contact Us
                    </h1>

                    <p className="text-[#355E3B] text-xl mt-2">
                        Need help? Let us know your issue!
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-[#ffffff15] shadow-lg">
                    {/* Subject Field */}
                    <div className="mb-6">
                        <label htmlFor="subject" className="text-[#355E3B] text-lg font-semibold mb-2 block">Subject</label>
                        <div className="flex items-center bg-white rounded-xl border border-[#355E3B]">
                            <FiFileText className="text-[#355E3B] ml-4" />
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full h-14 px-4 bg-transparent text-[#355E3B] placeholder-gray-400 focus:outline-none"
                                placeholder="Enter subject"
                                required
                            />
                        </div>
                    </div>

                    {/* Category Field */}
                    <div className="mb-6">
                        <label htmlFor="category" className="text-[#355E3B] text-lg font-semibold mb-2 block">Category</label>
                        <div className="relative flex items-center bg-white rounded-xl border border-[#355E3B]">
                            <FiTag className="text-[#355E3B] ml-4" />
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-14 px-4 bg-transparent text-[#355E3B] placeholder-gray-400 focus:outline-none appearance-none"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat.name} className="flex items-center gap-2 text-[#355E3B]">
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-[#355E3B]"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Details Field */}
                    <div className="mb-6">
                        <label htmlFor="details" className="text-[#355E3B] text-lg font-semibold mb-2 block">Details</label>
                        <div className="flex items-center bg-white rounded-xl border border-[#355E3B]">
                            <FiFileText className="text-[#355E3B] ml-4 self-start mt-4" />
                            <textarea
                                id="details"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows="4"
                                className="w-full px-4 py-3 bg-transparent text-[#355E3B] placeholder-gray-400 focus:outline-none"
                                placeholder="Enter your message"
                                required
                            />
                        </div>
                    </div>

                    {/* Attach Images Section */}
                    <div className="mb-6">
                        <label htmlFor="images" className="text-[#355E3B] text-lg font-semibold mb-2 block">Attach Images (max 5 files, optional)</label>
                        <div className="flex flex-col gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <label
                                        htmlFor={`file-${index}`}
                                        className="w-full h-14 px-4 bg-white rounded-xl border border-[#355E3B] text-[#355E3B] flex items-center justify-between cursor-pointer hover:bg-[#ffffff10] transition-colors"
                                    >
                                        <span className="truncate">
                                            {image ? image.name : "Choose file (JPEG, PNG only)"}
                                        </span>
                                        <FiImage className="text-[#355E3B]" />
                                    </label>

                                    <input
                                        type="file"
                                        id={`file-${index}`}
                                        onChange={(e) => handleImageChange(e, index)}
                                        className="hidden"
                                        disabled={images.length > maxFiles && !image} // Disable file input if maxFiles is reached
                                    />

                                    {image && (
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={URL.createObjectURL(image)}
                                                alt={`preview-${index}`}
                                                className="h-24 w-24 object-cover rounded"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <FiX />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Add New File Input */}
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={addNewFileInput}
                                    className="text-[#355E3B] text-sm hover:underline"
                                    disabled={images.length >= maxFiles}
                                >
                                    + Add another file
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-[#355E3B] to-[#2D4B33] text-white px-6 py-3 rounded-xl font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </div>

                </form>
            </div>

            {/* Toast Notifications */}
            <ToastContainer />
        </div>


    );
};

export default ContactUs;
