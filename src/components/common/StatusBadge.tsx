import React from 'react';
import { Flex } from '..';
import { Typography } from '.';

type URLStatus = 'queued' | 'running' | 'done' | 'error' | 'stopped';

interface StatusBadgeProps {
  status: URLStatus;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusStyles = {
    queued: 'bg-gray-200 text-gray-800',
    running: 'bg-blue-200 text-blue-800 animate-pulse',
    done: 'bg-green-200 text-green-800',
    error: 'bg-red-200 text-red-800',
    stopped: 'bg-yellow-200 text-yellow-800',
  };

  return (
    <Flex
      inline
      align="center"
      className={`px-2 py-0.5 sm:px-2.5 sm:py-0.5 rounded-full ${statusStyles[status]}`}
    >
      <Typography variant="caption" className="font-medium">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Typography>
    </Flex>
  );
};

export default StatusBadge;
