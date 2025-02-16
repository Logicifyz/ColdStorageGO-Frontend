// StaffLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSideBar";

const StaffLayout = () => {
    return (

        <div className="flex min-h-screen font-inter bg-gray-100">
            <StaffSidebar />
            <main className="flex-1 p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default StaffLayout;
