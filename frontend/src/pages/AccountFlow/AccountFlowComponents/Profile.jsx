import React, { useState, useEffect } from 'react';
import api from '../../../api';

const Profile = () => {
    const [formData, setFormData] = useState({
        Email: '',
        Username: '',
        PhoneNumber: '',
        FullName: '', // Keep the fullName field
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get('/api/Account/profile', { withCredentials: true });
                if (response.status === 200) {
                    setFormData({
                        Email: response.data.email,
                        Username: response.data.username,
                        PhoneNumber: response.data.phoneNumber || '', // Optional
                        FullName: response.data.fullName || '', // Optional
                    });
                }
            } catch (error) {
                setErrorMessage('Failed to fetch profile information.');
            }
        };

        fetchProfile();
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


        try {
            console.log(formData)
            const response = await api.put('/api/Account/update-profile', formData, { withCredentials: true });
            if (response.status === 200) {
                setSuccessMessage('Profile updated successfully.');
            }
        } catch (error) {
            setErrorMessage('An error occurred while updating the profile.');
        }
    };


    return (
        <div className="flex justify-center items-center h-screen bg-[#383838]">
            <div className="w-[497px]">
                <h2 className="text-white text-4xl font-bold mb-6">Profile</h2>

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

                <form onSubmit={handleSubmit} className="text-left">
                    <div className="mb-4">
                        <label htmlFor="Username" className="text-white text-lg">Username</label>
                        <input
                            type="text"
                            id="Username"
                            name="Username"
                            value={formData.Username}
                            onChange={handleInputChange}
                            className="w-full h-[66px] p-2 text-black rounded-[10px]"
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
                            className="w-full h-[66px] p-2 text-black rounded-[10px]"
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
                            className="w-full h-[66px] p-2 text-black rounded-[10px]"
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
                            className="w-full h-[66px] p-2 text-black rounded-[10px]"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold mt-4"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #B94444, #7A2F2F)',
                        }}
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
