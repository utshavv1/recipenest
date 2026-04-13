import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/recipenest.png';   
import searchIcon from '../assets/search-icon.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${search}`);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    return '/dashboard';
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="RecipeNest" className="h-8 w-auto" />
            <span className="text-2xl font-bold text-orange-500">RecipeNest</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-orange-500">Home</Link>
            <Link to="/chefs" className="text-gray-700 hover:text-orange-500">Find Chefs</Link>
            {user && (
              <Link to={getDashboardLink()} className="text-gray-700 hover:text-orange-500">
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search recipes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border rounded-full px-4 py-1 pr-8 text-sm w-40 focus:w-64 transition-all focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3">
                <img src={searchIcon} alt="Search" className="w-4 h-4 opacity-60 hover:opacity-100" />
              </button>
            </form>
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to={getDashboardLink()}>
                  <img src={user.avatar || '/default-avatar.png'} alt="profile" className="w-8 h-8 rounded-full object-cover border border-gray-300" />
                </Link>
                <button onClick={logout} className="text-sm bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600">Logout</button>
              </div>
            ) : (
              <div className="space-x-2">
                <Link to="/login" className="text-orange-500 hover:underline">Login</Link>
                <Link to="/register" className="bg-orange-500 text-white px-3 py-1 rounded-full hover:bg-orange-600">Join as Chef</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}