import React from 'react';
import PropTypes from 'prop-types';

const Typography = ({
  variant = 'body-medium',
  children,
  className = '',
  as,
  ...props
}) => {
  // Variant to element mapping
  const variantToElement = {
    'heading-1': 'h1',
    'heading-2': 'h2',
    'heading-3': 'h3',
    'heading-4': 'h4',
    'heading-5': 'h5',
    'heading-6': 'h6',
    'body-large': 'p',
    'body-medium': 'p',
    'body-small': 'p',
    'body-xs': 'p',
    'text-xs': 'span',
    'text-sm': 'span',
    'text-base': 'span',
    'text-lg': 'span',
    'text-xl': 'span',
    'text-2xl': 'span',
    'text-3xl': 'span',
    'text-4xl': 'span',
    'text-5xl': 'span',
    'text-6xl': 'span'
  };
  
  // Default element
  const defaultElement = variantToElement[variant] || 'p';
  const Element = as || defaultElement;
  
  // Combine classes
  const typographyClasses = [variant, className].filter(Boolean).join(' ');
  
  return (
    <Element className={typographyClasses} {...props}>
      {children}
    </Element>
  );
};

Typography.propTypes = {
  variant: PropTypes.oneOf([
    'heading-1', 'heading-2', 'heading-3', 'heading-4', 'heading-5', 'heading-6',
    'body-large', 'body-medium', 'body-small', 'body-xs',
    'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 
    'text-3xl', 'text-4xl', 'text-5xl', 'text-6xl'
  ]),
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.string
};

// Convenience components
export const Heading1 = (props) => <Typography variant="heading-1" {...props} />;
export const Heading2 = (props) => <Typography variant="heading-2" {...props} />;
export const Heading3 = (props) => <Typography variant="heading-3" {...props} />;
export const Heading4 = (props) => <Typography variant="heading-4" {...props} />;
export const Heading5 = (props) => <Typography variant="heading-5" {...props} />;
export const Heading6 = (props) => <Typography variant="heading-6" {...props} />;

export const BodyLarge = (props) => <Typography variant="body-large" {...props} />;
export const BodyMedium = (props) => <Typography variant="body-medium" {...props} />;
export const BodySmall = (props) => <Typography variant="body-small" {...props} />;
export const BodyXs = (props) => <Typography variant="body-xs" {...props} />;

export default Typography; 