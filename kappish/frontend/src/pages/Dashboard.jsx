import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckSquare, Cake, MoreVertical, Edit, Archive, Trash2, CheckCircle } from 'lucide-react';
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { documents, createDocument, deleteDocument, archiveDocument, restoreDocument, markAsCompleted, loading } = useDocuments();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDocumentTitle, setNewDocumentTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // Close action menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showActionMenu && !event.target.closest('.action-menu')) {
        setShowActionMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActionMenu]);

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
      // Force a complete page refresh to ensure the new document is loaded
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

  const handleDeleteDocument = async (docId, e) => {
    e.stopPropagation();
    setDocumentToDelete(docId);
    setShowDeleteModal(true);
    setShowActionMenu(null);
  };

  const confirmDelete = async () => {
    if (documentToDelete) {
      try {
        await deleteDocument(documentToDelete);
        setShowDeleteModal(false);
        setDocumentToDelete(null);
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDocumentToDelete(null);
  };

  const handleArchiveDocument = async (docId, e) => {
    e.stopPropagation();
    try {
      await archiveDocument(docId);
      setShowActionMenu(null);
    } catch (error) {
      console.error('Error archiving document:', error);
    }
  };

  const handleRestoreDocument = async (docId, e) => {
    e.stopPropagation();
    try {
      await restoreDocument(docId);
      setShowActionMenu(null);
    } catch (error) {
      console.error('Error restoring document:', error);
    }
  };

  const handleMarkAsCompleted = async (docId, e) => {
    e.stopPropagation();
    try {
      await markAsCompleted(docId);
      setShowActionMenu(null);
    } catch (error) {
      console.error('Error marking document as completed:', error);
    }
  };

  // Function to strip HTML tags and get clean text
  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' ||
                      (activeTab === 'active' && doc.status === 'active') ||
                      (activeTab === 'completed' && doc.aiAnalysis) ||
                      (activeTab === 'archived' && doc.status === 'archived');
    return matchesSearch && matchesTab;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-2 flex items-center space-x-2">
          <span>Let's be creative, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}</span>
          <Cake className="w-6 h-6 text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        </h1>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`btn-secondary text-sm ${
                activeTab === 'all'
                  ? '!bg-blue-600 !text-white !border-blue-500'
                  : ''
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`btn-secondary text-sm ${
                activeTab === 'active'
                  ? '!bg-blue-600 !text-white !border-blue-500'
                  : ''
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`btn-secondary text-sm ${
                activeTab === 'completed'
                  ? '!bg-blue-600 !text-white !border-blue-500'
                  : ''
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`btn-secondary text-sm ${
                activeTab === 'archived'
                  ? '!bg-blue-600 !text-white !border-blue-500'
                  : ''
              }`}
            >
              Archived
            </button>
          </div>
        </div>

        <button
          onClick={handleCreateDocument}
          className="btn-primary whitespace-nowrap"
        >
          New Document
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg hover:shadow-gray-700/20 cursor-pointer relative"
            onClick={() => navigate(`/editor/${doc.id}`)}
          >
            {/* Action Menu Button */}
            <div className="absolute top-3 right-3 z-10 action-menu">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActionMenu(showActionMenu === doc.id ? null : doc.id);
                }}
                className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
              >
                <MoreVertical size={16} />
              </button>

              {/* Action Menu Dropdown */}
              {showActionMenu === doc.id && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20 action-menu">
                  <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/editor/${doc.id}`);
                        setShowActionMenu(null);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                    >
                      <Edit size={14} />
                      <span>Edit</span>
                    </button>
                    {doc.status === 'archived' ? (
                      <button
                        onClick={(e) => handleRestoreDocument(doc.id, e)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-blue-400 hover:bg-gray-700 transition-colors"
                      >
                        <Archive size={14} />
                        <span>Restore</span>
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleArchiveDocument(doc.id, e)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-yellow-400 hover:bg-gray-700 transition-colors"
                      >
                        <Archive size={14} />
                        <span>Archive</span>
                      </button>
                    )}
                    {!doc.aiAnalysis && (
                      <button
                        onClick={(e) => handleMarkAsCompleted(doc.id, e)}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-green-400 hover:bg-gray-700 transition-colors"
                      >
                        <CheckSquare size={14} />
                        <span>Mark as Completed</span>
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteDocument(doc.id, e)}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-red-500/20"
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">{doc.title}</h3>
                  <p className="text-gray-400 text-sm line-clamp-2">{stripHtmlTags(doc.content)}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock size={14} />
                    <span>{new Date(doc.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                {doc.aiAnalysis && (
                  <div className="flex items-center space-x-1 text-green-400">
                    <CheckCircle size={14} />
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
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

      {/* Custom Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-700">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-100 mb-4">
                Delete Document
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete this document? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 