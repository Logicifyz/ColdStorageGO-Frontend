﻿import React, { useState } from 'react';
import axios from 'axios';
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import api from '../../api'
import { useEmail } from '../../context/EmailContext';
import Message from '../../components/Message'


const Register = () => {
    const navigate = useNavigate(); // For navigating to the login page
    const { setEmail } = useEmail();
    const [loading, setLoading] = useState(false); // Add loading state

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');

            return;
        }


        setError('');
        setLoading(true); // Start loading

        // Email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(formData.email)) {
            setError('Please enter a valid email address.');
            setLoading(false); // Stop loading

            return;
        }

        // Password length validation
        if (formData.password.length < 8) {
            setError('Password must be at least 8 characters long.');
            setLoading(false); // Stop loading

            return;
        }

        // Confirm password validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false); // Stop loading

            return;
        }

        // Required fields validation
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('All fields are required.');
            setLoading(false); // Stop loading

            return;
        }

        // Include empty fields in the formData
        const formDataWithEmptyFields = {
            ...formData,
            FullName: "",
            PhoneNumber: "",
            StreetAddress: "",
            PostalCode: ""
        };

        try {
            const response = await api.post('api/Auth/register', formDataWithEmptyFields, { withCredentials: true });
            if (response.data.success) {
                setEmail(formData.email); // Set the email in the context
                setSuccessMessage('Registration successful!');
                setFormData({
                    username: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                });

                // Navigate to the email verification page
                navigate('/SentVerificationEmailSuccess', { state: { email: formData.email } });
            } else {
                setError(response.data.message || 'Registration failed');
                setEmail(formData.email); // Set the email in the context
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'There was an error with the registration');
        }
     finally {
        setLoading(false); // Stop loading
    }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
            <div className="flex items-center bg-[#F0EAD6] p-8 rounded-lg">
                <img
                    src="https://live.staticflickr.com/65535/49642389768_aef80a434e_h.jpg"
                    alt="Side Image"
                    className="w-[491px] h-[579px] object-cover"
                />
                <div className="w-[497px] pr-8 mt-0" style={{ marginTop: '0', marginLeft: '150px' }}>
                    <div className="mb-6">
                        <h2 className="text-[#355E3B] text-4xl font-bold">Register</h2>
                    </div>

                    <div className="mb-6">
                        <p className="text-black text-sm" style={{ fontSize: '20px' }}>
                            Already have an account?{' '}
                            <span
                                onClick={() => navigate('/login')}
                                className="cursor-pointer text-[#355E3B]"
                            >
                                Login here!
                            </span>
                        </p>
                    </div>

                    <Message text={error} type="error" />
                    <Message text={successMessage} type="success" />

                    <form onSubmit={handleSubmit} className="text-left">
                        <div className="mb-4">
                            <label htmlFor="email" className="text-[#355E3B] text-lg font-medium">Email</label>
                            <div className="flex items-center border border-gray-300 rounded-xl bg-white">
                                <FiMail className="text-gray-400 ml-2" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-xl"
                                    placeholder="Enter your email"
                                    required
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="username" className="text-[#355E3B] text-lg font-medium">Username</label>
                            <div className="flex items-center border border-gray-300 rounded-xl bg-white">
                                <FiUser className="text-gray-400 ml-2" />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-xl"
                                    placeholder="Enter your username"
                                    required
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="text-[#355E3B] text-lg font-medium">Password</label>
                            <div className="relative flex items-center border border-gray-300 rounded-xl bg-white">
                                <FiLock className="text-gray-400 ml-2" />
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-xl"
                                    placeholder="Enter your password"
                                    required
                                    style={{ fontSize: '16px' }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? <FiEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="text-[#355E3B] text-lg font-medium">Confirm Password</label>
                            <div className="relative flex items-center border border-gray-300 rounded-xl bg-white">
                                <FiLock className="text-gray-400 ml-2" />
                                <input
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-xl"
                                    placeholder="Confirm your password"
                                    required
                                    style={{ fontSize: '16px' }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300"
                                    onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                >
                                    {confirmPasswordVisible ? <FiEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[66px] p-2 rounded-xl text-white font-bold bg-[#355E3B] hover:bg-[#2D4B33] mt-4"
                        >
                            Register
                        </button>
                    </form>
                </div>

                
            </div>
        </div>
    );
};

export default Register;
