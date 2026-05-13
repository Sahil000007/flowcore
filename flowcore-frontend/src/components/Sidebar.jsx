import { Briefcase, Calendar, DollarSign, Settings, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Sidebar = () => {
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', icon: <Briefcase size={20} />, path: '/dashboard' },
    { label: 'Workers', icon: <Users size={20} />, path: '/workers' },
    { label: 'Sites', icon: <Calendar size={20} />, path: '/sites' },
    { label: 'Attendance', icon: <Calendar size={20} />, path: '/attendance' },
    { label: 'Salary', icon: <DollarSign size={20} />, path: '/salary' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen shadow-lg">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded hover:bg-gray-700 transition text-left"
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
