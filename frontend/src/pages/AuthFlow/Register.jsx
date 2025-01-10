import React, { useState } from 'react';
import axios from 'axios';
import { FiMail, FiUser, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import api from '../../api'
import { useEmail } from '../../context/EmailContext';


const Register = () => {
    const navigate = useNavigate(); // For navigating to the login page
    const { setEmail } = useEmail();

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

        try {
            const response = await api.post('api/Auth/register', formData, { withCredentials: true });
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
    };


    return (
        <div className="flex justify-center items-center h-screen bg-[#383838]">
            <div className="flex items-center bg-[#383838] p-8 rounded-lg">
                <img
                    src="https://live.staticflickr.com/65535/49643190827_e50a242b2e_h.jpg"
                    alt="Side Image"
                    className="w-[491px] h-[579px] object-cover"
                />
                <div className="w-[497px] ml-[150px]">
                    <div className="mb-6">
                        <h2 className="text-white text-4xl font-bold">Register</h2> {/* Bold Register header */}
                    </div>

                    <div className="mb-6">
                        <p className="text-white text-sm" style={{ fontSize: '20px' }}>
                            Already have an account?{' '}
                            <span
                                onClick={() => navigate('/login')} // Navigate to login page
                                className="cursor-pointer text-[#B4C14A]"
                            >
                                Login here!
                            </span>
                        </p>
                    </div>

                    {error && <div className="text-red-500 mb-4" style={{ fontSize: '20px' }}>{error}</div>}
                    {successMessage && <div className="text-green-500 mb-4" style={{ fontSize: '20px' }}>{successMessage}</div>}

                    <form onSubmit={handleSubmit} className="text-left">
                        <div className="mb-4">
                            <label htmlFor="email" className="text-white text-lg">Email</label>
                            <div className="flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiMail className="text-gray-400 ml-2" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]" // Rounded input fields
                                    placeholder="Enter your email"
                                    required
                                    style={{ fontSize: '20px' }} // Placeholder text size 20px
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="username" className="text-white text-lg">Username</label>
                            <div className="flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiUser className="text-gray-400 ml-2" />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]" // Rounded input fields
                                    placeholder="Enter your username"
                                    required
                                    style={{ fontSize: '20px' }} // Placeholder text size 20px
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="text-white text-lg">Password</label>
                            <div className="relative flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiLock className="text-gray-400 ml-2" />
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]" // Rounded input fields
                                    placeholder="Enter your password"
                                    required
                                    style={{ fontSize: '20px' }} // Placeholder text size 20px
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
                            <label htmlFor="confirmPassword" className="text-white text-lg">Confirm Password</label>
                            <div className="relative flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiLock className="text-gray-400 ml-2" />
                                <input
                                    type={confirmPasswordVisible ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]" // Rounded input fields
                                    placeholder="Confirm your password"
                                    required
                                    style={{ fontSize: '20px' }} // Placeholder text size 20px
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
                            className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold inline-block mt-4"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #4D5C60, #2B2E4A)',
                            }}
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
