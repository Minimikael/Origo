import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Settings, ChevronDown } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // Add settings functionality here if needed
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
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
    </header>
  );
};

export default Header; 