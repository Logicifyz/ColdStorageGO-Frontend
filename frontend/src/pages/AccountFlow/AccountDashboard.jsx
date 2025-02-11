import React, { useState } from "react";
import api from "../../api";
import ChangePassword from "./AccountFlowComponents/ChangePassword";
import DeleteAccount from "./AccountFlowComponents/DeleteAccount";
import Profile from "./AccountFlowComponents/Profile";
import MyTickets from "./AccountFlowComponents/MyTickets";
import MyOrders from "./AccountFlowComponents/MyOrders";
import { useNavigate } from "react-router-dom";

const AccountDashboard = () => {
  const [activeTab, setActiveTab] = useState("Profile");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    { name: "Profile" },
    { name: "Address" },
    { name: "Notifications" },
    { name: "My Orders" },
    { name: "My Tickets" },
    { name: "Recipes and Discussions" },
    { name: "My Subscription" },
    { name: "My Redemptions" },
    { name: "Settings" }
  ];

  const handleSettingsClick = () => {
    if (activeTab === "Settings") {
      setIsSettingsOpen(!isSettingsOpen);
    } else {
      setActiveTab("Settings");
      setIsSettingsOpen(true);
    }
  };

  const handleSettingsHover = (isHovered) => {
    if (!isSettingsOpen) {
      setHovered(isHovered);
    }
  };

  const handleTabClick = (tabName) => {
    if (tabName === "Change Password") {
      setActiveTab("Change Password");
    } else if (tabName === "Delete Account") {
      setActiveTab("Delete Account");
    } else if (tabName === "Logout") {
      api
        .post("/api/Auth/logout")
        .then(() => {
          navigate("/login");
        })
        .catch((error) => {
          console.error("Logout failed:", error);
        });
    } else {
      setActiveTab(tabName);
    }
    setIsSettingsOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#383838]">
      {/* Sidebar */}
      <div className="w-1/4 bg-[#2B2E4A] text-white p-6">
        <h2 className="text-xl font-bold mb-6">Account Dashboard</h2>
        <ul>
          {tabs.map((tab, index) => (
            <li
              key={index}
              className={`p-3 cursor-pointer rounded-lg ${
                activeTab === tab.name ? "bg-[#4D5C60]" : "hover:bg-[#4D5C60]"
              } ${tab.name === "Settings" ? "relative" : ""}`}
              onClick={() => {
                if (tab.name !== "Settings") {
                  setActiveTab(tab.name);
                } else {
                  handleSettingsClick();
                }
              }}
              onMouseEnter={() =>
                tab.name === "Settings" && handleSettingsHover(true)
              }
              onMouseLeave={() =>
                tab.name === "Settings" && handleSettingsHover(false)
              }
            >
              {tab.name}
              {tab.name === "Settings" && isSettingsOpen && (
                <ul className="absolute left-0 top-full mt-2 bg-[#3E4752] text-white rounded-lg shadow-lg w-full">
                  <li
                    className="p-3 cursor-pointer hover:bg-[#4D5C60]"
                    onClick={() => handleTabClick("Change Password")}
                  >
                    Change Password
                  </li>
                  <li
                    className="p-3 cursor-pointer hover:bg-[#4D5C60]"
                    onClick={() => handleTabClick("Delete Account")}
                  >
                    Delete Account
                  </li>
                  <li
                    className="p-3 cursor-pointer hover:bg-[#4D5C60]"
                    onClick={() => handleTabClick("Logout")}
                  >
                    Logout
                  </li>
                </ul>
              )}
              {tab.name === "Settings" && !isSettingsOpen && hovered && (
                <ul className="absolute left-0 top-full mt-2 bg-[#3E4752] text-white rounded-lg shadow-lg w-full">
                  <li
                    className="p-3 cursor-pointer hover:bg-[#4D5C60]"
                    onClick={() => handleTabClick("Change Password")}
                  >
                    Change Password
                  </li>
                  <li
                    className="p-3 cursor-pointer hover:bg-[#4D5C60]"
                    onClick={() => handleTabClick("Delete Account")}
                  >
                    Delete Account
                  </li>
                  <li
                    className="p-3 cursor-pointer hover:bg-[#4D5C60]"
                    onClick={() => handleTabClick("Logout")}
                  >
                    Logout
                  </li>
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="w-3/4 p-8">
        <div className="text-white">
          {activeTab === "Profile" ? (
            <Profile />
          ) : activeTab === "Change Password" ? (
            <ChangePassword />
          ) : activeTab === "Delete Account" ? (
            <DeleteAccount />
          ) : activeTab === "My Tickets" ? (
            <MyTickets />
          ) : activeTab === "My Orders" ? (
            <MyOrders />
          ) : (
            <p>Currently viewing the {activeTab} section.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
