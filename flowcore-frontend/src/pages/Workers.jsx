import { Edit2, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { workerService } from '../services/api';

export const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    skill: '',
    dailyWage: 0,
    joiningDate: new Date().toISOString().split('T')[0],
    active: true,
  });

  useEffect(() => {
    fetchWorkers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchWorkers = async () => {
    try {
      const response = await workerService.getAll();
      if (response.data && response.data.success && response.data.data) {
        setWorkers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await workerService.update(editingId, formData);
        setEditingId(null);
      } else {
        await workerService.create(formData);
      }
      fetchWorkers();
      resetForm();
    } catch (error) {
      console.error('Error saving worker:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await workerService.delete(id);
        fetchWorkers();
      } catch (error) {
        console.error('Error deleting worker:', error);
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
      active: true,
    });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Workers</h2>
              <button
                onClick={() => {
                  setShowForm(true);
                  resetForm();
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center space-x-2 transition"
              >
                <Plus size={20} />
                <span>Add Worker</span>
              </button>
            </div>

            {showForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-xl font-bold mb-4">
                  {editingId ? 'Edit Worker' : 'Add New Worker'}
                </h3>

                <form
                  onSubmit={handleSubmit}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <input
                    type="text"
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Skill (e.g., Electrician, Plumber)"
                    value={formData.skill}
                    onChange={(e) => setFormData({ ...formData, skill: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <input
                    type="number"
                    placeholder="Daily Wage"
                    value={formData.dailyWage}
                    onChange={(e) =>
                      setFormData({ ...formData, dailyWage: parseFloat(e.target.value) })
                    }
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <input
                    type="date"
                    value={formData.joiningDate}
                    onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Aadhaar ID (optional)"
                    value={formData.aadhaarId || ''}
                    onChange={(e) => setFormData({ ...formData, aadhaarId: e.target.value })}
                    className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />

                  <div className="md:col-span-2 flex space-x-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                    >
                      {editingId ? 'Update' : 'Add'} Worker
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
              <p className="text-center text-gray-600">Loading workers...</p>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">Skill</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">
                        Daily Wage
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-800">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-gray-600">
                          No workers found
                        </td>
                      </tr>
                    ) : (
                      workers.map((worker) => (
                        <tr key={worker.id} className="border-t hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-800">{worker.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{worker.phone}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">{worker.skill}</td>
                          <td className="px-6 py-4 text-sm text-gray-800">₹{worker.dailyWage}</td>
                          <td className="px-6 py-4 text-sm">
                            <button
                              onClick={() => handleEdit(worker)}
                              className="text-blue-600 hover:text-blue-800 mr-4"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => worker.id && handleDelete(worker.id)}
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
