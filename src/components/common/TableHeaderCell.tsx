import React from 'react';

export interface TableHeaderCellProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const TableHeaderCell: React.FC<TableHeaderCellProps> = ({
  children,
  icon,
  className = '',
  onClick,
}) => {
  return (
    <th
      scope="col"
      className={`px-2 py-1.5 sm:px-6 sm:py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center min-h-[32px] sm:min-h-[40px]">
        <span>{children}</span>
        {icon && (
          <span className="ml-1 sm:ml-2 inline-flex items-center">
            {React.isValidElement(icon)
              ? React.cloneElement(icon, {
                  className: `w-3.5 h-3.5 sm:w-4 sm:h-4 ${(icon.props as { className?: string })?.className || ''}`,
                } as React.HTMLAttributes<HTMLElement>)
              : icon}
          </span>
        )}
      </div>
    </th>
  );
};

export default TableHeaderCell;
