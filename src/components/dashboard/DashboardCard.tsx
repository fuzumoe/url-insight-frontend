import React from 'react';

type DashboardCardProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  description,
  children,
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">{title}</h2>
    {description && <p className="text-gray-600 mb-4">{description}</p>}
    {children}
  </div>
);

export default DashboardCard;
