import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import FollowList from './FollowList'; // Import the List component
import Modal from 'react-modal';  // Import react-modal

const Profile = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        Email: '',
        Username: '',
        PhoneNumber: '',
        FullName: '',
    });
    const [originalData, setOriginalData] = useState({
        Email: '',
        Username: '',
        PhoneNumber: '',
        FullName: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false); // Default is false until verified status is fetched
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowersListOpen, setIsFollowersListOpen] = useState(false); // State to control followers list visibility
    const [isFollowingListOpen, setIsFollowingListOpen] = useState(false); // State to control following list visibility

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
                    };
                    setFormData(userData);
                    setOriginalData(userData);
                    setIsVerified(response.data.verified);  // Set verification status from response
                }
            } catch (error) {
                setErrorMessage('Failed to fetch profile information.');
            }
        };

        const fetchFollowersFollowing = async () => {
            try {
                const followersResponse = await api.get('/api/Account/followers', { withCredentials: true });
                setFollowers(followersResponse.data || []); // Set empty array if no followers

                const followingResponse = await api.get('/api/Account/following', { withCredentials: true });
                setFollowing(followingResponse.data || []); // Set empty array if no following
            } catch (error) {
                console.error('Failed to fetch followers/following:', error);
            }
        };

        fetchProfile();
        fetchFollowersFollowing();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (JSON.stringify(formData) === JSON.stringify(originalData)) {
            setIsEditing(false);
            return;
        }

        try {
            const response = await api.put('/api/Account/update-profile', formData, { withCredentials: true });
            if (response.status === 200) {
                setSuccessMessage('Profile updated successfully.');
                setIsEditing(false);
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
        setIsEditing(false);
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

    return (
        <div className="relative flex justify-start items-center h-screen bg-[#383838]">
            <div className="absolute top-4 left-4 text-white text-4xl font-bold">
                {formData.Username || 'Loading...'}
            </div>
            {/* Verification Status and Followers/Following Count */}
            <div className="absolute top-4 right-4 text-white text-lg flex items-center space-x-4">
                <div>
                    {isVerified ? (
                        <span className="bg-green-500 px-4 py-1 rounded-lg">Verified</span>
                    ) : (
                        <button
                            onClick={requestVerificationEmail}
                            className="bg-yellow-500 px-4 py-1 rounded-lg text-white font-bold hover:bg-yellow-600"
                        >
                            Not Verified - Click to Verify
                        </button>
                    )}
                </div>
                <div className="space-x-4">
                    <button
                        className="text-white"
                        onClick={() => setIsFollowersListOpen(true)}
                    >
                        Followers: {followers.length}
                    </button>
                    <button
                        className="text-white"
                        onClick={() => setIsFollowingListOpen(true)}
                    >
                        Following: {following.length}
                    </button>
                </div>
            </div>

            {/* Profile details form */}
            <div className="w-[497px] p-6 rounded-lg bg-[#383838]">
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-500 text-white rounded-[10px]">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-4 p-4 bg-red-500 text-white rounded-[10px]">
                        {errorMessage}
                    </div>
                )}

                {!isEditing ? (
                    <div className="text-left">
                        <p className="mb-4 text-lg text-white">Username: {formData.Username}</p>
                        <p className="mb-4 text-lg text-white">Email: {formData.Email}</p>
                        <p className="mb-4 text-lg text-white">Phone Number: {formData.PhoneNumber}</p>
                        <p className="mb-4 text-lg text-white">Full Name: {formData.FullName}</p>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold mt-4 bg-gray-600 hover:bg[#383838]"
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="text-left">
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
            </div>

            {/* React Modal for Followers List */}
            <Modal
                isOpen={isFollowersListOpen}
                onRequestClose={() => setIsFollowersListOpen(false)}
                contentLabel="Followers List"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        maxWidth: '400px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        zIndex: '9999',
                        width: '80%',
                    },
                }}
            >
                <h2 className="text-xl font-bold">Followers</h2>
                <FollowList title="Followers" listData={followers} />
            </Modal>

            {/* React Modal for Following List */}
            <Modal
                isOpen={isFollowingListOpen}
                onRequestClose={() => setIsFollowingListOpen(false)}
                contentLabel="Following List"
                style={{
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    },
                    content: {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        padding: '20px',
                        maxWidth: '400px',
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        zIndex: '9999',
                        width: '80%',
                    },
                }}
            >
                <h2 className="text-xl font-bold">Following</h2>
                <FollowList title="Following" listData={following} />
            </Modal>
        </div>
    );
};

export default Profile;
