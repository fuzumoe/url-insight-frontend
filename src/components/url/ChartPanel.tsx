import React from 'react';

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
    <div className={`p-4 bg-white shadow rounded-lg ${className}`}>
      <h2
        className={`text-lg font-medium text-gray-800 mb-4 ${titleClassName}`}
      >
        {title}
      </h2>
      <div className="h-64">{children}</div>
    </div>
  );
};

export default ChartPanel;
