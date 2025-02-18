import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import api from "../api";

// Session timing constants
const SESSION_CHECK_INTERVAL = 1000; // Check every second
const SESSION_EXPIRATION_WARNING = 1800000 - 300000; // 5 minutes before expiry (25 minutes)
const SESSION_EXPIRATION = 1800000; // Expire after 30 minutes (30 minutes = 1800000 ms)
const DEBOUNCE_DELAY = 500; // 500ms debounce delay


// Set the app element for react-modal (for accessibility)
Modal.setAppElement("#root");

const SessionProtectedRoute = ({ children, isPublic = false }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [showExpiryWarningModal, setShowExpiryWarningModal] = useState(false); // For "Session Expiring Soon"
    const [showSessionExpiredModal, setShowSessionExpiredModal] = useState(false); // For "Session Expired"
    const [timeLeft, setTimeLeft] = useState(SESSION_EXPIRATION); // Time left in milliseconds
    const expiryTimeRef = useRef(Date.now() + SESSION_EXPIRATION); // Track expiry time
    const [sessionExpired, setSessionExpired] = useState(false); // Track if session is expired

    // Function to check the session validity
    const checkSession = useCallback(async () => {
        if (sessionExpired || (isPublic && !isLoggedIn)) return; // Skip session check if expired or public page

        try {
            const response = await api.get("api/Auth/check-session");
            const { sessionValid, reason } = response.data;

            if (sessionValid) {
                console.log("Session valid.");
                expiryTimeRef.current = Date.now() + SESSION_EXPIRATION; // Reset expiry time
                setShowExpiryWarningModal(false); // Hide warning modal
                setTimeLeft(SESSION_EXPIRATION); // Reset countdown
                setIsLoggedIn(true);
            } else {
                console.log(reason)
                setIsLoggedIn(false);
                console.log("Is logged in:", isLoggedIn)
                switch (reason) {
                    case "NoSession":
                        if (!isPublic) {
                            console.log("No active session. Redirecting to PleaseLogin.");
                            setIsLoggedIn(false);
                            navigate("/please-login");
                        }
                        break;
                    case "SessionNotFound":
                        if (!isPublic) {
                            console.log("No active session. Redirecting to PleaseLogin.");
                            setIsLoggedIn(false);
                            navigate("/please-login");
                        }
                        break;
                    case "SessionInactive":
                        if (!isPublic) {
                            console.log("No active session. Redirecting to PleaseLogin.");
                            setIsLoggedIn(false);
                            navigate("/please-login");
                        }
                        break;
                    case "SessionExpired":
                        console.log("Session expired. Showing re-login modal.");
                        setShowSessionExpiredModal(true);
                        setSessionExpired(true); // Mark session as expired
                        break;
                    default:
                        console.log("Unknown session state. Redirecting to login.");
                        setIsLoggedIn(false);
                        navigate("/login");
                        break;
                }
            }
        } catch (error) {
            console.error("Error checking session:", error);
            setIsLoggedIn(false);
            navigate("/login");
        }
    }, [navigate, sessionExpired, isPublic]);

    // Timer to check session status at regular intervals
    useEffect(() => {
        checkSession(); // Ensure session is checked as soon as the page loads
    }, [checkSession]);

    useEffect(() => {
        console.log(isLoggedIn)
        console.log(isPublic)
        if (sessionExpired || (isPublic && !isLoggedIn)) return;

        const interval = setInterval(() => {
            const now = Date.now();
            const timeLeft = expiryTimeRef.current - now;

            console.log("Time left:", timeLeft / 1000, "seconds");

            if (timeLeft <= 0) {
                // Session expired
                console.log("Session expired. Showing expired modal.");
                setShowSessionExpiredModal(true);
                setShowExpiryWarningModal(false); // Hide warning modal
                setIsLoggedIn(false);
                setSessionExpired(true); // Mark session as expired
            } else if (timeLeft <= SESSION_EXPIRATION_WARNING) {
                // Show session expiry warning
                console.log("Session will expire soon.");
                const minutes = Math.floor(timeLeft / 60000);
                const seconds = Math.floor((timeLeft % 60000) / 1000);

                const formattedTime = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`; // Format as MM:SS

                setShowExpiryWarningModal(true);
                setTimeLeft(formattedTime); // Update countdown
            } else {
                setShowExpiryWarningModal(false); // Hide warning modal
            }
        }, SESSION_CHECK_INTERVAL);

        return () => clearInterval(interval);
    }, [sessionExpired, isPublic, isLoggedIn]);

    // Debounce update function to limit excessive requests
    const debounceUpdateInteraction = useCallback(() => {
        console.log("User activity detected. Refreshing session...");
        expiryTimeRef.current = Date.now() + SESSION_EXPIRATION; // Reset expiry time
        setTimeLeft(SESSION_EXPIRATION); // Reset countdown
        checkSession(); // Check session validity
    }, [checkSession]);

    const debounceTimer = useRef(null);

    const updateLastInteraction = () => {
        clearTimeout(debounceTimer.current);
        debounceTimer.current = setTimeout(() => {
            debounceUpdateInteraction();
        }, DEBOUNCE_DELAY);
    };

    // Add event listeners for user interactions
    useEffect(() => {
        if (isPublic && !isLoggedIn) return; // Skip interaction tracking for public pages

        window.addEventListener("click", updateLastInteraction);
        window.addEventListener("mousemove", updateLastInteraction);

        return () => {
            window.removeEventListener("click", updateLastInteraction);
            window.removeEventListener("mousemove", updateLastInteraction);
        };
    }, [updateLastInteraction, isPublic, isLoggedIn]);

    // Handle session expired modal close
    const handleSessionExpiredModalClose = () => {
        console.log("Session expired. Redirecting to login...");
        setShowSessionExpiredModal(false);
        navigate("/login"); // Redirect to login
    };

    // Handle session expiry warning modal close
    const handleExpiryWarningModalClose = () => {
        console.log("Session expiry warning dismissed.");
        setShowExpiryWarningModal(false);
        debounceUpdateInteraction(); // Refresh session
    };

    return (
        <>
            {isLoggedIn || isPublic ? children : null}

            {/* Modal for Session Expiry Warning */}
            <Modal
                isOpen={showExpiryWarningModal}
                onRequestClose={handleExpiryWarningModalClose}
                contentLabel="Session Expiration Warning"
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        zIndex: 9999, // Ensure the overlay is on top of other content
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        padding: "20px",
                        borderRadius: "8px",
                        textAlign: "center",
                        zIndex: 10000, // Ensure the modal content is above the overlay
                    },
                }}
            >
                <h2 className="text-xl font-bold mb-4">Session Expiring Soon</h2>
                <p className="text-gray-600 mb-4">
                    Your session will expire in {Math.floor(timeLeft / 1000)} seconds.
                </p>
                <p className="text-gray-600 mb-4">
                    Click or move your mouse to continue.
                </p>
                <button
                    onClick={handleExpiryWarningModalClose}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Continue
                </button>
            </Modal>

            {/* Modal for Session Expired */}
            <Modal
                isOpen={showSessionExpiredModal}
                onRequestClose={handleSessionExpiredModalClose}
                contentLabel="Session Expired"
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.75)",
                        zIndex: 9999, // Ensure the overlay is on top of other content
                    },
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        padding: "20px",
                        borderRadius: "8px",
                        textAlign: "center",
                        zIndex: 10000, // Ensure the modal content is above the overlay
                    },
                }}
            >
                <h2 className="text-xl font-bold mb-4">Session Expired</h2>
                <p className="text-gray-600 mb-4">
                    Your session has expired. Please log in again.
                </p>
                <button
                    onClick={handleSessionExpiredModalClose}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                    Log In Again
                </button>
            </Modal>
        </>
    );
};

export default SessionProtectedRoute;
