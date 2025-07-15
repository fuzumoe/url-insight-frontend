import { useState } from 'react';

export const useSort = <T>(
  defaultField: keyof T,
  defaultDirection: 'asc' | 'desc' = 'asc'
) => {
  const [sortField, setSortField] = useState<keyof T>(defaultField);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(
    defaultDirection
  );

  const sortBy = (field: keyof T) => {
    if (sortField === field) {
      setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  return { sortField, sortDirection, sortBy };
};
export default useSort;
