import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, User, LogOut, Settings, ChevronDown } from 'lucide-react';
import Button from '../ui/Button';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
  };

  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-300" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">O</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-100">Origo</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {user ? (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button 
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm text-gray-300 hidden md:block">
                    {user.displayName || user.email}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                    <div className="py-2">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-700">
                        <div className="text-sm font-medium text-gray-200">
                          {user.displayName || 'User'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {user.email}
                        </div>
                      </div>
                      
                      {/* Menu Items */}
                      <div className="py-1">
                        <button
                          onClick={() => {
                            // Navigate to profile
                            setProfileDropdownOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            // Navigate to settings
                            setProfileDropdownOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 transition-colors cursor-not-allowed"
                          disabled
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            // Navigate to support
                            setProfileDropdownOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 transition-colors cursor-not-allowed"
                          disabled
                        >
                          <span className="w-4 h-4">?</span>
                          <span>Support</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            // Navigate to billing
                            setProfileDropdownOpen(false);
                          }}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 transition-colors cursor-not-allowed"
                          disabled
                        >
                          <span className="w-4 h-4">$</span>
                          <span>Billing</span>
                        </button>
                        
                        <div className="border-t border-gray-700 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <Button variant="primary" size="sm">
              Sign In
            </Button>
          )}
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {profileDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setProfileDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header; 