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
        ProfilePicture: '', // Add field for profile picture URL
    });
    const [originalData, setOriginalData] = useState({
        Email: '',
        Username: '',
        PhoneNumber: '',
        FullName: '',
        ProfilePicture: '', // Add field for original profile picture URL
    });
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isVerified, setIsVerified] = useState(false); // Default is false until verified status is fetched
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowersListOpen, setIsFollowersListOpen] = useState(false); // State to control followers list visibility
    const [isFollowingListOpen, setIsFollowingListOpen] = useState(false); // State to control following list visibility
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
                        ProfilePicture: response.data.profilePicture || '', // Add profile picture URL
                    };
                    setFormData(userData);
                    setOriginalData(userData);
                    setIsVerified(response.data.verified);  // Set verification status from response
                    setProfilePicturePreview(userData.ProfilePicture ? `data:image/png;base64,${userData.ProfilePicture}` : 'default-profile.jpg'); // Set initial preview

                    // Fetch followers and following data using the username from the response
                    fetchFollowersFollowing(response.data.username);
                }
            } catch (error) {
                setErrorMessage('Failed to fetch profile information.');
            }
        };

        const fetchFollowersFollowing = async (username) => {
            try {
                const followersResponse = await api.get(`/api/Account/followers/${username}`, { withCredentials: true });
                setFollowers(followersResponse.data || []); // Set empty array if no followers

                const followingResponse = await api.get(`/api/Account/following/${username}`, { withCredentials: true });
                setFollowing(followingResponse.data || []); // Set empty array if no following
            } catch (error) {
                console.error('Failed to fetch followers/following:', error);
            }
        };

        fetchProfile(); // Initial profile fetch
    }, []);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'ProfilePicture' && files && files[0]) {
            const file = files[0];
            const allowedTypes = ['image/jpeg', 'image/png'];
            const maxSize = 2 * 1024 * 1024; // 2MB

            if (!allowedTypes.includes(file.type)) {
                setErrorMessage('Invalid file type. Only JPG and PNG images are allowed.');
                return;
            }

            if (file.size > maxSize) {
                setErrorMessage('File size exceeds the maximum allowed size (2MB).');
                return;
            }

            setFormData({
                ...formData,
                ProfilePicture: file,
            });
            setProfilePicturePreview(URL.createObjectURL(file)); // Set preview for the new image
            console.log('Profile Picture Selected:', file); // Log the selected file
            setErrorMessage(''); // Clear any previous error messages
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
            }
            console.log("Sending form data:", formDataToSend)

            const response = await api.put('/api/Account/update-profile', formDataToSend, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                setSuccessMessage('Profile updated successfully.');
                setIsEditing(false);

                // Convert ProfilePicture to Base64 before updating originalData
                if (formData.ProfilePicture instanceof File) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64ProfilePicture = reader.result.split(',')[1]; // Get the Base64 string
                        setOriginalData({
                            ...formData,
                            ProfilePicture: base64ProfilePicture, // Set the Base64 encoded profile picture
                        });
                        console.log("After updating profile:", base64ProfilePicture);
                    };
                    reader.readAsDataURL(formData.ProfilePicture); // Convert the file to Base64
                } else {
                    // If no new ProfilePicture, just update with the formData
                    setOriginalData({
                        ...formData,
                        ProfilePicture: formData.ProfilePicture, // Directly set the existing ProfilePicture
                    });
                    console.log("After updating profile:", formData.ProfilePicture);
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
        setProfilePicturePreview(originalData.ProfilePicture ? `data:image/png;base64,${originalData.ProfilePicture}` : 'default-profile.jpg'); // Revert to the original profile picture
        setIsEditing(false);
        console.log('Profile Picture After Cancel:', originalData.ProfilePicture); // Log the profile picture after cancel

        setErrorMessage(''); // Clear any error messages
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

    // Handle opening modal for followers
    const openFollowersModal = () => setIsFollowersListOpen(true);
    const closeFollowersModal = () => setIsFollowersListOpen(false);

    // Handle opening modal for following
    const openFollowingModal = () => setIsFollowingListOpen(true);
    const closeFollowingModal = () => setIsFollowingListOpen(false);

    return (
        <div className="relative flex flex-row justify-start items-start h-screen bg-[#383838] p-6">
            {/* Profile Details on the Left */}
            <div className="flex-1 w-[497px] p-6 rounded-lg bg-[#383838] text-left">
                <div className="w-full p-6 bg-[#383838] text-white">
                    <h1 className="text-4xl font-bold">{formData.Username || 'Loading...'}</h1>
                    <p className="text-lg text-gray-400">{formData.Email}</p>
                </div>

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
                    <div>
                        <p className="mb-4 text-lg text-white">Username: {formData.Username}</p>
                        <p className="mb-4 text-lg text-white">Email: {formData.Email}</p>
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
                    <form onSubmit={handleSubmit}>
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
            <div className="flex items-center space-x-6 mt-4">
                <div className="text-white cursor-pointer" onClick={openFollowersModal}>
                    <strong>{followers.length}</strong> Followers
                </div>
                <div className="text-white cursor-pointer" onClick={openFollowingModal}>
                    <strong>{following.length}</strong> Following
                </div>
            </div>
            <Modal
                isOpen={isFollowersListOpen}
                onRequestClose={() => setIsFollowersListOpen(false)}
                contentLabel="Followers List"
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
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

            {/* Following List Modal */}
            <Modal
                isOpen={isFollowingListOpen}
                onRequestClose={() => setIsFollowingListOpen(false)}
                contentLabel="Following List"
                style={{
                    overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
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
            {/* Profile Picture on the Right */}
            <div className="flex flex-col justify-start items-center ml-6">
                <img
                    src={profilePicturePreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white mt-4"
                />

                {isEditing && (
                    <div className="mt-2">
                        <input
                            type="file"
                            id="ProfilePicture"
                            name="ProfilePicture"
                            onChange={handleInputChange}
                            className="hidden"
                        />
                        <label
                            htmlFor="ProfilePicture"
                            className="text-white bg-blue-500 px-4 py-1 rounded-lg cursor-pointer hover:bg-blue-600"
                        >
                            Edit Profile Picture
                        </label>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;