import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // For navigation
import { FiCheckCircle } from 'react-icons/fi'; // Success Icon
import axios from 'axios';

const PasswordResetConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    // Get the email from the URL query params if available
    const email = new URLSearchParams(location.search).get('email');

    useEffect(() => {
        // If no email is found in query params, redirect to reset page
        if (!email) {
            navigate('/send-password-reset-email');
        }
    }, [email, navigate]);

    const handleResendEmail = async () => {
        if (!email) {
            setError('No email address found.');
            return;
        }

        setError(''); // Clear previous errors
        setSuccessMessage(''); // Clear previous success messages

        try {
            // Call API to resend the password reset email
            const response = await axios.post('https://localhost:7290/api/Auth/sendpasswordreset', { email });
            if (response.data.success) {
                setSuccessMessage('Password reset email resent successfully!');
            } else {
                setError(response.data.message || 'Error resending password reset email.');
            }
        } catch (error) {
            setError('There was an error with the request.');
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#383838]">
            <div className="flex items-center bg-[#383838] p-8 rounded-lg">
                <div className="w-[497px] ml-[50px]">
                    <div className="text-center mb-6">
                        <FiCheckCircle className="w-[100px] h-[100px] text-green-500 mx-auto" />
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-white text-4xl font-bold">Password Reset Email Sent</h2>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-white text-lg">
                            A password reset email has been sent to your email address. Please follow the instructions in the email to reset your password.
                        </p>
                    </div>

                    {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
                    {successMessage && <div className="text-green-500 mb-4 text-center">{successMessage}</div>}

                    <div className="text-center mt-6">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold inline-block mt-4"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #4D5C60, #2B2E4A)',
                            }}
                        >
                            Back to Login
                        </button>
                    </div>

                    <div className="text-center mt-6">
                        <p className="text-white text-lg">
                            Didn't receive the email?
                            <span
                                onClick={handleResendEmail}
                                className="cursor-pointer text-blue-400 ml-2"
                            >
                                Click to resend.
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PasswordResetConfirmation;
