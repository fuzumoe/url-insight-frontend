import React from 'react';
import { Spinner } from '..';
type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  fullWidth = false,
  ...props
}) => {
  const baseStyles =
    'rounded font-medium focus:outline-none focus:ring-2 transition inline-flex items-center justify-center';

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
    secondary:
      'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
  };

  const sizeStyles = {
    sm: 'px-2 py-1 sm:px-2.5 sm:py-1.5',
    md: 'px-3 py-1.5 sm:px-4 sm:py-2',
    lg: 'px-4 py-2 sm:px-5 sm:py-2.5',
    xl: 'px-5 py-2.5 sm:px-6 sm:py-3',
  };

  const spinnerSizeMap = {
    sm: 'sm',
    md: 'sm',
    lg: 'md',
    xl: 'md',
  } as const;

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthClass} ${className}`}
      data-size={size}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Spinner
          size={spinnerSizeMap[size]}
          color={variant === 'secondary' ? 'gray' : 'white'}
          showText={true}
          text="Loading..."
        />
      ) : (
        <span className="inline-flex items-center">{children}</span>
      )}
    </button>
  );
};

export default Button;
