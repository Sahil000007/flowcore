import { Edit2, Plus, Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { workerService } from '../services/api';

export const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWorkers = async () => {
    try {
      setError('');
      const response = await workerService.getAll();
      if (response.data && response.data.success && response.data.data) {
        setWorkers(response.data.data);
      } else {
        setError('Failed to load workers');
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
      setError(error.response?.data?.message || 'Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (editingId) {
        await workerService.update(editingId, formData);
        setEditingId(null);
      } else {
        await workerService.create(formData);
      }
      await fetchWorkers();
      resetForm();
    } catch (error) {
      console.error('Error saving worker:', error);
      setError(error.response?.data?.message || 'Failed to save worker');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        setError('');
        await workerService.delete(id);
        await fetchWorkers();
      } catch (error) {
        console.error('Error deleting worker:', error);
        setError(error.response?.data?.message || 'Failed to delete worker');
      }
    }
  };

  const handleEdit = (worker) => {
    setFormData(worker);
    setEditingId(worker.id || null);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
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
    });
    setShowForm(false);
    setEditingId(null);
    setError('');
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8 min-h-screen">
          <div className="max-w-6xl mx-auto">
            {/* Header with Animation */}
            <div className="flex justify-between items-center mb-12 animate-fade-in">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 text-white p-4 rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300">
                    <Users size={32} />
                  </div>
                  <div>
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-1">Workers</h2>
                    <p className="text-gray-600 text-lg">Manage all your contractors and workers</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-8 py-4 rounded-xl flex items-center space-x-3 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold text-lg">Add Worker</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg animate-pulse">
                <p className="font-semibold">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Form Card */}
            {showForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-10 mb-8 border-t-4 border-blue-600 backdrop-blur-lg bg-opacity-95 animate-slide-in">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-lg">
                    <span className="text-2xl">{editingId ? '✏️' : '➕'}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {editingId ? 'Edit Worker Details' : 'Add New Worker'}
                  </h3>
                </div>

                <div className="border-b-2 border-gray-100 mb-8"></div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                      <span>Worker Name</span>
                      <span className="text-red-500">*</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full group-hover:bg-blue-200 transition-colors">Required</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., John Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-200 transition-all bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1"><span>👤</span><span>Full name of the worker</span></p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                      <span>Phone Number</span>
                      <span className="text-red-500">*</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full group-hover:bg-blue-200 transition-colors">Required</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g., +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-200 transition-all bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1"><span>📱</span><span>Primary contact number</span></p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                      <span>Skill/Trade</span>
                      <span className="text-red-500">*</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full group-hover:bg-blue-200 transition-colors">Required</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Electrician, Plumber, Carpenter"
                      value={formData.skill}
                      onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-200 transition-all bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Worker&apos;s area of expertise</p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                      <span>Daily Wage (₹)</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 500"
                      value={formData.dailyWage}
                      onChange={(e) =>
                        setFormData({ ...formData, dailyWage: parseFloat(e.target.value) })
                      }
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-200 transition-all bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1"><span>💰</span><span>Daily wage rate</span></p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                      <span>Joining Date</span>
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-200 transition-all bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1"><span>📅</span><span>Date when worker joined</span></p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                      <span>Aadhaar ID</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 1234 5678 9012"
                      value={formData.aadhaarId || ''}
                      onChange={(e) => setFormData({ ...formData, aadhaarId: e.target.value })}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-200 transition-all bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1"><span>🆔</span><span>12-digit identification number</span></p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                      <span>Emergency Contact</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Rajesh Kumar"
                      value={formData.emergencyContact || ''}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-200 transition-all bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1"><span>👨👩👧</span><span>Emergency contact person name</span></p>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                      <span>Emergency Phone</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g., +91 98765 43210"
                      value={formData.emergencyPhone || ''}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-200 transition-all bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100"
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1"><span>☎️</span><span>Emergency phone number</span></p>
                  </div>

                  <div className="md:col-span-2 group">
                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                      <span>Notes & Experience</span>
                      <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
                      placeholder="e.g., 10+ years experience, OSHA Certified, available for weekends"
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-200 transition-all bg-gradient-to-r from-white to-blue-50 hover:from-blue-50 hover:to-blue-100"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-2 flex items-center space-x-1"><span>📝</span><span>Additional notes, experience, or skills</span></p>
                  </div>

                  <div className="md:col-span-2">
                    <div className="border-t-2 border-gray-100 pt-8"></div>
                    <div className="flex space-x-4 mt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 group flex items-center justify-center space-x-2"
                      >
                        <span>{editingId ? '📝' : '➕'}</span>
                        <span>{editingId ? 'Update Worker' : 'Add Worker'}</span>
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

            {/* Table */}
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="ml-4 text-gray-600 font-medium">Loading workers...</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {workers.length === 0 ? (
                  <div className="text-center py-16">
                    <Users size={48} className="mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium text-lg">No workers found</p>
                    <p className="text-gray-500">Start adding workers to get started</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-blue-50 to-blue-100 border-b-2 border-blue-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Name</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Phone</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Skill</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Daily Wage</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-800">Status</th>
                          <th className="px-6 py-4 text-center text-sm font-bold text-gray-800">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {workers.map((worker, idx) => (
                          <tr
                            key={worker.id}
                            className={`hover:bg-blue-50 transition-colors ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="px-6 py-4">
                              <p className="font-semibold text-gray-900">{worker.name}</p>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{worker.phone}</td>
                            <td className="px-6 py-4">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                {worker.skill}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-green-600">₹{worker.dailyWage}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                  worker.active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {worker.active ? '✓ Active' : '✕ Inactive'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center space-x-2">
                              <button
                                onClick={() => handleEdit(worker)}
                                className="inline-flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg transition-all"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                                <span className="text-sm">Edit</span>
                              </button>
                              <button
                                onClick={() => worker.id && handleDelete(worker.id)}
                                className="inline-flex items-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-2 rounded-lg transition-all"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                                <span className="text-sm">Delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
