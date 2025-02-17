import React, { useState } from 'react';
import { FiFileText, FiTag, FiImage, FiX } from 'react-icons/fi';
import { FaTruck, FaCreditCard, FaUndoAlt, FaUserCog, FaTools, FaComments, FaTrophy, FaUtensils } from 'react-icons/fa';
import api from '../../api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] p-8">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-[40%] h-[60%] bg-[#ff6b6b10] rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-[50%] h-[50%] bg-[#ff8e5310] rounded-full blur-3xl" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] bg-clip-text text-transparent">
                        Contact Us
                    </h1>
                    <p className="text-gray-400 text-lg mt-2">
                        Need help? Let us know your issue!
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="bg-[#ffffff08] backdrop-blur-sm rounded-2xl p-8 border border-[#ffffff15]">
                    {/* Subject Field */}
                    <div className="mb-6">
                        <label htmlFor="subject" className="text-gray-300 text-lg font-semibold mb-2 block">Subject</label>
                        <div className="flex items-center bg-[#ffffff05] rounded-xl border border-[#ffffff15]">
                            <FiFileText className="text-gray-400 ml-4" />
                            <input
                                type="text"
                                id="subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                className="w-full h-14 px-4 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none"
                                placeholder="Enter subject"
                                required
                            />
                        </div>
                    </div>

                    {/* Category Field */}
                    <div className="mb-6">
                        <label htmlFor="category" className="text-gray-300 text-lg font-semibold mb-2 block">Category</label>
                        <div className="relative flex items-center bg-[#ffffff05] rounded-xl border border-[#ffffff15]">
                            <FiTag className="text-gray-400 ml-4" />
                            <select
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-14 px-4 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none appearance-none"
                                required
                            >
                                <option value="">Select a category</option>
                                {categories.map((cat, index) => (
                                    <option key={index} value={cat.name} className="flex items-center gap-2 bg-[#1a1a1a]">
                                        {cat.icon} {cat.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <svg
                                    className="w-5 h-5 text-gray-400"
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
                        <label htmlFor="details" className="text-gray-300 text-lg font-semibold mb-2 block">Details</label>
                        <div className="flex items-center bg-[#ffffff05] rounded-xl border border-[#ffffff15]">
                            <FiFileText className="text-gray-400 ml-4 self-start mt-4" />
                            <textarea
                                id="details"
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                rows="4"
                                className="w-full px-4 py-3 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none"
                                placeholder="Enter your message"
                                required
                            />
                        </div>
                    </div>

                    {/* Attach Images Section */}
                    <div className="mb-6">
                        <label htmlFor="images" className="text-gray-300 text-lg font-semibold mb-2 block">    Attach Images (max 5 files, optional)</label>
                        <div className="flex flex-col gap-4">
                            {images.map((image, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <label
                                        htmlFor={`file-${index}`}
                                        className="w-full h-14 px-4 bg-[#ffffff05] rounded-xl border border-[#ffffff15] text-gray-200 flex items-center justify-between cursor-pointer hover:bg-[#ffffff10] transition-colors"
                                    >
                                        <span className="truncate">
                                            {image ? image.name : "Choose file (JPEG, PNG only)"}
                                        </span>
                                        <FiImage className="text-gray-400" />
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
                                                <FiX className="w-6 h-6" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {images.length < maxFiles && (
                                <button
                                    type="button"
                                    onClick={addNewFileInput}
                                    className="text-[#ff8e53] hover:text-[#ff6b6b] transition-colors"
                                >
                                    + Add another file
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full h-14 bg-gradient-to-r from-[#ff6b6b] to-[#ff8e53] text-white font-semibold rounded-xl hover:from-[#ff8e53] hover:to-[#ff6b6b] transition-all"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                </form>
            </div>

            {/* Toast Container */}
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar closeButton />
        </div>
    );
};

export default ContactUs;
