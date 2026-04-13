import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="bg-linear-to-r from-orange-50 to-amber-50 text-center py-20">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
        Nurturing Your Culinary Journey
      </h1>
      <p className="mt-4 text-lg text-gray-600">
        Discover recipes, connect with chefs, and share your passion.
      </p>
      <Link to="/chefs" className="mt-6 inline-block bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600">
        Enter Kitchen
      </Link>
    </section>
  );
}