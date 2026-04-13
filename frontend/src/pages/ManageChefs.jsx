import { useEffect, useState } from 'react';
import { getAllUsers, deactivateUser } from '../services/api';

export default function ManageChefs() {
  const [chefs, setChefs] = useState([]);
  useEffect(() => {
    getAllUsers().then(res => setChefs(res.data.data.users.filter(u => u.role === 'chef')));
  }, []);

  const handleDeactivate = async (id) => {
    if (window.confirm('Deactivate this chef?')) {
      await deactivateUser(id);
      setChefs(chefs.map(c => c._id === id ? { ...c, isActive: false } : c));
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Manage Chefs</h2>
      <table className="w-full text-left">
        <thead className="border-b border-gray-700">
          <tr><th>Name</th><th>Email</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {chefs.map(c => (
            <tr key={c._id} className="border-b border-gray-700">
              <td className="py-2">{c.name}</td>
              <td>{c.email}</td>
              <td>{c.isActive ? 'Active' : 'Inactive'}</td>
              <td>{c.isActive && <button onClick={() => handleDeactivate(c._id)} className="text-red-400">Deactivate</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}