import React from 'react';
import Typography from './Typography';

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  icon?: React.ReactElement;
  className?: string;
  truncate?: boolean;
  typographyProps?: Partial<React.ComponentProps<typeof Typography>>;
}

const TableCell: React.FC<TableCellProps> = ({
  children,
  icon,
  className = '',
  truncate = false,
  typographyProps,
  ...rest
}) => {
  return (
    <td
      className={`px-2 py-1.5 sm:px-4 sm:py-2 ${truncate ? 'max-w-xs' : ''} ${className}`}
      {...rest}
    >
      {icon && (
        <span className="inline-flex mr-1 sm:mr-2">
          {React.cloneElement(icon, {
            className: `w-3.5 h-3.5 sm:w-4 sm:h-4 ${(icon.props as { className?: string }).className || ''}`,
          } as React.HTMLAttributes<HTMLElement>)}
        </span>
      )}
      {typographyProps ? (
        <Typography
          {...typographyProps}
          className={
            truncate
              ? `truncate ${typographyProps.className || ''}`
              : typographyProps.className
          }
        >
          {children}
        </Typography>
      ) : (
        <span className={truncate ? 'truncate block' : ''}>{children}</span>
      )}
    </td>
  );
};

export default TableCell;
