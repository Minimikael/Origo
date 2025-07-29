import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocument } from '../context/DocumentContext';
import { useAI } from '../context/AIContext';
import { 
  Home, 
  Save, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  Plus,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Link,
  Image,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Search,
  FileText,
  Target,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Star,
  ExternalLink,
  PlusCircle,
  Search as SearchIcon,
  Shield,
  Copy,
  CheckSquare,
  ChevronDown as ChevronDownIcon,
  RefreshCw,
  Bookmark
} from 'lucide-react';

const Editor = ({ showNavbar, setShowNavbar }) => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { documents, loadDocument, updateDocument } = useDocument();
  const { 
    argumentStrength, 
    suggestions = [], 
    auditSuggestions = [], 
    highlightedText, 
    handleSuggestionClick, 
    clearHighlight,
    generateCitation,
    checkPlagiarism,
    plagiarismResults
  } = useAI();
  
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedModel, setSelectedModel] = useState('source');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [collapsedSections, setCollapsedSections] = useState({
    argumentStrength: false,
    writingAnalysis: false,
    origoAudit: false,
    suggestions: false,
    citations: false,
    plagiarism: false
  });
  
  // Source management state
  const [sources, setSources] = useState([]);
  const [newSource, setNewSource] = useState({ title: '', url: '', author: '', year: '' });
  const [showAddSource, setShowAddSource] = useState(false);
  
  // Research state
  const [researchTopic, setResearchTopic] = useState('');
  const [researchResults, setResearchResults] = useState([]);
  const [isResearching, setIsResearching] = useState(false);
  
  // Agent dropdown state
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [selectedCitationStyle, setSelectedCitationStyle] = useState('APA');
  
  const textareaRef = useRef(null);

  useEffect(() => {
    if (documentId) {
      const document = documents.find(doc => doc.id === documentId);
      if (document) {
        setContent(document.content || '');
        setTitle(document.title || '');
      }
    }
  }, [documentId, documents]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 's':
            e.preventDefault();
            handleSave();
            break;
          case 'b':
            e.preventDefault();
            applyFormatting('bold');
            break;
          case 'i':
            e.preventDefault();
            applyFormatting('italic');
            break;
          case 'u':
            e.preventDefault();
            applyFormatting('underline');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [content]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSave = async () => {
    if (!documentId) return;
    
    setIsSaving(true);
    try {
      await updateDocument(documentId, { content, title });
      setTimeout(() => {
        setIsSaving(false);
        navigate('/'); // Redirect to home page after saving
      }, 1000);
    } catch (error) {
      console.error('Error saving document:', error);
      setIsSaving(false);
    }
  };

  const applyFormatting = (format) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let formattedText = '';

    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'heading1':
        formattedText = `# ${selectedText}`;
        break;
      case 'heading2':
        formattedText = `## ${selectedText}`;
        break;
      case 'bullet':
        formattedText = `• ${selectedText}`;
        break;
      case 'numbered':
        formattedText = `1. ${selectedText}`;
        break;
      case 'quote':
        formattedText = `> ${selectedText}`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          formattedText = `[${selectedText}](${url})`;
        } else {
          return;
        }
        break;
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          formattedText = `![${selectedText}](${imageUrl})`;
        } else {
          return;
        }
        break;
    }

    const newContent = content.substring(0, start) + formattedText + content.substring(end);
    setContent(newContent);
    
    // Restore focus and selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + formattedText.length);
    }, 0);
  };

  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: chatInput,
      sender: 'user',
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, newMessage]);
    setChatInput('');

    // Simulate AI response based on selected model
    setTimeout(() => {
      let aiResponse = '';
      switch (selectedModel) {
        case 'source':
          aiResponse = "I found 3 relevant academic sources that could strengthen your argument. Consider citing the recent study by Johnson et al. (2024) on this topic. Their findings directly support your main point about renewable energy adoption.";
          break;
        case 'research':
          aiResponse = "Your research is well-structured, but I noticed you could benefit from more recent data. The 2023 Global Energy Report shows updated statistics that would make your argument more compelling. Would you like me to suggest specific research databases?";
          break;
        case 'document':
          aiResponse = "Your document structure is clear, but I recommend adding a brief methodology section. This would help readers understand your research approach and increase the credibility of your findings.";
          break;
      }

      const aiResponseObj = {
        id: Date.now() + 1,
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponseObj]);
    }, 1000);
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now(),
      text: newNote,
      timestamp: new Date()
    };
    setNotes(prev => [...prev, note]);
    setNewNote('');
  };

  const updateNote = (id, text) => {
    setNotes(prev => prev.map(note => note.id === id ? { ...note, text } : note));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getModelInfo = (model) => {
    switch (model) {
      case 'source':
        return {
          icon: <BookOpen className="w-4 h-4" />,
          title: 'Source Assistant',
          description: 'Find and cite academic sources',
          color: 'text-blue-400'
        };
      case 'research':
        return {
          icon: <Search className="w-4 h-4" />,
          title: 'Research Assistant',
          description: 'Get research insights and data',
          color: 'text-purple-400'
        };
      case 'document':
        return {
          icon: <FileText className="w-4 h-4" />,
          title: 'Document Assistant',
          description: 'Structure and organize your writing',
          color: 'text-green-400'
        };
    }
  };

  // Source management functions
  const addSource = () => {
    if (!newSource.title || !newSource.url) return;
    const source = {
      id: Date.now(),
      ...newSource,
      reliability: 0.8, // Default reliability
      addedAt: new Date()
    };
    setSources(prev => [...prev, source]);
    setNewSource({ title: '', url: '', author: '', year: '' });
    setShowAddSource(false);
  };

  const removeSource = (id) => {
    setSources(prev => prev.filter(source => source.id !== id));
  };

  const findSourcesTogether = () => {
    const newMessage = {
      id: Date.now(),
      text: "Let's find academic sources together. What topic would you like to research?",
      sender: 'ai',
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  // Research functions
  const startResearch = () => {
    if (!researchTopic.trim()) return;
    
    setIsResearching(true);
    setChatMessages(prev => [...prev, {
      id: Date.now(),
      text: `Researching: "${researchTopic}"`,
      sender: 'user',
      timestamp: new Date()
    }]);

    // Simulate research process
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          title: "Academic Study on " + researchTopic,
          authors: "Smith, J. et al.",
          year: "2024",
          journal: "Journal of Research",
          url: "#",
          reliability: 0.95,
          relevance: 0.9,
          summary: "This peer-reviewed study provides comprehensive analysis of the topic with strong methodology."
        },
        {
          id: 2,
          title: "Research Paper: " + researchTopic + " Analysis",
          authors: "Johnson, M. & Brown, A.",
          year: "2023",
          journal: "Academic Review",
          url: "#",
          reliability: 0.88,
          relevance: 0.85,
          summary: "Recent research with updated data and findings relevant to your topic."
        },
        {
          id: 3,
          title: "Systematic Review: " + researchTopic,
          authors: "Davis, R. et al.",
          year: "2024",
          journal: "Meta-Analysis Journal",
          url: "#",
          reliability: 0.92,
          relevance: 0.8,
          summary: "Comprehensive review of existing literature with strong statistical analysis."
        }
      ];

      setResearchResults(mockResults);
      setIsResearching(false);

      const aiResponse = {
        id: Date.now() + 1,
        text: `I found ${mockResults.length} academic sources for "${researchTopic}". Here are the most relevant ones with reliability ratings:`,
        sender: 'ai',
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 2000);
  };

  const getReliabilityColor = (reliability) => {
    if (reliability >= 0.9) return 'text-green-400';
    if (reliability >= 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Citation functions
  const [citations, setCitations] = useState([]);
  const addCitation = (source) => {
    const citation = generateCitation(source, selectedCitationStyle);
    const newCitation = {
      id: Date.now(),
      source,
      citation,
      style: selectedCitationStyle,
      addedAt: new Date()
    };
    setCitations(prev => [...prev, newCitation]);
  };

  const removeCitation = (id) => {
    setCitations(prev => prev.filter(citation => citation.id !== id));
  };

  // Plagiarism checking
  const handlePlagiarismCheck = () => {
    if (!content.trim()) return;
    checkPlagiarism(content);
  };

  const getPlagiarismColor = (score) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Save research source to notes
  const saveResearchToNotes = (source) => {
    const noteContent = `Research Source: ${source.title}\nAuthor: ${source.author}\nYear: ${source.year}\nURL: ${source.url}\nReliability: ${Math.round(source.reliability * 100)}%\n\nSummary: ${source.summary || 'No summary available'}`;
    
    const newNote = {
      id: Date.now(),
      content: noteContent,
      type: 'research',
      source: source,
      createdAt: new Date()
    };
    
    setNotes(prev => [...prev, newNote]);
  };

  // Load more research sources
  const loadMoreSources = () => {
    setIsResearching(true);
    
    // Simulate loading more sources
    setTimeout(() => {
      const additionalSources = [
        {
          id: Date.now() + 1,
          title: 'Additional Research Paper 1',
          author: 'Dr. Smith',
          year: '2024',
          url: '#',
          reliability: 0.92,
          relevance: 0.88,
          summary: 'This paper provides additional insights into the research topic.'
        },
        {
          id: Date.now() + 2,
          title: 'Academic Journal Article 2',
          author: 'Prof. Johnson',
          year: '2023',
          url: '#',
          reliability: 0.89,
          relevance: 0.85,
          summary: 'A comprehensive analysis of the subject matter with detailed methodology.'
        },
        {
          id: Date.now() + 3,
          title: 'Research Study 3',
          author: 'Dr. Williams',
          year: '2024',
          url: '#',
          reliability: 0.87,
          relevance: 0.82,
          summary: 'Recent findings that complement the existing research on this topic.'
        }
      ];
      
      setResearchResults(prev => [...prev, ...additionalSources]);
      setIsResearching(false);
    }, 1500);
  };

  const currentModel = getModelInfo(selectedModel);

  return (
    <div className="h-full w-full flex flex-col bg-gray-900 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-700 bg-gray-800">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </button>
        </div>

        <div className="flex-1 mx-8">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Document title..."
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-secondary flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Rich Text Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => applyFormatting('bold')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormatting('italic')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormatting('underline')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-600 mx-2"></div>
          
          <button
            onClick={() => applyFormatting('heading1')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormatting('heading2')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-600 mx-2"></div>
          
          <button
            onClick={() => applyFormatting('bullet')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormatting('numbered')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormatting('quote')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-600 mx-2"></div>
          
          <button
            onClick={() => applyFormatting('link')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Insert Link"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormatting('image')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </button>
          
          <div className="w-px h-6 bg-gray-600 mx-2"></div>
          
          <button
            onClick={() => applyFormatting('alignLeft')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormatting('alignCenter')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormatting('alignRight')}
            className="p-2 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel (AI Assistant / Notes) */}
        <div className={`collapsible-panel ${leftPanelCollapsed ? 'collapsed' : 'expanded'} flex flex-col`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowAgentDropdown(!showAgentDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-gray-200"
                >
                  <div className="w-4 h-4">
                    {currentModel.icon}
                  </div>
                  <span className="text-sm font-medium">{currentModel.title}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                {showAgentDropdown && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                    <div className="p-2">
                      <button
                        onClick={() => {
                          setSelectedModel('source');
                          setShowAgentDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          selectedModel === 'source' 
                            ? 'bg-blue-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        <span className="text-sm">Source</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedModel('research');
                          setShowAgentDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          selectedModel === 'research' 
                            ? 'bg-purple-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <Search className="w-4 h-4" />
                        <span className="text-sm">Research</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedModel('document');
                          setShowAgentDropdown(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-left transition-colors ${
                          selectedModel === 'document' 
                            ? 'bg-green-600 text-white' 
                            : 'text-gray-300 hover:bg-gray-700'
                        }`}
                      >
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Document/Notes</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button
              onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {leftPanelCollapsed ? <ChevronRight className="w-4 h-4 text-gray-300" /> : <ChevronLeft className="w-4 h-4 text-gray-300" />}
            </button>
          </div>

          {!leftPanelCollapsed && (
            <div className="flex-1 flex flex-col p-4">
              {/* AI Model Info */}
              <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={currentModel.color}>
                    {currentModel.icon}
                  </div>
                  <h4 className="font-semibold text-gray-200">{currentModel.title}</h4>
                </div>
                <p className="text-sm text-gray-400">{currentModel.description}</p>
              </div>

              {selectedModel === 'source' && (
                // Source Management View
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-semibold text-gray-200">Source Management</h4>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => setShowAddSource(!showAddSource)}
                        className="btn-secondary text-xs px-2 py-1"
                      >
                        <PlusCircle className="w-3 h-3 mr-1" />
                        Add Source
                      </button>
                      <button 
                        onClick={findSourcesTogether}
                        className="btn-primary text-xs px-2 py-1"
                      >
                        <SearchIcon className="w-3 h-3 mr-1" />
                        Find Together
                      </button>
                    </div>
                  </div>

                  {showAddSource && (
                    <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-200 mb-2">Add New Source</h5>
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Source title"
                          value={newSource.title}
                          onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full input text-xs"
                        />
                        <input
                          type="text"
                          placeholder="URL"
                          value={newSource.url}
                          onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                          className="w-full input text-xs"
                        />
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            placeholder="Author"
                            value={newSource.author}
                            onChange={(e) => setNewSource(prev => ({ ...prev, author: e.target.value }))}
                            className="flex-1 input text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Year"
                            value={newSource.year}
                            onChange={(e) => setNewSource(prev => ({ ...prev, year: e.target.value }))}
                            className="w-20 input text-xs"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={addSource} className="btn-primary text-xs px-3 py-1">
                            Add Source
                          </button>
                          <button 
                            onClick={() => setShowAddSource(false)}
                            className="btn-secondary text-xs px-3 py-1"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex-1 overflow-y-auto space-y-2">
                    {sources.map(source => (
                      <div key={source.id} className="bg-gray-700 rounded-lg p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-200">{source.title}</h5>
                            <p className="text-xs text-gray-400">{source.author} ({source.year})</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <a 
                                href={source.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                              >
                                <ExternalLink className="w-3 h-3 mr-1" />
                                View Source
                              </a>
                              <span className={`text-xs ${getReliabilityColor(source.reliability)}`}>
                                <Star className="w-3 h-3 inline mr-1" />
                                {Math.round(source.reliability * 100)}% reliable
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => addCitation(source)}
                              className="text-blue-400 hover:text-blue-300 text-xs"
                              title="Add Citation"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeSource(source.id)}
                              className="text-red-400 hover:text-red-300 text-xs"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedModel === 'research' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={researchTopic}
                        onChange={(e) => setResearchTopic(e.target.value)}
                        placeholder="Enter research topic..."
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-400"
                      />
                      <button
                        onClick={startResearch}
                        disabled={!researchTopic.trim() || isResearching}
                        className="btn-primary px-4 py-2 disabled:opacity-50"
                      >
                        <SearchIcon className="w-4 h-4 mr-2" />
                        Research
                      </button>
                      {researchResults.length > 0 && (
                        <button
                          onClick={loadMoreSources}
                          disabled={isResearching}
                          className="btn-secondary px-3 py-2 disabled:opacity-50"
                          title="Load more sources"
                        >
                          <RefreshCw className={`w-4 h-4 ${isResearching ? 'animate-spin' : ''}`} />
                        </button>
                      )}
                    </div>
                    
                    {isResearching && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-300">Researching academic sources...</p>
                      </div>
                    )}
                    
                    {researchResults.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-gray-200">Research Results</h4>
                        {researchResults.map(source => (
                          <div key={source.id} className="bg-gray-700 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h5 className="text-sm font-medium text-gray-200">{source.title}</h5>
                                <p className="text-xs text-gray-400">{source.author} ({source.year})</p>
                                <div className="flex items-center space-x-3 mt-2">
                                  <span className={`text-xs ${getReliabilityColor(source.reliability)}`}>
                                    <Star className="w-3 h-3 inline mr-1" />
                                    {Math.round(source.reliability * 100)}% reliable
                                  </span>
                                  <span className="text-xs text-purple-400">
                                    {Math.round(source.relevance * 100)}% relevant
                                  </span>
                                </div>
                                {source.summary && (
                                  <p className="text-xs text-gray-300 mt-2">{source.summary}</p>
                                )}
                                <div className="flex items-center space-x-2 mt-2">
                                  <a 
                                    href={source.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                                  >
                                    <ExternalLink className="w-3 h-3 mr-1" />
                                    View Source
                                  </a>
                                  <button
                                    onClick={() => addCitation(source)}
                                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center"
                                    title="Add Citation"
                                  >
                                    <Copy className="w-3 h-3 mr-1" />
                                    Cite
                                  </button>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => saveResearchToNotes(source)}
                                  className="text-green-400 hover:text-green-300 text-xs"
                                  title="Save to Notes"
                                >
                                  <Bookmark className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedModel === 'document' ? (
                // Notes View
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                      className="flex-1 input"
                    />
                    <button onClick={addNote} className="btn-primary">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto space-y-3">
                    {notes.map(note => (
                      <div key={note.id} className="bg-gray-700 rounded-lg p-3">
                        <textarea
                          value={note.text}
                          onChange={(e) => updateNote(note.id, e.target.value)}
                          className="w-full bg-transparent text-gray-200 resize-none border-none outline-none"
                          rows={3}
                        />
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-400">
                            {new Date(note.timestamp).toLocaleTimeString()}
                          </span>
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : selectedModel !== 'source' && selectedModel !== 'research' && (
                // Default Chat View
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {chatMessages.map(message => (
                      <div key={message.id} className={`chat-message ${message.sender === 'user' ? 'user' : 'ai'}`}>
                        <div className="flex items-start space-x-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                            message.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                          }`}>
                            {message.sender === 'user' ? 'U' : 'O'}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-200">{message.text}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <form onSubmit={handleChatSubmit} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={`Ask ${currentModel.title}...`}
                      className="flex-1 input"
                    />
                    <button type="submit" className="btn-primary">
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center Document Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-8">
            <div className="max-w-4xl mx-auto relative">
              {highlightedText && (
                <div className="absolute top-0 right-0 z-10">
                  <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 shadow-lg max-w-sm">
                    <h4 className="font-semibold text-gray-200 mb-2">{highlightedText.title}</h4>
                    <p className="text-sm text-gray-300 mb-3">{highlightedText.message}</p>
                    <div className="flex justify-between">
                      <button
                        onClick={highlightedText.action}
                        className="btn-primary text-xs px-3 py-1"
                      >
                        Apply
                      </button>
                      <button
                        onClick={clearHighlight}
                        className="text-gray-400 hover:text-gray-300 text-xs"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing your document..."
                className="w-full h-full bg-gray-800 border border-gray-700 rounded-lg p-6 text-gray-200 placeholder-gray-500 resize-none outline-none focus:ring-2 focus:ring-blue-500"
                style={{ minHeight: '500px' }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel (AI Analysis) */}
        <div className={`collapsible-panel ${rightPanelCollapsed ? 'collapsed' : 'expanded'} flex flex-col`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
            <h3 className="text-lg font-semibold text-gray-100">Origo Analysis</h3>
            <button
              onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              {rightPanelCollapsed ? <ChevronLeft className="w-4 h-4 text-gray-300" /> : <ChevronRight className="w-4 h-4 text-gray-300" />}
            </button>
          </div>

          {!rightPanelCollapsed && (
            <div className="flex-1 p-4 overflow-y-auto">
              {/* Argument Strength */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('argumentStrength')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-gray-200">Argument Strength</span>
                  </div>
                  {collapsedSections.argumentStrength ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </button>
                
                {!collapsedSections.argumentStrength && (
                  <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Overall Score</span>
                      <span className="text-lg font-bold text-blue-400">{argumentStrength || 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${argumentStrength || 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      {(argumentStrength || 0) > 70 ? 'Excellent! Your argument is well-supported with strong evidence.' :
                       (argumentStrength || 0) > 40 ? 'Good start, but consider adding more supporting evidence to strengthen your position.' :
                       'Your argument needs more research and evidence to be convincing.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Writing Analysis */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('writingAnalysis')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-gray-200">Writing Analysis</span>
                  </div>
                  {collapsedSections.writingAnalysis ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </button>
                
                {!collapsedSections.writingAnalysis && (
                  <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                    <div className="space-y-3">
                      <div className="analysis-indicator">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Thesis Statement</span>
                          <span className="text-xs text-green-400">✓ Strong</span>
                        </div>
                      </div>
                      <div className="analysis-indicator">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Evidence & Citations</span>
                          <span className="text-xs text-yellow-400">⚠ Needs more</span>
                        </div>
                      </div>
                      <div className="analysis-indicator">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Critical Analysis</span>
                          <span className="text-xs text-green-400">✓ Good</span>
                        </div>
                      </div>
                      <div className="analysis-indicator">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Research Quality</span>
                          <span className="text-xs text-blue-400">✓ Comprehensive</span>
                        </div>
                      </div>
                      <div className="analysis-indicator">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Writing Structure</span>
                          <span className="text-xs text-green-400">✓ Well-organized</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Origo Audit Panel */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('origoAudit')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-200">Origo Audit</span>
                  </div>
                  {collapsedSections.origoAudit ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </button>
                
                {!collapsedSections.origoAudit && (
                  <div className="mt-2 space-y-2">
                    {(auditSuggestions || []).map(suggestion => (
                      <button
                        key={suggestion.id}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        <div className="flex items-start space-x-2">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            suggestion.type === 'critical' ? 'bg-red-400' : 'bg-yellow-400'
                          }`}></div>
                          <div className="flex-1">
                            <h5 className="text-sm font-medium text-gray-200">{suggestion.title}</h5>
                            <p className="text-xs text-gray-400 mt-1">{suggestion.message}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Suggestions */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('suggestions')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-semibold text-gray-200">Writing Suggestions</span>
                  </div>
                  {collapsedSections.suggestions ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </button>
                
                {!collapsedSections.suggestions && (
                  <div className="mt-2 space-y-2">
                    {(suggestions || []).map((suggestion, index) => (
                      <div key={index} className="p-3 bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-300">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Citations */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('citations')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Copy className="w-4 h-4 text-blue-400" />
                    <span className="text-sm font-semibold text-gray-200">Citations</span>
                  </div>
                  {collapsedSections.citations ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </button>
                
                {!collapsedSections.citations && (
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center space-x-2 mb-3">
                      <select
                        value={selectedCitationStyle}
                        onChange={(e) => setSelectedCitationStyle(e.target.value)}
                        className="bg-gray-600 border border-gray-500 rounded px-2 py-1 text-xs text-gray-200"
                      >
                        <option value="APA">APA</option>
                        <option value="MLA">MLA</option>
                        <option value="Harvard">Harvard</option>
                      </select>
                      <span className="text-xs text-gray-400">Citation Style</span>
                    </div>
                    
                    {citations.map(citation => (
                      <div key={citation.id} className="p-3 bg-gray-700 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-gray-300 mb-1">{citation.citation}</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-400">{citation.style}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(citation.addedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => removeCitation(citation.id)}
                            className="text-red-400 hover:text-red-300 text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    {citations.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-2">
                        No citations added yet. Add sources in the Source Assistant.
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Plagiarism Check */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('plagiarism')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-400" />
                    <span className="text-sm font-semibold text-gray-200">Plagiarism Check</span>
                  </div>
                  {collapsedSections.plagiarism ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </button>
                
                {!collapsedSections.plagiarism && (
                  <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                    {!plagiarismResults ? (
                      <div className="text-center">
                        <button
                          onClick={handlePlagiarismCheck}
                          className="btn-primary text-sm px-4 py-2"
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Check for Plagiarism
                        </button>
                        <p className="text-xs text-gray-400 mt-2">
                          Scan your document for potential plagiarism issues
                        </p>
                      </div>
                    ) : plagiarismResults.isChecking ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-300">Checking for plagiarism...</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-300">Originality Score</span>
                          <span className={`text-lg font-bold ${getPlagiarismColor(plagiarismResults.score)}`}>
                            {plagiarismResults.score}%
                          </span>
                        </div>
                        
                        <div className="w-full bg-gray-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getPlagiarismColor(plagiarismResults.score).replace('text-', 'bg-')}`}
                            style={{ width: `${plagiarismResults.score}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          {plagiarismResults.totalWords} words analyzed
                        </div>
                        
                        {plagiarismResults.issues.length > 0 && (
                          <div className="space-y-2">
                            <h5 className="text-sm font-medium text-gray-200">Issues Found:</h5>
                            {plagiarismResults.issues.map((issue, index) => (
                              <div key={index} className="flex items-start space-x-2">
                                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                  issue.type === 'critical' ? 'bg-red-400' : 'bg-yellow-400'
                                }`}></div>
                                <p className="text-xs text-gray-300">{issue.message}</p>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <button
                          onClick={handlePlagiarismCheck}
                          className="btn-secondary text-xs px-3 py-1 w-full"
                        >
                          Check Again
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor; 