﻿import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import FollowList from './AccountFlow/AccountFlowComponents/FollowList';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';

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
    const [isFollowingUser, setIsFollowingUser] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [comments, setComments] = useState([]);
    const [activeTab, setActiveTab] = useState("Recipes");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                console.log("✅ Fetching profile for:", username);
                const response = await api.get(`api/Account/profile/${username}`);
                setProfile(response.data);

                // ✅ Get logged-in user from session
                const sessionResponse = await api.get('/api/Auth/check-session');
                const loggedInUsername = sessionResponse.data.username;

                // ✅ If viewing own profile, redirect to /account-dashboard
                if (loggedInUsername === username) {
                    console.log("🔄 [DEBUG] Redirecting to: /account-dashboard");
                    navigate("/account-dashboard/profile");
                }
            } catch (err) {
                console.error("❌ Error fetching profile:", err);
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
                console.log("LoggedinUsername = ", loggedInUsername);
                // Check if the logged-in user is following this user
                console.log(followersResponse.data);
                const isFollowing = followersResponse.data.some(follow => follow.username === loggedInUsername);
                console.log("Is logged-in user following?", isFollowing);
                setIsFollowingUser(isFollowing);
            } catch (error) {
                console.error('Failed to fetch followers/following:', error);
            }
        };

        const fetchUserRecipes = async () => {
            try {
                const response = await api.get(`/api/Recipes/user/${username}`, {
                    credentials: "include",
                });
                setRecipes(response.data || []);
            } catch (error) {
                console.error("Error fetching user recipes:", error);
            }
        };

        const fetchUserDiscussions = async () => {
            try {
                console.log("🔄 [FETCHING] Fetching discussions...");
                const response = await api.get(`/api/Discussions/user/${username}`);
                console.log("✅!!!! [DEBUG] Fetched Discussions:", response.data);
                setDiscussions(response.data || []);
            } catch (error) {
                console.error("❌ [ERROR] Fetching discussions failed:", error);
            }
        };

        const fetchUserComments = async () => {
            try {
                console.log("?? [FETCHING] Fetching user comments for:", username);
                const response = await api.get(`/api/Comments/user/${username}`);
                console.log("?!!!! [DEBUG] Raw API Response:", response);
                console.log("?!!!! [DEBUG] Fetched COMMENTS:", response.data);

                setComments(response.data || []);
            } catch (error) {
                console.error("❌ [ERROR] Fetching user comments failed:", error);
            }
        };

        fetchProfile();
        fetchFollowersFollowing();
        fetchUserRecipes();
        fetchUserDiscussions();
        fetchUserComments();
    }, [username]);

    const handleFollow = async () => {
        console.log("Attempting to follow...");
        try {
            await api.post('/api/Account/follow', { username });
            console.log("Successfully followed the user");
            setIsFollowingUser(true);
        } catch (error) {
            console.error("Error following user:", error);
        }
    };

    const handleUnfollow = async () => {
        console.log("Attempting to unfollow...");
        try {
            await api.post('/api/Account/unfollow', { username });
            console.log("Successfully unfollowed the user");
            setIsFollowingUser(false);
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
    };

    if (loading) return <p className="text-[#355E3B]">Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="p-6 bg-[#f0f0e0] min-h-screen flex flex-col items-center">
            {/* Profile Card */}
            <div className="w-full max-w-4xl bg-[#e0e0d0] p-8 rounded-lg shadow-lg border border-[#355E3B]">
                <div className="flex items-center space-x-6">
                    {profile.ProfilePicture ? (
                        <img
                            src={profile.ProfilePicture}
                            alt={`${profile.username}'s profile`}
                            className="w-24 h-24 rounded-full object-cover border-4 border-[#355E3B]"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-full bg-[#355E3B] border-4 border-[#355E3B]"></div>
                    )}
                    <div>
                        <h1 className="text-3xl font-bold text-[#355E3B]">{profile.username}</h1>
                        
                    </div>
                </div>

                {/* Followers & Following Section */}
                <div className="mt-4 flex space-x-6">
                    <button
                        onClick={() => setIsFollowersListOpen(true)}
                        className="text-lg font-semibold text-[#355E3B] hover:underline"
                    >
                        Followers: {followers?.length || 0}
                    </button>
                    <button
                        onClick={() => setIsFollowingListOpen(true)}
                        className="text-lg font-semibold text-[#355E3B] hover:underline"
                    >
                        Following: {following?.length || 0}
                    </button>

                    {/* Follow/Unfollow Button */}
                    {isFollowingUser ? (
                        <button
                            onClick={handleUnfollow}
                            className="ml-auto bg-red-500 px-4 py-2 text-white rounded-md hover:bg-red-600 transition"
                        >
                            Unfollow
                        </button>
                    ) : (
                        <button
                            onClick={handleFollow}
                            className="ml-auto bg-[#355E3B] px-4 py-2 text-white rounded-md hover:bg-[#204037] transition"
                        >
                            Follow
                        </button>
                    )}
                </div>
            </div>

            {/* Profile Navigation Tabs */}
            <div className="w-full max-w-4xl mt-6">
                <div className="flex border-b border-[#355E3B]">
                    {["Recipes", "Discussions", "Comments"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 text-lg font-semibold transition ${activeTab === tab
                                ? "border-b-4 border-[#355E3B] text-[#355E3B]"
                                : "text-[#355E3B] hover:text-[#204037]"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "Recipes" && recipes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {recipes.map((recipe) => (
                                <div key={recipe.recipeId} className="bg-[#e0e0d0] p-4 rounded-lg shadow-md border border-[#355E3B]">
                                    {recipe.coverImages.length > 0 && (
                                        <img src={`data:image/jpeg;base64,${recipe.coverImages[0]}`} alt="Recipe Cover" className="w-full h-48 object-cover rounded-t-lg" />
                                    )}
                                    <h3 className="text-xl font-semibold mt-4 text-[#355E3B]">{recipe.name}</h3>
                                    <p className="text-[#355E3B]">{recipe.description}</p>
                                </div>
                            ))}
                        </div>
                    ) : activeTab === "Discussions" && discussions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {discussions.map((discussion) => (
                                <div key={discussion.discussionId} className="bg-[#e0e0d0] p-4 rounded-lg shadow-md border border-[#355E3B]">
                                    {discussion.coverImages && discussion.coverImages.length > 0 && (
                                        <img
                                            src={`data:image/jpeg;base64,${discussion.coverImages[0]}`}
                                            alt="Discussion Cover"
                                            className="w-full h-48 object-cover rounded-t-lg"
                                        />
                                    )}
                                    <h3 className="text-xl font-semibold mt-4 text-[#355E3B]">{discussion.title}</h3>
                                    <p className="text-[#355E3B]">{discussion.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : activeTab === "Comments" && comments.length > 0 ? (
                        <div className="space-y-4">
                            {comments.map((comment, index) => (
                                <div key={comment.commentId || `comment-${index}`} className="bg-[#e0e0d0] p-4 rounded-lg shadow-md border border-[#355E3B]">
                                    <p className="text-[#355E3B]">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-[#355E3B] text-center">No content found.</p>
                    )}
                </div>
            </div>

            {/* Followers List Modal */}
            <Modal
                isOpen={isFollowersListOpen}
                onRequestClose={() => setIsFollowersListOpen(false)}
                contentLabel="Followers List"
                className="bg-[#e0e0d0] p-6 rounded-lg max-w-md mx-auto border border-[#355E3B]"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl font-bold mb-4 text-[#355E3B]">Followers</h2>
                <FollowList title="Followers" listData={followers} />
            </Modal>

            {/* Following List Modal */}
            <Modal
                isOpen={isFollowingListOpen}
                onRequestClose={() => setIsFollowingListOpen(false)}
                contentLabel="Following List"
                className="bg-[#e0e0d0] p-6 rounded-lg max-w-md mx-auto border border-[#355E3B]"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-xl font-bold mb-4 text-[#355E3B]">Following</h2>
                <FollowList title="Following" listData={following} />
            </Modal>
        </div>
    );
};

export default Profile;