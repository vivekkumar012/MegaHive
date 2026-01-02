import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import AdminSideBar from "./AdminSideBar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSideBar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Section */}
      <div
        className={`bg-gray-900 w-64 text-white fixed md:relative transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 md:translate-x-0 z-20`}
      >
        <AdminSideBar />
      </div>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="flex md:hidden p-4 bg-gray-900 text-white z-20">
          <button onClick={toggleSideBar}>
            <FaBars size={24} />
          </button>
          <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
        </div>

        {/* Overlay for Mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-10"
            onClick={toggleSideBar}
          ></div>
        )}

        {/* Routed Content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
