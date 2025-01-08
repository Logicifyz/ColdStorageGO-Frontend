import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import Navbar from "./components/Navigation"
import Footer from "./components/Footer"
import './App.css';
import Register from './pages/AuthFlow/Register'; // Assuming the path to Register component
import Login from './pages/AuthFlow/Login'; // Assuming a Login component
import SendPasswordResetEmail from './pages/AuthFlow/SendPasswordResetEmail';
import ResetPassword from './pages/AuthFlow/ResetPassword'; // Assuming a Login component
import SuccessfullySentVerificationEmail from './pages/AuthFlow/SuccessfullySentVerificationEmail'; // Assuming a Login component
import { EmailProvider } from './context/EmailContext';



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
                <Route path="/sendpasswordresetemail" element={<SendPasswordResetEmail />} />
                <Route path="/resetpassword/:token" element={<ResetPassword />} />
                <Route
                    path="/SentVerificationEmailSuccess"
                    element={
                        <EmailProvider>
                            <SuccessfullySentVerificationEmail />
                        </EmailProvider>
                    }
                />

            </Routes>
            <Footer />
        </Router>
    );
};

export default App;
