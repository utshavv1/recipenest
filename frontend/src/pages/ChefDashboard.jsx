import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRecipes, deleteRecipe, updateProfile, uploadAvatar } from '../services/api';

export default function ChefDashboard() {
  const { user, login } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [profile, setProfile] = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [avatarMessage, setAvatarMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  useEffect(() => {
    if (user) getRecipes({ chefId: user._id }).then(res => setRecipes(res.data.data.recipes));
  }, [user]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this recipe permanently?')) {
      await deleteRecipe(id);
      setRecipes(recipes.filter(r => r._id !== id));
    }
  };

  // Update text profile (name, bio)
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await updateProfile(profile);
      if (res.data.success) {
        const updatedUser = { ...user, ...profile };
        login(localStorage.getItem('token'), updatedUser);
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      setMessage('Update failed. ' + (err.response?.data?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // Handle avatar file selection and preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Upload avatar separately
  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setAvatarMessage('Please select a file first.');
      return;
    }
    setAvatarLoading(true);
    setAvatarMessage('');
    try {
      const res = await uploadAvatar(avatarFile);
      if (res.data.success) {
        // Update user context with new avatar URL
        const updatedUser = { ...user, avatar: res.data.data.avatarUrl };
        login(localStorage.getItem('token'), updatedUser);
        setAvatarMessage('Avatar uploaded successfully!');
        setAvatarFile(null);
        setAvatarPreview(null);
      }
    } catch (err) {
      setAvatarMessage('Avatar upload failed. ' + (err.response?.data?.message || ''));
    } finally {
      setAvatarLoading(false);
    }
  };

  if (!user) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Chef Dashboard</h1>

      {/* Manage Profile Section */}
      <div className="bg-white rounded-2xl shadow-md p-6 mb-10 border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Profile</h2>
        {message && <p className={`mb-4 ${message.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{message}</p>}
        
        {/* Text fields form */}
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Bio (short description)</label>
            <textarea
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows="3"
              placeholder="Tell your culinary story..."
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>

        {/* Avatar upload section */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Profile Picture</h3>
          <div className="flex items-start gap-6 flex-wrap">
            <div>
              {user.avatar ? (
                <img src={user.avatar} alt="Current avatar" className="w-24 h-24 rounded-full object-cover border-2 border-orange-200" />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">No avatar</div>
              )}
              <p className="text-xs text-gray-500 mt-1">Current</p>
            </div>
            {avatarPreview && (
              <div>
                <img src={avatarPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-orange-500" />
                <p className="text-xs text-gray-500 mt-1">New preview</p>
              </div>
            )}
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
              {avatarFile && (
                <button
                  onClick={handleAvatarUpload}
                  disabled={avatarLoading}
                  className="mt-3 bg-orange-500 text-white px-4 py-1 rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
                >
                  {avatarLoading ? 'Uploading...' : 'Upload New Avatar'}
                </button>
              )}
              {avatarMessage && <p className={`mt-2 text-sm ${avatarMessage.includes('✅') ? 'text-green-600' : 'text-red-500'}`}>{avatarMessage}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Your Recipes Section */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/add-recipe" className="bg-orange-50 border-2 border-dashed border-orange-300 rounded-xl p-6 text-center hover:bg-orange-100 transition">
          <div className="text-4xl text-orange-500 mb-2">+</div>
          <p className="text-orange-600 font-medium">Add New Recipe</p>
        </Link>

        {recipes.map(recipe => (
          <div key={recipe._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="relative h-40 bg-gray-100 flex items-center justify-center">
              {recipe.image ? (
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-sm">No image</span>
              )}
              <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold ${recipe.isPublic ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {recipe.isPublic ? 'Published' : 'Draft'}
              </span>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-800">{recipe.title}</h3>
              <div className="flex justify-between items-center mt-3">
                <Link to={`/edit-recipe/${recipe._id}`} className="text-blue-600 text-sm hover:underline">Edit</Link>
                <button onClick={() => handleDelete(recipe._id)} className="text-red-600 text-sm hover:underline">Delete</button>
                <Link to={`/recipes/${recipe._id}`} className="text-orange-500 text-sm hover:underline">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}