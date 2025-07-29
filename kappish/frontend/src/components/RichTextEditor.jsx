import React, { useState, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDocument } from '../../context/DocumentContext';
import { useAI } from '../../context/AIContext';
import { Save, Users, Brain } from 'lucide-react';

const RichTextEditor = ({ documentId }) => {
  const { currentDocument, updateDocument, loadDocument } = useDocument();
  const { aiAnalysis, realTimeFeedback } = useAI();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const quillRef = useRef(null);

  // Load document on mount
  useEffect(() => {
    if (documentId) {
      loadDocument(documentId);
    }
  }, [documentId, loadDocument]);

  // Update local state when document loads
  useEffect(() => {
    if (currentDocument) {
      setContent(currentDocument.content || '');
      setTitle(currentDocument.title || 'Untitled Document');
    }
  }, [currentDocument]);

  // Auto-save functionality
  useEffect(() => {
    if (!content || !currentDocument) return;

    const saveTimeout = setTimeout(async () => {
      setIsSaving(true);
      await updateDocument(currentDocument.id, { content, title });
      setLastSaved(new Date());
      setIsSaving(false);
    }, 2000);

    return () => clearTimeout(saveTimeout);
  }, [content, title, currentDocument, updateDocument]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSave = async () => {
    if (!currentDocument) return;
    
    setIsSaving(true);
    await updateDocument(currentDocument.id, { content, title });
    setLastSaved(new Date());
    setIsSaving(false);
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'blockquote', 'code-block'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'color', 'background',
    'link', 'blockquote', 'code-block'
  ];

  if (!currentDocument) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading document...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0"
            placeholder="Untitled Document"
          />
          
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {isSaving ? (
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <span>Saving...</span>
              </span>
            ) : lastSaved ? (
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            ) : null}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="btn-secondary flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Share</span>
          </button>
          
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 flex">
        {/* Main Editor */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={handleContentChange}
              modules={modules}
              formats={formats}
              placeholder="Start writing your document..."
              className="h-full"
              style={{ height: 'calc(100vh - 200px)' }}
            />
          </div>
        </div>

        {/* AI Feedback Panel */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Brain className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">AI Insights</h3>
          </div>

          {/* Argument Strength */}
          <div className="card p-4 mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Argument Strength</h4>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${realTimeFeedback.argumentStrength}%` }}
                ></div>
              </div>
              <span className="text-sm text-gray-600">
                {realTimeFeedback.argumentStrength}%
              </span>
            </div>
          </div>

          {/* Suggestions */}
          {realTimeFeedback.suggestions.length > 0 && (
            <div className="card p-4 mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Suggestions</h4>
              <ul className="space-y-2">
                {realTimeFeedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                    <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources */}
          {realTimeFeedback.sources.length > 0 && (
            <div className="card p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Suggested Sources</h4>
              <div className="space-y-2">
                {realTimeFeedback.sources.map((source, index) => (
                  <div key={index} className="text-sm">
                    <a 
                      href={source.url} 
                      className="text-primary-600 hover:text-primary-700 font-medium"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {source.title}
                    </a>
                    <div className="text-xs text-gray-500">
                      Relevance: {Math.round(source.relevance * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RichTextEditor; 