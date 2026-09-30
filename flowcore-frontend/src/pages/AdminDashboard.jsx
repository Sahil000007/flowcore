import {
    AlertCircle,
    Briefcase,
    CheckCircle,
    DollarSign,
    Edit2,
    Plus,
    Settings,
    Trash2,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { useUI } from '../context/UIContext';
import {
    attendanceService,
    salaryService,
    siteService,
    workerService
} from '../services/api';

const TABS = ['Dashboard', 'Workers', 'Sites', 'Attendance', 'Salary'];
const STATUS_OPTIONS = ['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED'];
const ATTENDANCE_STATUS = ['PRESENT', 'ABSENT', 'HALF_DAY', 'OVERTIME', 'LEAVE'];

export const AdminDashboard = () => {
  const { isSidebarCollapsed } = useUI();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [workers, setWorkers] = useState([]);
  const [sites, setSites] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [salaries, setSalaries] = useState([]);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // Empty forms for each entity
  const emptyForms = {
    workers: {
      name: '',
      phone: '',
      skill: '',
      dailyWage: 0,
      joiningDate: new Date().toISOString().split('T')[0],
      emergencyContact: '',
      emergencyPhone: '',
      aadhaarId: '',
      notes: '',
      active: true,
    },
    sites: {
      projectName: '',
      location: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      clientName: '',
      budget: 0,
      totalWorkers: 0,
      supervisorName: '',
      supervisorPhone: '',
      status: 'ACTIVE',
      description: '',
    },
    attendance: {
      workerId: '',
      siteId: '',
      attendanceDate: new Date().toISOString().split('T')[0],
      status: 'PRESENT',
      hoursWorked: 0,
      overtimeHours: 0,
      remarks: '',
    },
    salary: {
      workerId: '',
      month: new Date().toISOString().slice(0, 7),
      daysWorked: 0,
      totalWage: 0,
      advance: 0,
      deduction: 0,
      netAmount: 0,
      status: 'PENDING',
      paymentMethod: 'BANK_TRANSFER',
      bankAccount: '',
      ifsc: '',
      upiId: '',
      remarks: '',
    },
  };

  // Pagination state
  const [workerPage, setWorkerPage] = useState(0);
  const [sitePage, setSitePage] = useState(0);
  const [attendancePage, setAttendancePage] = useState(0);
  const [salaryPage, setSalaryPage] = useState(0);
  const PAGE_SIZE = 10;

  // Fetch data only for dashboard stats (limited)
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');
      // Fetch limited data for stats
      const [workersRes, sitesRes] = await Promise.all([
        workerService.getAll(),
        siteService.getAll(),
      ]);

      setWorkers(workersRes.data?.data || []);
      setSites(sitesRes.data?.data || []);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load stats. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch tab-specific data
  const fetchTabData = async (tab) => {
    try {
      setLoading(true);
      setError('');
      
      if (tab === 'Workers') {
        const res = await workerService.getAll();
        setWorkers(res.data?.data || []);
      } else if (tab === 'Sites') {
        const res = await siteService.getAll();
        setSites(res.data?.data || []);
      } else if (tab === 'Attendance') {
        const res = await attendanceService.getAll();
        setAttendance(res.data?.data || []);
      } else if (tab === 'Salary') {
        const res = await salaryService.getAll();
        setSalaries(res.data?.data || []);
      }
    } catch (err) {
      console.error('Error fetching tab data:', err);
      setError(`Failed to load ${tab} data. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg, isError = false) => {
    if (isError) {
      setError(msg);
      setSuccess('');
    } else {
      setSuccess(msg);
      setError('');
    }
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 3000);
  };

  const handleAddWorker = async () => {
    try {
      setError('');
      await workerService.create(formData);
      showMessage('Worker added successfully!');
      await fetchTabData('Workers');
      resetForm();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to add worker', true);
    }
  };

  const handleEditWorker = async () => {
    try {
      setError('');
      await workerService.update(editingId, formData);
      showMessage('Worker updated successfully!');
      await fetchTabData('Workers');
      resetForm();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update worker', true);
    }
  };

  const handleDeleteWorker = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      setError('');
      await workerService.delete(id);
      showMessage('Worker deleted successfully!');
      await fetchTabData('Workers');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to delete worker', true);
    }
  };

  // SITES CRUD
  const handleAddSite = async () => {
    try {
      setError('');
      await siteService.create(formData);
      showMessage('Site added successfully!');
      await fetchTabData('Sites');
      resetForm();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to add site', true);
    }
  };

  const handleEditSite = async () => {
    try {
      setError('');
      await siteService.update(editingId, formData);
      showMessage('Site updated successfully!');
      await fetchTabData('Sites');
      resetForm();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update site', true);
    }
  };

  const handleDeleteSite = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      setError('');
      await siteService.delete(id);
      showMessage('Site deleted successfully!');
      await fetchTabData('Sites');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to delete site', true);
    }
  };

  // ATTENDANCE CRUD
  const handleAddAttendance = async () => {
    try {
      setError('');
      const payload = {
        ...formData,
        workerId: Number(formData.workerId),
        siteId: Number(formData.siteId),
        hoursWorked: Number(formData.hoursWorked),
        overtimeHours: Number(formData.overtimeHours),
      };
      await attendanceService.create(payload);
      showMessage('Attendance record added successfully!');
      await fetchTabData('Attendance');
      resetForm();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to add attendance', true);
    }
  };

  const handleEditAttendance = async () => {
    try {
      setError('');
      const payload = {
        ...formData,
        workerId: Number(formData.workerId),
        siteId: Number(formData.siteId),
        hoursWorked: Number(formData.hoursWorked),
        overtimeHours: Number(formData.overtimeHours),
      };
      await attendanceService.update(editingId, payload);
      showMessage('Attendance record updated successfully!');
      await fetchTabData('Attendance');
      resetForm();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update attendance', true);
    }
  };

  const handleDeleteAttendance = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      setError('');
      await attendanceService.delete(id);
      showMessage('Attendance record deleted successfully!');
      await fetchTabData('Attendance');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to delete attendance', true);
    }
  };

  // SALARY CRUD
  const handleAddSalary = async () => {
    try {
      setError('');
      const payload = {
        ...formData,
        workerId: Number(formData.workerId),
        daysWorked: Number(formData.daysWorked),
        totalWage: Number(formData.totalWage),
        advance: Number(formData.advance),
        deduction: Number(formData.deduction),
        netAmount: Number(formData.netAmount),
      };
      await salaryService.create(payload);
      showMessage('Salary record added successfully!');
      await fetchTabData('Salary');
      resetForm();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to add salary', true);
    }
  };

  const handleEditSalary = async () => {
    try {
      setError('');
      const payload = {
        ...formData,
        workerId: Number(formData.workerId),
        daysWorked: Number(formData.daysWorked),
        totalWage: Number(formData.totalWage),
        advance: Number(formData.advance),
        deduction: Number(formData.deduction),
        netAmount: Number(formData.netAmount),
      };
      await salaryService.update(editingId, payload);
      showMessage('Salary record updated successfully!');
      await fetchTabData('Salary');
      resetForm();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update salary', true);
    }
  };

  const handleDeleteSalary = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      setError('');
      await salaryService.delete(id);
      showMessage('Salary record deleted successfully!');
      await fetchTabData('Salary');
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to delete salary', true);
    }
  };

  const resetForm = () => {
    setFormData({});
    setShowForm(false);
    setEditingId(null);
  };

  const getPaginatedData = (data, page, pageSize) => {
    const start = page * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  };

  const getTotalPages = (data, pageSize) => {
    return Math.ceil(data.length / pageSize);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleEdit = (item, tab) => {
    setFormData(item);
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'Workers') {
      editingId ? handleEditWorker() : handleAddWorker();
    } else if (activeTab === 'Sites') {
      editingId ? handleEditSite() : handleAddSite();
    } else if (activeTab === 'Attendance') {
      editingId ? handleEditAttendance() : handleAddAttendance();
    } else if (activeTab === 'Salary') {
      editingId ? handleEditSalary() : handleAddSalary();
    }
  };

  // Dashboard Stats
  const stats = [
    {
      label: 'Total Workers',
      value: workers.length,
      icon: <Users size={24} />,
      color: 'bg-blue-500',
    },
    {
      label: 'Active Sites',
      value: sites.filter((s) => s.status === 'ACTIVE').length,
      icon: <Briefcase size={24} />,
      color: 'bg-green-500',
    },
    {
      label: 'Total Attendance Records',
      value: attendance.length,
      icon: <CheckCircle size={24} />,
      color: 'bg-purple-500',
    },
    {
      label: 'Salary Records',
      value: salaries.length,
      icon: <DollarSign size={24} />,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarCollapsed ? 'md:ml-20' : 'md:ml-72'
        }`}
      >
        <Header />
        <main className="flex-1 bg-slate-50 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Title */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="text-blue-600" size={32} />
                <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
              </div>
              <p className="text-gray-600">Manage all system components: Workers, Sites, Attendance, and Salary</p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 mt-0.5" size={20} />
                <p className="text-red-800">{error}</p>
              </div>
            )}
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="text-green-600 mt-0.5" size={20} />
                <p className="text-green-800">{success}</p>
              </div>
            )}

            {/* Dashboard Stats - Only show on Dashboard tab */}
            {activeTab === 'Dashboard' && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-600 font-medium">{stat.label}</span>
                      <div className={`${stat.color} p-3 rounded-lg text-white`}>
                        {stat.icon}
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="flex gap-1 p-4 border-b border-gray-200 overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      resetForm();
                      // Load data for this tab on demand
                      if (tab !== 'Dashboard' && tab !== activeTab) {
                        fetchTabData(tab);
                      }
                    }}
                    className={`px-6 py-2 font-medium whitespace-nowrap transition ${
                      activeTab === tab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-lg shadow-md">
              {loading && (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600">Loading data...</p>
                </div>
              )}

              {!loading && activeTab === 'Dashboard' && (
                <div className="p-8">
                  <div className="text-center text-gray-600">
                    <p className="text-lg mb-4">Click on the tabs above to manage different components</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <Users className="mx-auto mb-2 text-blue-600" size={32} />
                        <p className="font-semibold text-gray-700">Workers</p>
                        <p className="text-sm text-gray-600">Add, edit, delete workers</p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <Briefcase className="mx-auto mb-2 text-green-600" size={32} />
                        <p className="font-semibold text-gray-700">Sites</p>
                        <p className="text-sm text-gray-600">Manage project sites</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg">
                        <CheckCircle className="mx-auto mb-2 text-purple-600" size={32} />
                        <p className="font-semibold text-gray-700">Attendance</p>
                        <p className="text-sm text-gray-600">Track worker attendance</p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <DollarSign className="mx-auto mb-2 text-orange-600" size={32} />
                        <p className="font-semibold text-gray-700">Salary</p>
                        <p className="text-sm text-gray-600">Manage payroll</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Workers Tab */}
              {activeTab === 'Workers' && !loading && (
                <WorkersTab
                  workers={workers}
                  showForm={showForm}
                  setShowForm={setShowForm}
                  editingId={editingId}
                  formData={formData}
                  emptyForm={emptyForms.workers}
                  handleEdit={handleEdit}
                  handleDelete={handleDeleteWorker}
                  handleFormChange={handleFormChange}
                  handleSubmit={handleSubmit}
                  resetForm={resetForm}
                />
              )}

              {/* Sites Tab */}
              {activeTab === 'Sites' && !loading && (
                <SitesTab
                  sites={sites}
                  showForm={showForm}
                  setShowForm={setShowForm}
                  editingId={editingId}
                  formData={formData}
                  emptyForm={emptyForms.sites}
                  handleEdit={handleEdit}
                  handleDelete={handleDeleteSite}
                  handleFormChange={handleFormChange}
                  handleSubmit={handleSubmit}
                  resetForm={resetForm}
                />
              )}

              {/* Attendance Tab */}
              {activeTab === 'Attendance' && !loading && (
                <AttendanceTab
                  attendance={attendance}
                  workers={workers}
                  sites={sites}
                  showForm={showForm}
                  setShowForm={setShowForm}
                  editingId={editingId}
                  formData={formData}
                  emptyForm={emptyForms.attendance}
                  handleEdit={handleEdit}
                  handleDelete={handleDeleteAttendance}
                  handleFormChange={handleFormChange}
                  handleSubmit={handleSubmit}
                  resetForm={resetForm}
                />
              )}

              {/* Salary Tab */}
              {activeTab === 'Salary' && !loading && (
                <SalaryTab
                  salaries={salaries}
                  workers={workers}
                  showForm={showForm}
                  setShowForm={setShowForm}
                  editingId={editingId}
                  formData={formData}
                  emptyForm={emptyForms.salary}
                  handleEdit={handleEdit}
                  handleDelete={handleDeleteSalary}
                  handleFormChange={handleFormChange}
                  handleSubmit={handleSubmit}
                  resetForm={resetForm}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Workers Tab Component
const WorkersTab = ({
  workers,
  showForm,
  setShowForm,
  editingId,
  formData,
  emptyForm,
  handleEdit,
  handleDelete,
  handleFormChange,
  handleSubmit,
  resetForm,
}) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Workers Management</h2>
      <button
        onClick={() => {
          if (!showForm) setShowForm(true);
          else resetForm();
        }}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        <Plus size={20} />
        {showForm ? 'Cancel' : 'Add Worker'}
      </button>
    </div>

    {showForm && (
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="name"
            placeholder="Worker Name"
            value={formData.name || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            name="skill"
            placeholder="Skill"
            value={formData.skill || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="dailyWage"
            placeholder="Daily Wage"
            value={formData.dailyWage || 0}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="date"
            name="joiningDate"
            value={formData.joiningDate || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            name="aadhaarId"
            placeholder="Aadhaar ID"
            value={formData.aadhaarId || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            name="emergencyContact"
            placeholder="Emergency Contact"
            value={formData.emergencyContact || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="tel"
            name="emergencyPhone"
            placeholder="Emergency Phone"
            value={formData.emergencyPhone || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <label className="flex items-center gap-2 border border-gray-300 rounded px-3 py-2 bg-white hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              name="active"
              checked={formData.active !== false}
              onChange={handleFormChange}
              className="w-4 h-4"
            />
            Active
          </label>
        </div>
        <textarea
          name="notes"
          placeholder="Notes"
          value={formData.notes || ''}
          onChange={handleFormChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          rows="2"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {editingId ? 'Update' : 'Add'} Worker
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    )}

    {workers.length === 0 ? (
      <p className="text-center text-gray-500 py-8">No workers found. Add one to get started!</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Phone</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Skill</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Daily Wage</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {workers.map((worker) => (
              <tr key={worker.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{worker.name}</td>
                <td className="px-4 py-3">{worker.phone}</td>
                <td className="px-4 py-3">{worker.skill}</td>
                <td className="px-4 py-3">₹{worker.dailyWage}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    worker.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {worker.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(worker, 'workers')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(worker.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// Sites Tab Component
const SitesTab = ({
  sites,
  showForm,
  setShowForm,
  editingId,
  formData,
  emptyForm,
  handleEdit,
  handleDelete,
  handleFormChange,
  handleSubmit,
  resetForm,
}) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Sites Management</h2>
      <button
        onClick={() => {
          if (!showForm) setShowForm(true);
          else resetForm();
        }}
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        <Plus size={20} />
        {showForm ? 'Cancel' : 'Add Site'}
      </button>
    </div>

    {showForm && (
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            name="projectName"
            placeholder="Project Name"
            value={formData.projectName || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            name="clientName"
            placeholder="Client Name"
            value={formData.clientName || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="date"
            name="startDate"
            value={formData.startDate || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="date"
            name="endDate"
            value={formData.endDate || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget || 0}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="totalWorkers"
            placeholder="Total Workers"
            value={formData.totalWorkers || 0}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="text"
            name="supervisorName"
            placeholder="Supervisor Name"
            value={formData.supervisorName || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="tel"
            name="supervisorPhone"
            placeholder="Supervisor Phone"
            value={formData.supervisorPhone || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <select
            name="status"
            value={formData.status || 'ACTIVE'}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description || ''}
          onChange={handleFormChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          rows="2"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {editingId ? 'Update' : 'Add'} Site
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    )}

    {sites.length === 0 ? (
      <p className="text-center text-gray-500 py-8">No sites found. Add one to get started!</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Project Name</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Location</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Client</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Budget</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Workers</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((site) => (
              <tr key={site.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{site.projectName}</td>
                <td className="px-4 py-3">{site.location}</td>
                <td className="px-4 py-3">{site.clientName}</td>
                <td className="px-4 py-3">₹{site.budget?.toLocaleString()}</td>
                <td className="px-4 py-3">{site.totalWorkers}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    site.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : site.status === 'COMPLETED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {site.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(site, 'sites')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(site.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// Attendance Tab Component
const AttendanceTab = ({
  attendance,
  workers,
  sites,
  showForm,
  setShowForm,
  editingId,
  formData,
  emptyForm,
  handleEdit,
  handleDelete,
  handleFormChange,
  handleSubmit,
  resetForm,
}) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Attendance Management</h2>
      <button
        onClick={() => {
          if (!showForm) setShowForm(true);
          else resetForm();
        }}
        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
      >
        <Plus size={20} />
        {showForm ? 'Cancel' : 'Add Record'}
      </button>
    </div>

    {showForm && (
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            name="workerId"
            value={formData.workerId || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select Worker</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          <select
            name="siteId"
            value={formData.siteId || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select Site</option>
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.projectName}
              </option>
            ))}
          </select>
          <input
            type="date"
            name="attendanceDate"
            value={formData.attendanceDate || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
          <select
            name="status"
            value={formData.status || 'PRESENT'}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            {ATTENDANCE_STATUS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="hoursWorked"
            placeholder="Hours Worked"
            value={formData.hoursWorked || 0}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="overtimeHours"
            placeholder="Overtime Hours"
            value={formData.overtimeHours || 0}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
        </div>
        <textarea
          name="remarks"
          placeholder="Remarks"
          value={formData.remarks || ''}
          onChange={handleFormChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
          rows="2"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {editingId ? 'Update' : 'Add'} Record
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    )}

    {attendance.length === 0 ? (
      <p className="text-center text-gray-500 py-8">No attendance records found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Worker</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Site</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Date</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Hours</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((record) => (
              <tr key={record.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {workers.find((w) => w.id === record.workerId)?.name || 'N/A'}
                </td>
                <td className="px-4 py-3">
                  {sites.find((s) => s.id === record.siteId)?.projectName || 'N/A'}
                </td>
                <td className="px-4 py-3">{record.attendanceDate}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    record.status === 'PRESENT'
                      ? 'bg-green-100 text-green-800'
                      : record.status === 'ABSENT'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-4 py-3">{record.hoursWorked}h</td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(record, 'attendance')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

// Salary Tab Component
const SalaryTab = ({
  salaries,
  workers,
  showForm,
  setShowForm,
  editingId,
  formData,
  emptyForm,
  handleEdit,
  handleDelete,
  handleFormChange,
  handleSubmit,
  resetForm,
}) => (
  <div className="p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Salary Management</h2>
      <button
        onClick={() => {
          if (!showForm) setShowForm(true);
          else resetForm();
        }}
        className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
      >
        <Plus size={20} />
        {showForm ? 'Cancel' : 'Add Record'}
      </button>
    </div>

    {showForm && (
      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <select
            name="workerId"
            value={formData.workerId || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          >
            <option value="">Select Worker</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          <input
            type="month"
            name="month"
            value={formData.month || ''}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="daysWorked"
            placeholder="Days Worked"
            value={formData.daysWorked || 0}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="totalWage"
            placeholder="Total Wage"
            value={formData.totalWage || 0}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="advance"
            placeholder="Advance"
            value={formData.advance || 0}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="deduction"
            placeholder="Deduction"
            value={formData.deduction || 0}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <input
            type="number"
            name="netAmount"
            placeholder="Net Amount"
            value={formData.netAmount || 0}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <select
            name="status"
            value={formData.status || 'PENDING'}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
          <select
            name="paymentMethod"
            value={formData.paymentMethod || 'BANK_TRANSFER'}
            onChange={handleFormChange}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CHEQUE">Cheque</option>
          </select>
        </div>
        <input
          type="text"
          name="remarks"
          placeholder="Remarks"
          value={formData.remarks || ''}
          onChange={handleFormChange}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {editingId ? 'Update' : 'Add'} Record
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    )}

    {salaries.length === 0 ? (
      <p className="text-center text-gray-500 py-8">No salary records found.</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Worker</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Month</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Total Wage</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Net Amount</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {salaries.map((salary) => (
              <tr key={salary.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {workers.find((w) => w.id === salary.workerId)?.name || 'N/A'}
                </td>
                <td className="px-4 py-3">{salary.month}</td>
                <td className="px-4 py-3">₹{salary.totalWage?.toLocaleString()}</td>
                <td className="px-4 py-3 font-medium">₹{salary.netAmount?.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    salary.status === 'COMPLETED'
                      ? 'bg-green-100 text-green-800'
                      : salary.status === 'PENDING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {salary.status}
                  </span>
                </td>
                <td className="px-4 py-3 flex gap-2">
                  <button
                    onClick={() => handleEdit(salary, 'salary')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(salary.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default AdminDashboard;
