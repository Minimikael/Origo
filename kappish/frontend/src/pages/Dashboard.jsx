import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocument } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  Archive,
  Filter
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
  const { documents, createDocument } = useDocument();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const handleCreateDocument = async () => {
    const newDoc = await createDocument();
    navigate(`/editor/${newDoc.id}`);
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
            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
              <CarbonSearch size={20} className="text-gray-400" />
            </button>
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

      {/* Search and Filter Bar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
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

      {/* Documents Grid */}
      <div className="flex-1 p-6 overflow-y-auto">
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
                onClick={() => navigate(`/editor/${doc.id}`)}
                className="bg-gray-800 rounded-lg border border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer group"
              >
                {/* Document Thumbnail */}
                <div className="h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-t-lg flex items-center justify-center">
                  <div className="text-center text-white">
                    <Document size={32} className="mx-auto mb-2" />
                    <div className="text-xs font-medium opacity-80">
                      {doc.title.substring(0, 20)}
                      {doc.title.length > 20 ? '...' : ''}
                    </div>
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
    </div>
  );
};

export default Dashboard; 