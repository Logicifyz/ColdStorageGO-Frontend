import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./AccountFlowComponents/Sidebar"; // Adjust the Sidebar import to the correct path

const AccountDashboardLayout = () => {
    return (
        <div className="min-h-screen font-inter bg-gray-100 flex flex-col">
            <header className="w-full">
                <Sidebar /> {/* This will now be at the top */}
            </header>
            <main className="flex-1 p-8 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AccountDashboardLayout;
