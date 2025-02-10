// PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navigation";
import Footer from "./Footer";

const PublicLayout = () => {
    return (
        <>
            <Navbar />
            <Outlet />
            <Footer />
        </>
    );
};

export default PublicLayout;
