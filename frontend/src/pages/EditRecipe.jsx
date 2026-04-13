import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipe, updateRecipe, uploadRecipeImage } from '../services/api';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', ingredients: '', steps: '', prepTime: '', cuisine: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRecipe(id).then(res => {
      const r = res.data.data.recipe;
      setForm({
        title: r.title,
        description: r.description,
        ingredients: r.ingredients.join(', '),
        steps: r.steps.join('\n'),
        prepTime: r.prepTime,
        cuisine: r.cuisine,
        price: r.price || 0
      });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateRecipe(id, form);
      if (image) await uploadRecipeImage(id, image);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border p-3 rounded-lg" required />
        <textarea placeholder="Description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full border p-3 rounded-lg" rows="3" required />
        <textarea placeholder="Ingredients (comma separated)" value={form.ingredients} onChange={e => setForm({...form, ingredients: e.target.value})} className="w-full border p-3 rounded-lg" rows="3" required />
        <textarea placeholder="Steps (one per line)" value={form.steps} onChange={e => setForm({...form, steps: e.target.value})} className="w-full border p-3 rounded-lg" rows="5" required />
        <input type="number" placeholder="Prep Time" value={form.prepTime} onChange={e => setForm({...form, prepTime: e.target.value})} className="w-full border p-3 rounded-lg" required />
        <input placeholder="Cuisine" value={form.cuisine} onChange={e => setForm({...form, cuisine: e.target.value})} className="w-full border p-3 rounded-lg" />
        <input type="file" onChange={e => setImage(e.target.files[0])} className="w-full border p-3 rounded-lg" />
        <button type="submit" disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">
          {loading ? 'Updating...' : 'Update Recipe'}
        </button>
      </form>
    </div>
  );
}