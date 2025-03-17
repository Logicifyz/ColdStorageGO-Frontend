import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./AccountFlowComponents/Sidebar"; // Adjust the Sidebar import to the correct path

const AccountDashboardLayout = () => {
    return (
        <div className="min-h-screen font-inter bg-gray-100 flex flex-col">
            <header className="w-full">
                <Sidebar className="sticky top-0 left-0 h-full z-10" />
            </header>
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
};

export default AccountDashboardLayout;
