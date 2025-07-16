import React from 'react';
import Typography, { type TypographyProps } from './Typography';
import cx from 'classnames';

export type CardProps = {
  /** Main title of the card */
  title: string;
  /** Optional secondary description text */
  description?: string;
  /** Optional code or number to display prominently (for error cards) */
  prominentText?: string | number;
  /** Card children content */
  children?: React.ReactNode;
  /** Control text alignment within the card */
  align?: 'left' | 'center' | 'right';
  /** Control padding size */
  padding?: 'small' | 'medium' | 'large';
  /** Control maximum width */
  maxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Additional custom classes */
  className?: string;
  /** Typography variant for the title */
  titleVariant?: TypographyProps['variant'];
  /** Typography variant for the description */
  descriptionVariant?: TypographyProps['variant'];
  /** Typography color for the title */
  titleColor?: TypographyProps['color'];
  /** Typography color for the description */
  descriptionColor?: TypographyProps['color'];
  /** Typography weight for the title */
  titleWeight?: TypographyProps['weight'];
};

const Card: React.FC<CardProps> = ({
  title,
  description,
  prominentText,
  children,
  align = 'left',
  padding = 'medium',
  maxWidth = 'none',
  className = '',
  titleVariant = 'h4',
  descriptionVariant = 'body2',
  titleColor = 'default',
  descriptionColor = 'secondary',
  titleWeight = 'semibold',
}) => {
  const paddingClasses = {
    small: 'p-3 sm:p-4',
    medium: 'p-4 sm:p-5 md:p-6',
    large: 'p-6 sm:p-7 md:p-8',
  };

  const maxWidthClasses = {
    none: '',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const cardClasses = cx(
    'bg-white rounded-lg shadow',
    paddingClasses[padding],
    maxWidthClasses[maxWidth],
    alignClasses[align],
    className
  );

  return (
    <div className={cardClasses}>
      {prominentText && (
        <Typography
          variant="h1"
          color="primary"
          weight="bold"
          align={align}
          className="mb-3 sm:mb-4"
        >
          {prominentText}
        </Typography>
      )}

      <Typography
        variant={titleVariant}
        weight={titleWeight}
        color={titleColor}
        align={align}
        className="mb-2 sm:mb-3"
      >
        {title}
      </Typography>

      {description && (
        <Typography
          variant={descriptionVariant}
          color={descriptionColor}
          align={align}
          className="mb-3 sm:mb-4"
        >
          {description}
        </Typography>
      )}

      {children}
    </div>
  );
};

export default Card;
