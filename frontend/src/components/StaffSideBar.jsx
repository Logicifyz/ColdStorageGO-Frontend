import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Gift, Image, Users, Package, HelpCircle, FileText, Tag } from "lucide-react"; // Importing HelpCircle for Support Management icon

const StaffSidebar = () => {
    return (
        <aside className="w-64 p-5 bg-gray-900 text-gray-200 border-r border-gray-700">
            <h1 className="text-xl font-bold text-white mb-4">Staff Dashboard</h1>
            <nav className="flex flex-col space-y-2">
                <NavItem to="/staff" icon={<Home size={20} />} label="Home" />
                <NavItem to="/staff/subscription-management" icon={<Tag size={20} />} label="Subscription Management" />
                <NavItem to="/staff/rewards" icon={<Gift size={20} />} label="Rewards Management" />
                <NavItem to="/staff/gallery" icon={<Image size={20} />} label="Gallery Management" />
                <NavItem to="/staff/account-management" icon={<Users size={20} />} label="Account Management" />
                <NavItem to="/staff/orders" icon={<Package size={20} />} label="Orders Management" />
                <NavItem to="/staff/support" icon={<HelpCircle size={20} />} label="Support Management" /> {/* New NavItem for Support Management */}
                <NavItem to="/staff/help-centre" icon={<FileText size={20} />} label="Help Centre Management" /> {/* Help Centre Management */}
         
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

export default StaffSidebar;
