import React from 'react';

export type StackProps = {
  children: React.ReactNode;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  direction?: 'row' | 'column';
  className?: string;
};

const Stack: React.FC<StackProps> = ({
  children,
  spacing = 'md',
  align = 'stretch',
  direction = 'column',
  className = '',
}) => {
  // Mapping spacing values to gap classes
  const spacingClasses: Record<NonNullable<StackProps['spacing']>, string> = {
    none: 'gap-0',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const directionClass = direction === 'row' ? 'flex-row' : 'flex-col';

  const alignClasses: Record<NonNullable<StackProps['align']>, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  return (
    <div
      className={`flex ${directionClass} ${spacingClasses[spacing]} ${alignClasses[align]} ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default Stack;
