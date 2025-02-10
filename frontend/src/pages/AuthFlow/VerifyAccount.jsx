import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi'; // Person icon from react-icons
import { useNavigate, useParams } from 'react-router-dom'; // For navigation and URL params
import api from '../../api';
import Message from '../../components/Message';

const VerifyAccount = () => {
    const navigate = useNavigate();
    const { token } = useParams(); // Get the token from the URL parameters
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
        setSuccessMessage(response.data.message); // Set success message
        setError(''); // Clear any error message
        navigate("/successfullyverifiedaccount");
    } catch (error) {
        // Handle error
        console.error('Verification failed:', error);

        // Check if error has a response and use the error message from the response
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message); // Set the error message from the response
        } else {
            setError('Verification failed. Please try again.'); // Fallback error message
        }

        setSuccessMessage(''); // Clear any success message
    }
};


    return (
        <div className="flex justify-center items-center h-screen bg-[#383838]">
            <div className="flex items-center bg-[#383838] p-8 rounded-lg">
                <div className="w-[497px] ml-[50px]">
                    {/* Person Icon */}
                    <div className="text-center mb-6">
                        <FiUser className="w-[100px] h-[100px] text-white mx-auto" />
                    </div>

                    {/* Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-white text-4xl font-bold">Verify Account</h2>
                    </div>

                    {/* Instructions */}
                    <div className="text-center mb-6">
                        <p className="text-white text-lg">
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
                            className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold inline-block mt-4"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #4D5C60, #2B2E4A)',
                            }}
                        >
                            Verify
                        </button>
                    </div>

                    {/* Back to Login */}
                    <div className="text-center">
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

export default VerifyAccount;
