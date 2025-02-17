import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Gift, Image, Users, Package, HelpCircle, FileText, Tag } from "lucide-react"; // Importing icons

const Sidebar = () => {
    return (
        <aside className="w-64 p-5 bg-gray-900 text-gray-200 border-r border-gray-700">
            <h1 className="text-xl font-bold text-white mb-4">Account Dashboard</h1>
            <nav className="flex flex-col space-y-2">
                <NavItem to="/account-dashboard/profile" icon={<Home size={20} />} label="Profile" />
                <NavItem to="/account-dashboard/my-orders" icon={<Tag size={20} />} label="My Orders" />
                <NavItem to="/account-dashboard/my-tickets" icon={<Gift size={20} />} label="My Tickets" />
                <NavItem to="/account-dashboard/my-redemptions" icon={<Image size={20} />} label="My Redemptions" />
                <NavItem to="/account-dashboard/subscription-management" icon={<Package size={20} />} label="Subscription Management" />
                <NavItem to="/account-dashboard/subscription-history" icon={<Users size={20} />} label="Subscription History" />
                <NavItem to="/account-dashboard/notifications" icon={<HelpCircle size={20} />} label="Notifications" />
                <NavItem to="/account-dashboard/change-password" icon={<FileText size={20} />} label="Change Password" />
                <NavItem to="/account-dashboard/delete-account" icon={<Gift size={20} />} label="Delete Account" />
            </nav>
        </aside>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-gray-800 ${isActive ? "bg-gray-800 text-white" : "text-gray-400"
            }`
        }
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </NavLink>
);

export default Sidebar;
