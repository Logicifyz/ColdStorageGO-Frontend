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

        // Check if both password fields are filled
        if (!password || !confirmPassword) {
            setError('Please fill out both password fields.');
            return;
        }

        // Check if the passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        // Check if password is at least 8 characters long
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setError(''); // Clear previous error messages

        try {
            const response = await api.post('/api/Auth/reset-password', {
                token,
                NewPassword: password, // Send the new password in the request
            });

            if (response.data.success) {
                setSuccessMessage('Password reset successful!');
                setPassword('');
                setConfirmPassword('');
                setTimeout(() => navigate('/successfullyresetpassword')); // Redirect to success page
            } else {
                setError(response.data.message || 'There was an error with the password reset.');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'There was an error with the password reset.');
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F0EAD6]">
            <div className="w-[497px] bg-[#F0EAD6] p-8 rounded-lg">
                <div className="text-center mb-6">
                    <FiLock className="w-[213px] h-[213px] text-[#355E3B] mx-auto" />
                </div>

                <div className="text-center mb-6">
                    <h2 className="text-[#355E3B] text-4xl font-bold">Set a New Password</h2>
                </div>

                <div className="text-center mb-6">
                    <p className="text-gray-700 text-lg">
                        Enter your new password below
                    </p>
                </div>

                <Message text={error} type="error" />
                <Message text={successMessage} type="success" />

                <form onSubmit={handleSubmit} className="text-left">
                    <div className="mb-4">
                        <label htmlFor="password" className="text-[#355E3B] text-lg">New Password</label>
                        <div className="relative flex items-center border border-gray-300 rounded-xl bg-white">
                            <FiLock className="text-gray-400 ml-2" />
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[66px] p-2 pl-8 text-black rounded-xl"
                                placeholder="Enter new password"
                                required
                                style={{ fontSize: '16px' }}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                                {passwordVisible ? <FiEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="text-[#355E3B] text-lg">Confirm Password</label>
                        <div className="relative flex items-center border border-gray-300 rounded-xl bg-white">
                            <FiLock className="text-gray-400 ml-2" />
                            <input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-[66px] p-2 pl-8 text-black rounded-xl"
                                placeholder="Confirm new password"
                                required
                                style={{ fontSize: '16px' }}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            >
                                {confirmPasswordVisible ? <FiEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-[66px] p-2 rounded-xl text-white font-bold inline-block mt-4 bg-[#355E3B] hover:bg-[#2D4B33] transition"
                    >
                        Reset Password
                    </button>
                </form>

                <div className="flex justify-center items-center mt-6">
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[#355E3B] flex justify-center items-center text-lg"
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
