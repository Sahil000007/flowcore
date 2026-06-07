import {
  Briefcase,
  Calendar,
  ChevronRight,
  DollarSign,
  Settings,
  Users,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: Briefcase, path: "/dashboard" },
    { label: "Workers", icon: Users, path: "/workers" },
    { label: "Sites", icon: Calendar, path: "/sites" },
    { label: "Attendance", icon: Calendar, path: "/attendance" },
    { label: "Salary", icon: DollarSign, path: "/salary" },
    { label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col shadow-2xl border-r border-slate-700">

      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-xl shadow-lg">
            FC
          </div>

          <div>
            <h1 className="text-xl font-bold">FlowCore</h1>
            <p className="text-xs text-gray-400">
              Contractor Management
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300
              
              ${
                active
                  ? "bg-blue-600 shadow-lg shadow-blue-500/30"
                  : "hover:bg-slate-700 hover:translate-x-2"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  size={20}
                  className={`transition-transform duration-300 ${
                    active
                      ? "scale-110"
                      : "group-hover:scale-110"
                  }`}
                />

                <span className="font-medium">
                  {item.label}
                </span>
              </div>

              <ChevronRight
                size={18}
                className={`transition-all duration-300 ${
                  active
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center font-bold">
            A
          </div>

          <div>
            <h3 className="font-semibold">Admin</h3>
            <p className="text-xs text-gray-400">
              System Administrator
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};