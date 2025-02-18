import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Gift, Image, Users, Package, HelpCircle, FileText, Tag, LogOut, MessageSquare,MapPinHouse, Bookmark } from "lucide-react"; // Importing icons
import api from '../../../api';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // Make the logout request to the backend
            await api.post('/api/Auth/logout');

            // Clear session data (e.g., remove token from localStorage)
            console.log("Logging out...");
    
            // Redirect to the login page after successful logout
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
            // Handle error (e.g., show an error message)
        }
    };
    return (
        <aside className="w-64 p-5 bg-gray-900 text-gray-200 border-r border-gray-700">
            <h1 className="text-xl font-bold text-white mb-4">Account Dashboard</h1>
            <nav className="flex flex-col space-y-2">
                <NavItem to="/account-dashboard/profile" icon={<Home size={20} />} label="Profile" />
                <NavItem to="/account-dashboard/address" icon={<MapPinHouse size={20} />} label="Address" />
                <NavItem to="/account-dashboard/my-orders" icon={<Tag size={20} />} label="My Orders" />
                <NavItem to="/account-dashboard/my-tickets" icon={<Gift size={20} />} label="My Tickets" />
                <NavItem to="/account-dashboard/my-redemptions" icon={<Image size={20} />} label="My Redemptions" />
                <NavItem to="/account-dashboard/my-forum-activity" icon={<MessageSquare size={20} />} label="My Forum Activity" />
                <NavItem to="/account-dashboard/my-saved-items" icon={<Bookmark size={20} />} label="Saved AI Recipes" />
                <NavItem to="/account-dashboard/subscription-management" icon={<Package size={20} />} label="Subscription Management" />
                <NavItem to="/account-dashboard/subscription-history" icon={<Users size={20} />} label="Subscription History" />
                <NavItem to="/account-dashboard/notifications" icon={<HelpCircle size={20} />} label="Notifications" />
                <NavItem to="/account-dashboard/change-password" icon={<FileText size={20} />} label="Change Password" />
                <NavItem to="/account-dashboard/delete-account" icon={<Gift size={20} />} label="Delete Account" />
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 p-2 mt-4 rounded-lg text-gray-400 hover:bg-gray-800"
                >
                    <LogOut size={20} />
                    <span className="text-sm font-medium">Logout</span>
                </button>
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
