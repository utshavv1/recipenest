import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecipes, getChefs } from '../services/api';
import RecipeCard from '../components/RecipeCard';
import ChefCard from '../components/ChefCard';

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [chefs, setChefs] = useState([]);

  useEffect(() => {
    getRecipes({ limit: 6 }).then(res => setRecipes(res.data.data.recipes));
    getChefs().then(res => setChefs(res.data.data.slice(0, 4)));
  }, []);

  return (
    <>
      {/* Hero with gradient text and pattern */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-white overflow-hidden py-20">
        <div className="absolute inset-0 bg-hero-pattern opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-gradient-orange">Nurturing</span>{' '}
            <span className="text-gray-800">Your Culinary Journey</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover recipes, connect with chefs, and share your passion.
          </p>
          <Link to="/chefs" className="mt-8 inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition">
            Enter Kitchen
          </Link>
        </div>
      </section>

      {/* Popular Recipes */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Popular Recipes</h2>
            <p className="text-gray-500 mt-1">Most loved by our community</p>
          </div>
          <Link to="/recipes" className="text-orange-500 hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recipes.map(recipe => <RecipeCard key={recipe._id} recipe={recipe} />)}
        </div>
      </section>

      {/* Meet Our Chefs */}
      <section className="bg-gradient-to-r from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">Meet Our Chefs</h2>
            <p className="text-gray-500 mt-1">Passionate experts behind the recipes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {chefs.map(chef => <ChefCard key={chef._id} chef={chef} />)}
          </div>
        </div>
      </section>
    </>
  );
}