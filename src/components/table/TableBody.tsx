import React from 'react';

export type TableBodyProps = {
  children?: React.ReactNode;
  background?: 'white' | 'gray' | 'transparent';
  divider?: boolean;
  dividerColor?: 'gray-200' | 'gray-300' | 'none';
  striped?: boolean;
  stripedColors?: 'gray' | 'blue' | 'none';
  className?: string;
};

const TableBody: React.FC<TableBodyProps> = ({
  children,
  background = 'white',
  divider = true,
  dividerColor = 'gray-200',
  striped = false,
  stripedColors = 'gray',
  className = '',
}) => {
  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    transparent: 'bg-transparent',
  };

  const dividerClasses =
    divider && dividerColor !== 'none' ? `divide-y divide-${dividerColor}` : '';

  // Define striped row classes
  let stripedClasses = '';
  if (striped) {
    switch (stripedColors) {
      case 'gray':
        stripedClasses = 'even:bg-gray-50';
        break;
      case 'blue':
        stripedClasses = 'even:bg-blue-50';
        break;
      default:
        stripedClasses = '';
    }
  }

  return (
    <tbody
      className={`${backgroundClasses[background]} ${dividerClasses} ${stripedClasses} ${className}`.trim()}
    >
      {children}
    </tbody>
  );
};

export default TableBody;
