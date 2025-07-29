import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Base classes
  const baseClasses = 'btn';
  
  // Variant classes
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    tertiary: 'btn-tertiary',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
    ghost: 'btn-ghost'
  };
  
  // Size classes
  const sizeClasses = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
    xl: 'btn-xl'
  };
  
  // Icon button classes
  const iconClasses = icon && !children ? 'btn-icon' : '';
  
  // Loading classes
  const loadingClasses = loading ? 'btn-loading' : '';
  
  // Full width classes
  const fullWidthClasses = fullWidth ? 'w-full' : '';
  
  // Combine all classes
  const buttonClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    iconClasses,
    loadingClasses,
    fullWidthClasses,
    className
  ].filter(Boolean).join(' ');
  
  // Handle click with loading state
  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick?.(e);
  };
  
  // Render icon
  const renderIcon = () => {
    if (!icon) return null;
    
    const iconElement = React.isValidElement(icon) ? icon : <span>{icon}</span>;
    
    return (
      <span className="inline-flex items-center">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : iconElement}
      </span>
    );
  };
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children && <span>{children}</span>}
      {iconPosition === 'right' && renderIcon()}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'ghost']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default Button; 