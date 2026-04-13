import { useEffect, useState } from 'react';
import { adminGetAllRecipes, deleteRecipe } from '../services/api';

export default function ManageRecipes() {
  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    adminGetAllRecipes().then(res => setRecipes(res.data.data.recipes));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recipe permanently?')) {
      await deleteRecipe(id);
      setRecipes(recipes.filter(r => r._id !== id));
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">All Recipes</h2>
      <table className="w-full text-left">
        <thead className="border-b border-gray-700">
          <tr><th>Title</th><th>Chef</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {recipes.map(r => (
            <tr key={r._id} className="border-b border-gray-700">
              <td className="py-2">{r.title}</td>
              <td>{r.chef?.name}</td>
              <td>{r.isPublic ? 'Published' : 'Draft'}</td>
              <td><button onClick={() => handleDelete(r._id)} className="text-red-400">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}