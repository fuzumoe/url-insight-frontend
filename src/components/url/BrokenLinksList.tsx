import React, { useState } from 'react';
import type { BrokenLink } from '../../types';

interface BrokenLinksListProps {
  links: BrokenLink[];
}

const BrokenLinksList: React.FC<BrokenLinksListProps> = ({ links }) => {
  const [sortBy, setSortBy] = useState<'url' | 'statusCode'>('statusCode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  if (links.length === 0) {
    return (
      <div className="bg-gray-50 rounded-md p-6 text-center">
        <p className="text-gray-500">No broken links found</p>
      </div>
    );
  }

  const sortedLinks = [...links].sort((a, b) => {
    if (sortBy === 'url') {
      return sortDirection === 'asc'
        ? a.url.localeCompare(b.url)
        : b.url.localeCompare(a.url);
    } else {
      return sortDirection === 'asc'
        ? a.statusCode - b.statusCode
        : b.statusCode - a.statusCode;
    }
  });

  const handleSort = (field: 'url' | 'statusCode') => {
    if (sortBy === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDirection('asc');
    }
  };

  const getStatusCodeColor = (statusCode: number) => {
    if (statusCode >= 500) return 'bg-red-100 text-red-800'; // Server errors
    if (statusCode >= 400) return 'bg-orange-100 text-orange-800'; // Client errors
    return 'bg-gray-100 text-gray-800'; // Fallback
  };

  const getStatusCodeDescription = (statusCode: number) => {
    switch (statusCode) {
      case 400:
        return 'Bad Request';
      case 401:
        return 'Unauthorized';
      case 403:
        return 'Forbidden';
      case 404:
        return 'Not Found';
      case 500:
        return 'Internal Server Error';
      case 502:
        return 'Bad Gateway';
      case 503:
        return 'Service Unavailable';
      case 504:
        return 'Gateway Timeout';
      default:
        return `Error ${statusCode}`;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('url')}
            >
              URL
              {sortBy === 'url' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('statusCode')}
            >
              Status Code
              {sortBy === 'statusCode' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </span>
              )}
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Description
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedLinks.map(link => (
            <tr key={link.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 max-w-sm truncate">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {link.url}
                  </a>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusCodeColor(link.statusCode)}`}
                >
                  {link.statusCode}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {getStatusCodeDescription(link.statusCode)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BrokenLinksList;
