import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./AccountFlowComponents/Sidebar"; // Adjust the Sidebar import to the correct path

const AccountDashboardLayout = () => {
    return (
        <div className="flex min-h-screen font-inter bg-gray-100">
            <Sidebar /> {/* This can be your sidebar component, adjust if needed */}
            <main className="flex-1 p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AccountDashboardLayout;
