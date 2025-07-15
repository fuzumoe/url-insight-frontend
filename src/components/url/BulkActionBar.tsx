import React from 'react';
import { Button } from '../common';

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
        </div>
      </div>
    </div>
  );
};

export default BulkActionBar;
