import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  FileText, 
  Clock, 
  CheckCircle, 
  Archive,
  BookOpen,
  FileImage
} from 'lucide-react'
import { useDocuments } from '../context/DocumentContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const { documents, createDocument, deleteDocument, loading } = useDocuments()
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showActionMenu, setShowActionMenu] = useState(null)

  const handleCreateDocument = async () => {
    try {
      const newDoc = await createDocument('Untitled Document', '')
      navigate(`/editor/${newDoc.id}`)
    } catch (error) {
      console.error('Error creating document:', error)
    }
  }

  const handleDeleteDocument = async (docId) => {
    try {
      await deleteDocument(docId)
      setShowDeleteConfirm(null)
    } catch (error) {
      console.error('Error deleting document:', error)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.content?.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (activeTab === 'all') return doc.status !== 'deleted' && matchesSearch
    if (activeTab === 'active') return doc.status === 'active' && matchesSearch
    if (activeTab === 'archived') return doc.status === 'archived' && matchesSearch
    
    return doc.status !== 'deleted' && matchesSearch
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

  // Generate a simple thumbnail based on document content
  const generateThumbnail = (doc) => {
    const words = doc.content ? doc.content.split(' ').slice(0, 20) : []
    const preview = words.join(' ').substring(0, 100) + (words.length >= 20 ? '...' : '')
    
    return (
      <div className="w-full h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs p-3 text-center">
        {preview || 'Empty document'}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-semibold text-gray-100">Workspace</h1>
            <button 
              onClick={handleCreateDocument}
              className="btn-primary flex items-center space-x-2"
              disabled={loading}
            >
              <Plus size={16} />
              <span>New Project</span>
            </button>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
              <Filter size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800 border-b border-gray-700 px-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            All Documents
          </button>
          <button
            onClick={() => setActiveTab('active')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'active'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'archived'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            Archived
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-400">Loading documents...</span>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-200 mb-2">No documents found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first document to get started'}
            </p>
            {!searchTerm && (
              <button 
                onClick={handleCreateDocument}
                className="btn-primary flex items-center space-x-2 mx-auto"
                disabled={loading}
              >
                <Plus size={16} />
                <span>Create Document</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors overflow-hidden">
                {/* Thumbnail */}
                <div className="p-4">
                  {generateThumbnail(doc)}
                </div>
                
                {/* Document Info */}
                <div className="p-4 pt-0">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-medium text-gray-100 truncate flex-1">
                      {doc.title}
                    </h3>
                    <div className="relative ml-2">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === doc.id ? null : doc.id)}
                        className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      
                      {showActionMenu === doc.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => navigate(`/editor/${doc.id}`)}
                              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                            >
                              <Edit size={14} />
                              <span>Edit</span>
                            </button>
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
                  
                  {/* Stats */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center">
                        <BookOpen size={12} className="mr-1" />
                        Sources
                      </span>
                      <span className="text-gray-300">
                        {doc.sources ? doc.sources.length : 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center">
                        <FileText size={12} className="mr-1" />
                        Words
                      </span>
                      <span className="text-gray-300">
                        {doc.content ? doc.content.split(' ').length : 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 flex items-center">
                        <CheckCircle size={12} className="mr-1" />
                        Process
                      </span>
                      <span className="text-gray-300">
                        {doc.aiAnalysis ? 'Complete' : 'In Progress'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Last Updated */}
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock size={12} className="mr-1" />
                      <span>{formatDate(doc.updated_at || doc.updatedAt)}</span>
                    </div>
                  </div>
                  
                  {/* Open Button */}
                  <div className="mt-3">
                    <button
                      onClick={() => navigate(`/editor/${doc.id}`)}
                      className="w-full btn-secondary text-sm"
                    >
                      Open Document
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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