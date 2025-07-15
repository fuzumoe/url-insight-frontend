import React from 'react';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption';

export type TypographyColor =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'success'
  | 'warning';

export type TypographyWeight = 'normal' | 'medium' | 'semibold' | 'bold';

export type TypographyAlign = 'left' | 'center' | 'right';

export interface TypographyProps {
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
  gutterBottom?: boolean;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body1',
  color = 'default',
  weight = 'normal',
  align = 'left',
  className = '',
  children,
  as,
  gutterBottom = false,
  ...rest
}) => {
  const Component =
    as ||
    (variant === 'h1'
      ? 'h1'
      : variant === 'h2'
        ? 'h2'
        : variant === 'h3'
          ? 'h3'
          : variant === 'h4'
            ? 'h4'
            : variant === 'h5'
              ? 'h5'
              : variant === 'h6'
                ? 'h6'
                : variant === 'subtitle1' || variant === 'subtitle2'
                  ? 'h6'
                  : 'p');

  // Mobile-first responsive typography
  const variantClasses = {
    h1: 'text-3xl md:text-4xl lg:text-5xl leading-tight',
    h2: 'text-2xl md:text-3xl lg:text-4xl leading-tight',
    h3: 'text-xl md:text-2xl lg:text-3xl leading-tight',
    h4: 'text-lg md:text-xl lg:text-2xl leading-snug',
    h5: 'text-base md:text-lg lg:text-xl leading-snug',
    h6: 'text-sm md:text-base lg:text-lg leading-normal',
    subtitle1: 'text-base md:text-lg leading-relaxed',
    subtitle2: 'text-sm md:text-base leading-relaxed',
    body1: 'text-sm md:text-base leading-relaxed',
    body2: 'text-xs md:text-sm leading-relaxed',
    caption: 'text-xs leading-normal',
  }[variant];

  const colorClasses = {
    default: 'text-gray-900',
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    error: 'text-red-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
  }[color];

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
  }[weight];

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align];

  // Responsive gutterBottom
  const gutterBottomClass = gutterBottom ? 'mb-2 md:mb-3 lg:mb-4' : '';

  return (
    <Component
      className={`${variantClasses} ${colorClasses} ${weightClasses} ${alignClasses} ${gutterBottomClass} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Typography;
