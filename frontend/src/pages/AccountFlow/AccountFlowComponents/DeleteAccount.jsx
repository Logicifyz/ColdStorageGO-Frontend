import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff, FiTrash2 } from 'react-icons/fi';
import api from '../../../api';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setPassword(e.target.value);
    };

    const handlePasswordVisibilityToggle = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        try {
            const response = await api.delete(
                '/api/Account/delete-account',
                { data: { password } }, // Ensure password is passed in the correct format
                { withCredentials: true }
            );

            if (response.status === 200) {
                setSuccessMessage('Your account has been deleted successfully.');
                setPassword('');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            }
        } catch (error) {
            // Ensure error message is a string
            const errorMsg = error.response?.data?.message || error.message || 'An error occurred while deleting the account.';
            setErrorMessage(errorMsg); // Set the error message properly
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#F0EAD6] relative overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-[#E2F2E6] rounded-full blur-3xl z-0" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-[#E2F2E6] rounded-full blur-3xl z-0" />
            </div>
            <div className="w-[497px] bg-white p-6 rounded-lg shadow-sm z-10">
                <h2 className="text-[#355E3B] text-4xl font-bold mb-6">Delete Account</h2>

                {successMessage && (
                    <div className="mb-4 p-4 bg-[#355E3B] text-white rounded-[10px]">
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
                        <label htmlFor="Password" className="text-[#355E3B] text-lg">Password</label>
                        <div className="relative flex items-center border border-gray-300 bg-white rounded-xl">
                            <FiLock className="text-gray-400 ml-2" />
                            <input
                                type={passwordVisible ? "text" : "password"}
                                id="Password"
                                name="Password"
                                value={password}
                                onChange={handleInputChange}
                                className="w-full h-[66px] p-2 pl-8 text-black rounded-xl"
                                placeholder="Enter your password to confirm"
                                required
                                style={{ fontSize: '16px' }}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300"
                                onClick={handlePasswordVisibilityToggle}
                            >
                                {passwordVisible ? <FiEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>


                    <button
                        type="submit"
                        className="w-full h-[66px] p-2 rounded-xl text-white font-bold mt-4 bg-[#355E3B] hover:bg-[#2D4B33] flex items-center justify-center"
                    >
                        <FiTrash2 className="mr-2" /> Delete Account
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DeleteAccount;
