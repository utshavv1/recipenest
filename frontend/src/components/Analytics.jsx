import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Analytics() {
  const [data, setData] = useState({ totalRecipes: 0, totalChefs: 0, totalUsers: 0, mostPopularRecipe: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data.data);
      } catch (err) {
        console.error('Analytics fetch failed', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="bg-gray-800 rounded-lg p-4 text-gray-300">Loading analytics...</div>;

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Analytics</h2>
      <div className="space-y-3">
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <span className="text-gray-300">Total Recipes:</span>
          <span className="text-white font-semibold">{data.totalRecipes}</span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <span className="text-gray-300">Total Chefs:</span>
          <span className="text-white font-semibold">{data.totalChefs}</span>
        </div>
        <div className="flex justify-between items-center border-b border-gray-700 pb-2">
          <span className="text-gray-300">Total Users:</span>
          <span className="text-white font-semibold">{data.totalUsers}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Most Popular Recipe:</span>
          <span className="text-orange-400 font-medium">{data.mostPopularRecipe}</span>
        </div>
      </div>
    </div>
  );
}