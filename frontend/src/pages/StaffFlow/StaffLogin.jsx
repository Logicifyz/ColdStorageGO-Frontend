import { useState } from "react";
import api from '../../api';
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import Message from '../../components/Message'; // Ensure you have this component for displaying messages

const StaffLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await api.post("/api/Auth/staff/login",
                { email, password },
                { withCredentials: true }
            );


            navigate("/staff/gallery");
        } catch (err) {
            setError(err.response?.data || "Login failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
            <div className="flex items-center bg-[#F0EAD6] p-8 rounded-lg">
                <div className="w-[497px] pr-8 mt-0" style={{ marginTop: '-100px', marginRight: '150px' }}>
                    <div className="mb-6">
                        <h2 className="text-[#355E3B] text-4xl font-bold">Staff Login</h2>
                    </div>

                    <div className="mb-6">
                        <p className="text-black text-sm" style={{ fontSize: '20px' }}>
                            Don't have an account?{' '}
                            <span
                                onClick={() => navigate('/register')}
                                className="cursor-pointer text-[#355E3B]"
                            >
                                Register here
                            </span>
                        </p>
                    </div>

                    {/* Use the Message component for error and success messages */}
                    <Message text={error} type="error" />

                    <form onSubmit={handleLogin} className="text-left">
                        <div className="mb-4">
                            <label htmlFor="email" className="text-[#355E3B] text-lg font-medium">Email</label>
                            <div className="flex items-center border border-gray-300 rounded-xl bg-white">
                                <FiMail className="text-gray-400 ml-2" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-xl"
                                    placeholder="Enter your email"
                                    required
                                    style={{ fontSize: '16px' }}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="text-[#355E3B] text-lg font-medium">Password</label>
                            <div className="relative flex items-center border border-gray-300 rounded-xl bg-white">
                                <FiLock className="text-gray-400 ml-2" />
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-xl"
                                    placeholder="Enter your password"
                                    required
                                    style={{ fontSize: '16px' }}
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-300"
                                    onClick={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? <FiEye className="w-6 h-6" /> : <FiEyeOff className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-4 text-right">
                            <span
                                onClick={() => navigate('/sendpasswordresetemail')}
                                className="cursor-pointer text-[#355E3B] text-lg"
                            >
                                Forgot Password?
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="w-full h-[66px] p-2 rounded-xl text-white font-bold bg-[#355E3B] hover:bg-[#2D4B33] mt-4"
                        >
                            Login
                        </button>
                    </form>
                </div>

                <img
                    src="https://live.staticflickr.com/65535/49642389768_aef80a434e_h.jpg"
                    alt="Side Image"
                    className="w-[491px] h-[579px] object-cover"
                />
            </div>
        </div>

    );
};

export default StaffLogin;
