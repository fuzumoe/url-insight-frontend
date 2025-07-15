import React from 'react';

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
      <h1 className="text-2xl font-bold mb-1">{title}</h1>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
    {actions && <div className="mt-4 md:mt-0">{actions}</div>}
  </div>
);

export default PageHeader;
