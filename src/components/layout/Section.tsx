import React from 'react';
import Typography from '../common/Typography';
import Stack from './Stack';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  spacing = 'md',
  className = '',
}) => {
  const spacingClasses = {
    none: '',
    sm: 'py-4 sm:py-6',
    md: 'py-6 sm:py-8',
    lg: 'py-8 sm:py-12',
    xl: 'py-12 sm:py-16',
  };

  const classes = [spacingClasses[spacing], className]
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classes}>
      {(title || subtitle) && (
        <Stack spacing="sm" className="mb-4 sm:mb-6">
          {title && (
            <Typography
              variant="h2"
              as="h2"
              className="text-gray-900 font-bold"
            >
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant="body1" className="text-gray-600">
              {subtitle}
            </Typography>
          )}
        </Stack>
      )}
      {children}
    </section>
  );
};

export default Section;
