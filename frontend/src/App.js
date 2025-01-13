import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Gallery from "./pages/Gallery";
import SubscriptionForm from "./pages/Subscriptions";
import SubscriptionChoicePage from "./pages/SubscriptionChoicePage";
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage";
import SubscriptionManagement from "./pages/SubscriptionManagement"

import Navbar from "./components/Navigation"
import Footer from "./components/Footer"
import './App.css';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/gallery" element={<Gallery />} />
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
