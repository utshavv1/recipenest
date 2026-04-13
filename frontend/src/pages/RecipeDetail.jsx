import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecipe } from '../services/api';
import ShareModal from '../components/ShareModal';

export default function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [showShare, setShowShare] = useState(false);
  useEffect(() => {
    getRecipe(id).then(res => setRecipe(res.data.data.recipe));
  }, [id]);
  if (!recipe) return <div className="text-center py-20">Loading...</div>;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <img src={recipe.image || '/placeholder.jpg'} alt={recipe.title} className="w-full h-80 object-cover rounded-lg" />
      <h1 className="text-3xl font-bold mt-4">{recipe.title}</h1>
      <div className="flex gap-4 mt-2 text-gray-600">
        <span>{recipe.chef.name}</span>
        <span>{recipe.prepTime} min</span>
        <span>{recipe.cuisine}</span>
      </div>
      <p className="mt-4">{recipe.description}</p>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Ingredients</h2>
        <ul className="list-disc list-inside mt-2">
          {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
        </ul>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-semibold">Steps</h2>
        <ol className="list-decimal list-inside mt-2">
          {recipe.steps.map((step, i) => <li key={i}>{step}</li>)}
        </ol>
      </div>
      <button onClick={() => setShowShare(true)} className="mt-6 bg-green-600 text-white px-4 py-2 rounded">Share Recipe</button>
      {showShare && <ShareModal recipe={recipe} onClose={() => setShowShare(false)} />}
    </div>
  );
}