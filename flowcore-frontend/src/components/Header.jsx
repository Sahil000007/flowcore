import {
  Bell,
  LogOut,
  Search,
  UserCircle2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <nav className="flex items-center justify-between px-6 py-4">

        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            FC
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-800">
              FlowCore
            </h1>
            <p className="text-sm text-gray-500">
              Contractor Management System
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-10">
          <div className="relative w-full">
            <Search
              size={18}
              className="absolute left-4 top-3 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search workers, sites..."
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section */}
        {user && (
          <div className="flex items-center gap-4">

            {/* Notification */}
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition">
              <Bell size={22} className="text-gray-600" />

              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">

              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white">
                <UserCircle2 size={24} />
              </div>

              <div className="hidden sm:block">
                <p className="font-semibold text-gray-800">
                  {user.username}
                </p>

                <p className="text-xs text-gray-500">
                  {user.role}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-md hover:shadow-lg transition-all duration-300"
            >
              <LogOut size={18} />
              <span className="hidden sm:block">
                Logout
              </span>
            </button>

          </div>
        )}
      </nav>
    </header>
  );
};