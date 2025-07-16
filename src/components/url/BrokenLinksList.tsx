import React, { useState } from 'react';
import type { BrokenLink } from '../../types';
import {
  TableCell,
  TableHeader,
  TableBody,
  TableRow,
  Typography,
} from '../common';
import Table from '../common/Table';
import { FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { Box, Stack } from '../layout';
import TableHeaderCell from '../common/TableHeaderCell';
import { formatHttpStatusCode } from '../../utils';

interface BrokenLinksListProps {
  links: BrokenLink[];
}

const BrokenLinksList: React.FC<BrokenLinksListProps> = ({ links }) => {
  const [sortBy, setSortBy] = useState<'url' | 'statusCode'>('statusCode');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  if (links.length === 0) {
    return (
      <Box
        background="gray-50"
        rounded="md"
        padding="md"
        className="text-center"
      >
        <Typography variant="body1" className="text-gray-500">
          No broken links found
        </Typography>
      </Box>
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
    if (statusCode >= 500) return 'bg-red-100 text-red-800';
    if (statusCode >= 400) return 'bg-orange-100 text-orange-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <Box className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableHeaderCell
            onClick={() => handleSort('url')}
            className="py-2 px-2 sm:py-3 sm:px-4"
          >
            <Stack direction="row" align="center" spacing="sm">
              <Typography variant="body1">URL</Typography>
              {sortBy === 'url' && (
                <Typography variant="body1">
                  {sortDirection === 'asc' ? (
                    <FiArrowUp size={14} />
                  ) : (
                    <FiArrowDown size={14} />
                  )}
                </Typography>
              )}
            </Stack>
          </TableHeaderCell>
          <TableHeaderCell
            onClick={() => handleSort('statusCode')}
            className="py-2 px-2 sm:py-3 sm:px-4"
          >
            <Stack direction="row" align="center" spacing="sm">
              <Typography variant="body1">Status Code</Typography>
              {sortBy === 'statusCode' && (
                <Typography variant="body1">
                  {sortDirection === 'asc' ? (
                    <FiArrowUp size={14} />
                  ) : (
                    <FiArrowDown size={14} />
                  )}
                </Typography>
              )}
            </Stack>
          </TableHeaderCell>
          <TableHeaderCell className="py-2 px-2 sm:py-3 sm:px-4">
            <Typography variant="body1">Description</Typography>
          </TableHeaderCell>
        </TableHeader>

        <TableBody striped>
          {sortedLinks.map(link => (
            <TableRow
              key={link.id}
              hover
              variant={link.statusCode >= 500 ? 'error' : 'default'}
            >
              <TableCell className="py-2 sm:py-3 px-2 sm:px-4 max-w-xs sm:max-w-sm truncate">
                <Typography
                  variant="body1"
                  as="a"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {link.url}
                </Typography>
              </TableCell>
              <TableCell className="py-2 sm:py-3 px-2 sm:px-4">
                <Typography
                  variant="body1"
                  className={`px-2 py-1 sm:px-2.5 sm:py-1.5 inline-flex leading-5 font-semibold rounded-full ${getStatusCodeColor(link.statusCode)}`}
                >
                  {link.statusCode}
                </Typography>
              </TableCell>
              <TableCell className="py-2 sm:py-3 px-2 sm:px-4">
                <Typography variant="body1" className="text-gray-600">
                  {formatHttpStatusCode(link.statusCode)}
                </Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default BrokenLinksList;
