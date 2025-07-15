import { useState } from 'react';
import type { URLTableFilters } from '../types';

export const useFilter = (initialFilters: URLTableFilters = {}) => {
  const [filters, setFilters] = useState<URLTableFilters>(initialFilters);

  const setFilter = <K extends keyof URLTableFilters>(
    key: K,
    value: URLTableFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters({});

  return { filters, setFilter, resetFilters };
};
export default useFilter;
