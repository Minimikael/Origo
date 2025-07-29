import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  MoreHorizontal, 
  Clock, 
  Trash2, 
  Edit,
  CheckCircle,
  Archive,
  Tag
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDocuments } from '../context/DocumentContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { documents, createDocument, deleteDocument, loading } = useDocuments()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showActionMenu, setShowActionMenu] = useState(null)

  // Get user's display name
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name
    }
    if (user?.displayName) {
      return user.displayName
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  const handleCreateDocument = async () => {
    try {
      const newDoc = await createDocument('Untitled Document', '')
      navigate(`/editor/${newDoc.id}`)
    } catch (error) {
      console.error('Error creating document:', error)
    }
  }

  // TODO: Implement document editing functionality

  const handleDeleteDocument = async (docId) => {
    try {
      await deleteDocument(docId)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    return doc.status !== 'deleted'
  })

  const formatDate = (dateString) => {
    if (!dateString) return 'Just now'
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold text-gray-100">
              Welcome to Origo, {getUserDisplayName()}! 👋
            </h1>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={handleCreateDocument}
              className="btn-primary flex items-center space-x-2"
              disabled={loading}
            >
              <Plus size={16} />
              <span>Document</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Documents</p>
                <p className="text-2xl font-bold text-white">{filteredDocuments.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <Archive className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Archived</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Last Updated</p>
                <p className="text-2xl font-bold text-white">
                  {filteredDocuments.length > 0 
                    ? formatDate(filteredDocuments[0].updated_at || filteredDocuments[0].updatedAt)
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-600 rounded-lg">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Total Words</p>
                <p className="text-2xl font-bold text-white">
                  {filteredDocuments.reduce((total, doc) => {
                    const wordCount = doc.content ? doc.content.split(' ').length : 0
                    return total + wordCount
                  }, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-gray-800 rounded-lg">
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-100">Your Documents</h2>
              <button 
                onClick={handleCreateDocument}
                className="btn-primary flex items-center space-x-2 mx-auto"
                disabled={loading}
              >
                <Plus size={16} />
                <span>Create Document</span>
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading documents...</p>
            </div>
          ) : filteredDocuments.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-200 mb-2">No documents yet</h3>
              <p className="text-gray-400 mb-4">Create your first document to get started</p>
              <button 
                onClick={handleCreateDocument}
                className="btn-primary flex items-center space-x-2 mx-auto"
                disabled={loading}
              >
                <Plus size={16} />
                <span>Create Document</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredDocuments.map((doc) => (
                <div key={doc.id} className="p-6 hover:bg-gray-750 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-100 truncate">
                          {doc.title}
                        </h3>
                        {doc.status === 'archived' && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                            Archived
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-3">
                        Updated {formatDate(doc.updated_at || doc.updatedAt)}
                      </p>
                      
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock size={12} />
                          <span>{doc.content ? doc.content.split(' ').length : 0} words</span>
                        </div>
                        {doc.aiAnalysis && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <CheckCircle size={12} />
                            <span>AI analyzed</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => navigate(`/editor/${doc.id}`)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === doc.id ? null : doc.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="More actions"
                        >
                          <MoreHorizontal size={16} />
                        </button>
                        
                        {showActionMenu === doc.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                            <div className="py-1">
                              <button
                                onClick={() => setShowDeleteConfirm(doc.id)}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-gray-700 hover:text-red-300 transition-colors"
                              >
                                <Trash2 size={14} />
                                <span>Delete</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Delete Document</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this document? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteDocument(showDeleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard 