import React from 'react';
import { SearchBar, Checkbox, SelectInput } from '../common';
import type { URLTableFilters, URLStatus } from '../../types';
import { Box, Flex } from '../layout';

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
    <Box background="white" padding="md" className="border-b">
      <Flex
        direction="column"
        justify="between"
        className="md:flex-row md:space-y-0 md:space-x-4 space-y-4"
      >
        <Box className="md:w-1/3">
          <SearchBar
            onSearch={onSearch}
            placeholder="Search URLs..."
            className="w-full"
          />
        </Box>

        <Flex wrap="wrap" gap="md" align="center">
          <Box className="w-full md:w-auto">
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
          </Box>

          <Box className="w-full md:w-auto">
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
          </Box>

          <Box className="w-full md:w-auto">
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
          </Box>

          <Flex align="center" gap="sm">
            <Checkbox
              id="latest-filter"
              label="Latest analysis only"
              checked={!!filters.latestOnly}
              onChange={checked =>
                onFilterChange({ latestOnly: checked || undefined })
              }
            />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default URLFilterBar;
