import React from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white/80 backdrop-blur-md border-r border-indigo-100 shadow-md flex flex-col p-6">
        <h1 className="text-2xl font-bold text-indigo-600 mb-8">TalentFlow</h1>
        <nav className="flex flex-col gap-3 text-gray-600">
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg hover:bg-indigo-100 ${
                isActive ? "bg-indigo-200 text-indigo-700 font-semibold" : ""
              }`
            }
          >
            💼 Jobs
          </NavLink>
          <NavLink
            to="/candidates"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg hover:bg-indigo-100 ${
                isActive ? "bg-indigo-200 text-indigo-700 font-semibold" : ""
              }`
            }
          >
            👥 Candidates
          </NavLink>
          <NavLink
            to="/assessments"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg hover:bg-indigo-100 ${
                isActive ? "bg-indigo-200 text-indigo-700 font-semibold" : ""
              }`
            }
          >
            🧾 Assessments
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-between px-8">
         
          <div className="flex items-center gap-3">
            <img
              src="https://ui-avatars.com/api/?name=HR&background=6366f1&color=fff"
              alt="HR"
              className="w-10 h-10 rounded-full"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
