import React from 'react';
import Typography from '../common/Typography';

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
    <Typography variant="h4" weight="semibold" className="mb-4">
      {title}
    </Typography>

    {description && (
      <Typography variant="body2" color="secondary" className="mb-4">
        {description}
      </Typography>
    )}

    {children}
  </div>
);

export default DashboardCard;
