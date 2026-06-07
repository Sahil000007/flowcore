import { CheckCircle, Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { siteService, workerService } from '../services/api';
import attendanceService from '../services/attendanceService';


const STATUS_OPTIONS = ['PRESENT', 'ABSENT', 'HALF_DAY', 'OVERTIME', 'LEAVE'];

export const Attendance = () => {
  const [items, setItems] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = useMemo(
    () => ({
      workerId: '',
      siteId: '',
      attendanceDate: new Date().toISOString().split('T')[0],
      status: 'PRESENT',
      hoursWorked: 0,
      overtimeHours: 0,
      remarks: '',
    }),
    []
  );

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAll = async () => {
    try {
      const [attendanceRes, workersRes, sitesRes] = await Promise.all([
        attendanceService.getAll(),
        workerService.getAll(),
        siteService.getAll(),
      ]);

      if (attendanceRes.data?.success && Array.isArray(attendanceRes.data?.data)) {
        setItems(attendanceRes.data.data);
      }

      if (workersRes.data?.success && Array.isArray(workersRes.data?.data)) {
        setWorkers(workersRes.data.data);
      }

      if (sitesRes.data?.success && Array.isArray(sitesRes.data?.data)) {
        setSites(sitesRes.data.data);
      }
    } catch (e) {
      console.error('Error fetching attendance-related data', e);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (row) => {
    setFormData({
      workerId: row.workerId ?? '',
      siteId: row.siteId ?? '',
      attendanceDate: row.attendanceDate ?? new Date().toISOString().split('T')[0],
      status: row.status ?? 'PRESENT',
      hoursWorked: row.hoursWorked ?? 0,
      overtimeHours: row.overtimeHours ?? 0,
      remarks: row.remarks ?? '',
    });
    setEditingId(row.id ?? null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      workerId: formData.workerId ? Number(formData.workerId) : null,
      siteId: formData.siteId ? Number(formData.siteId) : null,
      attendanceDate: formData.attendanceDate,
      status: formData.status,
      hoursWorked: formData.hoursWorked ? Number(formData.hoursWorked) : 0,
      overtimeHours: formData.overtimeHours ? Number(formData.overtimeHours) : 0,
      remarks: formData.remarks,
    };

    try {
      if (editingId) {
        await attendanceService.update(editingId, payload);
      } else {
        await attendanceService.create(payload);
      }
      await fetchAll();
      resetForm();
    } catch (e) {
      console.error('Error saving attendance', e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await attendanceService.delete(id);
      await fetchAll();
    } catch (e) {
      console.error('Error deleting attendance', e);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-slate-50 via-orange-50 to-slate-100 p-8 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12 animate-fade-in">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white p-4 rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-1">Attendance</h2>
                    <p className="text-gray-600 text-lg">Track worker attendance and hours</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData(emptyForm);
                }}
                className="relative bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 hover:from-orange-700 hover:via-orange-800 hover:to-orange-900 text-white px-8 py-4 rounded-xl flex items-center space-x-3 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold text-lg">Mark Attendance</span>
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-10 mb-8 border-t-4 border-orange-600 backdrop-blur-lg bg-opacity-95 animate-slide-in">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 rounded-lg">
                    <span className="text-2xl">{editingId ? '✏️' : '📋'}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {editingId ? 'Edit Attendance Record' : 'Mark New Attendance'}
                  </h3>
                </div>

                <div className="border-b-2 border-gray-100 mb-8"></div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Worker *</label>
                    <select
                      value={formData.workerId}
                      onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      required
                    >
                      <option value="" disabled>
                        Select worker from list
                      </option>
                      {workers.map((w) => (
                        <option key={w.id} value={w.id}>
                          {w.name} ({w.skill})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Choose the worker to mark attendance</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Site *</label>
                    <select
                      value={formData.siteId}
                      onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      required
                    >
                      <option value="" disabled>
                        Select active site
                      </option>
                      {sites.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.projectName}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Project where attendance is being marked</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Attendance Date *</label>
                    <input
                      type="date"
                      value={formData.attendanceDate}
                      onChange={(e) => setFormData({ ...formData, attendanceDate: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Date of attendance record</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      required
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Present, Absent, Half Day, Overtime, or Leave</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Hours Worked *</label>
                    <input
                      type="number"
                      placeholder="e.g., 8"
                      value={formData.hoursWorked}
                      onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      required
                      min={0}
                      step={0.25}
                    />
                    <p className="text-xs text-gray-500 mt-1">Total working hours in a day</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Overtime Hours (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g., 2"
                      value={formData.overtimeHours}
                      onChange={(e) => setFormData({ ...formData, overtimeHours: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      min={0}
                      step={0.25}
                    />
                    <p className="text-xs text-gray-500 mt-1">Extra hours worked beyond regular shift</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks (Optional)</label>
                    <textarea
                      placeholder="e.g., Weather delay, Site inspection, Medical leave"
                      value={formData.remarks}
                      onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">Any additional notes or details about the attendance</p>
                  </div>

                  <div className="md:col-span-2">
                    <div className="border-t-2 border-gray-100 pt-8"></div>
                    <div className="flex space-x-4 mt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-orange-600 via-orange-700 to-orange-800 hover:from-orange-700 hover:via-orange-800 hover:to-orange-900 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 group flex items-center justify-center space-x-2"
                      >
                        <span>{editingId ? '📝' : '✅'}</span>
                        <span>{editingId ? 'Update Attendance' : 'Mark Attendance'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
                      >
                        <span>❌</span>
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <p className="text-center text-gray-600">Loading attendance...</p>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Worker</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Site</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Hours</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Overtime</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-4 text-center text-gray-600">
                          No attendance records found
                        </td>
                      </tr>
                    ) : (
                      items.map((row) => {
                        const worker = workers.find((w) => w.id === row.workerId);
                        const site = sites.find((s) => s.id === row.siteId);
                        return (
                          <tr key={row.id} className="border-t hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800">{worker?.name || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{site?.projectName || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{row.attendanceDate}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{row.status}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{row.hoursWorked ?? 0}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{row.overtimeHours ?? 0}</td>
                            <td className="px-6 py-4 text-sm">
                              <button
                                onClick={() => handleEdit(row)}
                                className="text-blue-600 hover:text-blue-800 mr-4"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => row.id && handleDelete(row.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};


