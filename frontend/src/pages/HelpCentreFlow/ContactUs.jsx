import React, { useState } from 'react';
import { FiFileText, FiTag, FiImage, FiX } from 'react-icons/fi';
import api from '../../api';

const ContactUs = () => {
    const [subject, setSubject] = useState('');
    const [category, setCategory] = useState('');
    const [details, setDetails] = useState('');
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const maxFiles = 5;

    // Handle image file change
    const handleImageChange = (e, index) => {
        const newImages = [...images];
        newImages[index] = e.target.files[0]; // Update the image at the given index
        setImages(newImages);
    };

    // Handle adding new file input
    const addNewFileInput = () => {
        if (images.filter(img => img === null).length > 0) {
            setImages(images.map(img => img === null ? null : img)); // Make sure to add a new empty slot if there are null slots
        } else if (images.length < maxFiles) {
            setImages([...images, null]); // Add a new slot if less than 5 images
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
        setError('');
        setMessage('');

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
                setMessage('Ticket opened successfully!');
                setSubject('');
                setCategory('');
                setDetails('');
                setImages([]);
            }
        } catch (error) {
            setError('Error opening ticket. Please try again later.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#383838] p-4">
            <div className="flex items-center bg-[#383838] p-8 rounded-lg w-full max-w-4xl">
                <div className="w-full">
                    <div className="mb-6">
                        <h2 className="text-white text-4xl font-bold">Contact Us</h2>
                    </div>

                    <div className="mb-6">
                        <p className="text-white text-sm" style={{ fontSize: '20px' }}>
                            Need help? Let us know your issue!
                        </p>
                    </div>

                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    {message && <div className="text-green-500 mb-4">{message}</div>}

                    <form onSubmit={handleSubmit} className="text-left">
                        {/* Subject Field */}
                        <div className="mb-4">
                            <label htmlFor="subject" className="text-white text-lg">Subject</label>
                            <div className="flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiFileText className="text-gray-400 ml-2" />
                                <input
                                    type="text"
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                    placeholder="Enter subject"
                                    required
                                    style={{ fontSize: '20px' }}
                                />
                            </div>
                        </div>

                        {/* Category Field */}
                        <div className="mb-4">
                            <label htmlFor="category" className="text-white text-lg">Category</label>
                            <div className="flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiTag className="text-gray-400 ml-2" />
                                <input
                                    type="text"
                                    id="category"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                    placeholder="Enter category"
                                    required
                                    style={{ fontSize: '20px' }}
                                />
                            </div>
                        </div>

                        {/* Details Field */}
                        <div className="mb-4">
                            <label htmlFor="details" className="text-white text-lg">Details</label>
                            <div className="relative flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiFileText className="text-gray-400 ml-2" />
                                <textarea
                                    id="details"
                                    value={details}
                                    onChange={(e) => setDetails(e.target.value)}
                                    rows="4"
                                    className="w-full p-2 pl-8 text-black rounded-[10px]"
                                    placeholder="Enter your message"
                                    required
                                    style={{ fontSize: '20px' }}
                                />
                            </div>
                        </div>

                        {/* Attach Images Section */}
                        <div className="mb-4">
                            <label htmlFor="images" className="text-white text-lg">Attach Images (optional)</label>
                            <div className="flex flex-col">
                                {images.map((image, index) => (
                                    <div key={index} className="flex items-center mb-2">
                                        <input
                                            type="file"
                                            onChange={(e) => handleImageChange(e, index)}
                                            className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                            disabled={images.length >= maxFiles && !image} // Disable input if max files are reached
                                        />
                                        {image && (
                                            <div className="ml-4 flex items-center">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`preview-${index}`}
                                                    className="h-32 w-auto object-cover rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeFile(index)}
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                >
                                                    <FiX className="w-6 h-6" />
                                                </button>
                                            </div>
                                        )}
                                        {/* Add X button even when image slot is empty */}
                                        {image === null && (
                                            <button
                                                type="button"
                                                onClick={() => removeFile(index)}
                                                className="ml-2 text-red-500 hover:text-red-700"
                                            >
                                                <FiX className="w-6 h-6" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>


                            {/* File count and add new file button */}
                            <div className="text-white mt-2">
                                {images.filter(img => img !== null).length}/{maxFiles} files attached
                            </div>
                            {images.filter(img => img === null).length === 0 && images.length < maxFiles && (
                                <button
                                    type="button"
                                    onClick={addNewFileInput}
                                    className="text-blue-500 mt-2"
                                >
                                    Add another file
                                </button>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full h-[66px] bg-[#B4C14A] text-white rounded-[10px] hover:bg-[#9fbb3a] focus:outline-none mt-4"
                            disabled={loading}
                        >
                            {loading ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
