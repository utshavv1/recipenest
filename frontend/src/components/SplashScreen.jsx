import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/recipenest.png';   // import the image

export default function SplashScreen() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => navigate('/home'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="text-center animate-pulse">
        <img src={logo} alt="RecipeNest" className="w-32 h-32 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-orange-500">RecipeNest</h1>
        <p className="text-gray-500 mt-2">Nurturing Your Culinary Journey</p>
      </div>
    </div>
  );
}