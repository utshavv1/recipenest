import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getChefById, getRecipes } from '../services/api';

export default function ChefProfile() {
  const { id } = useParams();
  const [chef, setChef] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    getChefById(id).then(res => setChef(res.data.data.user));
    getRecipes({ chefId: id }).then(res => setRecipes(res.data.data.recipes));
  }, [id]);

  if (!chef) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="w-40 h-40 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
          {chef.avatar ? <img src={chef.avatar} className="w-full h-full object-cover" /> : <span className="text-gray-400">No avatar</span>}
        </div>
        <div>
          <h1 className="text-3xl font-bold">{chef.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-yellow-500">★★★★☆</span> <span className="text-gray-600">4.5 (128 reviews)</span>
          </div>
          <p className="mt-3 text-gray-700">{chef.bio || 'Professional chef sharing authentic recipes.'}</p>
          <button className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600">Follow Chef</button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6">Signature Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <div key={recipe._id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-40 bg-gray-100 flex items-center justify-center">
              {recipe.image ? <img src={recipe.image} className="w-full h-full object-cover" /> : <span className="text-gray-400">No image</span>}
              <span className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">Prep: {recipe.prepTime} min</span>
            </div>
            <div className="p-4">
              <h3 className="font-bold">{recipe.title}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-500">{recipe.cuisine}</span>
                <Link to={`/recipes/${recipe._id}`} className="text-orange-500 text-sm">View Recipe →</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}