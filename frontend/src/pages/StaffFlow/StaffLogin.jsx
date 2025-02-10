import { useState } from "react";
import api from '../../api';
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

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


            navigate("/staff/dashboard");
        } catch (err) {
            setError(err.response?.data || "Login failed. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-[#383838]">
            <div className="flex items-center bg-[#383838] p-8 rounded-lg">
                <div className="w-[497px] pr-8 mt-0" style={{ marginTop: '-100px', marginRight: '150px' }}>
                    <div className="mb-6">
                        <h2 className="text-white text-4xl font-bold">Staff Login</h2>
                    </div>

                    <form onSubmit={handleLogin} className="text-left">
                        <div className="mb-4">
                            <label htmlFor="email" className="text-white text-lg font-medium">Email</label>
                            <div className="flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiMail className="text-gray-400 ml-2" />
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                    placeholder="Enter your email"
                                    required
                                    style={{ fontSize: '20px' }}
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="text-white text-lg font-medium">Password</label>
                            <div className="relative flex items-center border border-gray-300 rounded-[10px] bg-white">
                                <FiLock className="text-gray-400 ml-2" />
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full h-[66px] p-2 pl-8 text-black rounded-[10px]"
                                    placeholder="Enter your password"
                                    required
                                    style={{ fontSize: '20px' }}
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

                      

                        <button
                            type="submit"
                            className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold inline-block mt-4"
                            style={{
                                backgroundImage: 'linear-gradient(to right, #4D5C60, #2B2E4A)',
                            }}
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
