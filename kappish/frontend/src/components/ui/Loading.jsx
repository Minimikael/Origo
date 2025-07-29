import React from 'react';

const Loading = ({ 
  size = 'md',
  text = 'Loading...',
  className = '',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <div className="flex flex-col items-center space-y-2">
        <div
          className={`
            ${sizeClasses[size]} border-2 border-gray-600 border-t-blue-500
            rounded-full animate-spin
          `}
        />
        {text && (
          <p className="text-sm text-gray-400">{text}</p>
        )}
      </div>
    </div>
  );
};

export default Loading; 