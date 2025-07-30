import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Settings, ChevronDown, HelpCircle, Bell } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBellModal, setShowBellModal] = useState(false);
  const [selectedHelpTopic, setSelectedHelpTopic] = useState('');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user's display name from Google auth or email
  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name;
    }
    if (user?.user_metadata?.name) {
      return user.user_metadata.name;
    }
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const helpTopics = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Learn the basics of using Origo for your writing projects.'
    },
    {
      id: 'document-editing',
      title: 'Document Editing',
      description: 'Master the rich text editor and formatting options.'
    },
    {
      id: 'sources-citations',
      title: 'Sources & Citations',
      description: 'How to add sources, manage citations, and use the research assistant.'
    },
    {
      id: 'ai-assistants',
      title: 'AI Assistants',
      description: 'Understanding the different AI assistants and how to use them effectively.'
    },
    {
      id: 'exporting-sharing',
      title: 'Exporting & Sharing',
      description: 'Learn how to export your documents and share them with others.'
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      description: 'Common issues and how to resolve them.'
    }
  ];

  const getHelpContent = (topicId) => {
    const topic = helpTopics.find(t => t.id === topicId);
    if (!topic) return null;
    
    const content = {
      'getting-started': 'Welcome to Origo! Start by creating a new document using the "New Document" button. You can then begin writing and use the various AI assistants to enhance your work.',
      'document-editing': 'Use the rich text editor to format your content. You can apply bold, italic, underline, and other formatting options using the toolbar. The page style dropdown allows you to adjust the width of your editor.',
      'sources-citations': 'Add sources by clicking the "Add Source" button in the source assistant. The research assistant can help you find relevant sources online. Citations can be automatically generated in various styles.',
      'ai-assistants': 'Origo includes several AI assistants: Source Assistant for managing references, Research Assistant for finding sources, Notes Assistant for comments, and Writing Assistant for content suggestions.',
      'exporting-sharing': 'Export your documents as TXT files using the share button. More export formats will be available soon.',
      'troubleshooting': 'If you encounter issues, try refreshing the page or clearing your browser cache. For persistent problems, check your internet connection and ensure you\'re using a supported browser.'
    };
    
    return content[topicId] || 'Content not available for this topic.';
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <svg width="120" height="32" viewBox="0 0 364 97" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M60.6906 64.4399L10.8702 96.0464L7.20715 92.5327L22.7472 65.6167H0.585083V4.98877H60.6906V64.4399ZM5.81165 60.3901H31.7999L17.0509 85.9351L55.464 61.5649V10.2153H5.81165V60.3901Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M132.294 64.4399L82.4738 96.0464L78.8107 92.5327L94.3507 65.6167H72.1886V4.98877H132.294V64.4399ZM77.4152 60.3901H103.403L88.6544 85.9351L127.068 61.5649V10.2153H77.4152V60.3901Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M282.747 19.2153C290.097 19.2155 294.8 22.0572 298.23 26.8589H298.426V20.3911H306.363V68.311C306.363 81.6384 297.544 87.9106 284.118 87.9106C270.987 87.9105 263.539 82.6184 262.657 73.897H270.007C270.791 79.4826 276.083 81.6382 283.923 81.6382C293.232 81.6381 298.426 77.4245 298.426 68.605V61.4517H298.23C294.506 66.2532 290.488 69.2905 283.236 69.2905C270.105 69.2904 261.09 58.8049 261.09 44.2036C261.09 28.4265 270.988 19.2153 282.747 19.2153ZM283.53 25.8784C274.025 25.8786 269.223 33.3268 269.223 44.3022C269.223 55.3756 274.221 62.6274 283.629 62.6274C295.29 62.6273 299.014 54.4934 299.014 43.812C299.014 32.7385 294.31 25.8784 283.53 25.8784Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M179.267 19.1167C194.456 19.1167 203.668 31.0726 203.668 45.772C203.668 60.4713 194.456 72.4272 179.267 72.4272C164.175 72.4272 154.768 60.4713 154.768 45.772C154.768 31.0726 164.175 19.1167 179.267 19.1167ZM179.267 25.6831C168.487 25.6831 162.901 34.6004 162.901 45.772C162.902 56.9435 168.487 65.7632 179.267 65.7632C190.046 65.7632 195.534 56.9435 195.534 45.772C195.534 34.6004 190.046 25.6831 179.267 25.6831Z" fill="white"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M338.797 19.1167C353.986 19.1167 363.198 31.0726 363.198 45.772C363.198 60.4713 353.986 72.4272 338.797 72.4272C323.706 72.4271 314.298 60.4712 314.298 45.772C314.298 31.0727 323.706 19.1169 338.797 19.1167ZM338.797 25.6831C328.018 25.6833 322.432 34.6005 322.432 45.772C322.432 56.9433 328.018 65.763 338.797 65.7632C349.577 65.7632 355.065 56.9435 355.065 45.772C355.065 34.6004 349.577 25.6831 338.797 25.6831Z" fill="white"/>
            <path d="M234.809 19.8032C236.279 19.8032 237.063 19.9991 238.043 20.3911V28.0347H237.749C236.573 27.6427 235.789 27.5444 234.221 27.5444C226.381 27.5446 219.522 33.4247 219.522 42.9302V71.0552H211.584V20.3911H219.522V28.8188H219.718C222.756 23.9191 228.047 19.8034 234.809 19.8032Z" fill="white"/>
            <path d="M253.112 71.0552H245.175V20.3911H253.112V71.0552Z" fill="white"/>
            <path d="M253.112 10.7876H245.175V0.987793H253.112V10.7876Z" fill="white"/>
          </svg>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center space-x-2">
          {/* Help Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Help"
          >
            <HelpCircle size={20} />
          </button>

          {/* Bell Button */}
          <button
            onClick={() => setShowBellModal(true)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Notifications"
          >
            <Bell size={20} />
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings size={20} />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {getUserDisplayName().charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm font-medium">{getUserDisplayName()}</span>
              <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-68 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                <div className="py-2">
                  {/* User Info */}
                  <div className="px-4 py-3 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {getUserDisplayName().charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-100">{getUserDisplayName()}</p>
                        <p className="text-xs text-gray-400">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1">
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Help Center</h2>
              <button
                onClick={() => {
                  setShowHelpModal(false);
                  setSelectedHelpTopic('');
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {helpTopics.map(topic => (
                <button
                  key={topic.id}
                  onClick={() => setSelectedHelpTopic(topic.id)}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    selectedHelpTopic === topic.id
                      ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                      : 'border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <h3 className="font-medium text-white mb-1">{topic.title}</h3>
                  <p className="text-sm text-gray-400">{topic.description}</p>
                </button>
              ))}
            </div>
            
            {selectedHelpTopic && (
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-medium text-white mb-2">
                  {helpTopics.find(t => t.id === selectedHelpTopic)?.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {getHelpContent(selectedHelpTopic)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bell Modal */}
      {showBellModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
              <button
                onClick={() => setShowBellModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">No notifications yet</p>
              <p className="text-sm text-gray-500 mt-2">We'll notify you about important updates</p>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Settings</h2>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center py-8">
              <Settings className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Settings coming soon</p>
              <p className="text-sm text-gray-500 mt-2">Customize your Origo experience</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 