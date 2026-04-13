export default function SystemStatus() {
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">System Status</h2>
      <p className="text-green-400">API Server: Online</p>
      <p className="text-green-400">Database: Connected</p>
      <p className="text-green-400">File Storage: Operational</p>
      <p className="text-yellow-400">Last backup: 2 days ago</p>
    </div>
  );
}