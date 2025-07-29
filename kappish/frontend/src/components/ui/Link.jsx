import React from 'react';
import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';

const Link = ({
  children,
  variant = 'primary',
  href,
  to,
  external = false,
  className = '',
  ...props
}) => {
  // Variant classes
  const variantClasses = {
    primary: 'link-primary',
    secondary: 'link-secondary',
    tertiary: 'link-tertiary'
  };
  
  // Combine classes
  const linkClasses = [variantClasses[variant], className].filter(Boolean).join(' ');
  
  // External link props
  const externalProps = external ? {
    target: '_blank',
    rel: 'noopener noreferrer'
  } : {};
  
  // Render as router link if 'to' prop is provided
  if (to) {
    return (
      <RouterLink to={to} className={linkClasses} {...props}>
        {children}
      </RouterLink>
    );
  }
  
  // Render as external link if external prop is true
  if (external) {
    return (
      <a href={href} className={linkClasses} {...externalProps} {...props}>
        {children}
      </a>
    );
  }
  
  // Default anchor link
  return (
    <a href={href} className={linkClasses} {...props}>
      {children}
    </a>
  );
};

Link.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'tertiary']),
  href: PropTypes.string,
  to: PropTypes.string,
  external: PropTypes.bool,
  className: PropTypes.string
};

export default Link; 