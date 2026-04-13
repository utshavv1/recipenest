import { useEffect, useState } from 'react';
import { getChefs } from '../services/api';
import ChefCard from '../components/ChefCard';

export default function Chefs() {
  const [chefs, setChefs] = useState([]);
  useEffect(() => {
    getChefs().then(res => setChefs(res.data.data));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-4">Our Professional Chefs</h1>
      <p className="text-center text-gray-600 mb-12">Meet the culinary experts behind the recipes</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {chefs.map(chef => <ChefCard key={chef._id} chef={chef} />)}
      </div>
    </div>
  );
}