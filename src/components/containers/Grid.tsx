import React from 'react';

interface GridProps {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: {
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  };
  className?: string;
}

const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = 'md',
  responsive,
  className = '',
}) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    12: 'grid-cols-12',
  };

  const gapClasses = {
    none: '',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const responsiveClasses = [];
  if (responsive?.sm) responsiveClasses.push(`sm:grid-cols-${responsive.sm}`);
  if (responsive?.md) responsiveClasses.push(`md:grid-cols-${responsive.md}`);
  if (responsive?.lg) responsiveClasses.push(`lg:grid-cols-${responsive.lg}`);
  if (responsive?.xl) responsiveClasses.push(`xl:grid-cols-${responsive.xl}`);

  const classes = [
    'grid',
    colsClasses[cols],
    gapClasses[gap],
    ...responsiveClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <div className={classes}>{children}</div>;
};

export default Grid;
