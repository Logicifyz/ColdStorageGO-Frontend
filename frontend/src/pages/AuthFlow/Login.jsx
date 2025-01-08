import React, { useState } from 'react';
import axios from 'axios';
import api from '../../api'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate(); // For navigating to the register page
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
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

        try {
            const response = await api.post('/api/Auth/login', formData);
            console.log(response.data); // For debugging
            if (response.data.success) { // Use successFlag instead of success
                setSuccessMessage('Login successful!');
                setError(''); // Clear any previous errors
                setFormData({
                    email: '',
                    password: ''
                });
                // Navigate to another page or perform other actions after successful login
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error(error);
            setError(error.response?.data?.message || 'There was an error with the login');
        }

    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#383838]">
            <div className="flex items-center bg-[#383838] p-8 rounded-lg">
                {/* Form on the left */}
                <div className="w-[497px] pr-8 mt-0" style={{ marginTop: '-100px', marginRight: '150px' }}>
                    <div className="mb-6">
                        <h2 className="text-white text-4xl font-bold">Login</h2> {/* Bold Login header */}
                    </div>

                    <div className="mb-6">
                        <p className="text-white text-sm" style={{ fontSize: '20px' }}>
                            Don't have an account?{' '}
                            <span
                                onClick={() => navigate('/register')} // Navigate to register page
                                className="cursor-pointer text-[#B4C14A]"
                            >
                                Register here
                            </span>
                        </p>
                    </div>

                    {error && <div className="text-red-500 mb-4" style={{ fontSize: '20px' }}>{error}</div>}
                    {successMessage && <div className="text-green-500 mb-4" style={{ fontSize: '20px' }}>{successMessage}</div>}

                    <form onSubmit={handleSubmit} className="text-left">
                        {/* Email field */}
                        <div className="mb-4">
                            <label htmlFor="email" className="text-white text-lg font-medium">Email</label>
                            <div className="flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiMail className="text-gray-400 ml-2" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                    placeholder="Enter your email"
                                    required
                                    style={{ fontSize: '20px' }}
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className="mb-4">
                            <label htmlFor="password" className="text-white text-lg font-medium">Password</label>
                            <div className="relative flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiLock className="text-gray-400 ml-2" />
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                    placeholder="Enter your password"
                                    required
                                    style={{ fontSize: '20px' }}
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

                        <div className="mb-4 text-right">
                            <span
                                onClick={() => navigate('/sendpasswordresetemail')} // Navigate to forgot password page
                                className="cursor-pointer text-[#B4C14A] text-lg"
                            >
                                Forgot Password?
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold inline-block mt-4"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #4D5C60, #2B2E4A)',
                            }}
                        >
                            Login
                        </button>
                    </form>
                </div>

                {/* Image on the right */}
                <img
                    src="https://live.staticflickr.com/65535/49642389768_aef80a434e_h.jpg"
                    alt="Side Image"
                    className="w-[491px] h-[579px] object-cover"
                />
            </div>
        </div>
    );
};

export default Login;
