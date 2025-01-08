import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api'
import { FiKey, FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // For navigation

const SendPasswordResetEmail = () => {
    const navigate = useNavigate(); // For navigation
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setError('Please enter your email.');
            return;
        }

        setError('');

        try {
            // Call API to send password reset email
            const response = await api.post('api/Auth/sendpasswordreset', { email });
            if (response.data.success) {
                setSuccessMessage('Password reset email sent successfully!');
                setEmail('');
            } else {
                setError(response.data.message || 'Error sending password reset email.');
            }
        } catch (error) {
            setError('There was an error with the request');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#383838]">
            <div className="flex items-center bg-[#383838] p-8 rounded-lg">
                <div className="w-[497px] ml-[50px]">
                    <div className="text-center mb-6">
                        <FiKey className="w-[213px] h-[213px] text-white mx-auto" style={{ transform: 'scaleX(-1)' }} /> {/* Mirrored Key Icon */}
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-white text-4xl font-bold">Forgot Password?</h2> {/* Same size as register header */}
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-white text-lg">
                            Enter your registered email for verification
                        </p>
                    </div>

                    {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                    {successMessage && <div className="text-green-500 mb-4 text-center">{successMessage}</div>}

                    <form onSubmit={handleSubmit} className="text-left">
                        <div className="mb-4">
                            <label htmlFor="email" className="text-white text-lg">Email</label>
                            <div className="flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiMail className="text-gray-400 ml-2" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                    placeholder="Enter your email"
                                    required
                                    style={{ fontSize: '20px' }} // Placeholder text size 20px
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold inline-block mt-4"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #4D5C60, #2B2E4A)',
                            }}
                        >
                            Send Reset Email
                        </button>
                    </form>

                    <div className="text-center mt-4">
                        <span
                            onClick={() => navigate('/login')}
                            className="cursor-pointer text-white flex justify-center items-center"
                        >
                            <span className="text-white mr-2">&#8592;</span> {/* Left Arrow Icon */}
                            Back to Login
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SendPasswordResetEmail;
