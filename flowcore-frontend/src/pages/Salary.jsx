import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { salaryService, workerService } from '../services/api';

export const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = useMemo(
    () => ({
      workerId: '',
      month: new Date().toISOString().slice(0, 7),
      daysWorked: 0,
      totalWage: 0,
      advance: 0,
      deduction: 0,
      netAmount: 0,
      status: 'PENDING',
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
      const [salariesRes, workersRes] = await Promise.all([
        salaryService.getAll(),
        workerService.getAll(),
      ]);

      if (salariesRes.data?.success && Array.isArray(salariesRes.data?.data)) {
        setSalaries(salariesRes.data.data);
      }

      if (workersRes.data?.success && Array.isArray(workersRes.data?.data)) {
        setWorkers(workersRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching salary/worker data', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (salary) => {
    setFormData({
      workerId: salary.workerId ?? '',
      month: salary.month ?? new Date().toISOString().slice(0, 7),
      daysWorked: salary.daysWorked ?? 0,
      totalWage: salary.totalWage ?? 0,
      advance: salary.advance ?? 0,
      deduction: salary.deduction ?? 0,
      netAmount: salary.netAmount ?? 0,
      status: salary.status ?? 'PENDING',
      remarks: salary.remarks ?? '',
    });
    setEditingId(salary.id ?? null);
    setShowForm(true);
  };

  const calculateNetAmount = (total, advance, deduction) => {
    return Math.max(0, total - (advance + deduction));
  };

  const handleFormChange = (field, value) => {
    const newData = { ...formData, [field]: value };
    if (field === 'totalWage' || field === 'advance' || field === 'deduction') {
      newData.netAmount = calculateNetAmount(
        parseFloat(newData.totalWage) || 0,
        parseFloat(newData.advance) || 0,
        parseFloat(newData.deduction) || 0
      );
    }
    setFormData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      workerId: formData.workerId ? Number(formData.workerId) : null,
      month: formData.month,
      daysWorked: formData.daysWorked ? Number(formData.daysWorked) : 0,
      totalWage: formData.totalWage ? Number(formData.totalWage) : 0,
      advance: formData.advance ? Number(formData.advance) : 0,
      deduction: formData.deduction ? Number(formData.deduction) : 0,
      netAmount: formData.netAmount ? Number(formData.netAmount) : 0,
      status: formData.status,
      remarks: formData.remarks,
    };

    try {
      if (editingId) {
        await salaryService.update(editingId, payload);
      } else {
        await salaryService.create(payload);
      }
      await fetchAll();
      resetForm();
    } catch (error) {
      console.error('Error saving salary', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this salary record?')) return;
    try {
      await salaryService.delete(id);
      await fetchAll();
    } catch (error) {
      console.error('Error deleting salary', error);
    }
  };

  const totalPayroll = salaries.reduce((sum, s) => sum + (s.netAmount || 0), 0);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">Salary Management</h2>
                <p className="text-gray-600 text-sm mt-1">Track and manage worker salaries and payroll</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData(emptyForm);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition"
              >
                <Plus size={20} />
                <span>Add Salary Record</span>
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Total Payroll</p>
                <p className="text-3xl font-bold text-green-600 mt-2">₹{totalPayroll.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Total Records</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{salaries.length}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm font-medium">Active Workers</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{workers.length}</p>
              </div>
            </div>

            {showForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {editingId ? 'Edit Salary Record' : 'Add New Salary Record'}
                </h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={formData.workerId}
                    onChange={(e) => handleFormChange('workerId', e.target.value)}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="" disabled>
                      Select Worker
                    </option>
                    {workers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.name} ({w.skill})
                      </option>
                    ))}
                  </select>

                  <input
                    type="month"
                    value={formData.month}
                    onChange={(e) => handleFormChange('month', e.target.value)}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Days Worked"
                    value={formData.daysWorked}
                    onChange={(e) => handleFormChange('daysWorked', e.target.value)}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                    min={0}
                    max={31}
                  />

                  <input
                    type="number"
                    placeholder="Total Wage (₹)"
                    value={formData.totalWage}
                    onChange={(e) => handleFormChange('totalWage', e.target.value)}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                    min={0}
                    step={0.01}
                  />

                  <input
                    type="number"
                    placeholder="Advance (₹)"
                    value={formData.advance}
                    onChange={(e) => handleFormChange('advance', e.target.value)}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    min={0}
                    step={0.01}
                  />

                  <input
                    type="number"
                    placeholder="Deduction (₹)"
                    value={formData.deduction}
                    onChange={(e) => handleFormChange('deduction', e.target.value)}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    min={0}
                    step={0.01}
                  />

                  <div className="px-4 py-2 border rounded bg-gray-50">
                    <p className="text-gray-600 text-sm">Net Amount (₹)</p>
                    <p className="text-2xl font-bold text-green-600">{formData.netAmount.toFixed(2)}</p>
                  </div>

                  <select
                    value={formData.status}
                    onChange={(e) => handleFormChange('status', e.target.value)}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="PAID">Paid</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>

                  <textarea
                    placeholder="Remarks/Notes"
                    value={formData.remarks}
                    onChange={(e) => handleFormChange('remarks', e.target.value)}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 md:col-span-2"
                    rows={3}
                  />

                  <div className="md:col-span-2 flex space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                      {editingId ? 'Update' : 'Add'} Salary Record
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
              <p className="text-center text-gray-600">Loading salary records...</p>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Worker</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Month</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Days Worked</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Total Wage</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Advance</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Deduction</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Net Amount</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaries.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="px-6 py-4 text-center text-gray-600">
                          No salary records found
                        </td>
                      </tr>
                    ) : (
                      salaries.map((salary) => {
                        const worker = workers.find((w) => w.id === salary.workerId);
                        const statusColors = {
                          PENDING: 'bg-yellow-100 text-yellow-800',
                          APPROVED: 'bg-blue-100 text-blue-800',
                          PAID: 'bg-green-100 text-green-800',
                          CANCELLED: 'bg-red-100 text-red-800',
                        };
                        return (
                          <tr key={salary.id} className="border-t hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-800">{worker?.name || '-'}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{salary.month}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">{salary.daysWorked}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">₹{salary.totalWage?.toFixed(2) || '0.00'}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">₹{salary.advance?.toFixed(2) || '0.00'}</td>
                            <td className="px-6 py-4 text-sm text-gray-800">₹{salary.deduction?.toFixed(2) || '0.00'}</td>
                            <td className="px-6 py-4 text-sm font-bold text-green-600">
                              ₹{salary.netAmount?.toFixed(2) || '0.00'}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[salary.status] || 'bg-gray-100 text-gray-800'}`}>
                                {salary.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <button
                                onClick={() => handleEdit(salary)}
                                className="text-blue-600 hover:text-blue-800 mr-4"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => salary.id && handleDelete(salary.id)}
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

