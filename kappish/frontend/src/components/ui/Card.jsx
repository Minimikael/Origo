import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  hover = false,
  onClick,
  ...props 
}) => {
  return (
    <div
      className={`
        bg-gray-800 rounded-lg border border-gray-700
        ${padding}
        ${hover ? 'hover:bg-gray-750 hover:border-gray-600 transition-colors cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 