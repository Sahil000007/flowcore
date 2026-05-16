import { Edit2, Plus, Trash2 } from 'lucide-react';
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
        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Sites</h2>
              <button
                onClick={() => {
                  setShowForm(true);
                  resetForm();
                  setShowForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition"
              >
                <Plus size={20} />
                <span>Add Site</span>
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {editingId ? 'Edit Site' : 'Add New Site'}
                </h3>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <input
                    type="text"
                    placeholder="Project Name"
                    value={formData.projectName}
                    onChange={(e) =>
                      setFormData({ ...formData, projectName: e.target.value })
                    }
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />

                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  <input
                    type="text"
                    placeholder="Client Name"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Budget"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        budget: parseFloat(e.target.value || 0),
                      })
                    }
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />

                  <input
                    type="number"
                    placeholder="Total Workers"
                    value={formData.totalWorkers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        totalWorkers: parseInt(e.target.value || 0, 10),
                      })
                    }
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />

                  <input
                    type="text"
                    placeholder="Supervisor Name"
                    value={formData.supervisorName}
                    onChange={(e) =>
                      setFormData({ ...formData, supervisorName: e.target.value })
                    }
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  <input
                    type="tel"
                    placeholder="Supervisor Phone"
                    value={formData.supervisorPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, supervisorPhone: e.target.value })
                    }
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <textarea
                    placeholder="Description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600 md:col-span-2"
                    rows={3}
                  />

                  <div className="md:col-span-2 flex space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                      {editingId ? 'Update' : 'Add'} Site
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

