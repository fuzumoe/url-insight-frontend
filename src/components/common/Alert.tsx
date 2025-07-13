import React, { useState } from 'react';
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from 'react-icons/fi';

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

  return (
    <div
      className={`border-l-4 p-4 rounded-md ${variantStyles[variant]} ${className}`}
      role="alert"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">{iconMap[variant]}</div>
        <div className="ml-3 flex-1">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className={`text-sm ${title ? 'mt-1' : ''}`}>{message}</div>
        </div>
        {dismissible && (
          <button
            type="button"
            className={`ml-auto -mx-1.5 -my-1.5 rounded-md p-1.5 inline-flex focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              variant === 'success'
                ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                : variant === 'error'
                  ? 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                  : variant === 'warning'
                    ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600'
                    : 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600'
            }`}
            onClick={handleDismiss}
            aria-label="Dismiss"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;
