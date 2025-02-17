import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import FollowList from './FollowList';
import Modal from 'react-modal';
import { motion } from 'framer-motion';

const MyProfile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Email: '',
        Username: '',
        PhoneNumber: '',
        FullName: '',
        ProfilePicture: '',
    });
    const [originalData, setOriginalData] = useState({
        Email: '',
        Username: '',
        PhoneNumber: '',
        FullName: '',
        ProfilePicture: '',
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowersListOpen, setIsFollowersListOpen] = useState(false);
    const [isFollowingListOpen, setIsFollowingListOpen] = useState(false);
    const [profilePicturePreview, setProfilePicturePreview] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/api/Account/profile', { withCredentials: true });
                if (response.status === 200) {
                    const userData = {
                        Email: response.data.email,
                        Username: response.data.username,
                        PhoneNumber: response.data.phoneNumber || '',
                        FullName: response.data.fullName || '',
                        ProfilePicture: response.data.profilePicture || '',
                    };
                    setFormData(userData);
                    setOriginalData(userData);
                    setIsVerified(response.data.verified);
                    setProfilePicturePreview(
                        userData.ProfilePicture
                            ? `data:image/png;base64,${userData.ProfilePicture}`
                            : ''
                    );
                    fetchFollowersFollowing(response.data.username);
                }
            } catch (error) {
                setErrorMessage('Failed to fetch profile information.');
            }
        };

        const fetchFollowersFollowing = async (username) => {
            try {
                const followersResponse = await api.get(`/api/Account/followers/${username}`, { withCredentials: true });
                setFollowers(followersResponse.data || []);
                const followingResponse = await api.get(`/api/Account/following/${username}`, { withCredentials: true });
                setFollowing(followingResponse.data || []);
            } catch (error) {
                console.error('Failed to fetch followers/following:', error);
            }
        };

        fetchProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'ProfilePicture' && files && files[0]) {
            const file = files[0];
            const allowedTypes = ['image/jpeg', 'image/png']; // Allowed image types
            const maxSize = 2 * 1024 * 1024; // Maximum file size: 2MB

            if (!allowedTypes.includes(file.type)) {
                setErrorMessage('Invalid file type. Only JPG and PNG images are allowed.');
                return; // Prevent further processing
            }

            if (file.size > maxSize) {
                setErrorMessage('File size exceeds the maximum allowed size (2MB).');
                return; // Prevent further processing
            }

            // Only set form data and preview if the file is valid
            setFormData({
                ...formData,
                ProfilePicture: file,
            });
            setProfilePicturePreview(URL.createObjectURL(file)); // Preview image
            setErrorMessage(''); // Clear any previous error message
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        // Validate that all required fields are entered
        const missingFields = [];
        if (!formData.Email) missingFields.push('Email');
        if (!formData.Username) missingFields.push('Username');
        if (!formData.PhoneNumber) missingFields.push('Phone Number');
        if (!formData.FullName) missingFields.push('Full Name');

        if (missingFields.length > 0) {
            setErrorMessage(`Please complete the following fields: ${missingFields.join(', ')}`);
            return;
        }

        // Proceed if no fields are missing
        if (JSON.stringify(formData) === JSON.stringify(originalData)) {
            setIsEditing(false);
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('Email', formData.Email);
            formDataToSend.append('Username', formData.Username);
            formDataToSend.append('PhoneNumber', formData.PhoneNumber);
            formDataToSend.append('FullName', formData.FullName);

            if (formData.ProfilePicture instanceof File) {
                formDataToSend.append('ProfilePicture', formData.ProfilePicture);
            } else if (formData.ProfilePicture === '') {
                // If profile picture is removed, send an empty string
                formDataToSend.append('ProfilePicture', '');
            }

            const response = await api.put('/api/Account/update-profile', formDataToSend, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setSuccessMessage('Profile updated successfully.');
                setIsEditing(false);

                if (formData.ProfilePicture instanceof File) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64ProfilePicture = reader.result.split(',')[1];
                        setOriginalData({
                            ...formData,
                            ProfilePicture: base64ProfilePicture,
                        });
                    };
                    reader.readAsDataURL(formData.ProfilePicture);
                } else {
                    setOriginalData({
                        ...formData,
                        ProfilePicture: formData.ProfilePicture,
                    });
                }
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'An error occurred while updating the profile.');
            } else {
                setErrorMessage('An error occurred while updating the profile.');
            }
        }
    };

    const handleCancel = () => {
        setFormData(originalData);
        setProfilePicturePreview(originalData.ProfilePicture ? `data:image/png;base64,${originalData.ProfilePicture}` : '');
        setIsEditing(false);
        setErrorMessage('');
    };

    const handleSetPassword = async () => {
        console.log("Requesting password setup...");
        try {
            const response = await api.post('/api/Auth/request-password-set');
            if (response.data.success) {
                console.log("Password set token received:", response.data.Token);
                alert("Check your email to set your password.");
                navigate(`/successfullysentsetpasswordemail`);
            } else {
                alert(response.data.Message);
            }
        } catch (error) {
            console.error("Error requesting password setup:", error);
            alert("Error requesting password setup.");
        }
    };

    const requestVerificationEmail = async () => {
        try {
            const response = await api.post('/api/Auth/request-verification-email', { Email: formData.Email });
            if (response.status === 200) {
                setSuccessMessage('Verification email sent successfully!');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'An error occurred while sending the verification email.');
            } else {
                setErrorMessage('An error occurred while sending the verification email.');
            }
        }
    };

    const getInitials = (username) => {
        if (!username) return ''; // Return empty string if no username is provided
        // Match all uppercase letters and join the first two
        const initials = username.match(/[A-Z]/g) || [];
        return initials.slice(0, 2).join('');
    };

    const handleRemoveProfilePicture = () => {
        setFormData({
            ...formData,
            ProfilePicture: '', // Set to an empty string when the picture is removed
        });
        setProfilePicturePreview(''); // Clear the preview
    };
        
    const openFollowersModal = () => setIsFollowersListOpen(true);
    const closeFollowersModal = () => setIsFollowersListOpen(false);

    const openFollowingModal = () => setIsFollowingListOpen(true);
    const closeFollowingModal = () => setIsFollowingListOpen(false);

    return (
        <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden p-8">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-48 -left-48 bg-gradient-to-r from-purple-700/10 to-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute w-[600px] h-[600px] -bottom-32 -right-48 bg-gradient-to-r from-pink-700/10 to-cyan-500/10 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Profile
                    </h1>
                </div>

                <div className="grid gap-4">
                    {successMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-4 bg-green-500/30 text-green-300 rounded-[10px]"
                        >
                            {successMessage}
                        </motion.div>
                    )}

                    {errorMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-4 bg-red-500/30 text-red-300 rounded-[10px]"
                        >
                            {errorMessage}
                        </motion.div>
                    )}

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 backdrop-blur-xl rounded-2xl border border-[#ffffff10] shadow-2xl overflow-hidden p-6"
                    >
                        <div className="flex items-center gap-4">
                            {profilePicturePreview ? (
                                <img
                                    src={profilePicturePreview}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-white">
                                    {getInitials(formData.Username)} {/* Use Username for initials */}
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-white">{formData.Username}</h2>
                                <p className="text-gray-400">{formData.Email}</p>
                            </div>
                        </div>

                        {!isEditing ? (
                            <div className="mt-6">
                                <p className="mb-4 text-lg text-white">Phone Number: {formData.PhoneNumber}</p>
                                <p className="mb-4 text-lg text-white">Full Name: {formData.FullName}</p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold mt-4 bg-gray-600 hover:bg-gray-700"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="mt-6">
                                <div className="mb-4">
                                    <label htmlFor="Username" className="text-white text-lg">Username</label>
                                    <input
                                        type="text"
                                        id="Username"
                                        name="Username"
                                        value={formData.Username}
                                        onChange={handleInputChange}
                                        className="w-full h-[66px] p-2 text-black rounded-[10px] mt-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="Email" className="text-white text-lg">Email</label>
                                    <input
                                        type="Email"
                                        id="Email"
                                        name="Email"
                                        value={formData.Email}
                                        onChange={handleInputChange}
                                        className="w-full h-[66px] p-2 text-black rounded-[10px] mt-2"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="PhoneNumber" className="text-white text-lg">Phone Number</label>
                                    <input
                                        type="text"
                                        id="PhoneNumber"
                                        name="PhoneNumber"
                                        value={formData.PhoneNumber}
                                        onChange={handleInputChange}
                                        className="w-full h-[66px] p-2 text-black rounded-[10px] mt-2"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label htmlFor="FullName" className="text-white text-lg">Full Name</label>
                                    <input
                                        type="text"
                                        id="FullName"
                                        name="FullName"
                                        value={formData.FullName}
                                        onChange={handleInputChange}
                                        className="w-full h-[66px] p-2 text-black rounded-[10px] mt-2"
                                    />
                                </div>
                                    <div className="mt-6 flex gap-4">
                                        {formData.ProfilePicture ? (
                                            <button
                                                onClick={handleRemoveProfilePicture}
                                                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                                            >
                                                Remove Picture
                                            </button>
                                        ) : (
                                            <label
                                                className="bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-blue-600 transition"
                                            >
                                                Add Picture
                                                <input
                                                    type="file"
                                                    name="ProfilePicture"
                                                    accept="image/jpeg, image/png"
                                                    className="hidden"
                                                    onChange={handleInputChange}
                                                />
                                            </label>
                                        )}
                                    </div>
                                <button
                                    type="submit"
                                    className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold mt-4 bg-gray-600 hover:bg-gray-700"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold mt-4 bg-gray-600 hover:bg-gray-700"
                                >
                                    Cancel
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            </div>

            <Modal
                isOpen={isFollowersListOpen}
                onRequestClose={closeFollowersModal}
                contentLabel="Followers List"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 1001
                    },
                    content: {
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        maxWidth: '400px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        zIndex: 1002,
                        width: '80%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    },
                }}
            >
                <h2 className="text-xl font-bold">Followers</h2>
                <FollowList title="Followers" listData={followers} />
            </Modal>

            <Modal
                isOpen={isFollowingListOpen}
                onRequestClose={closeFollowingModal}
                contentLabel="Following List"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                        zIndex: 1001
                    },
                    content: {
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        maxWidth: '400px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        zIndex: 1002,
                        width: '80%',
                        maxHeight: '80vh',
                        overflowY: 'auto'
                    },
                }}
            >
                <h2 className="text-xl font-bold">Following</h2>
                <FollowList title="Following" listData={following} />
            </Modal>
        </div>
    );
};

export default MyProfile;