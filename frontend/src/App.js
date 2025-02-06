import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import Navbar from "./components/Navigation";
import Footer from "./components/Footer";
import './App.css';
import Register from './pages/AuthFlow/Register';
import Login from './pages/AuthFlow/Login';
import SendPasswordResetEmail from './pages/AuthFlow/SendPasswordResetEmail';
import ResetPassword from './pages/AuthFlow/ResetPassword';
import SuccessfullySentVerificationEmail from './pages/AuthFlow/SuccessfullySentVerificationEmail';
import VerifyAccount from './pages/AuthFlow/VerifyAccount';
import { EmailProvider } from './context/EmailContext';
import SuccessfullyVerifiedAccount from "./pages/AuthFlow/SuccessfullyVerifiedAccount";
import SuccessfullySentPasswordResetEmail from "./pages/AuthFlow/SuccessfullySentPasswordResetEmail";
import SuccessfullyResetPassword from "./pages/AuthFlow/SuccecssfullyResetPassword";
import AccountDashboard from "./pages/AccountFlow/AccountDashboard";
import Profile from "./pages/Profile";
import { GoogleOAuthProvider } from '@react-oauth/google';
import SetPassword from "./pages/AuthFlow/SetPassword";
import HelpCentre from "./pages/HelpCentreFlow/HelpCentre";
import ContactUs from "./pages/HelpCentreFlow/ContactUs";

const App = () => {
    return (
        <GoogleOAuthProvider
            clientId="869557804479-pv18rpo94fbpd6hatmns6m4nes5adih8.apps.googleusercontent.com"
            redirectUri="http://localhost:3000/login"
        >
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/help-centre" element={<HelpCentre />} />
                    <Route path="/contact-us" element={<ContactUs />} />

                    <Route path="/account-dashboard" element={<AccountDashboard />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route
                        path="/register"
                        element={
                            <EmailProvider>
                                <Register />
                            </EmailProvider>
                        }
                    />
                    <Route path="/login" element={<Login />} />
                    <Route
                        path="/sendpasswordresetemail"
                        element={
                            <EmailProvider>
                                <SendPasswordResetEmail />
                            </EmailProvider>
                        }
                    />
                    <Route path="/resetpassword/:token" element={<ResetPassword />} />
                    <Route path="/setpassword/:token" element={<SetPassword />} />

                    <Route
                        path="/sentverificationemailsuccess"
                        element={
                            <EmailProvider>
                                <SuccessfullySentVerificationEmail />
                            </EmailProvider>
                        }
                    />
                    <Route path="/profile/:username" element={<Profile />} />
                    <Route path="/verify-account/:token" element={<VerifyAccount />} />
                    <Route path="/successfullyverifiedaccount" element={<SuccessfullyVerifiedAccount />} />
                    <Route path="/successfullyresetpassword" element={<SuccessfullyResetPassword />} />
                    <Route
                        path="/sentpasswordresetemailsuccess"
                        element={
                            <EmailProvider>
                                <SuccessfullySentPasswordResetEmail />
                            </EmailProvider>
                        }
                    />
                </Routes>
                <Footer />
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;
