import { Briefcase, CheckCircle, DollarSign, Users } from 'lucide-react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export const Dashboard = () => {
  const stats = [
    { label: 'Total Workers', value: '248', icon: <Users size={24} />, color: 'bg-blue-500' },
    { label: 'Active Sites', value: '12', icon: <Briefcase size={24} />, color: 'bg-green-500' },
    { label: 'Monthly Payroll', value: '₹4.2L', icon: <DollarSign size={24} />, color: 'bg-purple-500' },
    { label: 'Attendance Rate', value: '94%', icon: <CheckCircle size={24} />, color: 'bg-orange-500' },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                    </div>
                    <div className={`${stat.color} text-white p-3 rounded-lg`}>{stat.icon}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Workers</h3>
                <div className="space-y-3">
                  <p className="text-gray-600">No data available yet</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Active Sites</h3>
                <div className="space-y-3">
                  <p className="text-gray-600">No sites available yet</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
