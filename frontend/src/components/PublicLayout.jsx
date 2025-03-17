// PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navigation";
import Footer from "./Footer";
import SessionProtectedRoute from "./SessionHandler"; // Import your session handler

const PublicLayout = () => {
    return (
        <>
            <SessionProtectedRoute isPublic={true}>
            <Navbar />
            <Outlet />
            <Footer />
            </SessionProtectedRoute>

        </>
    );
};

export default PublicLayout;
