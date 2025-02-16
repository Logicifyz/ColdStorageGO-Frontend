import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navigation";
import Footer from "./Footer";
import SessionProtectedRoute from "./SessionHandler"; // Import your session handler

const ProtectedLayout = () => {
    return (
        <SessionProtectedRoute isPublic={false}>
            <Navbar />
            <Outlet />
            <Footer />
        </SessionProtectedRoute>
    );
};


export default ProtectedLayout;
