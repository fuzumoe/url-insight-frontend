import React, { useEffect } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';
import Typography from './Typography';
import Button from './Button';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  message: string;
  variant: ToastVariant;
  title?: string;
  dismissible?: boolean;
  duration?: number;
  onDismiss: () => void;
  className?: string;
}

const Toast: React.FC<ToastProps> = ({
  message,
  variant,
  title,
  dismissible = true,
  duration = 5000,
  onDismiss,
  className = '',
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss]);

  const variantStyles = {
    success: 'bg-green-50 border-green-500 text-green-800',
    error: 'bg-red-50 border-red-500 text-red-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    info: 'bg-blue-50 border-blue-500 text-blue-800',
  };

  const iconMap = {
    success: <FiCheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />,
    error: <FiAlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />,
    warning: (
      <FiAlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
    ),
    info: <FiInfo className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />,
  };

  const buttonVariantMap = {
    success: 'primary',
    error: 'danger',
    warning: 'secondary',
    info: 'secondary',
  } as const;

  return (
    <div
      className={`flex items-start p-3 sm:p-4 mb-3 sm:mb-4 rounded-md shadow-lg border-l-4 max-w-full sm:max-w-md ${variantStyles[variant]} ${className}`}
      role="alert"
    >
      <div className="flex-shrink-0 pt-0.5">{iconMap[variant]}</div>

      <div className="ml-2 sm:ml-3 flex-1">
        {title && (
          <Typography
            variant="caption"
            as="h3"
            className="font-medium sm:text-sm"
          >
            {title}
          </Typography>
        )}

        <Typography variant="caption" className={title ? 'mt-0.5 sm:mt-1' : ''}>
          {message}
        </Typography>
      </div>

      {dismissible && (
        <Button
          variant={buttonVariantMap[variant]}
          size="sm"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="ml-auto -mx-1 -my-1 p-0 bg-transparent hover:bg-opacity-20 focus:ring-offset-0"
        >
          <FiX className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      )}
    </div>
  );
};

export default Toast;
