import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
import api from '../../api';
import Message from '../../components/Message';

const SetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
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
            setError('Passwords do not match.');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setError('');

        try {
            const response = await api.post('/api/Auth/set-password', {
                token,
                NewPassword: password,
            });

            if (response.data.success) {
                setSuccessMessage('Password set successfully!');
                setPassword('');
                setConfirmPassword('');
                setTimeout(() => navigate('/successfullysetpassword'), 2000);
            } else {
                setError(response.data.message || 'There was an error setting the password.');
            }
        } catch (error) {
            setError(error.response?.data?.message || 'There was an error setting the password.');
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
                        <div className="relative flex items-center border border-gray-300 rounded-xl bg-white shadow-sm">
                            <FiLock className="text-gray-400 ml-4" />
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[66px] p-2 pl-8 text-black rounded-xl"
                                placeholder="Enter your new password"
                                required
                                style={{ fontSize: '16px' }}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                            >
                                {passwordVisible ? <FiEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className="text-[#355E3B] text-lg">Confirm Password</label>
                        <div className="relative flex items-center border border-gray-300 rounded-xl bg-white shadow-sm">
                            <FiLock className="text-gray-400 ml-4" />
                            <input
                                type={confirmPasswordVisible ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-[66px] p-2 pl-8 text-black rounded-xl"
                                placeholder="Confirm your new password"
                                required
                                style={{ fontSize: '16px' }}
                            />
                            <button
                                type="button"
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                            >
                                {confirmPasswordVisible ? <FiEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-[66px] rounded-xl text-white font-bold bg-[#355E3B] hover:bg-[#2D4B33] transition-transform transform hover:-translate-y-1"
                    >
                        Set Password
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

export default SetPassword;
