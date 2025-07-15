import React from 'react';
import { SearchBar, Checkbox, SelectInput } from '../common';
import type { URLTableFilters, URLStatus } from '../../types';

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
          <div className="w-full md:w-auto">
            <SelectInput
              id="status-filter"
              label="Filter by Status"
              value={filters.status || 'all'}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'queued', label: 'Queued' },
                { value: 'running', label: 'Running' },
                { value: 'done', label: 'Done' },
                { value: 'error', label: 'Error' },
                { value: 'stopped', label: 'Stopped' },
              ]}
              onChange={e =>
                onFilterChange({
                  status:
                    e.target.value === 'all'
                      ? undefined
                      : (e.target.value as URLStatus),
                })
              }
            />
          </div>

          <div className="w-full md:w-auto">
            <SelectInput
              id="login-filter"
              label="Filter by Login Form"
              value={
                filters.hasLoginForm === undefined
                  ? 'all'
                  : filters.hasLoginForm.toString()
              }
              options={[
                { value: 'all', label: 'Login Form' },
                { value: 'true', label: 'Has Login Form' },
                { value: 'false', label: 'No Login Form' },
              ]}
              onChange={e => {
                const value = e.target.value;
                onFilterChange({
                  hasLoginForm: value === 'all' ? undefined : value === 'true',
                });
              }}
            />
          </div>

          <div className="w-full md:w-auto">
            <SelectInput
              id="broken-filter"
              label="Filter by Broken Links"
              value={
                filters.hasBrokenLinks === undefined
                  ? 'all'
                  : filters.hasBrokenLinks.toString()
              }
              options={[
                { value: 'all', label: 'Broken Links' },
                { value: 'true', label: 'Has Broken Links' },
                { value: 'false', label: 'No Broken Links' },
              ]}
              onChange={e => {
                const value = e.target.value;
                onFilterChange({
                  hasBrokenLinks:
                    value === 'all' ? undefined : value === 'true',
                });
              }}
            />
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
