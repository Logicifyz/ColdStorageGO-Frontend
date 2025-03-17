import React from "react";
import { NavLink } from "react-router-dom";
import {
    Home,
    Gift,
    Image,
    Users,
    Package,
    HelpCircle,
    FileText,
    Tag
} from "lucide-react";

const StaffSidebar = () => {
    return (
        <aside className="w-64 h-screen bg-gradient-to-b from-[#F0EAD6] to-[#E2F2E6] text-[#2D4B33] p-5 border-r border-[#355E3B] shadow-lg">
            <h1 className="text-2xl font-bold mb-6">Staff Dashboard</h1>
            <nav className="flex flex-col space-y-3">
                <NavItem to="/staff" icon={<Home size={20} />} label="Home" />
                <NavItem
                    to="/staff/subscription-management"
                    icon={<Tag size={20} />}
                    label="Subscription Management"
                />
                <NavItem
                    to="/staff/rewards"
                    icon={<Gift size={20} />}
                    label="Rewards Management"
                />
                <NavItem
                    to="/staff/gallery"
                    icon={<Image size={20} />}
                    label="Gallery Management"
                />
                <NavItem
                    to="/staff/account-management"
                    icon={<Users size={20} />}
                    label="Account Management"
                />
                <NavItem
                    to="/staff/orders"
                    icon={<Package size={20} />}
                    label="Orders Management"
                />
                <NavItem
                    to="/staff/support"
                    icon={<HelpCircle size={20} />}
                    label="Support Management"
                />
                <NavItem
                    to="/staff/help-centre"
                    icon={<FileText size={20} />}
                    label="Help Centre Management"
                />
            </nav>
        </aside>
    );
};

const NavItem = ({ to, icon, label }) => (
    <NavLink
        to={to}
        end={to === "/staff"}  // Only apply exact matching for Home
        className={({ isActive }) =>
            `flex items-center space-x-3 p-3 rounded-lg transition ${isActive
                ? "bg-[#355E3B] text-white"
                : "text-[#2D4B33] hover:bg-[#E2F2E6] hover:text-[#2D4B33]"
            }`
        }
    >
        {icon}
        <span className="text-sm font-medium">{label}</span>
    </NavLink>
);

export default StaffSidebar;
