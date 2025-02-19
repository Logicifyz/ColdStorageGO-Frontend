import React, { useState } from 'react';
import api from '../../api';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Message from '../../components/Message';
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin
import { jwtDecode } from 'jwt-decode';

const clientid = "869557804479-pv18rpo94fbpd6hatmns6m4nes5adih8.apps.googleusercontent.com";
const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.post('/api/Auth/login', formData, { withCredentials: true });
            console.log(response.data);
            if (response.data.success) {
                setSuccessMessage('Login successful!');
                setError('');
                setFormData({
                    email: '',
                    password: ''
                });
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(response.data.message || 'Login failed');
            }
        } catch (error) {
            console.error(error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError('There was an issue with the login. Please try again later.');
            }
        }
    };

    const handleGoogleLogin = async (response) => {
        try {
            const { credential } = response;

            // Decode the ID token and inspect its contents
            const decodedToken = jwtDecode(credential); // Decode the ID token
            console.log(decodedToken.email)
            if (!decodedToken.email) {
                setError('Google login failed: Missing email.');
                return;
            }

            // Send the Google ID token to your backend for authentication
            const googleResponse = await api.post('/api/Auth/google-login', {
                IdToken: credential, // Send the IdToken as expected by the backend
            }, { withCredentials: true });

            console.log(googleResponse.data);

            if (googleResponse.data.success) {
                setSuccessMessage('Login successful!');
                setError('');
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(googleResponse.data.message || 'Google login failed');
            }
        } catch (error) {
            console.error(error);
            if (error.response?.status === 403) {
                setError('Account is deactivated. Please contact support.');
            } else {
                setError('There was an issue with Google login. Please try again later.');
            }

        }
    };



    return (
        <div className="flex justify-center items-center h-screen bg-[#F0EAD6]">
            <div className="flex items-center bg-[#F0EAD6] p-8 rounded-lg">
                <div className="w-[497px] pr-8 mt-0" style={{ marginTop: '-100px', marginRight: '150px' }}>
                    <div className="mb-6">
                        <h2 className="text-[#355E3B] text-4xl font-bold">Login</h2>
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
                    <Message text={successMessage} type="success" />

                    <form onSubmit={handleSubmit} className="text-left">
                        <div className="mb-4">
                            <label htmlFor="email" className="text-[#355E3B] text-lg font-medium">Email</label>
                            <div className="flex items-center border border-gray-300 rounded-xl bg-white">
                                <FiMail className="text-gray-400 ml-2" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
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
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
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

                    {/* Google login button */}
                    <div className="mt-4">
                        <GoogleLogin
                            clientid={clientid}
                            onSuccess={handleGoogleLogin}
                            onError={(error) => setError('Google login failed. Please try again.')}
                        />
                    </div>
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

export default Login;
