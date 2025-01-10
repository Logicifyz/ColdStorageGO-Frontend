import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi'; // Tick icon from react-icons

const SuccessfullyResetPassword = () => {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center items-center h-screen bg-[#383838]">
            <div className="flex items-center bg-[#383838] p-8 rounded-lg">
                <div className="w-[497px] ml-[50px]">
                    {/* Full Circle with Green Tick */}
                    <div className="text-center mb-6">
                        <div className="w-[213px] h-[213px] border-8 border-[#34A853] rounded-full flex justify-center items-center mx-auto">
                            <FiCheck className="w-[100px] h-[100px] text-[#34A853]" />
                        </div>
                    </div>

                    {/* Success Message */}
                    <div className="text-center mb-6">
                        <h2 className="text-white text-4xl font-bold">Password Successfully Reset</h2>
                    </div>

                    <div className="text-center mb-6">
                        <p className="text-white text-lg">
                            Your password has been successfully reset. Click below to login.
                        </p>
                    </div>

                    {/* Continue to Login Button */}
                    <div className="text-center mb-6">
                        <button
                            onClick={() => navigate('/login')}
                            type="submit"
                            className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold inline-block mt-4"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #4D5C60, #2B2E4A)',
                            }}
                        >
                            Continue to Login
                        </button>
                    </div>

                    {/* Back to Login Link */}
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

export default SuccessfullyResetPassword;
