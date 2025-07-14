import React, { useState } from 'react';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Pagination from '../common/Pagination';
import SearchBar from '../common/SearchBar';
import Checkbox from '../common/Checkbox';
import TableHeaderCell from '../common/TableHeaderCell';
import TableCell from '../common/TableCell';
import SelectInput from '../common/SelectInput';
import Spinner from '../common/Spinner';
import type { URLData, URLStatus, URLTableFilters } from '../../types';

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

  const renderSortIcon = (field: keyof URLData) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  const renderBulkActionBar = () => {
    if (selectedIds.length === 0) return null;
    return (
      <div className="bg-gray-100 px-6 py-3 border-b flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-gray-700">
            {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'}{' '}
            selected
          </span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => onRerunSelected(selectedIds)}
            className="text-sm"
          >
            Rerun Analysis
          </Button>
          <Button
            variant="danger"
            onClick={() => onDeleteSelected(selectedIds)}
            className="text-sm"
          >
            Delete Selected
          </Button>
        </div>
      </div>
    );
  };

  const renderFilterBar = () => {
    return (
      <div className="bg-gray-50 px-6 py-4 border-b flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-wrap items-center space-x-4">
          <SelectInput
            id="status-filter"
            label="Filter by Status"
            value={filters.status || ''}
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'queued', label: 'Queued' },
              { value: 'running', label: 'Running' },
              { value: 'done', label: 'Done' },
              { value: 'error', label: 'Error' },
            ]}
            onChange={e =>
              updateFilters({
                status: e.target.value
                  ? (e.target.value as URLStatus)
                  : undefined,
              })
            }
          />

          <div className="flex items-center space-x-2">
            <Checkbox
              id="login-form-filter"
              checked={!!filters.hasLoginForm}
              onChange={checked =>
                updateFilters({ hasLoginForm: checked || undefined })
              }
            />
            <label
              htmlFor="login-form-filter"
              className="text-sm text-gray-700"
            >
              Has Login Form
            </label>
          </div>
        </div>

        <div className="w-full md:w-auto">
          <SearchBar onSearch={onSearch} placeholder="Search URLs..." />
        </div>
      </div>
    );
  };

  const renderURLRow = (url: URLData) => {
    const isSelected = selectedIds.includes(url.id);
    return (
      <tr key={url.id} className={isSelected ? 'bg-blue-50' : undefined}>
        <TableCell>
          <Checkbox
            checked={isSelected}
            onChange={() => toggleSelectUrl(url.id)}
          />
        </TableCell>
        <TableCell>
          <div className="flex items-center">
            <div className="ml-2">
              <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                {url.title || 'Untitled'}
              </div>
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {url.url}
              </div>
            </div>
          </div>
        </TableCell>
        <TableCell>{url.htmlVersion || 'Unknown'}</TableCell>
        <TableCell>{url.internalLinks}</TableCell>
        <TableCell>{url.externalLinks}</TableCell>
        <TableCell>{url.brokenLinks}</TableCell>
        <TableCell>{url.hasLoginForm ? 'Yes' : 'No'}</TableCell>
        <TableCell>
          <StatusBadge status={url.status} />
        </TableCell>
        <TableCell>
          <div className="flex space-x-2">
            {url.status === 'queued' || url.status === 'error' ? (
              <Button
                variant="primary"
                className="text-xs py-1"
                onClick={() => onStartAnalysis(url.id)}
              >
                Start
              </Button>
            ) : url.status === 'running' ? (
              <Button
                variant="secondary"
                className="text-xs py-1"
                onClick={() => onStopAnalysis(url.id)}
              >
                Stop
              </Button>
            ) : null}
            <Button variant="secondary" className="text-xs py-1">
              <a href={`/urls/${url.id}`}>Details</a>
            </Button>
          </div>
        </TableCell>
      </tr>
    );
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {renderFilterBar()}
      {renderBulkActionBar()}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <TableHeaderCell>
                <Checkbox
                  checked={
                    selectedIds.length === urls.length && urls.length > 0
                  }
                  onChange={toggleSelectAll}
                />
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('title')}>
                Title/URL {renderSortIcon('title')}
              </TableHeaderCell>
              <TableHeaderCell>HTML Version</TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('internalLinks')}>
                Internal Links {renderSortIcon('internalLinks')}
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('externalLinks')}>
                External Links {renderSortIcon('externalLinks')}
              </TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('brokenLinks')}>
                Broken Links {renderSortIcon('brokenLinks')}
              </TableHeaderCell>
              <TableHeaderCell>Login Form</TableHeaderCell>
              <TableHeaderCell onClick={() => handleSort('status')}>
                Status {renderSortIcon('status')}
              </TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <TableCell colSpan={9} className="text-center">
                  <Spinner size="lg" showText text="Loading..." />
                </TableCell>
              </tr>
            ) : urls.length === 0 ? (
              <tr>
                <TableCell
                  colSpan={9}
                  className="text-center text-sm text-gray-500"
                >
                  No URLs found. Add a URL to get started.
                </TableCell>
              </tr>
            ) : (
              urls.map(url => renderURLRow(url))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
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
