import { DollarSign, Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { salaryService, workerService } from '../services/api';

export const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      setError('');
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
      const errorMsg = error.response?.data?.message || 'Failed to load salary data';
      setError(errorMsg);
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
      const errorMsg = error.response?.data?.message || 'Failed to save salary record';
      setError(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this salary record?')) return;
    try {
      setError('');
      await salaryService.delete(id);
      await fetchAll();
    } catch (error) {
      console.error('Error deleting salary', error);
      const errorMsg = error.response?.data?.message || 'Failed to delete salary record';
      setError(errorMsg);
    }
  };

  const totalPayroll = salaries.reduce((sum, s) => sum + (s.netAmount || 0), 0);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 p-8 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12 animate-fade-in">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 text-white p-4 rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300">
                    <DollarSign size={32} />
                  </div>
                  <div>
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent mb-1">Salary Management</h2>
                    <p className="text-gray-600 text-lg">Track and manage worker salaries and payroll</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowForm(true);
                  setEditingId(null);
                  setFormData(emptyForm);
                }}
                className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white px-8 py-4 rounded-xl flex items-center space-x-3 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold text-lg">Add Salary Record</span>
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

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {showForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-10 mb-8 border-t-4 border-purple-600 backdrop-blur-lg bg-opacity-95 animate-slide-in">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 rounded-lg">
                    <span className="text-2xl">{editingId ? '✏️' : '💰'}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {editingId ? 'Edit Salary Record' : 'Add New Salary Record'}
                  </h3>
                </div>

                <div className="border-b-2 border-gray-100 mb-8"></div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Worker *</label>
                    <select
                      value={formData.workerId}
                      onChange={(e) => handleFormChange('workerId', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
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
                    <p className="text-xs text-gray-500 mt-1">Choose worker for salary record</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Month *</label>
                    <input
                      type="month"
                      value={formData.month}
                      onChange={(e) => handleFormChange('month', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Month for which salary is being recorded</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Days Worked *</label>
                    <input
                      type="number"
                      placeholder="e.g., 25"
                      value={formData.daysWorked}
                      onChange={(e) => handleFormChange('daysWorked', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                      min={0}
                      max={31}
                    />
                    <p className="text-xs text-gray-500 mt-1">Number of days worked in the month</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Wage (₹) *</label>
                    <input
                      type="number"
                      placeholder="e.g., 12500"
                      value={formData.totalWage}
                      onChange={(e) => handleFormChange('totalWage', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      required
                      min={0}
                      step={0.01}
                    />
                    <p className="text-xs text-gray-500 mt-1">Total wage before deductions</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Advance Paid (₹) (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g., 5000"
                      value={formData.advance}
                      onChange={(e) => handleFormChange('advance', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      min={0}
                      step={0.01}
                    />
                    <p className="text-xs text-gray-500 mt-1">Any advance amount already paid to worker</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deduction (₹) (Optional)</label>
                    <input
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.deduction}
                      onChange={(e) => handleFormChange('deduction', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      min={0}
                      step={0.01}
                    />
                    <p className="text-xs text-gray-500 mt-1">Any deductions from salary (penalties, loan repayment, etc.)</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payment Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="PAID">Paid</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Current status of salary payment</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Net Amount (₹) - Auto Calculated</label>
                    <div className="px-4 py-3 border-2 border-purple-300 rounded-lg bg-purple-50">
                      <p className="text-3xl font-bold text-purple-600">₹{formData.netAmount.toFixed(2)}</p>
                      <p className="text-xs text-gray-500 mt-1">Total Wage - Advance - Deduction = Net Amount</p>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Remarks (Optional)</label>
                    <textarea
                      placeholder="e.g., Bonus given, Promotion salary increase, Sick leave deduction"
                      value={formData.remarks}
                      onChange={(e) => handleFormChange('remarks', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">Any additional notes or remarks about this salary</p>
                  </div>

                  <div className="md:col-span-2">
                    <div className="border-t-2 border-gray-100 pt-8"></div>
                    <div className="flex space-x-4 mt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 hover:from-purple-700 hover:via-purple-800 hover:to-purple-900 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 group flex items-center justify-center space-x-2"
                      >
                        <span>{editingId ? '📝' : '💰'}</span>
                        <span>{editingId ? 'Update Salary' : 'Add Salary Record'}</span>
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

