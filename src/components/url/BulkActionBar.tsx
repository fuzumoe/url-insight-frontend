import React from 'react';
import { Box, Flex, Button, Typography } from '..';

interface BulkActionBarProps {
  selectedIds: string[];
  onRerun: (ids: string[]) => void;
  onDelete: (ids: string[]) => void;
}

const BulkActionBar: React.FC<BulkActionBarProps> = ({
  selectedIds,
  onRerun,
  onDelete,
}) => {
  if (selectedIds.length === 0) return null;

  return (
    <Box
      background="gray-50"
      padding="none"
      className="px-4 py-2 border-t border-b"
    >
      <Flex justify="between" align="center">
        <Typography variant="body2" className="text-sm text-gray-700">
          {selectedIds.length} item{selectedIds.length !== 1 ? 's' : ''}{' '}
          selected
        </Typography>
        <Flex gap="sm">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onRerun(selectedIds)}
          >
            Rerun Analysis
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(selectedIds)}
          >
            Delete
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default BulkActionBar;
