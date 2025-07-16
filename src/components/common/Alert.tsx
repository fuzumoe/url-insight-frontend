import React, { useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';
import Typography from './Typography';
import { Button } from '..';

type AlertVariant = 'success' | 'error' | 'warning' | 'info';

interface AlertProps {
  variant: AlertVariant;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  message,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    if (onDismiss) onDismiss();
  };

  const variantStyles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
  };

  const iconMap = {
    success: <FiCheckCircle className="h-5 w-5 text-green-500" />,
    error: <FiAlertCircle className="h-5 w-5 text-red-500" />,
    warning: <FiAlertCircle className="h-5 w-5 text-yellow-500" />,
    info: <FiInfo className="h-5 w-5 text-blue-500" />,
  };

  const typographyColorMap = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'primary',
  } as const;

  // Map button variants based on alert variant
  const buttonVariantMap = {
    success: 'primary',
    error: 'danger',
    warning: 'secondary',
    info: 'secondary',
  } as const;

  // Fix for Tailwind JIT - pre-define all possible hover classes
  const hoverBgClasses = {
    success: 'hover:bg-green-100',
    error: 'hover:bg-red-100',
    warning: 'hover:bg-yellow-100',
    info: 'hover:bg-blue-100',
  };

  return (
    <div
      className={`border-l-4 p-3 sm:p-4 rounded-md ${variantStyles[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">{iconMap[variant]}</div>
        <div className="ml-3 flex-1">
          {title && (
            <Typography
              variant="subtitle2"
              weight="medium"
              color={typographyColorMap[variant]}
            >
              {title}
            </Typography>
          )}
          <Typography
            variant="body2"
            color="secondary"
            className={title ? 'mt-1' : ''}
          >
            {message}
          </Typography>
        </div>
        {dismissible && (
          <Button
            variant={buttonVariantMap[variant]}
            size="sm"
            className={`ml-auto -mr-1.5 -mt-1.5 p-1.5 bg-transparent ${hoverBgClasses[variant]}`}
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <FiX className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default Alert;
