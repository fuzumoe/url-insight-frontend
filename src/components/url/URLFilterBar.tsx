import React from 'react';
import SearchBar from '../common/SearchBar';
import Checkbox from '../common/Checkbox';
import type { URLTableFilters } from '../../types';

interface URLFilterBarProps {
  filters: URLTableFilters;
  onFilterChange: (filters: Partial<URLTableFilters>) => void;
  onSearch: (query: string) => void;
}

const URLFilterBar: React.FC<URLFilterBarProps> = ({
  filters,
  onFilterChange,
  onSearch,
}) => {
  return (
    <div className="bg-white p-4 border-b">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="md:w-1/3">
          <SearchBar
            onSearch={onSearch}
            placeholder="Search URLs..."
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div>
            <select
              className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              value={filters.status || 'all'}
              onChange={e =>
                onFilterChange({
                  status:
                    e.target.value === 'all'
                      ? undefined
                      : (e.target.value as any),
                })
              }
              aria-label="Filter by status"
            >
              <option value="all">All Statuses</option>
              <option value="queued">Queued</option>
              <option value="running">Running</option>
              <option value="done">Done</option>
              <option value="error">Error</option>
              <option value="stopped">Stopped</option>
            </select>
          </div>

          <div>
            <select
              className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              value={
                filters.hasLoginForm === undefined
                  ? 'all'
                  : filters.hasLoginForm.toString()
              }
              onChange={e => {
                const value = e.target.value;
                onFilterChange({
                  hasLoginForm: value === 'all' ? undefined : value === 'true',
                });
              }}
              aria-label="Filter by login form"
            >
              <option value="all">Login Form</option>
              <option value="true">Has Login Form</option>
              <option value="false">No Login Form</option>
            </select>
          </div>

          <div>
            <select
              className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
              value={
                filters.hasBrokenLinks === undefined
                  ? 'all'
                  : filters.hasBrokenLinks.toString()
              }
              onChange={e => {
                const value = e.target.value;
                onFilterChange({
                  hasBrokenLinks:
                    value === 'all' ? undefined : value === 'true',
                });
              }}
              aria-label="Filter by broken links"
            >
              <option value="all">Broken Links</option>
              <option value="true">Has Broken Links</option>
              <option value="false">No Broken Links</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="latest-filter"
              checked={!!filters.latestOnly}
              onChange={checked =>
                onFilterChange({ latestOnly: checked || undefined })
              }
            />
            <label
              htmlFor="latest-filter"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Latest analysis only
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default URLFilterBar;
