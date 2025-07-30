import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import { useAI } from '../context/AIContext';
import { validateAndFormatSource, generateCitation, insertCitationAtCursor } from '../utils/urlValidation';
import { 
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
  CheckCircle,
  Lightbulb,
  Star,
  ExternalLink,
  PlusCircle,
  Search as SearchIcon,
  Shield,
  Copy,
  ChevronDown as ChevronDownIcon,
  RefreshCw,
  Bookmark,
  Sun,
  Moon,
  Maximize2,
  Download,
  Home
} from 'lucide-react';

const Editor = () => {
  const { 
    currentDocument,
    selectDocument,
    updateDocument,
    addChatMessage,
    addNote,
    updateNote,
    deleteNote,
    addSource,
    updateDocumentSettings
  } = useDocuments();
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { 
    highlightedText, 
    clearHighlight,
    checkPlagiarism,
    plagiarismResults,
    // Gemini-powered functions
    writingSuggestions,
    isGenerating,
    getWritingSuggestions
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
    writingAnalysis: false,
    writingSuggestions: false,
    citations: false,
    plagiarism: false
  });
  
  // Source management state
  const [sources, setSources] = useState([]);
  const [newSource, setNewSource] = useState({ 
    title: '', 
    url: '', 
    author: '', 
    year: '', 
    journal: '', 
    publisher: '' 
  });
  const [showAddSource, setShowAddSource] = useState(false);
  const [sourceError, setSourceError] = useState('');
  
  // Research state
  const [researchTopic, setResearchTopic] = useState('');
  const [researchResults, setResearchResults] = useState([]);
  const [isResearching, setIsResearching] = useState(false);
  
  // Agent dropdown state
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const [selectedCitationStyle, setSelectedCitationStyle] = useState('APA');
  const [showSharePopup, setShowSharePopup] = useState(false);
  
  // Font and theme state
  const [selectedFont, setSelectedFont] = useState('sans-serif');
  const [selectedWidth, setSelectedWidth] = useState('regular');
  const [theme, setTheme] = useState('dark');
  const [showPageStyleDropdown, setShowPageStyleDropdown] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  
  const textareaRef = useRef(null);

  const handleSave = useCallback(async () => {
    if (!documentId) return;
    
    setIsSaving(true);
    try {
      await updateDocument(documentId, { content, title });
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error('Error saving document:', error);
      setIsSaving(false);
    }
  }, [documentId, content, title, updateDocument]);

  // Auto-save functionality
  useEffect(() => {
    if (!documentId || !content) return;
    
    const autoSaveTimer = setTimeout(() => {
      handleSave();
    }, 3000); // Auto-save after 3 seconds of inactivity
    
    return () => clearTimeout(autoSaveTimer);
  }, [content, title, documentId, handleSave]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Load document when component mounts
  useEffect(() => {
    if (documentId) {
      selectDocument(documentId);
    }
  }, [documentId, selectDocument]);

  // Set content and title when document is loaded
  useEffect(() => {
    if (currentDocument) {
      setContent(currentDocument.content || '');
      setTitle(currentDocument.title || '');
    }
  }, [currentDocument]);

  // Load related data when document data is available
  useEffect(() => {
    if (currentDocument) {
      // Load chat messages
      if (currentDocument.chatMessages) {
        setChatMessages(currentDocument.chatMessages.map(msg => ({
          id: msg.id,
          text: msg.message,
          sender: msg.is_user_message ? 'user' : 'ai',
          timestamp: new Date(msg.created_at)
        })));
      }

      // Load notes
      if (currentDocument.notes) {
        setNotes(currentDocument.notes.map(note => ({
          id: note.id,
          text: note.content,
          timestamp: new Date(note.created_at)
        })));
      }

      // Load sources
      if (currentDocument.sources) {
        setSources(currentDocument.sources.map(source => ({
          id: source.id,
          title: source.title,
          url: source.url,
          reliability: source.reliability_score,
          addedAt: new Date(source.created_at)
        })));
      }
    }
  }, [currentDocument]);

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
          case 'z':
            e.preventDefault();
            // Undo functionality
            document.execCommand('undo');
            break;
          case 'y':
            e.preventDefault();
            // Redo functionality
            document.execCommand('redo');
            break;
          case 'a':
            e.preventDefault();
            // Select all
            document.execCommand('selectAll');
            break;
          default:
            // Handle other key combinations
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [content, handleSave]);

  // Set initial content when component mounts or content changes externally
  useEffect(() => {
    if (textareaRef.current && content && textareaRef.current.innerHTML !== content) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const start = range.startOffset;
      const end = range.endOffset;
      
      textareaRef.current.innerHTML = content;
      
      // Restore cursor position
      if (selection.rangeCount > 0) {
        const newRange = document.createRange();
        newRange.setStart(textareaRef.current.firstChild || textareaRef.current, start);
        newRange.setEnd(textareaRef.current.firstChild || textareaRef.current, end);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    }
  }, [content]);

  const handleContentChange = (e) => {
    const newContent = e.target.innerHTML;
    setContent(newContent);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const applyFormatting = (format) => {
    const editor = textareaRef.current;
    if (!editor) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (!selectedText) {
      // If no text is selected, apply formatting to the current position
      const text = prompt(`Enter text for ${format}:`);
      if (!text) return;
      
      let formattedText = '';
      switch (format) {
        case 'bold':
          formattedText = `<strong>${text}</strong>`;
          break;
        case 'italic':
          formattedText = `<em>${text}</em>`;
          break;
        case 'underline':
          formattedText = `<u>${text}</u>`;
          break;
        case 'heading1':
          formattedText = `<h1>${text}</h1>`;
          break;
        case 'heading2':
          formattedText = `<h2>${text}</h2>`;
          break;
        case 'bullet':
          formattedText = `<li>${text}</li>`;
          break;
        case 'numbered':
          formattedText = `<li>${text}</li>`;
          break;
        case 'quote':
          formattedText = `<blockquote>${text}</blockquote>`;
          break;
        case 'link':
          const url = prompt('Enter URL:');
          if (url) {
            formattedText = `<a href="${url}" target="_blank">${text}</a>`;
          } else {
            return;
          }
          break;
        case 'image':
          const imageUrl = prompt('Enter image URL:');
          if (imageUrl) {
            formattedText = `<img src="${imageUrl}" alt="${text}" style="max-width: 100%; height: auto;" />`;
          } else {
            return;
          }
          break;
        default:
          // Handle unknown format
          break;
      }
      
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formattedText;
      range.insertNode(tempDiv.firstChild);
      setContent(editor.innerHTML);
      return;
    }

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${selectedText}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'heading1':
        formattedText = `<h1>${selectedText}</h1>`;
        break;
      case 'heading2':
        formattedText = `<h2>${selectedText}</h2>`;
        break;
      case 'bullet':
        formattedText = `<li>${selectedText}</li>`;
        break;
      case 'numbered':
        formattedText = `<li>${selectedText}</li>`;
        break;
      case 'quote':
        formattedText = `<blockquote>${selectedText}</blockquote>`;
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) {
          formattedText = `<a href="${url}" target="_blank">${selectedText}</a>`;
        } else {
          return;
        }
        break;
      case 'image':
        const imageUrl = prompt('Enter image URL:');
        if (imageUrl) {
          formattedText = `<img src="${imageUrl}" alt="${selectedText}" style="max-width: 100%; height: auto;" />`;
        } else {
          return;
        }
        break;
      default:
        // Handle unknown format
        break;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = formattedText;
    range.deleteContents();
    range.insertNode(tempDiv.firstChild);
    setContent(editor.innerHTML);
  };

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    try {
      // Save user message to database
      await addChatMessage(documentId, chatInput, true);
      setChatInput('');

      // Generate AI response based on selected model
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
        default:
          aiResponse = "I'm here to help with your document. How can I assist you today?";
          break;
      }

      // Save AI response to database
      await addChatMessage(documentId, aiResponse, false);
    } catch (error) {
      console.error('Error sending chat message:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim() || !documentId) return;
    
    try {
      await addNote(documentId, newNote);
      setNewNote('');
    } catch (error) {
      console.error('Error adding note:', error);
    }
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
        default:
          return {
            icon: <FileText className="w-4 h-4" />,
            title: 'Assistant',
            description: 'General assistance',
            color: 'text-gray-400'
          };
      }
  };

  // Source management functions
  const handleAddSource = async () => {
    if (!newSource.title || !newSource.url) {
      setSourceError('Title and URL are required');
      return;
    }
    
    try {
      // Validate and format the source
      const validatedSource = validateAndFormatSource(newSource);
      
      await addSource(documentId, {
        ...validatedSource,
        reliability_score: 0.8
      });
      
      setNewSource({ 
        title: '', 
        url: '', 
        author: '', 
        year: '', 
        journal: '', 
        publisher: '' 
      });
      setShowAddSource(false);
      setSourceError('');
    } catch (error) {
      console.error('Error adding source:', error);
      setSourceError(error.message);
    }
  };

  const handleCiteSource = (source) => {
    const citation = generateCitation(source, selectedCitationStyle);
    insertCitationAtCursor(citation, textareaRef.current);
  };

  // Font and theme functions
  const pageStyleOptions = [
    { name: 'Regular', value: 'regular' },
    { name: 'Wide', value: 'wide' },
    { name: 'Narrow', value: 'narrow' }
  ];

  const changePageStyle = (style) => {
    setSelectedWidth(style);
    // Update document settings
    if (documentId) {
      updateDocumentSettings(documentId, { page_width: style });
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Apply theme to document element
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Save theme preference
    localStorage.setItem('theme', newTheme);
  };

  // Export function
  const exportToTxt = () => {
    const exportContent = `${title}\n\n${content}`;
    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'document'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Click outside handler for dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFontDropdown && !event.target.closest('.font-dropdown')) {
        setShowFontDropdown(false);
      }
      if (showPageStyleDropdown && !event.target.closest('.page-style-dropdown')) {
        setShowPageStyleDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFontDropdown, showPageStyleDropdown]);

  const removeSource = (id) => {
    setSources(prev => prev.filter(source => source.id !== id));
  };

  // Placeholder for future implementation
  // TODO: Implement source finding functionality

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

  // Citation functions - placeholder for future implementation
  const addCitation = (source) => {
    // TODO: Implement citation functionality
  };

  // TODO: Implement citation removal

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

  // Gemini-powered functions
  const handleGetWritingSuggestions = async () => {
    if (content && content.length > 50) {
      await getWritingSuggestions(content);
    }
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
    <div className="h-screen w-full flex flex-col bg-gray-900 overflow-hidden">
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
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="btn-secondary p-2"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
          <button 
            onClick={() => setShowSharePopup(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>



      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel (AI Assistant / Notes) */}
        <div className={`flex flex-col border-r border-gray-700 transition-all duration-300 ease-in-out ${
          leftPanelCollapsed ? 'w-16' : 'w-80'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
            {!leftPanelCollapsed ? (
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
                              ? 'bg-gray-700 text-white border border-gray-600' 
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
                              ? 'bg-gray-700 text-white border border-gray-600' 
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
                              ? 'bg-gray-700 text-white border border-gray-600' 
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
            ) : (
              <div className="flex items-center justify-center">
                <button
                  onClick={() => setSelectedModel('source')}
                  className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                  title="Source Assistant"
                >
                  <BookOpen className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
            {leftPanelCollapsed && (
              <button
                onClick={() => setLeftPanelCollapsed(false)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </button>
            )}
          </div>

          {!leftPanelCollapsed && (
            <div className="flex-1 flex flex-col bg-gray-800">
              {selectedModel === 'source' && (
                // Source Management View
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
                  <div className="mb-4">
                    <button 
                      onClick={() => setShowAddSource(!showAddSource)}
                      className="w-full btn-secondary px-3 py-2 flex items-center justify-center space-x-2"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Add Source</span>
                    </button>
                  </div>

                  {showAddSource && (
                    <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                      <h5 className="text-sm font-medium text-gray-200 mb-2">Add New Source</h5>
                      {sourceError && (
                        <div className="mb-2 p-2 bg-red-900 border border-red-700 rounded text-red-200 text-xs">
                          {sourceError}
                        </div>
                      )}
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Source title *"
                          value={newSource.title}
                          onChange={(e) => setNewSource(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-gray-200 placeholder-gray-400"
                        />
                        <input
                          type="text"
                          placeholder="URL *"
                          value={newSource.url}
                          onChange={(e) => setNewSource(prev => ({ ...prev, url: e.target.value }))}
                          className="w-full bg-gray-600 border border-gray-500 rounded px-3 py-2 text-gray-200 placeholder-gray-400"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Author"
                            value={newSource.author}
                            onChange={(e) => setNewSource(prev => ({ ...prev, author: e.target.value }))}
                            className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-gray-200 placeholder-gray-400"
                          />
                          <input
                            type="text"
                            placeholder="Year"
                            value={newSource.year}
                            onChange={(e) => setNewSource(prev => ({ ...prev, year: e.target.value }))}
                            className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-gray-200 placeholder-gray-400"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Journal/Publisher"
                            value={newSource.journal}
                            onChange={(e) => setNewSource(prev => ({ ...prev, journal: e.target.value }))}
                            className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-gray-200 placeholder-gray-400"
                          />
                          <input
                            type="text"
                            placeholder="Publisher"
                            value={newSource.publisher}
                            onChange={(e) => setNewSource(prev => ({ ...prev, publisher: e.target.value }))}
                            className="bg-gray-600 border border-gray-500 rounded px-3 py-2 text-gray-200 placeholder-gray-400"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedCitationStyle}
                            onChange={(e) => setSelectedCitationStyle(e.target.value)}
                            className="bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200"
                          >
                            <option value="APA">APA</option>
                            <option value="MLA">MLA</option>
                            <option value="Harvard">Harvard</option>
                          </select>
                          <span className="text-xs text-gray-400">Citation Style</span>
                        </div>
                        <div className="flex space-x-2">
                          <button onClick={handleAddSource} className="btn-primary px-3 py-2">
                            Add Source
                          </button>
                          <button 
                            onClick={() => {
                              setShowAddSource(false);
                              setSourceError('');
                              setNewSource({ 
                                title: '', 
                                url: '', 
                                author: '', 
                                year: '', 
                                journal: '', 
                                publisher: '' 
                              });
                            }}
                            className="btn-secondary px-3 py-2"
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
                              onClick={() => handleCiteSource(source)}
                              className="text-blue-400 hover:text-blue-300 text-xs"
                              title="Insert Citation"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeSource(source.id)}
                              className="text-red-400 hover:text-red-300 text-xs"
                              title="Remove Source"
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
                <div className="flex-1 overflow-y-auto space-y-4 p-4">
                  {/* AI Model Info */}
                  <div className="p-3 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={currentModel.color}>
                        {currentModel.icon}
                      </div>
                      <h4 className="font-semibold text-gray-200">{currentModel.title}</h4>
                    </div>
                    <p className="text-sm text-gray-400">{currentModel.description}</p>
                  </div>
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
                        className="btn-primary px-3 py-2 disabled:opacity-50"
                      >
                        <SearchIcon className="w-4 h-4" />
                      </button>
                    </div>
                    {isResearching && (
                      <div className="text-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-300">Researching academic sources...</p>
                      </div>
                    )}
                    
                    {researchResults.length > 0 && (
                      <div className="space-y-3 flex-1 overflow-y-auto">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-semibold text-gray-200">Research Results</h4>
                          <button
                            onClick={loadMoreSources}
                            disabled={isResearching}
                            className="btn-secondary px-3 py-2 disabled:opacity-50"
                            title="Load more sources"
                          >
                            <RefreshCw className={`w-4 h-4 ${isResearching ? 'animate-spin' : ''}`} />
                          </button>
                        </div>
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
                                  className="text-green-400 hover:text-green-300 p-2 rounded bg-green-400 bg-opacity-10 hover:bg-opacity-20 transition-colors"
                                  title="Save to Notes"
                                >
                                  <Bookmark className="w-4 h-4" />
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
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Add a note..."
                      className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-gray-200 placeholder-gray-400"
                    />
                    <button onClick={handleAddNote} className="btn-primary">
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
                      className="flex-1 bg-gray-600 border border-gray-500 rounded px-3 py-2 text-gray-200 placeholder-gray-400"
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
        <div className="flex-1 flex flex-col bg-gray-800">
          <div className="flex-1 p-8">
            <div className={`mx-auto relative h-full flex flex-col ${
              selectedWidth === 'wide' ? 'max-w-6xl' : 
              selectedWidth === 'narrow' ? 'max-w-2xl' : 
              'max-w-4xl'
            }`}>
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
              
              {/* Rich Text Toolbar */}
              <div className="bg-gray-700 border border-gray-600 rounded-t-lg px-4 py-2 mb-0">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => applyFormatting('bold')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Bold (Ctrl+B)"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting('italic')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Italic (Ctrl+I)"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting('underline')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Underline (Ctrl+U)"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-500 mx-2"></div>
                  
                  <button
                    onClick={() => applyFormatting('heading1')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Heading 1"
                  >
                    <Heading1 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting('heading2')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Heading 2"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-500 mx-2"></div>
                  
                  <button
                    onClick={() => applyFormatting('bullet')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Bullet List"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting('numbered')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Numbered List"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting('quote')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Quote"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-500 mx-2"></div>
                  
                  <button
                    onClick={() => applyFormatting('link')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Insert Link"
                  >
                    <Link className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting('image')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Insert Image"
                  >
                    <Image className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-500 mx-2"></div>
                  
                  <button
                    onClick={() => applyFormatting('alignLeft')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Align Left"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting('alignCenter')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Align Center"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => applyFormatting('alignRight')}
                    className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                    title="Align Right"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  
                  <div className="w-px h-6 bg-gray-500 mx-2"></div>
                  
                  {/* Page Style Dropdown */}
                  <div className="relative page-style-dropdown">
                    <button
                      onClick={() => setShowPageStyleDropdown(!showPageStyleDropdown)}
                      className="p-2 rounded hover:bg-gray-600 text-gray-300 hover:text-white transition-colors flex items-center space-x-1"
                      title="Page Style"
                    >
                      <Maximize2 className="w-4 h-4" />
                      <span className="text-xs">{pageStyleOptions.find(s => s.value === selectedWidth)?.name}</span>
                    </button>
                    {showPageStyleDropdown && (
                      <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 min-w-32">
                        {pageStyleOptions.map((style) => (
                          <button
                            key={style.value}
                            onClick={() => {
                              changePageStyle(style.value);
                              setShowPageStyleDropdown(false);
                            }}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors text-sm ${
                              selectedWidth === style.value ? 'bg-blue-600 text-white' : 'text-gray-200'
                            }`}
                          >
                            {style.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div
                ref={textareaRef}
                contentEditable={true}
                onInput={handleContentChange}
                onBlur={(e) => setContent(e.target.innerHTML)}
                placeholder="Start writing your document..."
                className={`w-full flex-1 bg-gray-900 border border-gray-700 rounded-b-lg p-6 text-gray-200 placeholder-gray-500 resize-none outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto ${
                  selectedFont === 'serif' ? 'font-serif' : 
                  selectedFont === 'mono' ? 'font-mono' : 'font-sans'
                }`}
                style={{ minHeight: '0' }}
              />
            </div>
          </div>
        </div>

        {/* Right Panel (AI Analysis) */}
        <div className={`flex flex-col border-l border-gray-700 transition-all duration-300 ease-in-out ${
          rightPanelCollapsed ? 'w-16' : 'w-80'
        }`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800">
            {!rightPanelCollapsed ? (
              <h3 className="text-lg font-semibold text-gray-100">Origo Analysis</h3>
            ) : (
              <div className="flex items-center justify-center w-full">
                <button
                  className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center hover:scale-110 transition-transform"
                  title="Origo Analysis"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
            {rightPanelCollapsed && (
              <button
                onClick={() => setRightPanelCollapsed(false)}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-300" />
              </button>
            )}
          </div>

          {!rightPanelCollapsed && (
            <div className="flex-1 p-4 overflow-y-auto bg-gray-800">


              {/* Writing Analysis */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('writingAnalysis')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span className="text-sm font-semibold text-gray-200">Writing Analysis</span>
                  </div>
                  {collapsedSections.writingAnalysis ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </button>
                
                {!collapsedSections.writingAnalysis && (
                  <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                    {content && content.length > 50 ? (
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
                    ) : (
                      <div className="text-center">
                        <CheckCircle className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-400 mb-1">No writing analysis yet</p>
                        <p className="text-xs text-gray-500">Write more content to analyze your writing quality</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Writing Suggestions */}
              <div className="mb-4">
                <button
                  onClick={() => toggleSection('writingSuggestions')}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4 text-white" />
                    <span className="text-sm font-semibold text-gray-200">Writing Suggestions</span>
                    {content && content.length > 50 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleGetWritingSuggestions();
                        }}
                        className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                      >
                        {isGenerating ? 'Generating...' : 'Refresh'}
                      </button>
                    )}
                  </div>
                  {collapsedSections.writingSuggestions ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </button>
                
                {!collapsedSections.writingSuggestions && (
                  <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                    {isGenerating ? (
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-sm text-gray-400">Generating writing suggestions...</p>
                      </div>
                    ) : writingSuggestions && writingSuggestions.length > 0 ? (
                      <div className="space-y-3">
                        {writingSuggestions.map((suggestion, index) => (
                          <div key={index} className="suggestion-item">
                            <div className="flex items-start space-x-2">
                              <div className="w-2 h-2 rounded-full mt-1.5 bg-blue-400"></div>
                              <div className="flex-1">
                                <p className="text-sm text-gray-300">{suggestion}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : content && content.length > 50 ? (
                      <div className="text-center">
                        <Lightbulb className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-400 mb-1">Click "Refresh" to get AI-powered writing suggestions</p>
                        <p className="text-xs text-gray-500">Analyzing your content for improvement opportunities</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Lightbulb className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-sm text-gray-400 mb-1">No writing suggestions yet</p>
                        <p className="text-xs text-gray-500">Write more content (50+ characters) to get AI-powered writing suggestions</p>
                      </div>
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
                    <Shield className="w-4 h-4 text-white" />
                    <span className="text-sm font-semibold text-gray-200">Plagiarism Check</span>
                  </div>
                  {collapsedSections.plagiarism ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
                </button>
                
                {!collapsedSections.plagiarism && (
                  <div className="mt-2 p-3 bg-gray-700 rounded-lg">
                    {!plagiarismResults ? (
                      <div className="text-center">
                        {content && content.length > 20 ? (
                          <>
                            <button
                              onClick={handlePlagiarismCheck}
                              className="btn-primary text-sm px-4 py-2 w-full flex items-center justify-center"
                            >
                              <Shield className="w-6 h-6 mr-2" />
                              Check for Plagiarism
                            </button>
                            <p className="text-xs text-gray-400 mt-2">
                              Scan your document for potential plagiarism issues
                            </p>
                          </>
                        ) : (
                          <>
                            <Shield className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                            <p className="text-sm text-gray-400 mb-1">No content to check</p>
                            <p className="text-xs text-gray-500">Write more content to enable plagiarism checking</p>
                          </>
                        )}
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

      {/* Share Popup */}
      {showSharePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Share Document</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Share Link</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={`https://origo.app/share/${documentId}`}
                    readOnly
                    className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200"
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(`https://origo.app/share/${documentId}`)}
                    className="btn-secondary px-3 py-2"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Access Settings</label>
                <select className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-200">
                  <option value="public">Public - Anyone with the link can view</option>
                  <option value="private">Private - Only you can access</option>
                  <option value="restricted">Restricted - Only invited users can access</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Export Options</label>
                <div className="space-y-2">
                  <button
                    onClick={exportToTxt}
                    className="w-full btn-secondary flex items-center justify-center space-x-2 px-3 py-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export as TXT</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowSharePopup(false)}
                  className="px-4 py-2 text-gray-400 hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSharePopup(false)}
                  className="btn-primary px-4 py-2"
                >
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Editor; 