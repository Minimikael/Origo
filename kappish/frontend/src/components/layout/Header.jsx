import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';

const Header = () => {
  const { user } = useAuth();

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

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <User className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-100">{getUserDisplayName()}</h1>
        </div>
      </div>
    </header>
  );
};

export default Header; 