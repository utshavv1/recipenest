import { Link } from 'react-router-dom';

export default function RecipeCard({ recipe }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition flex flex-col h-full">
      <div className="relative h-48 bg-gray-200 flex items-center justify-center">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-sm">No image</span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{recipe.title}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2 flex-grow">{recipe.description}</p>
        <div className="mt-3 flex justify-between items-center">
          <span className="text-orange-500 text-sm font-medium">{recipe.cuisine}</span>
          <span className="text-orange-500 font-semibold">${recipe.price || '0'}</span>
        </div>
        <div className="mt-3 flex justify-center">
          <Link
            to={`/recipes/${recipe._id}`}
            className="inline-block bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-orange-600 transition"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </div>
  );
}