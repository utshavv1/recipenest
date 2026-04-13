import { Link } from 'react-router-dom';

export default function ChefCard({ chef }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 text-center hover:shadow-lg transition">
      <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
        {chef.avatar ? (
          <img src={chef.avatar} alt={chef.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-400 text-xs">No avatar</span>
        )}
      </div>
      <h3 className="mt-3 text-lg font-semibold">{chef.name}</h3>
      <p className="text-gray-500 text-sm mt-1">{chef.bio?.substring(0, 60) || 'Professional chef'}</p>
      <Link to={`/chefs/${chef._id}`} className="inline-block mt-3 text-orange-500 hover:underline">View Profile →</Link>
    </div>
  );
}