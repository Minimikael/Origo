import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  Archive,
  Filter,
  Edit,
  Trash2,
  MoreVertical,
  Move,
  Tag
} from 'lucide-react';
import {
  Add,
  Search as CarbonSearch,
  Document,
  Time,
  Checkmark,
  Archive as CarbonArchive
} from '@carbon/icons-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { documents, createDocument, deleteDocument, loading } = useDocuments();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [editingDoc, setEditingDoc] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);

  const handleCreateDocument = async () => {
    const newDoc = await createDocument();
    navigate(`/editor/${newDoc.id}`);
  };

  const handleEditDocument = (doc) => {
    setEditingDoc(doc);
  };

  const handleSaveEdit = async (docId, newTitle) => {
    // Update document title
    const updatedDoc = documents.find(d => d.id === docId);
    if (updatedDoc) {
      updatedDoc.title = newTitle;
      // In a real app, you'd save this to the backend
    }
    setEditingDoc(null);
  };

  const handleDeleteDocument = async (docId) => {
    // In a real app, you'd delete from the backend
    console.log('Deleting document:', docId);
    setShowDeleteConfirm(null);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (activeFilter) {
      case 'active':
        return !doc.archived && !doc.completed;
      case 'completed':
        return doc.completed;
      case 'archived':
        return doc.archived;
      default:
        return true;
    }
  });

  const getFilterCount = (filter) => {
    return documents.filter(doc => {
      switch (filter) {
        case 'active':
          return !doc.archived && !doc.completed;
        case 'completed':
          return doc.completed;
        case 'archived':
          return doc.archived;
        default:
          return true;
      }
    }).length;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="h-full w-full bg-gray-900 overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-100">
              Welcome to Origo, {user?.displayName || user?.email?.split('@')[0]}! 👋
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleCreateDocument}
              className="btn-primary flex items-center space-x-2"
            >
              <Add size={16} />
              <span>Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Search and Filter Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <CarbonSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                All ({getFilterCount('all')})
              </button>
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'active'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                Active ({getFilterCount('active')})
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'completed'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                Completed ({getFilterCount('completed')})
              </button>
              <button
                onClick={() => setActiveFilter('archived')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === 'archived'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-700'
                }`}
              >
                Archived ({getFilterCount('archived')})
              </button>
            </div>
          </div>
        </div>
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <Document size={64} className="text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {searchTerm ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Create your first document to get started'
              }
            </p>
            {!searchTerm && (
              <button 
                onClick={handleCreateDocument}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Add size={16} />
                <span>Create Document</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 hover:shadow-xl hover:shadow-gray-900/30 transition-all duration-200 group relative hover:scale-[1.01] shadow-lg shadow-gray-900/40"
              >
                {/* Document Thumbnail */}
                <div 
                  className="h-32 bg-gray-800 border border-gray-600 rounded-t-lg flex items-center justify-center cursor-pointer hover:bg-gray-700 hover:border-gray-500 transition-all duration-200 group-hover:shadow-lg group-hover:shadow-gray-900/20"
                  onClick={() => navigate(`/editor/${doc.id}`)}
                >
                  <div className="text-center text-gray-300">
                    <Document size={32} className="mx-auto mb-2" />
                    <div className="text-xs font-medium opacity-80">
                      {doc.title.substring(0, 20)}
                      {doc.title.length > 20 ? '...' : ''}
                    </div>
                  </div>
                </div>
                
                {/* Action Menu */}
                <div className="absolute top-2 right-2">
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowActionMenu(showActionMenu === doc.id ? null : doc.id);
                      }}
                      className={`p-1 rounded transition-colors ${
                        showActionMenu === doc.id 
                          ? 'bg-gray-700' 
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      title="More actions"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-300" />
                    </button>
                    
                    {showActionMenu === doc.id && (
                      <div 
                        className="absolute right-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditDocument(doc);
                              setShowActionMenu(null);
                            }}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Move to Active
                              setShowActionMenu(null);
                            }}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                          >
                            <Move className="w-4 h-4" />
                            <span>Move to Active</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Move to Completed
                              setShowActionMenu(null);
                            }}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Mark as Completed</span>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Move to Archived
                              setShowActionMenu(null);
                            }}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                          >
                            <Archive className="w-4 h-4" />
                            <span>Move to Archived</span>
                          </button>
                          <div className="border-t border-gray-700 my-1"></div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(doc.id);
                              setShowActionMenu(null);
                            }}
                            className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Document Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        doc.completed ? 'bg-green-400' : 
                        doc.archived ? 'bg-gray-400' : 'bg-blue-400'
                      }`}></div>
                      <h3 className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                        {doc.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mb-3">
                    Updated {formatDate(doc.updatedAt)}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <Time size={12} />
                        <span>{doc.content.split(' ').length} words</span>
                      </div>
                      {doc.aiAnalysis && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Checkmark size={12} />
                          <span>{doc.aiAnalysis.argumentStrength}%</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {doc.completed && (
                        <Checkmark size={16} className="text-green-400" />
                      )}
                      {doc.archived && (
                        <CarbonArchive size={16} className="text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Document Modal */}
      {editingDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Edit Document</h3>
            <input
              type="text"
              value={editingDoc.title}
              onChange={(e) => setEditingDoc({...editingDoc, title: e.target.value})}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200 mb-4"
              placeholder="Document title"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setEditingDoc(null)}
                className="px-4 py-2 text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editingDoc.id, editingDoc.title)}
                className="btn-primary px-4 py-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close action menu */}
      {showActionMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowActionMenu(null);
            }
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Delete Document</h3>
            <p className="text-gray-400 mb-6">Are you sure you want to delete this document? This action cannot be undone.</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-400 hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDocument(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 