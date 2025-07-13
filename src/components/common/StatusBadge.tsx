import React from 'react';

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
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export default StatusBadge;
