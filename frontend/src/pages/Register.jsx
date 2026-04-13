import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Join as a Chef</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border rounded-lg mb-4" required />
        <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full p-3 border rounded-lg mb-4" required />
        <input type="password" placeholder="Password (min 6 characters)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full p-3 border rounded-lg mb-6" required />
        <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">Register</button>
        <p className="mt-4 text-center">Already have an account? <Link to="/login" className="text-orange-500">Login</Link></p>
      </form>
    </div>
  );
}