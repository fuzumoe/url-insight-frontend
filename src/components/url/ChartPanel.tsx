import React from 'react';
import { Typography } from '../common';
import { Box } from '..';

export interface ChartPanelProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

const ChartPanel: React.FC<ChartPanelProps> = ({
  title,
  children,
  className = '',
  titleClassName = '',
}) => {
  return (
    <Box
      padding="lg"
      background="white"
      shadow="md"
      rounded="lg"
      className={className}
    >
      <Typography
        as="h2"
        variant="h6"
        className={`text-lg font-medium text-gray-800 mb-4 ${titleClassName}`}
      >
        {title}
      </Typography>
      <div className="h-64">{children}</div>
    </Box>
  );
};

export default ChartPanel;
