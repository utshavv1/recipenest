import { useState } from 'react';

// Import social icons from assets
import facebookIcon from '../assets/facebook.png';
import instagramIcon from '../assets/instagram.jpg';
import whatsappIcon from '../assets/whatsapp.png';
import twitterIcon from '../assets/twitter.png';
import emailIcon from '../assets/email.png';

export default function ShareModal({ recipe, onClose }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/recipes/${recipe._id}`;
  const text = `Check out "${recipe.title}" on RecipeNest!`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    { name: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, icon: facebookIcon },
    { name: 'Instagram', url: `https://www.instagram.com/?url=${encodeURIComponent(shareUrl)}`, icon: instagramIcon },
    { name: 'WhatsApp', url: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`, icon: whatsappIcon },
    { name: 'Twitter', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, icon: twitterIcon },
    { name: 'Email', url: `mailto:?subject=Amazing Recipe&body=${encodeURIComponent(text + '\n\n' + shareUrl)}`, icon: emailIcon },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Share this recipe</h2>
        <p className="text-gray-600 mb-4">{recipe.title}</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {platforms.map(p => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gray-100 p-2 rounded-lg hover:bg-orange-100 transition"
            >
              <img src={p.icon} alt={p.name} className="w-5 h-5" />
              <span>{p.name}</span>
            </a>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={shareUrl} readOnly className="border p-2 flex-1 rounded" />
          <button onClick={copyLink} className="bg-orange-500 text-white px-3 rounded">Copy Link</button>
        </div>
        {copied && <p className="text-green-600 mt-2">Link copied!</p>}
        <button onClick={onClose} className="mt-4 text-gray-500 hover:text-gray-700 w-full">Close</button>
      </div>
    </div>
  );
}