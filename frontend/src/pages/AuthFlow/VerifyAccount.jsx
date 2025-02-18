import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api';
import Message from '../../components/Message';

const VerifyAccount = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Handle the verification button click
    const handleVerifyClick = async () => {
        try {
            // Send a request to the backend to verify the account
            const response = await api.post(
                `/api/Auth/verify-email/${token}`,
                {},
                { withCredentials: true }
            );

            // Handle success
            setSuccessMessage(response.data.message);
            setError('');
            navigate("/successfullyverifiedaccount");
        } catch (error) {
            console.error('Verification failed:', error);

            // Check if error has a response and use the error message from the response
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('Verification failed. Please try again.');
            }

            setSuccessMessage('');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
            <div className="flex items-center bg-[#F0EAD6] p-8 rounded-lg">
                <div className="w-[497px] ml-[50px]">
                    {/* Person Icon */}
                    <div className="text-center mb-6">
                        <FiUser className="w-[100px] h-[100px] text-[#355E3B] mx-auto" />
                    </div>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-[#355E3B] text-4xl font-bold">Verify Account</h2>
                    </div>

                    {/* Instructions */}
                    <div className="text-center mb-6">
                        <p className="text-gray-700 text-lg">
                            Click the button below to verify your account.
                        </p>
                    </div>

                    {/* Verification Message */}
                    {error && <Message text={error} type="error" />}
                    {successMessage && <Message text={successMessage} type="success" />}

                    {/* Verify Button */}
                    <div className="text-center mb-6">
                        <button
                            onClick={handleVerifyClick}
                            type="submit"
                            className="w-full h-[66px] rounded-xl text-white font-bold inline-block mt-4 transition 
                                       bg-[#355E3B] hover:bg-[#2D4B33] focus:outline-none focus:ring-2 focus:ring-[#355E3B]"
                        >
                            Verify
                        </button>
                    </div>

                    {/* Back to Login */}
                    <div className="text-center">
                        <span
                            onClick={() => navigate('/login')}
                            className="cursor-pointer text-[#355E3B] flex justify-center items-center"
                        >
                            <span className="text-[#355E3B] mr-2">&#8592;</span>
                            Back to Login
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyAccount;
