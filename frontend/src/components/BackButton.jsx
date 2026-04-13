import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function BackButton({ fallbackPath = '/dashboard' }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-orange-500 transition flex items-center gap-2">
      <FaArrowLeft /> Back
    </button>
  );
}