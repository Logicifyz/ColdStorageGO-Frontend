import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // For accessing dynamic route parameters and navigation
import { FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import api from '../../api'
import Message from '../../components/Message'

const ResetPassword = () => {
    const { token } = useParams(); // Get the token from the URL
    const navigate = useNavigate(); // For navigation after successful reset
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            setError('Please fill out both password fields.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setError('');

        try {
            const response = await api.post('/api/Auth/reset-password', {
                token,
                NewPassword: password, // Add NewPassword here
            });
            if (response.data.success) {
                setSuccessMessage('Password reset successful!');
                setPassword('');
                setConfirmPassword('');
                setTimeout(() => navigate('/successfullyresetpassword')); // Redirect to login page after 2 seconds
            } else {
                setError(error.response?.data?.message || 'There was an error with the password reset');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'There was an error with the password reset');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#383838]">
            <div className="w-[497px] bg-[#383838] p-8 rounded-lg">
                <div className="text-center mb-6">
                    <FiLock className="w-[213px] h-[213px] text-white mx-auto" />
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-white text-4xl font-bold">Set a New Password</h2> {/* Updated header text */}
                </div>

                <div className="text-center mb-6">
                    <p className="text-white text-lg">
                        Enter your new password below
                    </p>
                </div>

                <Message text={error} type="error" />
                <Message text={successMessage} type="success" />
                <form onSubmit={handleSubmit} className="text-left">
                    <div className="mb-4">
                        <label htmlFor="password" className="text-white text-lg">New Password</label>
                        <div className="relative flex items-center border border-gray-300 rounded-[10px] bg-white">
                            <FiLock className="text-gray-400 ml-2" />
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                placeholder="Enter your new password"
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

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="text-white text-lg">Confirm Password</label>
                        <div className="relative flex items-center border border-gray-300 rounded-[10px] bg-white">
                            <FiLock className="text-gray-400 ml-2" />
                            <input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                placeholder="Confirm your new password"
                                required
                                style={{ fontSize: '20px' }}
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
                        Reset Password
                    </button>
                </form>

                {/* Centered Back to Login Section */}
                <div className="flex justify-center items-center mt-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-white flex justify-center items-center text-lg"
                    >
                        <FiArrowLeft className="mr-2" />
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
