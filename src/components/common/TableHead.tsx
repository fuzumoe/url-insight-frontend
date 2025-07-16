import React from 'react';

export type TableHeadProps = {
  children: React.ReactNode;
  background?: 'primary' | 'secondary' | 'gray' | 'white' | 'transparent';
  className?: string;
};

const TableHead: React.FC<TableHeadProps> = ({
  children,
  background = 'gray',
  className = '',
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
      {children}
    </thead>
  );
};

export default TableHead;
