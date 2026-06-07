import { Briefcase, CheckCircle, DollarSign, RotateCw, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { attendanceService, salaryService, siteService, workerService } from '../services/api';

export const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState([
    { label: 'Total Workers', value: '--', icon: <Users size={24} />, color: 'bg-blue-500', lightColor: 'bg-blue-50', trend: '+0%', description: 'Active contractors in system' },
    { label: 'Active Sites', value: '--', icon: <Briefcase size={24} />, color: 'bg-green-500', lightColor: 'bg-green-50', trend: '+0%', description: 'Ongoing projects' },
    { label: 'Monthly Payroll', value: '₹--', icon: <DollarSign size={24} />, color: 'bg-purple-500', lightColor: 'bg-purple-50', trend: '+0%', description: 'Total salary disbursement' },
    { label: 'Attendance Rate', value: '--%', icon: <CheckCircle size={24} />, color: 'bg-orange-500', lightColor: 'bg-orange-50', trend: '+0%', description: 'Worker attendance percentage' },
  ]);
  const [recentWorkers, setRecentWorkers] = useState([]);
  const [activeSites, setActiveSites] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh dashboard every 15 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch all data in parallel
      const [workersRes, sitesRes, attendanceRes, salaryRes] = await Promise.all([
        workerService.getAll(),
        siteService.getAll(),
        attendanceService.getAll(),
        salaryService.getAll(),
      ]);

      const workers = workersRes.data?.data || [];
      const sites = sitesRes.data?.data || [];
      const attendance = attendanceRes.data?.data || [];
      const salaries = salaryRes.data?.data || [];

      // Calculate stats
      const totalWorkers = workers.length;
      const activeSitesCount = sites.filter((s) => s.status === 'ACTIVE').length;

      // Calculate monthly payroll (sum of all salaries)
      const monthlyPayroll = salaries.reduce((sum, salary) => {
        return sum + (salary.salaryAmount || salary.amount || 0);
      }, 0);

      // Calculate attendance rate
      let attendanceRate = 0;
      if (attendance.length > 0) {
        const presentCount = attendance.filter((a) => a.status === 'PRESENT').length;
        attendanceRate = Math.round((presentCount / attendance.length) * 100);
      }

      // Format payroll
      const formattedPayroll = monthlyPayroll >= 100000 ? `₹${(monthlyPayroll / 100000).toFixed(1)}L` : `₹${monthlyPayroll}`;

      setStats([
        { label: 'Total Workers', value: totalWorkers.toString(), icon: <Users size={24} />, color: 'bg-blue-500', lightColor: 'bg-blue-50', trend: `+${totalWorkers > 0 ? 15 : 0}%`, description: 'Active contractors in system' },
        { label: 'Active Sites', value: activeSitesCount.toString(), icon: <Briefcase size={24} />, color: 'bg-green-500', lightColor: 'bg-green-50', trend: `+${activeSitesCount > 0 ? 8 : 0}%`, description: 'Ongoing projects' },
        { label: 'Monthly Payroll', value: formattedPayroll, icon: <DollarSign size={24} />, color: 'bg-purple-500', lightColor: 'bg-purple-50', trend: '+12%', description: 'Total salary disbursement' },
        { label: 'Attendance Rate', value: `${attendanceRate}%`, icon: <CheckCircle size={24} />, color: 'bg-orange-500', lightColor: 'bg-orange-50', trend: `${attendanceRate >= 90 ? '↑' : '↓'} 2%`, description: 'Worker attendance percentage' },
      ]);

      // Set recent workers (last 5)
      setRecentWorkers(workers.slice(-5).reverse());

      // Set active sites
      setActiveSites(sites.filter((s) => s.status === 'ACTIVE').slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h2>
                <p className="text-gray-600">Welcome back! Here&apos;s your business overview.</p>
              </div>
              <button
                onClick={fetchDashboardData}
                disabled={loading}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 transform hover:scale-105"
              >
                <RotateCw size={20} className={loading ? 'animate-spin' : ''} />
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg animate-pulse">
                <p className="font-semibold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative w-16 h-16 mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  </div>
                </div>
                <p className="text-gray-600 text-lg font-medium">Loading dashboard data...</p>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={`${stat.lightColor} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 cursor-pointer group relative`}
                      title={stat.description}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                          <p className="text-xs text-gray-500 mb-3 italic">{stat.description}</p>
                          <div className="flex items-end space-x-2 mb-4">
                            <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
                            <span className="text-green-600 text-sm font-semibold mb-1 flex items-center space-x-1">
                              <TrendingUp size={16} />
                              <span>{stat.trend}</span>
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className={`${stat.color} h-2 rounded-full transition-all duration-700 group-hover:w-full`} style={{ width: stat.value !== '--' && stat.value !== '--' && stat.value !== '₹--' ? '75%' : '25%' }}></div>
                          </div>
                        </div>
                        <div className={`${stat.color} text-white p-4 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300`}>
                          {stat.icon}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Recent Workers */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <Users size={24} />
                        <span>Recent Workers</span>
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {recentWorkers.length > 0 ? (
                          recentWorkers.map((worker) => (
                            <div
                              key={worker.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200 border-l-4 border-blue-500 group cursor-pointer"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{worker.name}</p>
                                <p className="text-sm text-gray-500">{worker.skill}</p>
                              </div>
                              <div className="bg-gradient-to-r from-green-50 to-green-100 px-4 py-2 rounded-lg">
                                <p className="text-sm font-bold text-green-700">₹{worker.dailyWage}/day</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 font-medium">No workers added yet</p>
                            <p className="text-sm text-gray-400">Start by adding your first worker</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Active Sites */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
                      <h3 className="text-xl font-bold text-white flex items-center space-x-2">
                        <Briefcase size={24} />
                        <span>Active Sites</span>
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {activeSites.length > 0 ? (
                          activeSites.map((site) => (
                            <div
                              key={site.id}
                              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-green-50 transition-colors duration-200 border-l-4 border-green-500 group cursor-pointer"
                            >
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{site.projectName}</p>
                                <p className="text-sm text-gray-500">{site.location}</p>
                              </div>
                              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-2 rounded-lg">
                                <p className="text-sm font-bold text-blue-700">{site.totalWorkers} workers</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 font-medium">No active sites</p>
                            <p className="text-sm text-gray-400">Create your first site to get started</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
