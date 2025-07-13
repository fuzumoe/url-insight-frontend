import React from 'react';
import { CgSpinner } from 'react-icons/cg'; // Codicon spinner icon

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  showText?: boolean;
  text?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  showText = false,
  text = 'Loading...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-500',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <CgSpinner
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        aria-hidden="true"
      />
      {showText && (
        <span className={`ml-2 ${colorClasses[color]}`}>{text}</span>
      )}
    </div>
  );
};

export default Spinner;
