import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import api from '../../../api';

const ChangePassword = () => {
    const [formData, setFormData] = useState({
        CurrentPassword: '',
        NewPassword: '',
        ConfirmPassword: ''
    });

    const [passwordVisible, setPasswordVisible] = useState({
        current: false,
        new: false,
        confirmNew: false
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handlePasswordVisibilityToggle = (field) => {
        setPasswordVisible((prevState) => ({
            ...prevState,
            [field]: !prevState[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage(''); // Clear previous success message
        setErrorMessage(''); // Clear previous error message

        try {
            const response = await api.post(
                '/api/Account/change-password', // Replace with your actual API endpoint
                formData,
                { withCredentials: true } // This ensures credentials (cookies/session) are sent with the request
            );

            if (response.status === 200) {
                console.log('Password changed successfully:', response.data);
                // Clear form fields after success
                setFormData({
                    CurrentPassword: '',
                    NewPassword: '',
                    ConfirmPassword: ''
                });
                // Display success message
                setSuccessMessage('Password changed successfully!');
            }
        } catch (error) {
            console.error('Error changing password:', error.response?.data || error.message);
            // Display error message
            setErrorMessage(error.response?.data || 'An error occurred while changing the password.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#383838]">
            <div className="w-[497px]">
                <h2 className="text-white text-4xl font-bold mb-6">Change Password</h2>

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-500 text-white rounded-[10px]">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-4 p-4 bg-red-500 text-white rounded-[10px]">
                        {errorMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="text-left">
                    <div className="mb-4">
                        <label htmlFor="CurrentPassword" className="text-white text-lg">Current Password</label>
                        <div className="relative flex items-center border border-gray-300 rounded-[10px] bg-white">
                            <FiLock className="text-gray-400 ml-2" />
                            <input
                                type={passwordVisible.current ? "text" : "password"}
                                id="CurrentPassword"
                                name="CurrentPassword"
                                value={formData.CurrentPassword}
                                onChange={handleInputChange}
                                className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                placeholder="Enter your current password"
                                required
                                style={{ fontSize: '20px' }}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300"
                                onClick={() => handlePasswordVisibilityToggle('current')}
                            >
                                {passwordVisible.current ? <FiEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="NewPassword" className="text-white text-lg">New Password</label>
                        <div className="relative flex items-center border border-gray-300 rounded-[10px] bg-white">
                            <FiLock className="text-gray-400 ml-2" />
                            <input
                                type={passwordVisible.new ? "text" : "password"}
                                id="NewPassword"
                                name="NewPassword"
                                value={formData.NewPassword}
                                onChange={handleInputChange}
                                className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                placeholder="Enter your new password"
                                required
                                style={{ fontSize: '20px' }}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300"
                                onClick={() => handlePasswordVisibilityToggle('new')}
                            >
                                {passwordVisible.new ? <FiEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="ConfirmPassword" className="text-white text-lg">Confirm New Password</label>
                        <div className="relative flex items-center border border-gray-300 rounded-[10px] bg-white">
                            <FiLock className="text-gray-400 ml-2" />
                            <input
                                type={passwordVisible.confirmNew ? "text" : "password"}
                                id="ConfirmPassword"
                                name="ConfirmPassword"
                                value={formData.ConfirmPassword}
                                onChange={handleInputChange}
                                className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                placeholder="Confirm your new password"
                                required
                                style={{ fontSize: '20px' }}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300"
                                onClick={() => handlePasswordVisibilityToggle('confirmNew')}
                            >
                                {passwordVisible.confirmNew ? <FiEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold mt-4"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #4D5C60, #2B2E4A)',
                        }}
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChangePassword;
