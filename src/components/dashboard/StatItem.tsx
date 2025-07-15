import React from 'react';

export type StatItemProps = {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
};

const StatItem: React.FC<StatItemProps> = ({
  label,
  value,
  icon,
  className,
}) => (
  <div className={`flex items-center space-x-3 ${className ?? ''}`}>
    {icon && <span className="text-2xl">{icon}</span>}
    <div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-gray-500 text-sm">{label}</div>
    </div>
  </div>
);

export default StatItem;
