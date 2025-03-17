import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi'; // Tick icon from react-icons

const SuccessfullyVerifiedAccount = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
            <div className="flex items-center bg-[#F0EAD6] p-8 rounded-lg">
                <div className="w-[497px] ml-[50px]">
                    {/* Full Circle with Green Tick */}
                    <div className="text-center mb-6">
                        <div className="w-[213px] h-[213px] border-8 border-[#355E3B] rounded-full flex justify-center items-center mx-auto">
                            <FiCheck className="w-[100px] h-[100px] text-[#355E3B]" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center mb-6">
                        <h2 className="text-[#355E3B] text-4xl font-bold">Account Successfully Verified</h2>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-gray-700 text-lg">
                            Your account has been successfully verified. Click below to continue to home.
                        </p>
                    </div>

                    {/* Continue to Home Button */}
                    <div className="text-center mb-6">
                        <button
                            onClick={() => navigate('/')}
                            type="submit"
                            className="w-full h-[66px] p-2 rounded-xl text-white font-bold bg-[#355E3B] hover:bg-[#2D4B33] transition"
                        >
                            Continue to Home
                        </button>
                    </div>

                    {/* Back to Login */}
                    <div className="text-center">
                        <span
                            onClick={() => navigate('/login')}
                            className="cursor-pointer text-gray-500 flex justify-center items-center hover:text-gray-700 transition"
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

export default SuccessfullyVerifiedAccount;
