import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { EmailProvider } from "./context/EmailContext";

// Layouts
import PublicLayout from "./components/PublicLayout";
import StaffLayout from "./components/StaffLayout";
import Navbar from "./components/Navigation";
import Footer from "./components/Footer";

// Public Pages
import Gallery from "./pages/Gallery";
import SubscriptionForm from "./pages/Subscriptions";
import SubscriptionChoicePage from "./pages/SubscriptionChoicePage";
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import AccountDashboard from "./pages/AccountFlow/AccountDashboard";
import Listing from "./pages/Listing";
import Cart from "./pages/Cart";
import Rewards from "./pages/Reward";
import Redemption from "./pages/Redemptions";
import Profile from "./pages/Profile";
import HelpCentre from "./pages/HelpCentreFlow/HelpCentre";
import ContactUs from "./pages/HelpCentreFlow/ContactUs";

// Authentication Pages
import Register from "./pages/AuthFlow/Register";
import Login from "./pages/AuthFlow/Login";
import SendPasswordResetEmail from "./pages/AuthFlow/SendPasswordResetEmail";
import ResetPassword from "./pages/AuthFlow/ResetPassword";
import SuccessfullySentVerificationEmail from "./pages/AuthFlow/SuccessfullySentVerificationEmail";
import VerifyAccount from "./pages/AuthFlow/VerifyAccount";
import SuccessfullyVerifiedAccount from "./pages/AuthFlow/SuccessfullyVerifiedAccount";
import SuccessfullySentPasswordResetEmail from "./pages/AuthFlow/SuccessfullySentPasswordResetEmail";
import SuccessfullyResetPassword from "./pages/AuthFlow/SuccecssfullyResetPassword";
import SetPassword from "./pages/AuthFlow/SetPassword";

// Staff Pages
import StaffLogin from "./pages/StaffFlow/StaffLogin";
import RewardManagementStaff from "./pages/staff/RewardManagement";
import GalleryManagement from "./pages/staff/GalleryManagement";

const App = () => {
    return (
        <GoogleOAuthProvider clientId="869557804479-pv18rpo94fbpd6hatmns6m4nes5adih8.apps.googleusercontent.com" redirectUri="http://localhost:3000/login">
            <Router>
                <Navbar />
                <Routes>
                    {/* Public Routes using PublicLayout */}
                    <Route element={<PublicLayout />}>
                        <Route path="/account-dashboard" element={<AccountDashboard />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/rewards" element={<Rewards />} />
                        <Route path="/redemptions" element={<Redemption />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/listing/:id" element={<Listing />} />
                        <Route path="/profile/:username" element={<Profile />} />
                        <Route path="/subscriptions" element={<SubscriptionForm />} />
                        <Route path="/subscription-choices" element={<SubscriptionChoicePage />} />
                        <Route path="/subscription-success" element={<SubscriptionSuccessPage />} />
                        <Route path="/subscription-management" element={<SubscriptionManagement />} />
                        <Route path="/help-centre" element={<HelpCentre />} />
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/register" element={<EmailProvider><Register /></EmailProvider>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/sendpasswordresetemail" element={<EmailProvider><SendPasswordResetEmail /></EmailProvider>} />
                        <Route path="/resetpassword/:token" element={<ResetPassword />} />
                        <Route path="/setpassword/:token" element={<SetPassword />} />
                        <Route path="/sentverificationemailsuccess" element={<EmailProvider><SuccessfullySentVerificationEmail /></EmailProvider>} />
                        <Route path="/verify-account/:token" element={<VerifyAccount />} />
                        <Route path="/successfullyverifiedaccount" element={<SuccessfullyVerifiedAccount />} />
                        <Route path="/successfullyresetpassword" element={<SuccessfullyResetPassword />} />
                        <Route path="/sentpasswordresetemailsuccess" element={<EmailProvider><SuccessfullySentPasswordResetEmail /></EmailProvider>} />
                    </Route>

                    {/* Staff Routes using StaffLayout */}
                    <Route path="/staff" element={<StaffLayout />}>
                        <Route index element={<RewardManagementStaff />} />
                        <Route path="rewards" element={<RewardManagementStaff />} />
                        <Route path="gallery" element={<GalleryManagement />} />
                    </Route>

                    {/* Standalone Staff Login */}
                    <Route path="/stafflogin" element={<StaffLogin />} />
                </Routes>
                <Footer />
            </Router>
        </GoogleOAuthProvider>
    );
};

export default App;