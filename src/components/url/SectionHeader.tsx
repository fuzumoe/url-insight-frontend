import React from 'react';
import { Flex } from '../layout';
import { Typography } from '../common';

export interface SectionHeaderProps {
  title: string;
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  actionsClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actions,
  className = '',
  titleClassName = '',
  actionsClassName = '',
}) => {
  return (
    <Flex justify="between" align="center" className={`mb-4 ${className}`}>
      <Typography
        as="h2"
        variant="h6"
        className={`text-lg font-medium text-gray-800 ${titleClassName}`}
      >
        {title}
      </Typography>
      {actions && <div className={actionsClassName}>{actions}</div>}
    </Flex>
  );
};

export default SectionHeader;
