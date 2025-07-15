import React from 'react';

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
    <div className="text-6xl font-bold text-blue-600 mb-4">{errorCode}</div>
    <h2 className="text-2xl font-semibold mb-2">{title}</h2>
    {description && <p className="text-gray-600 mb-4">{description}</p>}
    {children}
  </div>
);

export default ErrorCard;
