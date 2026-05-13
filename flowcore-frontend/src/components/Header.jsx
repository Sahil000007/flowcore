import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">FlowCore</h1>
          <span className="text-sm text-blue-100">Contractor Management</span>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <>
              <div className="text-right">
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-blue-100">{user.role}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 px-3 py-2 rounded transition"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
