import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password });
      const { token, user } = res.data.data;
      if (user.role !== 'admin') throw new Error('Not an admin account');
      authLogin(token, user);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin access only');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg w-96 text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
        <input type="email" placeholder="Admin Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white mb-4" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 rounded-lg bg-gray-700 text-white mb-6" required />
        <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">Login as Admin</button>
      </form>
    </div>
  );
}