import React from 'react';

export type TableHeaderProps = {
  children: React.ReactNode;
  background?: 'primary' | 'secondary' | 'gray' | 'white' | 'transparent';
  className?: string;
  rowClassName?: string; // Allow styling the tr element
};

const TableHeader: React.FC<TableHeaderProps> = ({
  children,
  background = 'gray',
  className = '',
  rowClassName = '',
}) => {
  const backgroundClasses = {
    primary: 'bg-primary-50',
    secondary: 'bg-secondary-50',
    gray: 'bg-gray-50',
    white: 'bg-white',
    transparent: 'bg-transparent',
  };

  return (
    <thead className={`${backgroundClasses[background]} ${className}`.trim()}>
      <tr className={rowClassName}>{children}</tr>
    </thead>
  );
};

export default TableHeader;
