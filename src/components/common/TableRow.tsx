import React from 'react';

export type TableRowProps = {
  children: React.ReactNode;
  className?: string;
  variant?:
    | 'default'
    | 'highlight'
    | 'selected'
    | 'error'
    | 'success'
    | 'warning';
  hover?: boolean;
  onClick?: () => void;
};

const TableRow: React.FC<TableRowProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = false,
  onClick,
}) => {
  const variantClasses = {
    default: '',
    highlight: 'bg-yellow-50',
    selected: 'bg-blue-50',
    error: 'bg-red-50',
    success: 'bg-green-50',
    warning: 'bg-orange-50',
  };

  const hoverClass = hover ? 'hover:bg-gray-50 cursor-pointer' : '';

  return (
    <tr
      className={`${variantClasses[variant]} ${hoverClass} ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </tr>
  );
};

export default TableRow;
