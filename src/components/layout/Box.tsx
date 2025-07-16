import React from 'react';

// Create a comprehensive props interface with support for both general HTML and form-specific attributes
interface BoxProps
  extends React.HTMLAttributes<HTMLElement>,
    React.FormHTMLAttributes<HTMLFormElement> {
  children?: React.ReactNode;
  as?: React.ElementType;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  background?: 'transparent' | 'white' | 'gray-50' | 'gray-100' | 'blue-50';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}

const Box: React.FC<BoxProps> = ({
  children,
  as: Component = 'div',
  padding = 'md',
  background = 'transparent',
  shadow = 'none',
  rounded = 'none',
  className = '',
  ...restProps
}) => {
  const paddingClasses = {
    none: '',
    sm: 'p-2 sm:p-3',
    md: 'p-3 sm:p-4',
    lg: 'p-4 sm:p-6',
    xl: 'p-6 sm:p-8',
  };

  const backgroundClasses = {
    transparent: 'bg-transparent',
    white: 'bg-white',
    'gray-50': 'bg-gray-50',
    'gray-100': 'bg-gray-100',
    'blue-50': 'bg-blue-50',
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };

  const classes = [
    paddingClasses[padding],
    backgroundClasses[background],
    shadowClasses[shadow],
    roundedClasses[rounded],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...restProps}>
      {children}
    </Component>
  );
};

export default Box;
