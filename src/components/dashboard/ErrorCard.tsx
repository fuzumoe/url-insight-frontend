import React from 'react';
import Typography from '../common/Typography';

type ErrorCardProps = {
  errorCode: string | number;
  title: string;
  description?: string;
  children?: React.ReactNode;
};

const ErrorCard: React.FC<ErrorCardProps> = ({
  errorCode,
  title,
  description,
  children,
}) => (
  <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
    <Typography
      variant="h1"
      color="primary"
      weight="bold"
      align="center"
      className="mb-4"
    >
      {errorCode}
    </Typography>

    <Typography variant="h2" weight="semibold" align="center" className="mb-2">
      {title}
    </Typography>

    {description && (
      <Typography
        variant="body2"
        color="secondary"
        align="center"
        className="mb-4"
      >
        {description}
      </Typography>
    )}

    {children}
  </div>
);

export default ErrorCard;
