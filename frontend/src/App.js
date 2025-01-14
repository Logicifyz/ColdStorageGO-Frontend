import React, { Profiler } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import Navbar from "./components/Navigation"
import Footer from "./components/Footer"
import './App.css';
import Register from './pages/AuthFlow/Register'; // Assuming the path to Register component
import Login from './pages/AuthFlow/Login'; // Assuming a Login component
import SendPasswordResetEmail from './pages/AuthFlow/SendPasswordResetEmail';
import ResetPassword from './pages/AuthFlow/ResetPassword'; // Assuming a Login component
import SuccessfullySentVerificationEmail from './pages/AuthFlow/SuccessfullySentVerificationEmail';
import VerifyAccount from './pages/AuthFlow/VerifyAccount';
import { EmailProvider } from './context/EmailContext';
import SuccessfullyVerifiedAccount from "./pages/AuthFlow/SuccessfullyVerifiedAccount";
import SuccessfullySentPasswordResetEmail from "./pages/AuthFlow/SuccessfullySentPasswordResetEmail";
import SuccessfullyResetPassword from "./pages/AuthFlow/SuccecssfullyResetPassword";
import AccountDashboard from "./pages/AccountFlow/AccountDashboard";
import Profile from "./pages/Profile"


const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/account-dashboard" element={<AccountDashboard/> }/>
                <Route path="/gallery" element={<Gallery />} />
                <Route
                    path="/register"
                    element={
                         <EmailProvider>
                             <Register />
                        </EmailProvider>} />
                <Route path="/login" element={<Login />} />
                <Route
                    path="/sendpasswordresetemail"
                    element={
                        <EmailProvider>
                        <SendPasswordResetEmail />
                        </EmailProvider>
} />
                <Route path="/resetpassword/:token" element={<ResetPassword />} />
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
                            <SuccessfullySentPasswordResetEmail/>
                        </EmailProvider>
                    }
                    />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
