import React from 'react';

export type TableProps = {
  children: React.ReactNode;
  className?: string;
};

const Table: React.FC<TableProps> = ({ children, className = '' }) => (
  <table className={`min-w-full divide-y divide-gray-200 ${className}`.trim()}>
    {children}
  </table>
);

export default Table;
