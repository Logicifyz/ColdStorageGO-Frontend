import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { EmailProvider } from "./context/EmailContext";

// Layouts
import PublicLayout from "./components/PublicLayout";
import ProtectedLayout from "./components/ProtectedLayout";
import StaffLayout from "./components/StaffLayout";

// Public Pages
import Gallery from "./pages/Gallery";
import SubscriptionForm from "./pages/Subscriptions";
import SubscriptionChoicePage from "./pages/SubscriptionChoicePage";
import SubscriptionSuccessPage from "./pages/SubscriptionSuccessPage";
import SubscriptionManagement from "./pages/AccountFlow/AccountFlowComponents/SubscriptionManagement";
import Listing from "./pages/Listing";
import Cart from "./pages/Cart";
import OrderSuccess from "./pages/OrderSuccess";
import Rewards from "./pages/Reward";
import Redemption from "./pages/Redemptions";
import Profile from "./pages/Profile";
import HelpCentre from "./pages/HelpCentreFlow/HelpCentre";
import ContactUs from "./pages/HelpCentreFlow/ContactUs";
import OrderCheckout from "./pages/OrderCheckout";
import Forum from "./pages/Forum";
import CreateRecipe from "./pages/CreateRecipe";
import DisplayForumRecipe from "./pages/DisplayForumRecipe";
import CreateDiscussion from "./pages/CreateDiscussion";
import DisplayForumDiscussion from "./pages/DisplayForumDiscussion";
import CheffieAI from "./pages/CheffieAI";
import DisplayFullAIRecipe from "./pages/DisplayFullAIRecipe";
import EditDiscussion from "./pages/EditDiscussion";
import EditRecipe from "./pages/EditRecipe";
import Home from "./pages/Home";
import NotFound from "./pages/Error";
import PleaseLogin from "./pages/PleaseLogin"

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
import SuccessfullySentSetPasswordEmail from "./pages/AuthFlow/SuccessfullySentSetPasswordEmail";
import SuccessfullySetPassword from "./pages/AuthFlow/SuccessfullySetPassword";

// Staff Pages
import StaffLogin from "./pages/StaffFlow/StaffLogin";
import RewardManagement from "./pages/StaffFlow/StaffFlowComponents/RewardManagement";
import GalleryManagement from "./pages/StaffFlow/StaffFlowComponents/GalleryManagement";
import OrdersManagement from "./pages/StaffFlow/StaffFlowComponents/OrdersManagement";
import TicketManagement from "./pages/StaffFlow/StaffFlowComponents/TicketManagement";
import SupportManagement from "./pages/StaffFlow/StaffFlowComponents/SupportManagement";
import HelpCentreManagement from "./pages/StaffFlow/StaffFlowComponents/HelpCentreManagement";
import AddArticle from "./pages/StaffFlow/StaffFlowComponents/AddArticle";
import EditArticle from "./pages/StaffFlow/StaffFlowComponents/EditArticle";
import CategoryPage from "./pages/HelpCentreFlow/CategoryPage";
import TicketDetails from "./pages/AccountFlow/AccountFlowComponents/TicketDetails";
import AnalyticsDashboard from "./pages/StaffFlow/StaffFlowComponents/AnalyticsDashboard";
import StaffSubscriptionManagement from "./pages/StaffFlow/StaffFlowComponents/StaffSubscriptionManagement";
import AccountManagement from "./pages/StaffFlow/StaffFlowComponents/AccountManagement";
import AccountDetails from "./pages/StaffFlow/StaffFlowComponents/AccountDetails";

import ChangePassword from "./pages/AccountFlow/AccountFlowComponents/ChangePassword";
import DeleteAccount from "./pages/AccountFlow/AccountFlowComponents/DeleteAccount";
import MyOrders from "./pages/AccountFlow/AccountFlowComponents/MyOrders";
import MyTickets from "./pages/AccountFlow/AccountFlowComponents/MyTickets";
import MyRedemptions from "./pages/AccountFlow/AccountFlowComponents/MyRedemptions";
import SubscriptionHistory from "./pages/AccountFlow/AccountFlowComponents/SubscriptionHistory";
import Notifications from "./pages/AccountFlow/AccountFlowComponents/Notifications";
import AccountDashboardLayout from "./pages/AccountFlow/AccountDashboardLayout";
import MyProfile from "./pages/AccountFlow/AccountFlowComponents/MyProfile";
import MyAddress from "./pages/AccountFlow/AccountFlowComponents/MyAddress";
import NotificationDetails from "./pages/AccountFlow/AccountFlowComponents/NotificationDetails";
import MyForumActivity from "./pages/AccountFlow/AccountFlowComponents/MyForumActivity";
import MySavedItems from "./pages/AccountFlow/AccountFlowComponents/MySavedItems";

const App = () => {
    return (
 
        < div className = "h-screen w-screen m-0 p-0 box-border bg-gray-100 overflow-auto" >
            <Router>
                <Routes>
                    {/* Protected Routes */}
                    <Route element={<ProtectedLayout />}>
                        <Route path="/contact-us" element={<ContactUs />} />
                        <Route path="/account-dashboard/:ticketId" element={<TicketDetails />} />
                        <Route path="/subscriptions" element={<SubscriptionForm />} />
                        <Route path="/subscription-choices" element={<SubscriptionChoicePage />} />
                        <Route path="/subscription-success" element={<SubscriptionSuccessPage />} />
                        <Route path="/subscription-management" element={<SubscriptionManagement />} />
                        <Route path="/rewards" element={<Rewards />} />
                        <Route path="/redemptions" element={<Redemption />} />
                        <Route path="/ordersuccess" element={<OrderSuccess />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/checkout" element={<OrderCheckout />} />
                        {/* Account Dashboard Individual Tab Routes */}
                        <Route path="/account-dashboard" element={<AccountDashboardLayout />}>
                            <Route path="profile" element={<MyProfile />} />
                            <Route path="address" element={<MyAddress />} />
                            <Route path="change-password" element={<ChangePassword />} />
                            <Route path="delete-account" element={<DeleteAccount />} />
                            <Route path="my-orders" element={<MyOrders />} />
                            <Route path="my-tickets" element={<MyTickets />} />
                            <Route path="my-redemptions" element={<MyRedemptions />} />
                            <Route path="subscription-management" element={<SubscriptionManagement />} />
                            <Route path="subscription-history" element={<SubscriptionHistory />} />
                            <Route path="notifications" element={<Notifications />} />
                            <Route path="notification-details/:notificationId" element={<NotificationDetails />} />
                            <Route path="my-forum-activity" element={<MyForumActivity />} />
                            <Route path="my-saved-items" element={<MySavedItems />} />
                        </Route>
                    </Route>

                    {/* Public Routes using PublicLayout */}
                    <Route element={<PublicLayout />}>
                        <Route path="/please-login" element={<PleaseLogin />} />
                        <Route path="/" element={<Home />} />
                        <Route path="/gallery" element={<Gallery />} />
                        <Route path="/forum" element={<Forum />} />
                        <Route path="/forum/recipe/:recipeId" element={<DisplayForumRecipe />} />
                        <Route path="/create-recipe" element={<CreateRecipe />} /> 
                        <Route path="/create-discussion" element={<CreateDiscussion />} /> 
                        <Route path="/forum/discussion/edit/:discussionId" element={<EditDiscussion />} />
                        <Route path="/forum/recipe/edit/:id" element={<EditRecipe />} />
                        <Route path="/forum/discussion/:discussionId" element={<DisplayForumDiscussion />} />
                        <Route path="/cheffie-ai" element={<CheffieAI />} />
                        <Route path="/ai-recipe/:id" element={<DisplayFullAIRecipe />} />
                        <Route path="/listing/:id" element={<Listing />} />
                        <Route path="/profile/:username" element={<Profile />} />
                        <Route path="/help-centre" element={<HelpCentre />} />
                        <Route path="/help-centre/:category/:articleId?" element={<CategoryPage />} />
                        <Route path="*" element={<NotFound />} />

                        <Route
                            path="/register"
                            element={
                                <EmailProvider>
                                    <Register />
                                </EmailProvider>
                            }
                        />

                        {/* Wrap only the Login page with GoogleOAuthProvider */}
                        <Route
                            path="/login"
                            element={
                                <GoogleOAuthProvider clientId="869557804479-pv18rpo94fbpd6hatmns6m4nes5adih8.apps.googleusercontent.com">
                                    <Login />
                                </GoogleOAuthProvider>
                            }
                        />

                        <Route
                            path="/sendpasswordresetemail"
                            element={
                                <EmailProvider>
                                    <SendPasswordResetEmail />
                                </EmailProvider>
                            }
                        />
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
                        <Route path="/resetpassword/:token" element={<ResetPassword />} />
                        <Route
                            path="/sentpasswordresetemailsuccess"
                            element={
                                <EmailProvider>
                                    <SuccessfullySentPasswordResetEmail />
                                </EmailProvider>
                            }
                        />
                        <Route path="/successfullysetpassword" element={<SuccessfullySetPassword />} />
                        <Route path="/setpassword/:token" element={<SetPassword />} />
                        <Route
                            path="/successfullysentsetpasswordemail"
                            element={
                                <EmailProvider>
                                    <SuccessfullySentSetPasswordEmail />
                                </EmailProvider>
                            }
                        />
                    </Route>

                    {/* Staff Routes using StaffLayout */}
                    <Route path="/staff" element={<StaffLayout />}>
                        <Route index element={<AnalyticsDashboard />} />
                        <Route path="rewards" element={<RewardManagement />} />
                        <Route path="orders" element={<OrdersManagement />} />
                        <Route path="gallery" element={<GalleryManagement />} />
                        <Route path="support" element={<SupportManagement />} />
                        <Route path="support/:ticketId" element={<TicketManagement />} />
                        <Route path="help-centre" element={<HelpCentreManagement />} />
                        <Route path="help-centre/add-article" element={<AddArticle />} />
                        <Route path="help-centre/edit-article/:articleId" element={<EditArticle />} />
                        <Route path="subscription-management" element={<StaffSubscriptionManagement />} />
                        <Route path="account-management" element={<AccountManagement />} />
                        <Route path="account-management/:userID" element={<AccountDetails />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    {/* Standalone Staff Login */}
                    <Route path="/staff-login" element={<StaffLogin />} />
                </Routes>
            </Router>
    </div >
  );
};

export default App;
