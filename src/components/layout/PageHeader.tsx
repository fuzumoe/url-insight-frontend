import React from 'react';
import Typography from '../common/Typography';
import { Box, Flex, Stack } from './';

export type PageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  className?: string;
};

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  actions,
  className = '',
}) => (
  <Flex
    direction="column"
    justify="between"
    align="start"
    className={`md:flex-row md:items-center mb-6 ${className}`}
  >
    <Stack spacing="sm">
      <Typography variant="h3" weight="bold">
        {title}
      </Typography>

      {subtitle && (
        <Typography variant="body2" color="secondary">
          {subtitle}
        </Typography>
      )}
    </Stack>

    {actions && <Box className="mt-4 md:mt-0">{actions}</Box>}
  </Flex>
);

export default PageHeader;
