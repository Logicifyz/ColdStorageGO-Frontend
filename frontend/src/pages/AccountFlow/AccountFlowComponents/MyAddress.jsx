import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';

const MyAddress = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        StreetAddress: '',
        PostalCode: ''
    });
    const [originalData, setOriginalData] = useState({
        StreetAddress: '',
        PostalCode: ''
    });
    
    const [isEditing, setIsEditing] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchAddress = async () => {
            try {
                const response = await api.get('/api/Account/profile', { withCredentials: true });
                if (response.status === 200) {
                    setFormData({
                        StreetAddress: response.data.streetAddress || '',
                        PostalCode: response.data.postalCode || ''
                    });
                    setOriginalData({
                        StreetAddress: response.data.streetAddress || '',
                        PostalCode: response.data.postalCode || ''
                    });
                }
            } catch (error) {
                setErrorMessage('Failed to fetch address details.');
            }
        };

        fetchAddress();
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
            const formDataToSend = new FormData();
            formDataToSend.append('StreetAddress', formData.StreetAddress);
            formDataToSend.append('PostalCode', formData.PostalCode);

            const response = await api.put('/api/Account/update-profile', formDataToSend, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                setSuccessMessage('Address updated successfully.');
                setIsEditing(false);
                setOriginalData({ ...formData });
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred while updating the address.');
        }
    };



    const handleCancel = () => {
        setFormData(originalData);
        setIsEditing(false);
        setErrorMessage('');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden p-8">
            <div className="relative z-10 max-w-4xl mx-auto">
                <div className="flex items-center gap-4 mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                        Manage Address
                    </h1>
                </div>

                {successMessage && (
                    <div className="mb-4 p-4 bg-green-500/30 text-green-300 rounded-[10px]">
                        {successMessage}
                    </div>
                )}

                {errorMessage && (
                    <div className="mb-4 p-4 bg-red-500/30 text-red-300 rounded-[10px]">
                        {errorMessage}
                    </div>
                )}

                <div className="bg-gradient-to-br from-[#1a1a2e]/50 to-[#16213e]/50 backdrop-blur-xl rounded-2xl border border-[#ffffff10] shadow-2xl overflow-hidden p-6">
                    {!isEditing ? (
                        <div className="mt-6">
                            <p className="mb-4 text-lg text-white">Street Address: {formData.StreetAddress || "Not set"}</p>
                            <p className="mb-4 text-lg text-white">Postal Code: {formData.PostalCode || "Not set"}</p>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full h-[66px] p-2 rounded-[30px] text-[#D1DFDF] font-bold mt-4 bg-gray-600 hover:bg-gray-700"
                            >
                                Edit Address
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mt-6">
                            <div className="mb-4">
                                <label htmlFor="StreetAddress" className="text-white text-lg">Street Address</label>
                                <input
                                    type="text"
                                    id="StreetAddress"
                                    name="StreetAddress"
                                    value={formData.StreetAddress}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 text-black rounded-[10px] mt-2"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="PostalCode" className="text-white text-lg">Postal Code</label>
                                <input
                                    type="text"
                                    id="PostalCode"
                                    name="PostalCode"
                                    value={formData.PostalCode}
                                    onChange={handleInputChange}
                                    className="w-full h-[66px] p-2 text-black rounded-[10px] mt-2"
                                    required
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
            </div>
        </div>
    );
};

export default MyAddress;
