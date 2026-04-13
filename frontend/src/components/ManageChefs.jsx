import { useEffect, useState } from 'react';
import { getAllUsers, deactivateUser, register } from '../services/api';

export default function ManageChefs() {
  const [chefs, setChefs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'chef' });

  const fetchChefs = async () => {
    const res = await getAllUsers();
    setChefs(res.data.data.users.filter(u => u.role === 'chef'));
  };

  useEffect(() => { fetchChefs(); }, []);

  const handleDeactivate = async (id) => {
    if (window.confirm('Deactivate this chef? They will no longer be able to log in.')) {
      await deactivateUser(id);
      fetchChefs();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    setShowModal(false);
    setForm({ name: '', email: '', password: '', role: 'chef' });
    fetchChefs();
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Chef Management</h2>
        <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">+ Add Chef</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-700">
            <tr className="text-gray-300">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {chefs.map(c => (
              <tr key={c._id} className="border-b border-gray-700">
                <td className="py-2 text-white">{c.name}</td>
                <td className="text-gray-300">{c.email}</td>
                <td>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${c.isActive ? 'bg-green-600' : 'bg-red-600'}`}>
                    {c.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  {c.isActive && (
                    <button onClick={() => handleDeactivate(c._id)} className="text-red-400 hover:underline">Deactivate</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for adding chef */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Add New Chef</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border rounded-lg p-2" required />
              <input type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border rounded-lg p-2" required />
              <input type="password" placeholder="Password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border rounded-lg p-2" required />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Create Chef</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}