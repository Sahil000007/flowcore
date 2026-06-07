import { motion } from "framer-motion";
import {
  Bell,
  Camera,
  Eye,
  EyeOff,
  LogOut,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-14 h-8 rounded-full transition ${
      enabled ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`absolute top-1 h-6 w-6 bg-white rounded-full transition-all ${
        enabled ? "left-7" : "left-1"
      }`}
    />
  </button>
);

const getStrength = (pwd) => {
  if (pwd.length < 6) return ["Weak", "25%", "bg-red-500"];
  if (pwd.length < 10) return ["Medium", "60%", "bg-yellow-500"];
  return ["Strong", "100%", "bg-green-500"];
};

export const Settings = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [message, setMessage] = useState("");

  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    role: user?.role || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [emailNotif, setEmailNotif] = useState(true);
  const [attendanceNotif, setAttendanceNotif] = useState(true);
  const [siteNotif, setSiteNotif] = useState(true);

  const inputClass =
    "w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition";

  const saveProfile = (e) => {
    e.preventDefault();
    setMessage("Profile updated successfully");
  };

  const savePassword = (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setMessage("Password changed successfully");
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "system", label: "Preferences", icon: Bell },
  ];

  const [strengthLabel, strengthWidth, strengthColor] = getStrength(
    passwordData.newPassword
  );

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
          <div className="max-w-6xl mx-auto">

            <h1 className="text-4xl font-bold mb-8">Settings</h1>

            {message && (
              <div className="mb-6 bg-green-100 text-green-700 border border-green-300 rounded-xl p-4">
                {message}
              </div>
            )}

            <div className="bg-white rounded-2xl p-2 shadow-sm border mb-8">
              <div className="flex gap-2 flex-wrap">
                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-5 py-3 rounded-xl flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "text-white"
                          : "text-gray-600"
                      }`}
                    >
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-blue-600 rounded-xl"
                        />
                      )}

                      <Icon size={18} className="relative z-10" />
                      <span className="relative z-10">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {activeTab === "profile" && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 mb-8 shadow-xl"
                >
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full bg-white/20 flex items-center justify-center">
                        <User size={40} />
                      </div>
                      <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-2 rounded-full">
                        <Camera size={16} />
                      </button>
                    </div>

                    <div>
                      <h2 className="text-3xl font-bold">
                        {profileData.firstName} {profileData.lastName}
                      </h2>
                      <p>{profileData.email}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full">
                        {profileData.role}
                      </span>
                    </div>
                  </div>
                </motion.div>

                <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl">
                  <form onSubmit={saveProfile}>
                    <div className="grid md:grid-cols-2 gap-6">
                      <input className={inputClass} value={profileData.username} disabled />
                      <input className={inputClass} value={profileData.role} disabled />

                      <input
                        className={inputClass}
                        value={profileData.firstName}
                        onChange={(e)=>setProfileData({...profileData,firstName:e.target.value})}
                        placeholder="First Name"
                      />

                      <input
                        className={inputClass}
                        value={profileData.lastName}
                        onChange={(e)=>setProfileData({...profileData,lastName:e.target.value})}
                        placeholder="Last Name"
                      />

                      <div className="md:col-span-2">
                        <input
                          className={inputClass}
                          value={profileData.email}
                          onChange={(e)=>setProfileData({...profileData,email:e.target.value})}
                          placeholder="Email"
                        />
                      </div>
                    </div>

                    <button className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl">
                      Save Changes
                    </button>
                  </form>
                </div>
              </>
            )}

            {activeTab === "security" && (
              <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl">
                <form onSubmit={savePassword} className="space-y-6 max-w-xl">

                  <div>
                    <label>Current Password</label>
                    <div className="relative">
                      <input type={showCurrent ? "text":"password"} className={inputClass}
                        value={passwordData.currentPassword}
                        onChange={(e)=>setPasswordData({...passwordData,currentPassword:e.target.value})}
                      />
                      <button type="button" className="absolute right-4 top-4" onClick={()=>setShowCurrent(!showCurrent)}>
                        {showCurrent ? <EyeOff/> : <Eye/>}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label>New Password</label>
                    <div className="relative">
                      <input type={showNew ? "text":"password"} className={inputClass}
                        value={passwordData.newPassword}
                        onChange={(e)=>setPasswordData({...passwordData,newPassword:e.target.value})}
                      />
                      <button type="button" className="absolute right-4 top-4" onClick={()=>setShowNew(!showNew)}>
                        {showNew ? <EyeOff/> : <Eye/>}
                      </button>
                    </div>

                    <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className={`h-full ${strengthColor}`} style={{width: strengthWidth}} />
                    </div>
                    <p className="text-sm mt-2">Strength: {strengthLabel}</p>
                  </div>

                  <div>
                    <label>Confirm Password</label>
                    <div className="relative">
                      <input type={showConfirm ? "text":"password"} className={inputClass}
                        value={passwordData.confirmPassword}
                        onChange={(e)=>setPasswordData({...passwordData,confirmPassword:e.target.value})}
                      />
                      <button type="button" className="absolute right-4 top-4" onClick={()=>setShowConfirm(!showConfirm)}>
                        {showConfirm ? <EyeOff/> : <Eye/>}
                      </button>
                    </div>
                  </div>

                  <button className="px-6 py-3 bg-blue-600 text-white rounded-xl">
                    Change Password
                  </button>
                </form>
              </div>
            )}

            {activeTab === "system" && (
              <div className="space-y-6">
                <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl">
                  <h3 className="font-bold text-xl mb-6">Notifications</h3>

                  <div className="space-y-6">
                    <div className="flex justify-between">
                      <span>Email Notifications</span>
                      <Toggle enabled={emailNotif} onChange={setEmailNotif} />
                    </div>

                    <div className="flex justify-between">
                      <span>Attendance Alerts</span>
                      <Toggle enabled={attendanceNotif} onChange={setAttendanceNotif} />
                    </div>

                    <div className="flex justify-between">
                      <span>Site Updates</span>
                      <Toggle enabled={siteNotif} onChange={setSiteNotif} />
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-3xl p-8">
                  <h3 className="text-red-700 font-bold text-xl">Danger Zone</h3>
                  <p className="my-4">Logout from your current session.</p>

                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
