import React from 'react';

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  icon,
  className = '',
  ...rest
}) => {
  return (
    <td className={`px-4 py-2 ${className}`} {...rest}>
      {icon && <span>{icon}</span>}
      {children}
    </td>
  );
};

export default TableCell;
