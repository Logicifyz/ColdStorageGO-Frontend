import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import GalleryManagement from "./pages/staff/GalleryManagement";
import Navbar from "./components/Navigation";
import Footer from "./components/Footer";
import Forum from "./pages/Forum";
import CreateRecipe from "./pages/CreateRecipe"; 
import CreateDiscussion from "./pages/CreateDiscussion";
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

const App = () => {
    const [popupType, setPopupType] = useState(null);

    const handleCreateRecipe = () => setPopupType("createRecipe");
    const handleCreateDiscussion = () => setPopupType("createDiscussion");
    const handleClosePopup = () => setPopupType(null);

    return (
        <Router>
            <Navbar onCreateRecipe={handleCreateRecipe} onCreateDiscussion={handleCreateDiscussion} />
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
                            <SuccessfullySentPasswordResetEmail />
                        </EmailProvider>
                    }
                />
                <Route path="/forum" element={<Forum />} />
                <Route path="/create-recipe" element={<CreateRecipe />} /> {/* Route for Create Recipe */}
                <Route path="/create-discussion" element={<CreateDiscussion />} /> {/* Route for Create Discussion */}
                <Route path="/" element={<GalleryManagement />} />
            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
