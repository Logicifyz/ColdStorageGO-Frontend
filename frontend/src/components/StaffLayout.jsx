import React from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "./StaffSideBar";

const StaffLayout = () => {
    return (
     
        < div className = "flex h-screen w-screen m-0 p-0 box-border bg-gray-100 font-inter overflow-hidden" >
      <StaffSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <Outlet />
      </main>
    </div >
  );
};

export default StaffLayout;
