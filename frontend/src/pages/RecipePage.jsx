import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaClock, FaGlobe, FaDollarSign, FaArrowLeft } from 'react-icons/fa';
import { getRecipe } from '../services/api';
import ShareModal from '../components/ShareModal';

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    getRecipe(id).then(res => setRecipe(res.data.data.recipe));
  }, [id]);

  if (!recipe) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-500 mb-4">
        <FaArrowLeft /> Back
      </button>

      <div className="relative h-80 bg-gray-200 rounded-xl flex items-center justify-center mb-6">
        {recipe.image ? <img src={recipe.image} className="w-full h-full object-cover rounded-xl" /> : <span>No image</span>}
      </div>
      <h1 className="text-3xl font-bold text-gray-800">{recipe.title}</h1>
      <div className="flex flex-wrap gap-6 mt-4 text-gray-600">
        <div className="flex items-center gap-2"><FaClock className="text-orange-500" /> {recipe.prepTime} min</div>
        <div className="flex items-center gap-2"><FaGlobe className="text-orange-500" /> {recipe.cuisine}</div>
        <div className="flex items-center gap-2"><FaDollarSign className="text-orange-500" /> ${recipe.price || '0'}</div>
      </div>
      <p className="mt-4 text-gray-700">{recipe.description}</p>
      {/* ingredients and steps as before */}
      <button onClick={() => setShowShare(true)} className="mt-8 bg-orange-500 text-white px-6 py-2 rounded-full">Share Recipe</button>
      {showShare && <ShareModal recipe={recipe} onClose={() => setShowShare(false)} />}
    </div>
  );
}