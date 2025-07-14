import React, { useState } from 'react';
import type { URLData, URLTableFilters, URLStatus } from '../../types';

import Button from '../common/Button';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import SelectInput from '../common/SelectInput';
import TableHeaderCell from '../common/TableHeaderCell';
import TableCell from '../common/TableCell';

interface URLTableProps {
  urls: URLData[];
  loading: boolean;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onStartAnalysis: (id: string) => void;
  onStopAnalysis: (id: string) => void;
  onDeleteSelected: (ids: string[]) => void;
  onRerunSelected: (ids: string[]) => void;
  onFilterChange: (filters: URLTableFilters) => void;
  onSearch: (query: string) => void;
}

const URLTable: React.FC<URLTableProps> = ({
  urls,
  loading,
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onStartAnalysis,
  onStopAnalysis,
  onDeleteSelected,
  onRerunSelected,
  onFilterChange,
  onSearch,
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<keyof URLData>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filters, setFilters] = useState<URLTableFilters>({});
  const [searchQuery] = useState('');

  const toggleSelectAll = () => {
    if (selectedIds.length === urls.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(urls.map(url => url.id));
    }
  };

  const toggleSelectUrl = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSort = (field: keyof URLData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const updateFilters = (newFilters: Partial<URLTableFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderActionButtons = (url: URLData) => {
    if (url.status === 'queued' || url.status === 'running') {
      return (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onStopAnalysis(url.id)}
        >
          Stop
        </Button>
      );
    } else {
      return (
        <Button
          variant="primary"
          size="sm"
          onClick={() => onStartAnalysis(url.id)}
        >
          Analyze
        </Button>
      );
    }
  };

  const renderBulkActions = () => {
    if (selectedIds.length === 0) return null;

    return (
      <div className="bg-gray-50 px-4 py-2 border-t border-b">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">
            {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''}{' '}
            selected
          </span>
          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onRerunSelected(selectedIds)}
            >
              Rerun Analysis
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDeleteSelected(selectedIds)}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderSearchAndFilters = () => {
    return (
      <div className="bg-white p-4 border-b">
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <form onSubmit={handleSearch} className="w-full md:w-1/3">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search URLs..."
              className="w-full"
            />
          </form>

          <div className="flex space-x-2">
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
                updateFilters({
                  status:
                    e.target.value === 'all'
                      ? undefined
                      : (e.target.value as URLStatus),
                })
              }
            />
            <SelectInput
              id="broken-filter"
              label="Filter Broken Links"
              value={
                filters.hasBrokenLinks === true
                  ? 'true'
                  : filters.hasBrokenLinks === false
                    ? 'false'
                    : 'all'
              }
              options={[
                { value: 'all', label: 'All Links' },
                { value: 'true', label: 'Has Broken Links' },
                { value: 'false', label: 'No Broken Links' },
              ]}
              onChange={e =>
                updateFilters({
                  hasBrokenLinks:
                    e.target.value === 'all'
                      ? undefined
                      : e.target.value === 'true'
                        ? true
                        : false,
                })
              }
            />
            <SelectInput
              id="login-filter"
              label="Login Form"
              value={
                filters.hasLoginForm === true
                  ? 'true'
                  : filters.hasLoginForm === false
                    ? 'false'
                    : 'all'
              }
              options={[
                { value: 'all', label: 'All' },
                { value: 'true', label: 'Has Login Form' },
                { value: 'false', label: 'No Login Form' },
              ]}
              onChange={e =>
                updateFilters({
                  hasLoginForm:
                    e.target.value === 'all'
                      ? undefined
                      : e.target.value === 'true'
                        ? true
                        : false,
                })
              }
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {renderSearchAndFilters()}
      {renderBulkActions()}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeaderCell>
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === urls.length && urls.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('url')}>
                URL
                {sortField === 'url' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <TableCell colSpan={10} className="px-6 py-4 text-center">
                  Loading...
                </TableCell>
              </tr>
            ) : urls.length === 0 ? (
              <tr>
                <TableCell colSpan={10} className="px-6 py-4 text-center">
                  No URLs found
                </TableCell>
              </tr>
            ) : (
              urls.map(url => (
                <tr key={url.id}>
                  <TableCell className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(url.id)}
                      onChange={() => toggleSelectUrl(url.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </TableCell>
                  <TableCell className="px-6 py-4">{url.url}</TableCell>
                  <TableCell className="px-6 py-4">
                    {renderActionButtons(url)}
                  </TableCell>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && urls.length > 0 && (
        <div className="px-6 py-4 border-t">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};

export default URLTable;
