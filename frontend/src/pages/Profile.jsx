import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import FollowList from './AccountFlow/AccountFlowComponents/FollowList';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const Profile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [isFollowersListOpen, setIsFollowersListOpen] = useState(false);
    const [isFollowingListOpen, setIsFollowingListOpen] = useState(false);
    const [isFollowingUser, setIsFollowingUser] = useState(false); // State for follow/unfollow button

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log("Fetching profile...");
                const response = await api.get(`api/Account/profile/${username}`);
                console.log("Profile fetched:", response.data);
                setProfile(response.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError(err.response?.data || 'Error fetching profile');
            } finally {
                setLoading(false);
            }
        };

        const fetchFollowersFollowing = async () => {
            try {
                console.log("Fetching followers and following...");
                const followersResponse = await api.get(`/api/Account/followers/${username}`);
                console.log("Followers fetched:", followersResponse.data);
                setFollowers(followersResponse.data || []);

                const followingResponse = await api.get(`/api/Account/following/${username}`);
                console.log("Following fetched:", followingResponse.data);
                setFollowing(followingResponse.data || []);

                // Fetch logged-in user details using the session-check API
                const sessionResponse = await api.get('/api/Auth/check-session');
                console.log("Session check response:", sessionResponse.data);
                const loggedInUsername = sessionResponse.data.username;
                console.log("LoggedinUsername = ", loggedInUsername)
                // Check if the logged-in user is following this user
                console.log(followersResponse.data)
                const isFollowing = followersResponse.data.some(follow => follow.username === loggedInUsername);
                console.log("Is logged-in user following?", isFollowing);
                setIsFollowingUser(isFollowing);
            } catch (error) {
                console.error('Failed to fetch followers/following:', error);
            }
        };

        fetchProfile();
        fetchFollowersFollowing();
    }, [username]);

    const handleFollow = async () => {
        console.log("Attempting to follow...");
        try {
            await api.post('/api/Account/follow', { username });
            console.log("Successfully followed the user");
            setIsFollowingUser(true);
            alert("Successfully followed the user.");
        } catch (error) {
            console.error("Error following user:", error);
            alert("Error following user.");
        }
    };

    const handleUnfollow = async () => {
        console.log("Attempting to unfollow...");
        try {
            await api.post('/api/Account/unfollow', { username });
            console.log("Successfully unfollowed the user");
            setIsFollowingUser(false);
            alert("Successfully unfollowed the user.");
        } catch (error) {
            console.error("Error unfollowing user:", error);
            alert("Error unfollowing user.");
        }
    };

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
                <div className="text-white text-lg">
                    <button onClick={() => setIsFollowersListOpen(true)}>
                        Followers: {followers.length}
                    </button>
                    <button onClick={() => setIsFollowingListOpen(true)}>
                        Following: {following.length}
                    </button>

                    {/* Follow/Unfollow Button */}
                    {isFollowingUser ? (
                        <button onClick={handleUnfollow} className="bg-red-500 text-white p-2 rounded-md mt-4">
                            Unfollow
                        </button>
                    ) : (
                        <button onClick={handleFollow} className="bg-blue-500 text-white p-2 rounded-md mt-4">
                            Follow
                        </button>
                    )}
                </div>
            </div>

            {/* Followers List Modal */}
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
        </div>
    );
};

export default Profile;
