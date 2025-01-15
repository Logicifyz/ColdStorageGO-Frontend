import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Rewards = () => {
    const [wallet, setWallet] = useState(null);
    const [rewards, setRewards] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [redemptions, setRedemptions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const response = await api.get("/api/Wallet");
                setWallet(response.data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    navigate("/login");
                } else {
                    setErrorMessage("Failed to load wallet. Please try again later.");
                }
            }
        };

        const fetchRewards = async () => {
            try {
                const response = await api.get("/api/Rewards");
                setRewards(response.data);
            } catch (error) {
                setErrorMessage("Failed to load rewards. Please try again later.");
            }
        };

        const fetchRedemptions = async () => {
            try {
                const response = await api.get("/api/Wallet/redemptions");
                setRedemptions(response.data);
                console.log(response.data)
            } catch (error) {
                setErrorMessage("Failed to load redemptions. Please try again later.");
            }
        };

        fetchRedemptions();
        fetchWallet();
        fetchRewards();

    }, [navigate]);

    const handleRedeem = async (rewardId) => {
        try {
            // Pass rewardId as a query parameter in the POST request
            const response = await api.post(`/api/Wallet/redeem?rewardId=${rewardId}`);

            setErrorMessage(""); // Clear any previous error messages
            alert("Reward redeemed successfully!");
      
            // Optionally refresh wallet data or rewards
            // fetchWallet(); 
            // fetchRewards();
        } catch (error) {
            console.error("Redeem error:", error);

            // Set appropriate error message based on server response
            setErrorMessage(
                error.response?.data || "Failed to redeem reward. Please try again later."
            );
        }
    };


    return (
        <div className="rewards-page">
            <div className="main-circle">
                <h1 className="balance">{wallet ? `Balance: ${wallet.currentBalance} Coins` : "Loading wallet..."}</h1>
            </div>

            {errorMessage && <div className="error-message">{errorMessage}</div>}

            <div className="rewards-container">
                {rewards.map((reward) => (
                    <div key={reward.rewardId} className="reward-card">
                        <div className="reward-header">
                            <h2>{reward.name}</h2>
                            <span className="reward-cost">{reward.coinsCost} <span className="coin-icon">⚪</span></span>
                        </div>
                        <p className="reward-description">{reward.description}</p>
                        <p className="reward-expiry">Expires on: {new Date(reward.expiryDate).toLocaleDateString()}</p>
                        <button className="redeem-button" onClick={() => handleRedeem(reward.rewardId)}>
                            Redeem the reward
                        </button>
                    </div>
                ))}
            </div>
            <div className="redemptions-section">
                <h2>My Redemptions</h2>
                <div className="redemptions-list">
                    {redemptions.length > 0 ? (
                        redemptions.map((redemption) => (
                            <div key={redemption.redemptionId} className="redemption-record">
                                <h3>Reward ID: {redemption.rewardId}</h3>
                                <p>Redeemed At: {new Date(redemption.redeemedAt).toLocaleDateString()}</p>
                                <p>Expiry Date: {new Date(redemption.expiryDate).toLocaleDateString()}</p>
                                <p>Status: {redemption.rewardUsable ? "Usable" : "Expired"}</p>
                            </div>
                        ))
                    ) : (
                        <p>No redemptions found.</p>
                    )}
                </div>
            </div>

            <style>{`
                .rewards-page {
                    background-color: #121212;
                    color: #fff;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 2rem;
                }

                .main-circle {
                    width: 25rem;
                    height: 25rem;
                    border-radius: 100%;
                    background: linear-gradient(40deg, #FF0080, #FF8C00 70%);
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 3rem;
                }

                .balance {
                    font-size: 1.5rem;
                    font-weight: bold;
                }

                .error-message {
                    color: red;
                    margin-bottom: 1rem;
                }

                .rewards-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 2rem;
                    justify-content: center;
                }

                .reward-card {
                    background: radial-gradient(circle, #ff0080, #7a00cc);
                    color: #fff;
                    border-radius: 16px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                    width: 280px;
                    padding: 1.5rem;
                    text-align: center;
                    transition: transform 0.3s, box-shadow 0.3s;
                }

                .reward-card:hover {
                    transform: scale(1.05);
                    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
                }

                .reward-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .reward-cost {
                    background: #fff;
                    color: #ff0080;
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                }

                .coin-icon {
                    font-size: 1.2rem;
                }

                .reward-description {
                    margin: 0.5rem 0;
                    font-size: 0.9rem;
                    opacity: 0.8;
                }

                .reward-expiry {
                    font-size: 0.8rem;
                    margin-bottom: 1rem;
                    opacity: 0.7;
                }

                .redeem-button {
                    background: #ff5500;
                    color: #fff;
                    padding: 0.7rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background 0.3s;
                }

                .redeem-button:hover {
                    background: #ff2a00;
                }

                .redemptions-section {
                    margin-top: 40px;
                }

                .redemptions-list {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .redemption-record {
                    border: 1px solid #ddd;
                    padding: 15px;
                    border-radius: 8px;
                    background-color: #2c2c2c;
                    color: #fff;
                }

                .redemption-record h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: bold;
                }

                .redemption-record p {
                    margin: 5px 0;
                }

                .error-message {
                    color: red;
                    text-align: center;
                    margin: 10px 0;
                }
            `}</style>
        </div>
    );
};

export default Rewards;
