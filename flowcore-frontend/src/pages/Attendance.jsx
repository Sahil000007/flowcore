import { Edit2, Plus, Trash2 } from 'lucide-react';
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
        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Attendance</h2>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData(emptyForm);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition"
              >
                <Plus size={20} />
                <span>Add Attendance</span>
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {editingId ? 'Edit Attendance' : 'Add New Attendance'}
                </h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={formData.workerId}
                    onChange={(e) => setFormData({ ...formData, workerId: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="" disabled>
                      Select Worker
                    </option>
                    {workers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={formData.siteId}
                    onChange={(e) => setFormData({ ...formData, siteId: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="" disabled>
                      Select Site
                    </option>
                    {sites.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.projectName}
                      </option>
                    ))}
                  </select>

                  <input
                    type="date"
                    value={formData.attendanceDate}
                    onChange={(e) => setFormData({ ...formData, attendanceDate: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />

                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    placeholder="Hours Worked"
                    value={formData.hoursWorked}
                    onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                    min={0}
                    step={0.25}
                  />

                  <input
                    type="number"
                    placeholder="Overtime Hours"
                    value={formData.overtimeHours}
                    onChange={(e) => setFormData({ ...formData, overtimeHours: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                    min={0}
                    step={0.25}
                  />

                  <textarea
                    placeholder="Remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 md:col-span-2"
                    rows={3}
                  />

                  <div className="md:col-span-2 flex space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                      {editingId ? 'Update' : 'Add'} Attendance
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition"
                    >
                      Cancel
                    </button>
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


