import { Briefcase, Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { siteService } from '../services/api';

const STATUS_OPTIONS = ['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED'];

export const Sites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = useMemo(
    () => ({
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
    }),
    []
  );

  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    fetchSites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSites = async () => {
    try {
      const response = await siteService.getAll();
      if (response.data && response.data.success && response.data.data) {
        setSites(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (site) => {
    setFormData({
      projectName: site.projectName ?? '',
      location: site.location ?? '',
      startDate:
        site.startDate && typeof site.startDate === 'string'
          ? site.startDate
          : new Date().toISOString().split('T')[0],
      endDate: site.endDate ?? '',
      clientName: site.clientName ?? '',
      budget: site.budget ?? 0,
      totalWorkers: site.totalWorkers ?? 0,
      supervisorName: site.supervisorName ?? '',
      supervisorPhone: site.supervisorPhone ?? '',
      status: site.status ?? 'ACTIVE',
      description: site.description ?? '',
    });
    setEditingId(site.id || null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await siteService.update(editingId, formData);
        setEditingId(null);
      } else {
        await siteService.create(formData);
      }
      await fetchSites();
      resetForm();
    } catch (error) {
      console.error('Error saving site:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await siteService.delete(id);
      await fetchSites();
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gradient-to-br from-slate-50 via-green-50 to-slate-100 p-8 min-h-screen">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-12 animate-fade-in">
              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-gradient-to-br from-green-500 via-green-600 to-green-700 text-white p-4 rounded-2xl shadow-lg transform hover:scale-110 transition-all duration-300">
                    <Briefcase size={32} />
                  </div>
                  <div>
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-1">Sites</h2>
                    <p className="text-gray-600 text-lg">Manage construction sites and projects</p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="relative bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 text-white px-8 py-4 rounded-xl flex items-center space-x-3 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 group overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></span>
                <Plus size={22} className="group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-semibold text-lg">Add Site</span>
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-2xl shadow-2xl p-10 mb-8 border-t-4 border-green-600 backdrop-blur-lg bg-opacity-95 animate-slide-in">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 rounded-lg">
                    <span className="text-2xl">{editingId ? '✏️' : '➕'}</span>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {editingId ? 'Edit Site Details' : 'Create New Site'}
                  </h3>
                </div>

                <div className="border-b-2 border-gray-100 mb-8"></div>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Highway Bridge Construction"
                      value={formData.projectName}
                      onChange={(e) =>
                        setFormData({ ...formData, projectName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location *</label>
                    <input
                      type="text"
                      placeholder="e.g., Mumbai, Maharashtra"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Date (Optional)</label>
                    <input
                      type="date"
                      placeholder="Expected completion date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Client Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., ABC Infrastructure Ltd."
                      value={formData.clientName}
                      onChange={(e) =>
                        setFormData({ ...formData, clientName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Budget (₹) *</label>
                    <input
                      type="number"
                      placeholder="e.g., 500000"
                      value={formData.budget || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          budget: parseFloat(e.target.value || 0),
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Total Workers Required *</label>
                    <input
                      type="number"
                      placeholder="e.g., 25"
                      value={formData.totalWorkers || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          totalWorkers: parseInt(e.target.value || 0, 10),
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supervisor Name</label>
                    <input
                      type="text"
                      placeholder="e.g., John Doe"
                      value={formData.supervisorName}
                      onChange={(e) =>
                        setFormData({ ...formData, supervisorName: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Supervisor Phone</label>
                    <input
                      type="tel"
                      placeholder="e.g., +91 98765 43210"
                      value={formData.supervisorPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, supervisorPhone: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Project Status *</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all bg-white"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      placeholder="Additional details about the project (scope, challenges, notes, etc.)"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
                      rows={4}
                    />
                  </div>

                  <div className="md:col-span-2 flex space-x-3">
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
                    >
                      {editingId ? '📝 Update Site' : '➕ Create Site'}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-semibold transition-all"
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <p className="text-center text-gray-600">Loading sites...</p>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Project</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Location</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Client</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Budget</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sites.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-4 text-center text-gray-600">
                          No sites found
                        </td>
                      </tr>
                    ) : (
                      sites.map((site) => (
                        <tr key={site.id} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">{site.projectName}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{site.location}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{site.clientName}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">₹{site.budget}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{site.status}</td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleEdit(site)}
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => site.id && handleDelete(site.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))
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

