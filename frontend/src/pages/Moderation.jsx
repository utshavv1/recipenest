import { useEffect, useState } from 'react';
import { adminGetAllRecipes } from '../services/api';

export default function Moderation() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    adminGetAllRecipes().then(res => setRecipes(res.data.data.recipes));
  }, []);

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Content Moderation</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-700">
            <tr className="text-gray-300">
              <th className="py-2">Recipe</th>
              <th>Chef</th>
              <th>Status</th>
              <th>Reports</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map(r => (
              <tr key={r._id} className="border-b border-gray-700">
                <td className="py-2 text-white">{r.title}</td>
                <td className="text-gray-300">{r.chef?.name}</td>
                <td>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${r.isPublic ? 'bg-green-600' : 'bg-red-600'}`}>
                    {r.isPublic ? 'Published' : 'Flagged'}
                  </span>
                </td>
                <td className="text-gray-300">{Math.floor(Math.random() * 10)}</td>
                <td>
                  <button className="text-red-400 hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}