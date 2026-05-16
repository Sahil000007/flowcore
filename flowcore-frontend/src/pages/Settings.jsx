import { Lock, LogOut, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    role: user?.role || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');

  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setMessage('Profile updated successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match!');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long!');
      return;
    }

    setMessage('Password changed successfully!');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Settings</h2>

            {message && (
              <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                {message}
              </div>
            )}

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-4 px-2 font-medium border-b-2 transition ${
                  activeTab === 'profile'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <User size={20} />
                  <span>Profile</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`pb-4 px-2 font-medium border-b-2 transition ${
                  activeTab === 'security'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Lock size={20} />
                  <span>Security</span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab('system')}
                className={`pb-4 px-2 font-medium border-b-2 transition ${
                  activeTab === 'system'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Mail size={20} />
                  <span>System</span>
                </div>
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Profile Information</h3>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                      </label>
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => handleProfileChange('username', e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <input
                        type="text"
                        value={profileData.role}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        disabled
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) => handleProfileChange('firstName', e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) => handleProfileChange('lastName', e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileChange('email', e.target.value)}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder="user@example.com"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-6 border-t">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
                    >
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('profile')}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h3>

                <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
              <div className="space-y-6">
                {/* Notifications Settings */}
                <div className="bg-white rounded-lg shadow p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Notification Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emailNotif"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                        defaultChecked
                      />
                      <label htmlFor="emailNotif" className="ml-3 text-gray-700">
                        Email notifications for payroll updates
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="attendanceNotif"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                        defaultChecked
                      />
                      <label htmlFor="attendanceNotif" className="ml-3 text-gray-700">
                        Attendance notifications
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="siteNotif"
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                        defaultChecked
                      />
                      <label htmlFor="siteNotif" className="ml-3 text-gray-700">
                        Site status updates
                      </label>
                    </div>

                    <div className="pt-4 border-t">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </div>

                {/* Session & Logout */}
                <div className="bg-white rounded-lg shadow p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Session & Logout</h3>
                  
                  <p className="text-gray-600 mb-4">
                    Click the button below to logout from your account.
                  </p>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>

                {/* Application Info */}
                <div className="bg-white rounded-lg shadow p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Application Information</h3>
                  
                  <div className="space-y-3 text-gray-700">
                    <p><span className="font-medium">Application Name:</span> FlowCore</p>
                    <p><span className="font-medium">Version:</span> 1.0.0</p>
                    <p><span className="font-medium">Application Type:</span> Contractor Management System</p>
                    <p><span className="font-medium">Last Updated:</span> May 2026</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

