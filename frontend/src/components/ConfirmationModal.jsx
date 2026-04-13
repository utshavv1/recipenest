export default function ConfirmationModal({ message, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 text-center max-w-sm">
        <div className="text-green-500 text-5xl mb-3">✓</div>
        <h3 className="text-xl font-semibold">Success!</h3>
        <p className="text-gray-600 mt-2">{message}</p>
        <button onClick={onClose} className="mt-4 bg-orange-500 text-white px-6 py-2 rounded-full">Continue</button>
      </div>
    </div>
  );
}