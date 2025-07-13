import React from 'react';
import { CgSpinner } from 'react-icons/cg';

type ButtonVariant = 'primary' | 'secondary' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  ...props
}) => {
  const baseStyles =
    'rounded font-medium focus:outline-none focus:ring-2 transition';

  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
    secondary:
      'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-200',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
    xl: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center">
          <CgSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
