// Import admin icons from assets
import recipesIcon from '../assets/recipe.png';
import chefsIcon from '../assets/chef.png';
import moderationIcon from '../assets/moderation.jpg';
import analyticsIcon from '../assets/analytics.png';
import statusIcon from '../assets/status.jpg';

export default function AdminSidebar({ active, setActive }) {
  const items = [
    { id: 'recipes', label: 'Recipe Management', icon: recipesIcon },
    { id: 'chefs', label: 'Chef Management', icon: chefsIcon },
    { id: 'moderation', label: 'Content Moderation', icon: moderationIcon },
    { id: 'analytics', label: 'Analytics', icon: analyticsIcon },
    { id: 'status', label: 'System Status', icon: statusIcon },
  ];

  return (
    <div className="w-64 bg-gray-800 p-4">
      <h2 className="text-2xl font-bold text-orange-500 mb-6">Admin Panel</h2>
      <ul className="space-y-2">
        {items.map(item => (
          <li key={item.id}>
            <button
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition ${active === item.id ? 'bg-orange-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
            >
              <img src={item.icon} alt={item.label} className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}