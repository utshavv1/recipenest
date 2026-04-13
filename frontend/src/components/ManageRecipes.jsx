import { useEffect, useState } from 'react';
import { adminGetAllRecipes, deleteRecipe, createRecipe, updateRecipe } from '../services/api';

export default function ManageRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', ingredients: '', steps: '', prepTime: '', cuisine: '' });

  const fetchRecipes = async () => {
    const res = await adminGetAllRecipes();
    setRecipes(res.data.data.recipes);
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recipe permanently?')) {
      await deleteRecipe(id);
      fetchRecipes();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateRecipe(editing._id, form);
    } else {
      await createRecipe(form);
    }
    setShowModal(false);
    setEditing(null);
    fetchRecipes();
  };

  const openEdit = (recipe) => {
    setEditing(recipe);
    setForm({
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients.join(', '),
      steps: recipe.steps.join('\n'),
      prepTime: recipe.prepTime,
      cuisine: recipe.cuisine
    });
    setShowModal(true);
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Recipe Management</h2>
        <button
          onClick={() => { setEditing(null); setForm({ title: '', description: '', ingredients: '', steps: '', prepTime: '', cuisine: '' }); setShowModal(true); }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add Recipe
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-700">
            <tr className="text-gray-300">
              <th className="py-2">Title</th>
              <th>Chef</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map(r => (
              <tr key={r._id} className="border-b border-gray-700">
                <td className="py-2 text-white">{r.title}</td>
                <td className="text-gray-300">{r.chef?.name}</td>
                <td>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${r.isPublic ? 'bg-green-600' : 'bg-yellow-600'}`}>
                    {r.isPublic ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <button onClick={() => openEdit(r)} className="text-blue-400 mr-3 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(r._id)} className="text-red-400 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold mb-4">{editing ? 'Edit Recipe' : 'Create New Recipe'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg p-2" required />
              <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg p-2" rows="2" required />
              <textarea placeholder="Ingredients (comma separated)" value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} className="w-full border rounded-lg p-2" rows="2" required />
              <textarea placeholder="Steps (one per line)" value={form.steps} onChange={e => setForm({...form, steps: e.target.value})} className="w-full border rounded-lg p-2" rows="3" required />
              <input type="number" placeholder="Prep Time (minutes)" value={form.prepTime} onChange={e => setForm({...form, prepTime: e.target.value})} className="w-full border rounded-lg p-2" required />
              <input type="text" placeholder="Cuisine" value={form.cuisine} onChange={e => setForm({...form, cuisine: e.target.value})} className="w-full border rounded-lg p-2" />
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg">Cancel</button>
                <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}