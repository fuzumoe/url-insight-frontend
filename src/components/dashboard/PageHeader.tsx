import React from 'react';
import Typography from '../common/Typography';

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
}) => (
  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
    <div>
      <Typography variant="h3" weight="bold" className="mb-1">
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="secondary">
          {subtitle}
        </Typography>
      )}
    </div>

    {actions && <div className="mt-4 md:mt-0">{actions}</div>}
  </div>
);

export default PageHeader;
