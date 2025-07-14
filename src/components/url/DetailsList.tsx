import React from 'react';

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
    <dl
      className={`grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 ${className}`}
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <dt className={`text-sm font-medium text-gray-500 ${dtClassName}`}>
            {item.label}
          </dt>
          <dd className={`text-sm text-gray-900 ${ddClassName}`}>
            {item.value}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};

export default DetailsList;
