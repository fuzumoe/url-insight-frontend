import React from 'react';

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
    <div className={`flex justify-between items-center mb-4 ${className}`}>
      <h2 className={`text-lg font-medium text-gray-800 ${titleClassName}`}>
        {title}
      </h2>
      {actions && <div className={actionsClassName}>{actions}</div>}
    </div>
  );
};

export default SectionHeader;
