import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  HelpCircle 
} from 'lucide-react';
import { useDocuments } from '../../context/DocumentContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { createDocument, documents } = useDocuments();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateDocument = () => {
    setShowCreateModal(true);
  };

  const handleCreateDocumentSubmit = async () => {
    if (!newDocumentTitle.trim()) return;
    
    setIsCreating(true);
    try {
      const newDoc = await createDocument(newDocumentTitle.trim(), '');
      setShowCreateModal(false);
      setNewDocumentTitle('');
      // Refresh the page and then navigate to the new document
      window.location.href = `/editor/${newDoc.id}`;
    } catch (error) {
      console.error('Error creating document:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelCreate = () => {
    setShowCreateModal(false);
    setNewDocumentTitle('');
  };

  const navigation = [
    {
      name: 'Billing',
      href: '/billing',
      icon: CreditCard,
      current: false
    },
    {
      name: 'Help',
      href: '/help',
      icon: HelpCircle,
      current: false
    }
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 flex flex-col">


      {/* New Document Button */}
      <div className="px-4 py-2 pt-6">
        <button
          onClick={handleCreateDocument}
          className="w-full btn-primary"
        >
          New Document
        </button>
      </div>

      {/* Recent Documents */}
      <div className="px-4 py-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Recent Documents</h3>
        <div className="space-y-2">
          {documents.slice(0, 5).map((doc) => (
            <button
              key={doc.id}
              onClick={() => navigate(`/editor/${doc.id}`)}
              className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors truncate"
            >
              {doc.title || 'Untitled Document'}
            </button>
          ))}
        </div>
      </div>

      {/* Workspace */}
      <div className="px-4 py-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Workspace</h3>
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.name}
                href={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Create Document Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-100 mb-4">
                Create New Document
              </h3>
              <div className="mb-6">
                <input
                  type="text"
                  value={newDocumentTitle}
                  onChange={(e) => setNewDocumentTitle(e.target.value)}
                  placeholder="Enter document title..."
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newDocumentTitle.trim()) {
                      handleCreateDocumentSubmit();
                    }
                    if (e.key === 'Escape') {
                      handleCancelCreate();
                    }
                  }}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelCreate}
                  className="flex-1 btn-secondary"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateDocumentSubmit}
                  className="flex-1 btn-primary"
                  disabled={!newDocumentTitle.trim() || isCreating}
                >
                  {isCreating ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </div>
                  ) : (
                    'Create Document'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar; 