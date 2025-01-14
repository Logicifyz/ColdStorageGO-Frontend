import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

const Profile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get(`api/Account/profile/${username}`);
                setProfile(response.data);
            } catch (err) {
                setError(err.response?.data || 'Error fetching profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username]);

    if (loading) return <p className="text-white">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="flex justify-center items-center h-screen bg-[#383838]">
            <div className="w-full max-w-4xl bg-[#383838] p-8 rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-white text-4xl font-bold">{profile.username}</h1>
                    {profile.ProfilePicture ? (
                        <img
                            src={profile.ProfilePicture}
                            alt={`${profile.username}'s profile`}
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-32 h-32 rounded-full bg-white"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
