import React from 'react';
import { FiMail } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useEmail } from '../../context/EmailContext';
import api from '../../api';

const SuccessfullySentVerificationEmail = () => {
    const navigate = useNavigate();
    const { email } = useEmail();  // Retrieve the email from context

    const handleResendEmail = async () => {
        try {
            // Make the API call to resend the verification email using the email from context
            const response = await api.post('/api/Auth/request-verification-email', { email }, { withCredentials: true });
            console.log(response.data);  // Handle success response (e.g., show success message)
        } catch (error) {
            console.error('Error resending email:', error);
            // Optionally, show an error message to the user
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
            <div className="flex items-center bg-[#F0EAD6] p-8 rounded-lg">
                <div className="w-[497px] ml-[50px]">
                    <div className="text-center mb-6">
                        <FiMail className="w-[213px] h-[213px] text-[#355E3B] mx-auto" />
                    </div>

                    <div className="text-center mb-6">
                        <h2 className="text-[#355E3B] text-5xl font-bold">Check your email</h2>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-gray-700 text-lg">
                            We have sent you a verification link to verify your account.
                        </p>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-gray-700 text-lg">
                            Didn't receive the email?{' '}
                            <button
                                onClick={handleResendEmail}
                                className="text-[#355E3B] hover:text-[#2D4B33] hover:underline"
                            >
                                Click here
                            </button>
                        </p>
                    </div>

                    <div className="text-center">
                        <span
                            onClick={() => navigate('/login')}
                            className="cursor-pointer text-[#355E3B] flex justify-center items-center"
                        >
                            <span className="mr-2">&#8592;</span> {/* Left Arrow Icon */}
                            Back to Login
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuccessfullySentVerificationEmail;
