import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClock, FaGlobe, FaDollarSign, FaArrowLeft } from 'react-icons/fa';
import { createRecipe, uploadRecipeImage } from '../services/api';

export default function AddRecipe() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', ingredients: '', steps: '', prepTime: '', cuisine: '', price: ''
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createRecipe(form);
      const recipeId = res.data.data.recipe._id;
      if (image) await uploadRecipeImage(recipeId, image);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-orange-500 transition">
          <FaArrowLeft size={24} />
        </button>
        <h1 className="text-3xl font-bold text-gradient-orange">Create New Recipe</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl shadow-lg p-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border rounded-lg p-3" required />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border rounded-lg p-3" required />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Ingredients (comma separated)</label>
          <textarea rows="3" value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} className="w-full border rounded-lg p-3" required />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Steps (one per line)</label>
          <textarea rows="5" value={form.steps} onChange={e => setForm({...form, steps: e.target.value})} className="w-full border rounded-lg p-3" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
              <FaClock className="text-orange-500" /> Prep Time (min)
            </label>
            <input type="number" value={form.prepTime} onChange={e => setForm({...form, prepTime: e.target.value})} className="w-full border rounded-lg p-3" required />
          </div>
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
              <FaGlobe className="text-orange-500" /> Cuisine
            </label>
            <input type="text" value={form.cuisine} onChange={e => setForm({...form, cuisine: e.target.value})} className="w-full border rounded-lg p-3" placeholder="e.g., Italian" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
              <FaDollarSign className="text-orange-500" /> Price ($)
            </label>
            <input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full border rounded-lg p-3" placeholder="0.00" />
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">Recipe Image</label>
          <input type="file" onChange={e => setImage(e.target.files[0])} className="w-full border rounded-lg p-2" accept="image/*" />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition">
          {loading ? 'Creating...' : 'Create Recipe'}
        </button>
      </form>
    </div>
  );
}