export default function SystemStatus() {
  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-white mb-4">System Status</h2>
      <ul className="space-y-3">
        <li className="flex items-center gap-3"><span className="text-green-400"></span> API Server – Online</li>
        <li className="flex items-center gap-3"><span className="text-green-400"></span> Database – Connected</li>
        <li className="flex items-center gap-3"><span className="text-green-400"></span> File Storage – Operational</li>
        <li className="flex items-center gap-3"><span className="text-yellow-400"></span> Last Backup – 2 days ago</li>
        <li className="flex items-center gap-3"><span className="text-green-400"></span> Redis Cache – Active</li>
      </ul>
    </div>
  );
}