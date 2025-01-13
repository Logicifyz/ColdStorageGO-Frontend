import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import GalleryManagement from "./pages/staff/GalleryManagement";
import SubscriptionForm from "./pages/Subscriptions";
import SubscriptionChoicePage from "./pages/SubscriptionChoicePage";
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage";
import SubscriptionManagement from "./pages/SubscriptionManagement"

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


const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
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
                <Route path="/" element={<GalleryManagement/> } />
                <Route path="/subscriptions" element={<SubscriptionForm />} />
                <Route path="/subscription-choices" element={<SubscriptionChoicePage />} />
                <Route path="/subscription-success" element={<SubscriptionSuccessPage />} />
                <Route path="/subscription-management" element={<SubscriptionManagement />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
