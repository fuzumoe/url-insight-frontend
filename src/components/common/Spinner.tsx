import React from 'react';
import { CgSpinner } from 'react-icons/cg';
import Typography from './Typography';
import { Flex } from '..';

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
  // Mobile-first size classes - smaller on mobile, larger at breakpoints
  const sizeClasses = {
    sm: 'h-3 w-3 sm:h-4 sm:w-4',
    md: 'h-5 w-5 sm:h-6 sm:w-6',
    lg: 'h-6 w-6 sm:h-8 sm:w-8',
    xl: 'h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12',
  };

  const colorClasses = {
    primary: 'text-blue-600',
    white: 'text-white',
    gray: 'text-gray-500',
  };

  // Map spinner colors to Typography colors
  const typographyColor =
    color === 'primary'
      ? 'primary'
      : color === 'white'
        ? 'default'
        : 'secondary';

  return (
    <Flex align="center" justify="center" className={className}>
      <CgSpinner
        className={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
        aria-hidden="true"
      />
      {showText && (
        <Typography
          variant="body2"
          color={typographyColor}
          className="ml-1.5 sm:ml-2 md:ml-3"
        >
          {text}
        </Typography>
      )}
    </Flex>
  );
};

export default Spinner;
