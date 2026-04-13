import { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import ManageRecipes from '../components/ManageRecipes';
import ManageChefs from '../components/ManageChefs';
import Moderation from './Moderation';
import Analytics from '../components/Analytics';
import SystemStatus from '../components/SystemStatus';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('recipes');

  const renderContent = () => {
    switch (activeTab) {
      case 'recipes': return <ManageRecipes />;
      case 'chefs': return <ManageChefs />;
      case 'moderation': return <Moderation />;
      case 'analytics': return <Analytics />;
      case 'status': return <SystemStatus />;
      default: return <ManageRecipes />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <AdminSidebar active={activeTab} setActive={setActiveTab} />
      <div className="flex-1 p-6">{renderContent()}</div>
    </div>
  );
}