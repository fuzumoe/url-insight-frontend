import React from 'react';
import { Flex } from '../layout';

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
  <Flex align="center" gap="sm" className={className}>
    {icon && <span className="text-xl sm:text-2xl text-gray-600">{icon}</span>}
    <div>
      <div className="text-base sm:text-lg font-bold">{value}</div>
      <div className="text-gray-500 text-xs sm:text-sm">{label}</div>
    </div>
  </Flex>
);

export default StatItem;
