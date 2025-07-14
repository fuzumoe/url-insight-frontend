import React from 'react';

export interface TableCellProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  icon,
  className = '',
}) => {
  return (
    <td className={`px-6 py-4 whitespace-nowrap ${className}`}>
      <div className="flex items-center">
        {icon && <span className="mr-2">{icon}</span>}
        <span className="text-sm text-gray-900">{children}</span>
      </div>
    </td>
  );
};

export default TableCell;
