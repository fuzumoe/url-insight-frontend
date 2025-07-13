import React, { useState } from 'react';
import type { URLData, URLTableFilters } from '../../types';

import Button from '../common/Button';
import Pagination from '../common/Pagination';

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
  const [searchQuery, setSearchQuery] = useState('');

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

  // Render action buttons based on URL status
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

  // Render bulk action controls
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

  // Add search and filter controls
  const renderSearchAndFilters = () => {
    return (
      <div className="bg-white p-4 border-b">
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <form onSubmit={handleSearch} className="w-full md:w-1/3">
            <div className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search URLs..."
                className="block w-full rounded-l-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 text-sm font-medium rounded-r-md bg-gray-50 hover:bg-gray-100"
              >
                Search
              </button>
            </div>
          </form>

          <div className="flex space-x-2">
            <select
              onChange={e =>
                updateFilters({
                  status: e.target.value as URLTableFilters['status'],
                })
              }
              value={filters.status || 'all'}
              className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="queued">Queued</option>
              <option value="running">Running</option>
              <option value="done">Done</option>
              <option value="error">Error</option>
              <option value="stopped">Stopped</option>
            </select>

            <select
              onChange={e =>
                updateFilters({
                  hasBrokenLinks:
                    e.target.value === 'true'
                      ? true
                      : e.target.value === 'false'
                        ? false
                        : undefined,
                })
              }
              value={
                filters.hasBrokenLinks === true
                  ? 'true'
                  : filters.hasBrokenLinks === false
                    ? 'false'
                    : 'all'
              }
              className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Links</option>
              <option value="true">Has Broken Links</option>
              <option value="false">No Broken Links</option>
            </select>

            <select
              onChange={e =>
                updateFilters({
                  hasLoginForm:
                    e.target.value === 'true'
                      ? true
                      : e.target.value === 'false'
                        ? false
                        : undefined,
                })
              }
              value={
                filters.hasLoginForm === true
                  ? 'true'
                  : filters.hasLoginForm === false
                    ? 'false'
                    : 'all'
              }
              className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">Login Form</option>
              <option value="true">Has Login Form</option>
              <option value="false">No Login Form</option>
            </select>
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
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === urls.length && urls.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th
                onClick={() => handleSort('url')}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              >
                URL
                {sortField === 'url' && (
                  <span className="ml-1">
                    {sortDirection === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
              {/* Other column headers here */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : urls.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-4 text-center">
                  No URLs found
                </td>
              </tr>
            ) : (
              urls.map(url => (
                <tr key={url.id}>
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(url.id)}
                      onChange={() => toggleSelectUrl(url.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">{url.url}</td>
                  {/* Other cells here */}
                  <td className="px-6 py-4">{renderActionButtons(url)}</td>
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
