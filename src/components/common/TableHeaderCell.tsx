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
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <span>{children}</span>
        {icon && <span className="ml-1">{icon}</span>}
      </div>
    </th>
  );
};

export default TableHeaderCell;
