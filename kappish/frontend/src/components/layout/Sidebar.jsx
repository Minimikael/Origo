import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../../context/DocumentContext';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Folder,
  CreditCard,
  Settings,
  HelpCircle,
  Home,
  FileText
} from 'lucide-react';
import Button from '../ui/Button';
import Typography, { BodySmall } from '../ui/Typography';

const Sidebar = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { createDocument, documents } = useDocument();

  const handleCreateDocument = async () => {
    const newDoc = await createDocument();
    navigate(`/editor/${newDoc.id}`);
  };

  const workspaceSections = [
    {
      id: 'home',
      label: 'Current Home',
      icon: <Home className="w-5 h-5" />,
      action: () => navigate('/'),
      active: true
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <Folder className="w-5 h-5" />,
      action: () => navigate('/projects'),
      count: documents?.length || 0
    }
  ];

  const workspaceItems = [
    {
      id: 'billing',
      label: 'Billing',
      icon: <CreditCard className="w-5 h-5" />,
      action: () => navigate('/billing'),
      empty: true
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5" />,
      action: () => navigate('/settings')
    }
  ];

  return (
    <div className={`h-full bg-gray-800 border-r border-gray-700 shadow-xl transition-all duration-300 ease-in-out ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      {/* Header with toggle button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">O</span>
            </div>
            <h2 className="text-lg font-bold text-gray-100">Origo</h2>
          </div>
        )}
        <button onClick={onToggle} className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
          {isOpen ? <ChevronLeft className="w-5 h-5 text-gray-300" /> : <ChevronRight className="w-5 h-5 text-gray-300" />}
        </button>
      </div>

      {/* Create New Project Button */}
      <div className="p-4 border-b border-gray-700">
        <Button
          onClick={handleCreateDocument}
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          iconPosition="left"
          fullWidth
        >
          {isOpen && "Create New Project"}
        </Button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto">
        {/* Workspace Section */}
        <div className="p-4">
          {isOpen && (
            <div className="mb-4">
              <BodySmall className="text-gray-400 uppercase tracking-wide">
                Workspace
              </BodySmall>
            </div>
          )}
          
          <div className="space-y-1">
            {workspaceSections.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left ${
                  item.active 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`flex-shrink-0 ${
                    item.active ? 'text-white' : 'text-gray-400'
                  }`}>
                    {item.icon}
                  </div>
                  {isOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
                {isOpen && item.count !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.active 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-600 text-gray-300'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Workspace Items */}
        <div className="p-4 border-t border-gray-700">
          <div className="space-y-1">
            {workspaceItems.map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors text-left text-gray-300 hover:text-gray-200 hover:bg-gray-700`}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 text-gray-400">
                    {item.icon}
                  </div>
                  {isOpen && (
                    <span className="text-sm font-medium">{item.label}</span>
                  )}
                </div>
                {isOpen && item.empty && (
                  <span className="text-xs text-gray-500">(empty)</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Support Link (bottom) */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => navigate('/support')}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors text-left text-gray-300 hover:text-gray-200 hover:bg-gray-700`}
        >
          <HelpCircle className="w-5 h-5 text-gray-400" />
          {isOpen && <span className="text-sm font-medium">Support</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 