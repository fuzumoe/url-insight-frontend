import React from 'react';
import { Grid, Box } from '../layout';
import { Typography } from '../common';

export interface DetailsItem {
  label: string;
  value: React.ReactNode;
}

export interface DetailsListProps {
  items: DetailsItem[];
  className?: string;
  dtClassName?: string;
  ddClassName?: string;
}

const DetailsList: React.FC<DetailsListProps> = ({
  items,
  className = '',
  dtClassName = '',
  ddClassName = '',
}) => {
  return (
    <Grid cols={2} gap="md" className={className}>
      {items.map((item, index) => (
        <Box key={index} className="flex flex-col">
          <Typography
            variant="body2"
            className={`text-sm font-medium text-gray-500 ${dtClassName}`}
          >
            {item.label}
          </Typography>
          <Typography
            variant="body2"
            className={`text-sm text-gray-900 ${ddClassName}`}
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Grid>
  );
};

export default DetailsList;
